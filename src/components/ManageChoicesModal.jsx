import React, { useEffect, useRef } from "react";
import Controls from "./Controls.jsx";
import SegmentList from "./SegmentList.jsx";

export default function ManageChoicesModal({
  open,
  onClose,
  segments,
  onAdd,
  onRemove,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-choices-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-[92vw] max-w-lg rounded-3xl bg-white/80 backdrop-blur border border-white/70
                   shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white/70 hover:bg-white font-semibold"
          >
            Stäng
          </button>
        </div>

        <p className="text-sb text-zinc-600 mt-1">
          Lägg till eller ta bort i listan
        </p>

        <div className="mt-4">
          <Controls onAdd={onAdd} />
          <SegmentList segments={segments} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
}