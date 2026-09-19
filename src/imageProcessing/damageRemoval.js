/**
 * Removes scratch-like artifacts from an image using thresholding and inpainting.
 * @param {any} src - The source cv.Mat
 * @returns {any} A new cv.Mat with damages removed
 */
export function removeDamage(src) {
  const cv = window.cv;
  if (!cv || !cv.Mat) {
    throw new Error("OpenCV is not loaded");
  }
  const dst = new cv.Mat();
  const gray = new cv.Mat();
  const mask = new cv.Mat();
  const kernel = cv.Mat.ones(2, 2, cv.CV_8U);
  let rgb = null;
  let dstRgb = null;
  
  try {
    // Convert to grayscale for scratch detection
    if (src.channels() === 4) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else if (src.channels() === 3) {
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
    } else {
      src.copyTo(gray);
    }
    
    // Adaptive threshold to detect small high-frequency scratch artifacts
    cv.adaptiveThreshold(gray, mask, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 11, 30);
    
    // Morphological close to connect small scratch fragments
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel);
    
    try {
      if (src.channels() === 4) {
        rgb = new cv.Mat();
        dstRgb = new cv.Mat();
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
        cv.inpaint(rgb, mask, dstRgb, 3, cv.INPAINT_TELEA);
        cv.cvtColor(dstRgb, dst, cv.COLOR_RGB2RGBA);
      } else {
        cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA);
      }
    } catch (err) {
      console.warn("Inpaint failed, falling back to Median Blur", err);
      cv.medianBlur(src, dst, 3);
    }
  } finally {
    gray.delete();
    mask.delete();
    kernel.delete();
    if (rgb) rgb.delete();
    if (dstRgb) dstRgb.delete();
  }
  
  return dst;
}
