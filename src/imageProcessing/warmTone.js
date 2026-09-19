/**
 * Applies a warm tone to an image using direct pixel manipulation.
 * @param {any} src - The source cv.Mat (RGBA)
 * @returns {any} A new cv.Mat with warm tone applied
 */
export function applyWarmTone(src) {
  const cv = window.cv;
  const dst = new cv.Mat(src.rows, src.cols, cv.CV_8UC4);
  const srcData = src.data;
  const dstData = dst.data;
  const length = srcData.length;
  
  for (let i = 0; i < length; i += 4) {
    const r = srcData[i];
    const g = srcData[i+1];
    const b = srcData[i+2];
    
    // Get grayscale intensity
    const intensity = (r * 0.299 + g * 0.587 + b * 0.114);
    
    let outR, outG, outB;
    if (intensity <= 80) { // shadows
      outR = intensity + 30;
      outG = intensity + 15;
      outB = intensity - 10;
    } else if (intensity <= 180) { // midtones
      outR = intensity + 25;
      outG = intensity + 18;
      outB = intensity + 5;
    } else { // highlights
      outR = intensity + 10;
      outG = intensity + 8;
      outB = intensity + 5;
    }
    
    dstData[i] = Math.min(255, Math.max(0, outR));
    dstData[i+1] = Math.min(255, Math.max(0, outG));
    dstData[i+2] = Math.min(255, Math.max(0, outB));
    dstData[i+3] = srcData[i+3]; // preserve alpha
  }
  
  return dst;
}
