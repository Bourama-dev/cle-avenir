/**
 * Centralized error handling utility
 */
export const handleError = (error, context = '') => {
  // Log the error internally
  console.error(`[Error] ${context}:`, error);

  // Categorize error types
  if (error?.message?.includes('NetworkError') || error?.message?.includes('Failed to fetch')) {
    console.warn('Network connectivity issue detected');
    return null;
  }

  if (error?.message?.includes('cors') || error?.message?.includes('CORS')) {
    console.warn('CORS policy restriction detected');
    return null;
  }

  if (error?.status === 401 || error?.status === 403) {
    console.warn('Authentication/Authorization error');
    return null;
  }

  // Return null to prevent app crashes while allowing calling code to handle 'null' result
  return null;
};

export const logError = (error, info) => {
  console.error('Logged Error:', error, info);
  // Here you could send to Sentry or another logging service
};