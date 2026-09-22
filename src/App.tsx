import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pencil,
  Camera,
  ImageUp,
  Download,
  RotateCcw,
  Sparkles,
  Feather,
  PenTool,
  Palette,
  Wand2,
} from "lucide-react";
import CompareSlider from "./components/CompareSlider";
import { createSketch, type SketchStyle } from "./utils/sketch";

const STYLES: { id: SketchStyle; label: string; icon: typeof Pencil }[] = [
  { id: "pencil", label: "Pencil", icon: Pencil },
  { id: "color", label: "Color", icon: Palette },
  { id: "ink", label: "Ink", icon: PenTool },
];

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sketchSrc, setSketchSrc] = useState<string | null>(null);
  const [style, setStyle] = useState<SketchStyle>("pencil");
  const [softness, setSoftness] = useState(10);
  const [contrast, setContrast] = useState(115);
  const [tint, setTint] = useState(0.35);
  const [compareValue, setCompareValue] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await createSketch(imageSrc, {
        style,
        softness,
        contrast,
        tint,
      });
      setSketchSrc(result);
    } catch (err) {
      console.error(err);
      setError("Couldn't sketch that image. Try a different one.");
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, style, softness, contrast, tint]);

  useEffect(() => {
    if (!imageSrc) return;
    const timeout = setTimeout(() => {
      processImage();
    }, 120);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, style, softness, contrast, tint]);

  const handleFiles = useCallback(async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    const dataUrl = await readFileAsDataURL(file);
    setImageSrc(dataUrl);
    setSketchSrc(null);
    setCompareValue(50);
  }, []);

  const handleReset = () => {
    setImageSrc(null);
    setSketchSrc(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!sketchSrc) return;
    const link = document.createElement("a");
    link.href = sketchSrc;
    link.download = `sketch-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black py-6 px-3 sm:py-10">
      {/* Phone frame */}
      <div className="relative mx-auto flex h-[780px] max-h-[92vh] w-full max-w-[400px] flex-col overflow-hidden rounded-[2.75rem] border-[6px] border-zinc-800 bg-gradient-to-b from-slate-50 to-slate-100 shadow-2xl shadow-black/60">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-zinc-800" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-zinc-800">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
              <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
              <rect x="4" y="4" width="2.5" height="6" rx="0.5" />
              <rect x="8" y="2" width="2.5" height="8" rx="0.5" />
              <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
            </svg>
            <svg width="16" height="10" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="1" width="19" height="14" rx="3" />
              <rect x="21.5" y="5" width="1.5" height="6" rx="0.75" fill="currentColor" stroke="none" />
              <rect x="3" y="3" width="15" height="10" rx="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* App header */}
        <header className="flex items-center gap-2.5 px-5 pt-2 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-300/50">
            <Pencil className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-bold text-zinc-900">SketchIt</h1>
            <p className="text-[11px] text-zinc-500">Photo → pencil sketch, instantly</p>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-5 pb-6">
          {!imageSrc ? (
            <UploadPanel
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onFiles={handleFiles}
              fileInputRef={fileInputRef}
              cameraInputRef={cameraInputRef}
              error={error}
            />
          ) : (
            <div className="flex flex-col gap-4 pt-1">
              <div className="relative">
                {sketchSrc ? (
                  <CompareSlider
                    before={imageSrc}
                    after={sketchSrc}
                    value={compareValue}
                    onChange={setCompareValue}
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-200">
                    <img
                      src={imageSrc}
                      alt="Original"
                      className="h-full w-full object-cover opacity-40"
                    />
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/40 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 animate-pulse text-white" />
                    <span className="text-xs font-medium text-white">Sketching…</span>
                  </div>
                )}
              </div>

              {/* Style selector */}
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setStyle(id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs font-medium transition ${
                      style === id
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3.5 rounded-2xl border border-zinc-200 bg-white p-4">
                <SliderControl
                  icon={<Feather className="h-3.5 w-3.5" />}
                  label="Pencil softness"
                  value={softness}
                  min={2}
                  max={30}
                  step={1}
                  onChange={setSoftness}
                />
                <SliderControl
                  icon={<Wand2 className="h-3.5 w-3.5" />}
                  label="Contrast"
                  value={contrast}
                  min={80}
                  max={200}
                  step={5}
                  onChange={setContrast}
                />
                {style === "color" && (
                  <SliderControl
                    icon={<Palette className="h-3.5 w-3.5" />}
                    label="Color tint"
                    value={Math.round(tint * 100)}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(v) => setTint(v / 100)}
                    suffix="%"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pb-2">
                <button
                  onClick={handleDownload}
                  disabled={!sketchSrc}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition active:scale-[0.98] disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-600 transition active:scale-[0.98]"
                >
                  <RotateCcw className="h-4 w-4" />
                  New
                </button>
              </div>

              <p className="pb-1 text-center text-[10.5px] leading-relaxed text-zinc-400">
                Made with layered grayscale, blur &amp; "color-dodge" blending —
                a pure canvas-compositing trick, no image-processing algorithms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function UploadPanel({
  isDragging,
  setIsDragging,
  onFiles,
  fileInputRef,
  cameraInputRef,
  error,
}: {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onFiles: (files: FileList | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-zinc-300 bg-white/60 hover:bg-zinc-50"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
          <ImageUp className="h-7 w-7 text-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-700">Tap to upload a photo</p>
          <p className="mt-1 text-xs text-zinc-400">or drag & drop it here</p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 active:scale-[0.98]"
        >
          <ImageUp className="h-4 w-4" />
          Gallery
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-600 active:scale-[0.98]"
        >
          <Camera className="h-4 w-4" />
          Camera
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      <div className="mt-1 rounded-2xl bg-zinc-100/80 p-4">
        <p className="text-[11px] leading-relaxed text-zinc-500">
          <span className="font-semibold text-zinc-600">How it works: </span>
          instead of running edge-detection or pixel algorithms, the app
          layers a grayscale copy, a blurred inverted copy, and blends them
          with the browser's native{" "}
          <span className="font-mono text-[10.5px]">color-dodge</span> mode —
          the same optical trick used in traditional pencil-sketch drawing
          tutorials, done entirely by the Canvas compositor.
        </p>
      </div>
    </div>
  );
}

function SliderControl({
  icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
          {icon}
          {label}
        </span>
        <span className="text-xs font-semibold text-indigo-600">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-indigo-600"
      />
    </div>
  );
}
