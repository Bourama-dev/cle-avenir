/**
 * Client-side progress tracking for activities served from the local
 * catalog (LOCAL_ACTIVITY_CATALOG) rather than the `activities` table.
 *
 * Local activities use string ids like "local-01" that don't exist as
 * rows in Supabase, so they can't go through `user_activities`
 * (FK on activity_id) without failing. Progress for them is kept in
 * localStorage instead, scoped per user.
 */
const LOCAL_ID_PREFIX = 'local-';

const storageKey = (userId) => `cleo_local_activity_progress_${userId}`;

function readAll(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(userId, data) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode, quota) — progress just won't persist
  }
}

export const localActivityProgress = {
  isLocalId(activityId) {
    return typeof activityId === 'string' && activityId.startsWith(LOCAL_ID_PREFIX);
  },

  getAll(userId) {
    return readAll(userId);
  },

  get(userId, activityId) {
    return readAll(userId)[activityId] || null;
  },

  markStarted(userId, activityId) {
    const all = readAll(userId);
    if (!all[activityId]) {
      all[activityId] = { status: 'started', score: 0 };
      writeAll(userId, all);
    }
  },

  markCompleted(userId, activityId, score) {
    const all = readAll(userId);
    all[activityId] = { status: 'completed', score, completed_at: new Date().toISOString() };
    writeAll(userId, all);
  },
};
