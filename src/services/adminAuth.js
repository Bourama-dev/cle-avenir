/**
 * Auth Admin / RBAC — FINAL
 *
 * ⚠️ IMPORTANT:
 * - Le rôle DOIT être vérifié côté backend (RLS + Edge Functions)
 * - Ce fichier sert surtout à la logique UI (menus/routes/affichage)
 */

const ADMIN_EMAILS = new Set([
  'contact@cleavenir.com'
]);

// Optionnel: autoriser un domaine (ex: @cleavenir.com)
// Mets null si tu ne veux pas
const ADMIN_DOMAIN = null; // 'cleavenir.com'

// Optionnel: regex d’email admin (ex: /^.+@cleavenir\.com$/i)
const ADMIN_EMAIL_REGEX = null;

// Permissions "par défaut" (tu peux en rajouter)
const PERMISSIONS = {
  user: {
    viewProfile: true,
    editProfile: true,
    viewTestResults: true,
    takeTest: true,
    viewFormations: true,
    viewCareers: true,
    viewDashboard: false,
    viewStats: false,
    manageUsers: false,
    manageContent: false,
    manageSettings: false,
    viewLogs: false,
    exportData: false,
    deleteAccount: true
  },
  admin: {
    viewProfile: true,
    editProfile: true,
    viewTestResults: true,
    takeTest: true,
    viewFormations: true,
    viewCareers: true,
    viewDashboard: true,
    viewStats: true,
    manageUsers: true,
    manageContent: true,
    manageSettings: true,
    viewLogs: true,
    exportData: true,
    deleteAccount: true
  }
};

/* ---------------------------------------
   Utils
---------------------------------------- */
const toStr = (v) => (v == null ? '' : String(v));
const normEmail = (email) => toStr(email).trim().toLowerCase();

function isEmailAllowedByDomain(email) {
  if (!ADMIN_DOMAIN) return false;
  const e = normEmail(email);
  return e.endsWith(`@${ADMIN_DOMAIN.toLowerCase()}`);
}

/**
 * UI-only check (fallback)
 * ⚠️ ne doit jamais protéger une ressource sensible
 */
export function isAdminEmail(email) {
  const e = normEmail(email);
  if (!e) return false;

  if (ADMIN_EMAILS.has(e)) return true;
  if (ADMIN_EMAIL_REGEX && ADMIN_EMAIL_REGEX.test(e)) return true;
  if (isEmailAllowedByDomain(e)) return true;

  return false;
}

/**
 * Source de vérité si dispo: Supabase JWT
 * - user.app_metadata.role (recommandé)
 * - user.user_metadata.role (fallback)
 * - user.role (fallback)
 * sinon fallback email (UI only)
 */
export function getRoleFromSupabaseUser(user) {
  const u = user && typeof user === 'object' ? user : null;
  if (!u) return 'user';

  const role =
    u.app_metadata?.role ||
    u.user_metadata?.role ||
    u.role ||
    null;

  if (role === 'admin' || role === 'user') return role;

  // Fallback UI-only
  return isAdminEmail(u.email) ? 'admin' : 'user';
}

export function getRoleByEmail(email) {
  // conservé pour compat
  return isAdminEmail(email) ? 'admin' : 'user';
}

export function getPermissionsByRole(role) {
  return PERMISSIONS[role] || PERMISSIONS.user;
}

/**
 * Merge permissions:
 * - base role permissions
 * - + overrides (userData.permissions) si tu veux
 */
function mergePermissions(base, overrides) {
  const o = overrides && typeof overrides === 'object' ? overrides : null;
  if (!o) return { ...base };
  return { ...base, ...o };
}

/**
 * Crée un profil utilisateur avec rôle et permissions
 * - supporte un user supabase (app_metadata)
 * - supporte userData legacy
 */
export function createUserProfile(userData = {}) {
  const u = userData && typeof userData === 'object' ? userData : {};
  const email = u.email || '';

  // Si userData ressemble à un user Supabase, on lit le rôle correctement
  const role = getRoleFromSupabaseUser(u);

  const basePerms = getPermissionsByRole(role);
  const permissions = mergePermissions(basePerms, u.permissions);

  return {
    ...u,
    email,
    role,
    permissions,
    isAdmin: role === 'admin',
    createdAt: u.createdAt || new Date().toISOString()
  };
}

/**
 * Vérifie permission
 */
export function hasPermission(userProfile, permission) {
  if (!userProfile || !permission) return false;
  return userProfile.permissions?.[permission] === true;
}

/**
 * Admin?
 */
export function isAdmin(userProfile) {
  return userProfile?.role === 'admin' || userProfile?.isAdmin === true;
}

/**
 * Route dashboard
 */
export function getDashboardRoute(userProfile) {
  return isAdmin(userProfile) ? '/admin/dashboard' : '/dashboard';
}

/**
 * Guard UI: retourne { ok, reason }
 */
export function guardPermission(userProfile, permission) {
  if (!userProfile) return { ok: false, reason: 'not_logged_in' };
  if (!hasPermission(userProfile, permission)) return { ok: false, reason: 'forbidden' };
  return { ok: true };
}