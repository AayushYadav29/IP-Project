/**
 * Sharpens an image using Unsharp Masking technique.
 * @param {any} src - The source cv.Mat
 * @param {number} amount - Sharpen amount from 0 to 100
 * @returns {any} A new cv.Mat with sharpened image
 */
export function sharpen(src, amount) {
  const cv = window.cv;
  if (amount === 0) {
    return src.clone();
  }
  
  const dst = new cv.Mat();
  const blurred = new cv.Mat();
  
  try {
    cv.GaussianBlur(src, blurred, new cv.Size(0, 0), 3);
    const weight = amount / 50;
    cv.addWeighted(src, 1 + weight, blurred, -weight, 0, dst);
  } finally {
    blurred.delete();
  }
  
  return dst;
}
