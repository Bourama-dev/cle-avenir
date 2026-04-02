import React from 'react';

/**
 * Validates if a hook is being called within its required provider context.
 * Useful for catching "null is not an object" errors during development.
 * 
 * @param {Object} contextValue - The value returned by useContext
 * @param {String} providerName - The name of the required Provider
 * @param {String} hookName - The name of the hook being called
 */
export const validateProviderContext = (contextValue, providerName, hookName) => {
  if (import.meta.env.MODE === 'development') {
    if (contextValue === undefined || contextValue === null) {
      const errorMessage = `[Hooks Validator] 🚨 React Hook Violation: ${hookName} was called outside of ${providerName}. Ensure the component is wrapped in ${providerName}.`;
      console.error(errorMessage);
      // We don't throw to prevent complete app crash, but log loudly
      return false;
    }
  }
  return true;
};

/**
 * Checks if a component function is calling hooks at the top level.
 * This is a lightweight dev-time check for common mistakes.
 */
export const checkHookRules = (componentName) => {
  if (import.meta.env.MODE === 'development') {
    try {
      // Basic sanity check to ensure we are in a React rendering cycle
      const dispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current;
      if (!dispatcher) {
        console.error(`[Hooks Validator] 🚨 ${componentName}: Hooks must be called inside a functional React component. 'dispatcher.useState' is null.`);
        return false;
      }
      return true;
    } catch (e) {
      console.error(`[Hooks Validator] Error checking hook rules for ${componentName}:`, e);
      return false;
    }
  }
  return true;
};