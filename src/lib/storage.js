import { handleError } from './errorHandler';

const KEYS = {
  TEST_PROGRESS: 'cleavenir-test-progress',
  USER_SESSION: 'cleavenir-user-session',
  FORM_DATA: 'cleavenir-form-draft'
};

const StorageManager = {
  // Test Progress Methods
  saveTestProgress: (data) => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(KEYS.TEST_PROGRESS, serialized);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.saveTestProgress');
      return false;
    }
  },

  getTestProgress: () => {
    try {
      const data = localStorage.getItem(KEYS.TEST_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleError(error, 'StorageManager.getTestProgress');
      return null;
    }
  },

  clearTestProgress: () => {
    try {
      localStorage.removeItem(KEYS.TEST_PROGRESS);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.clearTestProgress');
      return false;
    }
  },

  // User Session Methods
  saveUserSession: (session) => {
    try {
      const serialized = JSON.stringify(session);
      localStorage.setItem(KEYS.USER_SESSION, serialized);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.saveUserSession');
      return false;
    }
  },

  getUserSession: () => {
    try {
      const data = localStorage.getItem(KEYS.USER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleError(error, 'StorageManager.getUserSession');
      return null;
    }
  },

  clearUserSession: () => {
    try {
      localStorage.removeItem(KEYS.USER_SESSION);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.clearUserSession');
      return false;
    }
  },

  // Generic Form Data Methods
  saveFormData: (key, data) => {
    try {
      const fullKey = `${KEYS.FORM_DATA}-${key}`;
      const serialized = JSON.stringify(data);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.saveFormData');
      return false;
    }
  },

  getFormData: (key) => {
    try {
      const fullKey = `${KEYS.FORM_DATA}-${key}`;
      const data = localStorage.getItem(fullKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleError(error, 'StorageManager.getFormData');
      return null;
    }
  },

  clearFormData: (key) => {
    try {
      const fullKey = `${KEYS.FORM_DATA}-${key}`;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      handleError(error, 'StorageManager.clearFormData');
      return false;
    }
  }
};

export default StorageManager;