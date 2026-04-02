import { auditService } from '@/services/auditService';

// Simple in-memory rate limiter for client-side throttling
const rateLimitStore = new Map();

export const securityService = {
  // Advanced XSS prevention basic implementation (in frontend)
  sanitizeHTML(html) {
    if (!html) return '';
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  validateInput(data) {
    if (typeof data === 'string') {
      const sqlInjectionPattern = /DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+.*SET/i;
      if (sqlInjectionPattern.test(data)) {
        throw new Error("Invalid input detected.");
      }
      return this.sanitizeHTML(data.trim());
    }
    return data;
  },

  validatePassword(password) {
    const minLength = 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) return { valid: false, message: "Le mot de passe doit contenir au moins 12 caractères." };
    if (!hasUpper) return { valid: false, message: "Le mot de passe doit contenir au moins une majuscule." };
    if (!hasLower) return { valid: false, message: "Le mot de passe doit contenir au moins une minuscule." };
    if (!hasNumber) return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre." };
    if (!hasSpecial) return { valid: false, message: "Le mot de passe doit contenir au moins un caractère spécial." };

    return { valid: true };
  },

  // Encryption standard AES-256 equivalent for frontend
  async encryptSensitiveData(data, secretKeyStr = import.meta.env.VITE_ENCRYPTION_KEY || 'default_secure_key_1234567890123') {
    try {
      const textEncoder = new TextEncoder();
      const encodedData = textEncoder.encode(JSON.stringify(data));
      
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        textEncoder.encode(secretKeyStr),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encodedData
      );

      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      const ivBase64 = btoa(String.fromCharCode(...iv));
      const saltBase64 = btoa(String.fromCharCode(...salt));

      return {
        data: encryptedBase64,
        iv: ivBase64,
        salt: saltBase64
      };
    } catch (e) {
      console.error("Encryption error:", e);
      return null;
    }
  },

  async decryptSensitiveData(encryptedObj, secretKeyStr = import.meta.env.VITE_ENCRYPTION_KEY || 'default_secure_key_1234567890123') {
    try {
      const { data, iv, salt } = encryptedObj;
      
      const encryptedBuffer = new Uint8Array(atob(data).split("").map(c => c.charCodeAt(0)));
      const ivBuffer = new Uint8Array(atob(iv).split("").map(c => c.charCodeAt(0)));
      const saltBuffer = new Uint8Array(atob(salt).split("").map(c => c.charCodeAt(0)));

      const textEncoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        textEncoder.encode(secretKeyStr),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: saltBuffer,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: ivBuffer
        },
        key,
        encryptedBuffer
      );

      const textDecoder = new TextDecoder();
      return JSON.parse(textDecoder.decode(decryptedBuffer));
    } catch (e) {
      console.error("Decryption error:", e);
      return null;
    }
  },

  generateCSRFToken() {
    const array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    const token = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    if (!storedToken || token !== storedToken) {
      throw new Error("Invalid CSRF token.");
    }
    return true;
  },

  getSecurityMetaTags: () => [
    { httpEquiv: "Content-Security-Policy", content: "default-src 'self' https:; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; connect-src 'self' https: wss:;" },
    { httpEquiv: "X-Frame-Options", content: "DENY" },
    { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
    { httpEquiv: "Referrer-Policy", content: "strict-origin-when-cross-origin" }
  ],

  checkRateLimit: (key, limit = 5, windowMs = 60000) => {
    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, startTime: now };

    if (now - record.startTime > windowMs) {
      rateLimitStore.set(key, { count: 1, startTime: now });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    rateLimitStore.set(key, record);
    return true;
  }
};

export const initializeSecurity = () => {
  console.log("[securityService] Initializing security checks...");
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      console.warn(`[securityService] Warning: ${varName} environment variable is missing.`);
    }
  });
  
  securityService.generateCSRFToken();
  return () => {
    console.log("[securityService] Security context cleanup.");
  };
};

export const initializePushNotifications = async () => {
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("[securityService] VAPID public key missing for push notifications.");
    return;
  }
  // Logic for SW subscription would go here
};

export const logSecurityEvent = (event, details) => {
  auditService.logSecurityEvent(event, details);
};

export const healthCheck = async () => {
  return await auditService.healthCheck();
};