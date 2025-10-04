import React from "react";

export default function SegmentList({ segments, onRemove, size = "md" }) {
  const itemPad = size === "lg" ? "px-4 py-3" : "px-3 py-2";
  const textCls = size === "lg" ? "text-base sm:text-lg" : "text-sm";
  const pill = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex flex-col gap-2 mt-4 max-h-72 overflow-auto">
      {segments.length === 0 && (
        <p className="text-sm text-zinc-500">Inga val ännu.</p>
      )}

      {segments.map((s, i) => (
        <div
          key={i}
          className={`flex items-center justify-between gap-3
                     rounded-2xl bg-white/80 border border-white shadow-sm ${itemPad}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`${pill} rounded-md ring-1 ring-black/5`}
              style={{ background: s.color }}
              title={s.label}
            />
            <span className={`truncate font-semibold text-zinc-800 ${textCls}`}>
              {s.label}
            </span>
          </div>

          <button
            onClick={() => onRemove(i)}
            className="px-3 py-1.5 text-sm rounded-xl
                       border border-white bg-rose-50/80 text-rose-700
                       hover:bg-rose-100 transition"
          >
            Ta bort
          </button>
        </div>
      ))}
    </div>
  );
}