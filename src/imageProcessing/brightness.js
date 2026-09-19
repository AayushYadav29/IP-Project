/**
 * Adjusts the brightness of an image.
 * @param {any} src - The source cv.Mat
 * @param {number} value - Brightness adjustment value from -100 to 100
 * @returns {any} A new cv.Mat with adjusted brightness
 */
export function adjustBrightness(src, value) {
  const cv = window.cv;
  if (!cv || !cv.Mat) {
    throw new Error("OpenCV is not loaded");
  }
  const dst = new cv.Mat();

  if (src.channels() === 4) {
    const rgb = new cv.Mat();
    const dstRgb = new cv.Mat();
    try {
      cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      cv.convertScaleAbs(rgb, dstRgb, 1, value);
      cv.cvtColor(dstRgb, dst, cv.COLOR_RGB2RGBA);
    } finally {
      rgb.delete();
      dstRgb.delete();
    }
  } else {
    cv.convertScaleAbs(src, dst, 1, value);
  }
  return dst;
}
