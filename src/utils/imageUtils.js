export function fileToImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image from file."));
    };
    img.src = url;
  });
}

export function imageToMat(img) {
  const cv = window.cv;
  if (!cv || !cv.imread) {
    throw new Error("OpenCV.js is not loaded yet.");
  }
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return cv.imread(canvas);
}

export function matToDataURL(mat, type = 'image/jpeg', quality = 0.92) {
  const cv = window.cv;
  if (!cv || !cv.imshow) {
    throw new Error("OpenCV.js is not loaded yet.");
  }
  const canvas = document.createElement("canvas");
  cv.imshow(canvas, mat);
  return canvas.toDataURL(type, quality);
}

export function resizeIfNeeded(mat, maxDim = 2500) {
  const cv = window.cv;
  if (mat.rows > maxDim || mat.cols > maxDim) {
    const scale = maxDim / Math.max(mat.rows, mat.cols);
    const dst = new cv.Mat();
    cv.resize(mat, dst, new cv.Size(Math.round(mat.cols * scale), Math.round(mat.rows * scale)), 0, 0, cv.INTER_AREA);
    return dst;
  }
  return mat.clone();
}

/**
 * Determines whether an image (HTMLImageElement or cv.Mat) is predominantly grayscale.
 */
export function isGrayscaleImage(input) {
  try {
    // If input is an HTMLImageElement or Canvas
    if (input && (input instanceof HTMLImageElement || input instanceof HTMLCanvasElement || input.tagName === 'IMG')) {
      const canvas = document.createElement("canvas");
      const sampleSize = 64;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(input, 0, 0, sampleSize, sampleSize);
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      
      let matches = 0;
      const totalPixels = sampleSize * sampleSize;
      const threshold = 15;

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const diff = Math.max(r, g, b) - Math.min(r, g, b);
        if (diff <= threshold) {
          matches++;
        }
      }

      return (matches / totalPixels) > 0.88;
    }

    // If input is a cv.Mat
    if (input && input.rows && input.cols) {
      if (input.channels() === 1) return true;
      const data = input.data;
      let matches = 0;
      const numSamples = 100;
      const threshold = 15;
      const channels = input.channels();

      for (let i = 0; i < numSamples; i++) {
        const rIdx = Math.floor(Math.random() * input.rows);
        const cIdx = Math.floor(Math.random() * input.cols);
        const idx = (rIdx * input.cols + cIdx) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (Math.max(r, g, b) - Math.min(r, g, b) <= threshold) {
          matches++;
        }
      }
      return (matches / numSamples) > 0.88;
    }
  } catch (err) {
    console.warn("Could not determine grayscale status:", err);
  }
  return false;
}
