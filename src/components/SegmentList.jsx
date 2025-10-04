import React from "react";

export default function SegmentList({ segments, onRemove }) {
  return (
    <div className="flex flex-col gap-2 mt-3 max-h-72 overflow-auto">
      {segments.length === 0 && (
        <p className="text-sm text-zinc-500">Inga val ännu.</p>
      )}
      {segments.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3
                     rounded-2xl px-3 py-2
                     bg-white/80 border border-white shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-4 h-4 rounded-md ring-1 ring-black/5"
              style={{ background: s.color }}
              title={s.label}
            />
            <span className="truncate font-medium text-zinc-800">{s.label}</span>
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