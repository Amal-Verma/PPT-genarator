/**
 * Retry utility that attempts to execute an async function multiple times before giving up
 * 
 * @param {Function} fn - The async function to retry
 * @param {any[]} args - Arguments to pass to the function
 * @param {object} options - Configuration options
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.delay=500] - Base delay between retries in milliseconds (increases with each retry)
 * @param {Function} [options.onRetry] - Callback function executed when a retry occurs
 * @param {Function} [options.onFail] - Callback function executed when all retries fail
 * @returns {Promise<T>} - Result of the function execution
 */
export async function withRetry<T>(
  fn: (...args: any[]) => Promise<T>,
  args: any[] = [],
  options: {
    maxRetries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
    onFail?: () => T | Promise<T>; // Updated to accept both synchronous and asynchronous return values
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 500, onRetry } = options;
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries}`);
    try {
      // Attempt to execute the function
      return await fn(...args);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the failure
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // Call the onRetry callback if provided
      if (onRetry) {
        onRetry(lastError, attempt);
      }
      
      // If this was the last attempt, throw the error
      if (attempt >= maxRetries) {
        break;
      }
      
      // Wait before next attempt with exponential backoff
      const waitTime = delay * Math.pow(1.5, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  if (options.onFail) {
    // Ensure the result is always wrapped in a Promise
    return Promise.resolve(options.onFail());
  }
  throw new Error(`All ${maxRetries} retry attempts failed: ${lastError?.message}`);
}
