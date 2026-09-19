/**
 * Waits for OpenCV.js to load and initialize.
 * @param {number} timeout - Maximum time to wait in milliseconds.
 * @returns {Promise<any>} A promise that resolves to window.cv.
 */
export function waitForOpenCV(timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        clearInterval(checkInterval);
        resolve(window.cv);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error("OpenCV.js loading timed out."));
      }
    }, 100);
  });
}
