/**
 * Service to manage API request concurrency, rate limiting, and retries.
 * Prevents 429 errors by ensuring we don't flood the server.
 */

class ApiQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 3; // Max simultaneous requests
    this.interval = options.interval || 300; // Min ms between requests
    this.queue = [];
    this.activeCount = 0;
    this.lastRequestTime = 0;
    this.isProcessing = false;
  }

  /**
   * Add a request to the queue.
   * @param {Function} requestFn - Function returning a promise
   * @param {string} id - Optional ID for deduplication
   * @returns {Promise} - Resolves with the request result
   */
  add(requestFn, id = null) {
    // Basic payload validation
    if (typeof requestFn !== 'function') {
      return Promise.reject(new Error('ApiQueue: requestFn must be a function'));
    }

    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
        id,
        timestamp: Date.now(),
        retries: 0
      });
      this.processNext();
    });
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0 || this.activeCount >= this.concurrency) {
      return;
    }

    // Rate limiting check
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.interval) {
      setTimeout(() => this.processNext(), this.interval - timeSinceLast);
      return;
    }

    this.isProcessing = true;
    this.activeCount++;
    this.lastRequestTime = Date.now();

    const task = this.queue.shift();

    try {
      const result = await this.executeWithRetry(task);
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.activeCount--;
      this.isProcessing = false;
      this.processNext();
    }
  }

  async executeWithRetry(task, maxRetries = 3) {
    try {
      // Execute the request
      const response = await task.requestFn();
      
      // Check for Supabase function specific error structures that imply rate limits or server errors
      // Supabase functions return { data, error }
      if (response && response.error) {
        const err = response.error;
        
        // Check for FunctionsHttpError (non-2xx response from function)
        if (err.name === 'FunctionsHttpError') {
           // Try to parse context if available
           const context = await err.context?.json().catch(() => ({}));
           
           // 429 Too Many Requests
           if (err.status === 429 || context.status === 429) {
             throw new Error('RATE_LIMIT');
           }
           
           // 5xx Server Errors - retryable
           if (err.status >= 500 || context.status >= 500) {
             throw new Error('SERVER_ERROR');
           }
        }
        
        // Check for explicit 429 in message
        if (
          err.code === 429 || 
          err.status === 429 ||
          (err.message && err.message.includes('429')) ||
          (err.message && err.message.toLowerCase().includes('too many requests'))
        ) {
          throw new Error('RATE_LIMIT');
        }
      }

      return response;

    } catch (error) {
      const isRetryable = 
        error.message === 'RATE_LIMIT' || 
        error.message === 'SERVER_ERROR' ||
        error.status === 429 || 
        error.code === 429 ||
        error.status >= 500;
      
      if (isRetryable && task.retries < maxRetries) {
        task.retries++;
        // Exponential backoff + jitter: 1s, 2s, 4s... + random
        const delay = Math.pow(2, task.retries) * 1000 + (Math.random() * 500); 
        console.warn(`[Queue] ${error.message} hit. Retrying in ${Math.round(delay)}ms (Attempt ${task.retries}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(task, maxRetries);
      }
      
      // If not retryable or max retries reached, throw original error (or wrapped)
      throw error;
    }
  }
}

// Export a singleton instance tuned for France Travail / Supabase Edge Limits
export const apiQueue = new ApiQueue({
  concurrency: 2, // Conservative concurrency
  interval: 500   // 500ms between requests to be safe
});