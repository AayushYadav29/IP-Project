/**
 * Enhances details of an image using CLAHE on the L channel of LAB color space.
 * @param {any} src - The source cv.Mat
 * @returns {any} A new cv.Mat with enhanced details
 */
export function enhanceDetails(src) {
  const cv = window.cv;
  const dst = new cv.Mat();
  const rgb = new cv.Mat();
  const lab = new cv.Mat();
  const channels = new cv.MatVector();
  const enhancedL = new cv.Mat();
  let lChannel = null;
  let clahe = null;
  
  const blurred = new cv.Mat();
  
  try {
    cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
    cv.cvtColor(rgb, lab, cv.COLOR_RGB2Lab);
    
    cv.split(lab, channels);
    lChannel = channels.get(0);
    
    try {
      clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(lChannel, enhancedL);
    } catch (err) {
      console.warn("CLAHE failed, falling back to equalizeHist", err);
      cv.equalizeHist(lChannel, enhancedL);
    }
    
    channels.set(0, enhancedL);
    cv.merge(channels, lab);
    
    cv.cvtColor(lab, rgb, cv.COLOR_Lab2RGB);
    cv.cvtColor(rgb, dst, cv.COLOR_RGB2RGBA);
    
    // Mild sharpening
    cv.GaussianBlur(dst, blurred, new cv.Size(0, 0), 3);
    cv.addWeighted(dst, 1.3, blurred, -0.3, 0, dst);
    
  } finally {
    rgb.delete();
    lab.delete();
    channels.delete();
    enhancedL.delete();
    blurred.delete();
    if (lChannel !== null) lChannel.delete();
    if (clahe !== null) clahe.delete();
  }
  
  return dst;
}
