/**
 * Applies denoising to an image using Bilateral Filter or Gaussian Blur as fallback.
 * @param {any} src - The source cv.Mat
 * @param {number} strength - Denoise strength from 0 to 100
 * @returns {any} A new cv.Mat with denoised image
 */
export function denoise(src, strength) {
  const cv = window.cv;
  if (!cv || !cv.Mat) {
    throw new Error("OpenCV is not loaded");
  }
  if (strength === 0) {
    return src.clone();
  }
  
  const dst = new cv.Mat();
  const d = Math.min(Math.ceil(strength / 10) * 2 + 1, 15);
  const sigmaColor = strength * 1.5;
  const sigmaSpace = strength * 1.5;

  let rgb = null;
  let dstRgb = null;

  try {
    if (src.channels() === 4) {
      rgb = new cv.Mat();
      dstRgb = new cv.Mat();
      cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      cv.bilateralFilter(rgb, dstRgb, d, sigmaColor, sigmaSpace, cv.BORDER_DEFAULT);
      cv.cvtColor(dstRgb, dst, cv.COLOR_RGB2RGBA);
    } else {
      cv.bilateralFilter(src, dst, d, sigmaColor, sigmaSpace, cv.BORDER_DEFAULT);
    }
  } catch (err) {
    console.warn("Bilateral filter failed, falling back to Gaussian Blur", err);
    let ksize = Math.floor(strength / 10) * 2 + 1;
    if (ksize < 3) ksize = 3;
    if (ksize % 2 === 0) ksize += 1;
    cv.GaussianBlur(src, dst, new cv.Size(ksize, ksize), 0, 0, cv.BORDER_DEFAULT);
  } finally {
    if (rgb) rgb.delete();
    if (dstRgb) dstRgb.delete();
  }
  
  return dst;
}
