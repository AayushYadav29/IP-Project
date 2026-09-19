/**
 * Automatically restores an image by running a pipeline of operations.
 * @param {any} src - The source cv.Mat
 * @returns {Object} Object containing result Mat, operations array, and processing time
 */
export function autoRestore(src) {
  const cv = window.cv;
  const start = performance.now();
  const operations = [];
  
  const rgb = new cv.Mat();
  const lab = new cv.Mat();
  const channels = new cv.MatVector();
  const enhancedL = new cv.Mat();
  const rgba = new cv.Mat();
  let clahe = null;
  let lChannel = null;
  
  const blurred = new cv.Mat();
  const sharpened = new cv.Mat();
  const result = new cv.Mat();
  
  try {
    // 1. & 2. Convert to LAB
    cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
    cv.cvtColor(rgb, lab, cv.COLOR_RGB2Lab);
    
    // 3. CLAHE
    cv.split(lab, channels);
    lChannel = channels.get(0);
    try {
      clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(lChannel, enhancedL);
      operations.push('Contrast enhanced (CLAHE)');
    } catch (err) {
      cv.equalizeHist(lChannel, enhancedL);
      operations.push('Contrast enhanced (Histogram Equalization)');
    }
    channels.set(0, enhancedL);
    
    // 4. Merge and convert back to RGB
    cv.merge(channels, lab);
    cv.cvtColor(lab, rgb, cv.COLOR_Lab2RGB);
    
    // 5. Bilateral filter on 3-channel RGB
    const denoisedRgb = new cv.Mat();
    try {
      cv.bilateralFilter(rgb, denoisedRgb, 9, 75, 75, cv.BORDER_DEFAULT);
      operations.push('Noise reduced (Bilateral)');
    } catch (err) {
      cv.GaussianBlur(rgb, denoisedRgb, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
      operations.push('Noise reduced (Gaussian)');
    }
    
    cv.cvtColor(denoisedRgb, rgba, cv.COLOR_RGB2RGBA);
    denoisedRgb.delete();
    
    // 6. Unsharp mask
    cv.GaussianBlur(rgba, blurred, new cv.Size(0, 0), 3);
    cv.addWeighted(rgba, 1.4, blurred, -0.4, 0, sharpened);
    operations.push('Details sharpened');
    
    // 7. Brightness/contrast boost
    cv.convertScaleAbs(sharpened, result, 1.08, 8);
    operations.push('Brightness corrected');
    
    const processingTime = performance.now() - start;
    const finalResult = result.clone();
    
    return { result: finalResult, operations, processingTime };
  } finally {
    rgb.delete();
    lab.delete();
    channels.delete();
    enhancedL.delete();
    rgba.delete();
    blurred.delete();
    sharpened.delete();
    result.delete();
    if (clahe) clahe.delete();
    if (lChannel) lChannel.delete();
  }
}
