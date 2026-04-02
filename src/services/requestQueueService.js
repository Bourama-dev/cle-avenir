class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.delayMs = 300; // 300ms delay between executions to avoid 429 errors
  }

  queueRequest(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const { fn, resolve, reject } = this.queue.shift();

    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        this.isProcessing = false;
        this.processQueue();
      }, this.delayMs);
    }
  }
}

export const requestQueueService = new RequestQueue();

export const queueRequest = (fn) => {
  return requestQueueService.queueRequest(fn);
};