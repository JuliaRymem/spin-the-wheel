import React, { useState } from "react";

export default function SegmentList({ segments, onRemove, onEdit, size = "md" }) {
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const itemPad = size === "lg" ? "px-4 py-3" : "px-3 py-2";
  const textCls = size === "lg" ? "text-base sm:text-lg" : "text-sm";
  const pill = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  function startEdit(i, label) {
    setEditIdx(i);
    setEditValue(label);
  }

  function commitEdit(i) {
    if (editValue.trim()) onEdit?.(i, editValue.trim());
    setEditIdx(null);
  }

  function cancelEdit() {
    setEditIdx(null);
  }

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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span
              className={`${pill} flex-shrink-0 rounded-md ring-1 ring-black/5`}
              style={{ background: s.color }}
            />
            {editIdx === i ? (
              <input
                autoFocus
                className="flex-1 rounded-xl border border-zinc-200 px-2 py-1 text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(i);
                  if (e.key === "Escape") cancelEdit();
                }}
              />
            ) : (
              <span className={`truncate font-semibold text-zinc-800 ${textCls}`}>
                {s.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {editIdx === i ? (
              <>
                <button
                  onClick={() => commitEdit(i)}
                  className="px-2 py-1 text-xs rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold transition"
                >
                  Spara
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-2 py-1 text-xs rounded-lg border border-white bg-zinc-50 text-zinc-500 hover:bg-zinc-100 font-semibold transition"
                >
                  Avbryt
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEdit(i, s.label)}
                  className="px-3 py-1.5 text-sm rounded-xl border border-white bg-sky-50/80 text-sky-700 hover:bg-sky-100 transition"
                >
                  Redigera
                </button>
                <button
                  onClick={() => onRemove(i)}
                  className="px-3 py-1.5 text-sm rounded-xl border border-white bg-rose-50/80 text-rose-700 hover:bg-rose-100 transition"
                >
                  Ta bort
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
