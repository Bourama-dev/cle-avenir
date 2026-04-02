/**
 * NOTE ON VITE.CONFIG.JS AND SECURITY HEADERS
 * 
 * Since vite.config.js is a read-only system file in this environment,
 * we cannot inject standard HTTP security headers (CSP, HSTS, X-Frame-Options) 
 * directly through the Vite dev server configuration.
 * 
 * In a production environment (e.g., Vercel, Netlify, Nginx, Apache), 
 * these headers should be defined in the hosting provider's configuration 
 * (like vercel.json, _headers, or nginx.conf).
 * 
 * Example _headers file for Netlify / Cloudflare:
 * 
 * /*
 *   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
 *   X-Content-Type-Options: nosniff
 *   X-Frame-Options: DENY
 *   X-XSS-Protection: 1; mode=block
 *   Referrer-Policy: strict-origin-when-cross-origin
 *   Permissions-Policy: camera=(), microphone=(), geolocation=(self)
 *   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;
 * 
 * For HTTPS: Set up SSL via Let's Encrypt or your hosting provider's automatic SSL provisioning.
 */

export const securityConfigInfo = {
  hsts: "max-age=31536000; includeSubDomains; preload",
  xContentTypeOptions: "nosniff",
  xFrameOptions: "DENY", // Prevents clickjacking
  xXssProtection: "1; mode=block",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: "camera=(), microphone=(), geolocation=(self)", // Restricts features
  contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
};