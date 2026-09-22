import { useRef } from "react";

interface CompareSliderProps {
  before: string;
  after: string;
  value: number; // 0 - 100
  onChange: (value: number) => void;
}

export default function CompareSlider({
  before,
  after,
  value,
  onChange,
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl bg-black/40 shadow-inner"
    >
      {/* Sketch (after) - full base layer */}
      <img
        src={after}
        alt="Sketch result"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Original (before) - clipped from the left */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        <img
          src={before}
          alt="Original photo"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line + handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        style={{ left: `${value}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-black/10">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-slate-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 7l-5 5 5 5" />
            <path d="M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
        Original
      </span>
      <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
        Sketch
      </span>

      {/* Invisible range input drives the interaction, full coverage for easy touch */}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Compare original and sketch"
      />
    </div>
  );
}
