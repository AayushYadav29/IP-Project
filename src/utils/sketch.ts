// sketch.ts
//
// Turns a photo into a pencil-sketch using nothing but the browser's
// native Canvas 2D compositing pipeline — no manual pixel loops,
// no edge-detection kernels, no convolution matrices written by hand.
//
// The trick (a well known optical/darkroom technique, "dodge & burn"):
//   1. Desaturate the photo -> grayscale layer
//   2. Duplicate it, invert the colors, blur it -> soft negative layer
//   3. Composite the blurred negative on top of the grayscale layer
//      using the browser's built-in "color-dodge" blend mode
// The math for grayscale/invert/blur/dodge is all handled internally
// by the browser's compositor (CSS Filter + globalCompositeOperation),
// we just describe *what* effect we want, never *how* to compute it.

export type SketchStyle = "pencil" | "color" | "ink";

export interface SketchOptions {
  style: SketchStyle;
  softness: number; // blur radius in px, controls pencil "graininess"
  contrast: number; // percentage, 100 = normal
  tint: number; // 0-1, how much of the original color bleeds back in (color style)
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const MAX_DIMENSION = 1400;

export async function createSketch(
  src: string,
  opts: SketchOptions
): Promise<string> {
  const img = await loadImage(src);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // 1. Base grayscale layer
  const grayCanvas = makeCanvas(width, height);
  const grayCtx = grayCanvas.getContext("2d")!;
  grayCtx.filter = `grayscale(1) contrast(${opts.contrast}%)`;
  grayCtx.drawImage(img, 0, 0, width, height);

  // 2. Inverted + blurred layer (drawn straight from the base grayscale
  //    canvas so the browser does the invert/blur for us)
  const blurCanvas = makeCanvas(width, height);
  const blurCtx = blurCanvas.getContext("2d")!;
  blurCtx.filter = `invert(1) blur(${opts.softness}px)`;
  blurCtx.drawImage(grayCanvas, 0, 0);

  // 3. Composite with color-dodge -> pencil sketch magic
  const outCanvas = makeCanvas(width, height);
  const outCtx = outCanvas.getContext("2d")!;
  outCtx.drawImage(grayCanvas, 0, 0);
  outCtx.globalCompositeOperation = "color-dodge";
  outCtx.drawImage(blurCanvas, 0, 0);
  outCtx.globalCompositeOperation = "source-over";

  if (opts.style === "ink") {
    // Push it towards a bold ink-pen look using only filters + blend modes
    const inkCanvas = makeCanvas(width, height);
    const inkCtx = inkCanvas.getContext("2d")!;
    inkCtx.filter = `contrast(${opts.contrast + 60}%) brightness(0.92)`;
    inkCtx.drawImage(outCanvas, 0, 0);
    return inkCanvas.toDataURL("image/png");
  }

  if (opts.style === "color") {
    // Blend the original colors back in with "multiply" so the
    // pencil strokes stay but colors show through softly.
    const colorCanvas = makeCanvas(width, height);
    const colorCtx = colorCanvas.getContext("2d")!;
    colorCtx.drawImage(outCanvas, 0, 0);
    colorCtx.globalAlpha = opts.tint;
    colorCtx.globalCompositeOperation = "multiply";
    colorCtx.filter = "saturate(1.4)";
    colorCtx.drawImage(img, 0, 0, width, height);
    colorCtx.globalAlpha = 1;
    colorCtx.globalCompositeOperation = "source-over";
    return colorCanvas.toDataURL("image/png");
  }

  return outCanvas.toDataURL("image/png");
}
