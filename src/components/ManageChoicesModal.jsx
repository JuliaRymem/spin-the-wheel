// src/components/ManageChoicesModal.jsx
import React, { useEffect, useRef } from "react";
import Controls from "./Controls.jsx";
import SegmentList from "./SegmentList.jsx";

/**
 * Modal som visar samma innehåll som din nuvarande "ruta för val":
 * - Controls (input + Lägg till)
 * - SegmentList (lista + Ta bort)
 */
export default function ManageChoicesModal({
  open,
  onClose,
  segments,
  canSpin,
  spinning,
  onSpin,
  onReset,
  onAdd,
  onRemove,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Enkel fokus-hjälp: fokusera dialogen
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
        // Klick på backdrop stänger
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-[92vw] max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-xl p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="manage-choices-title" className="text-lg font-bold">
            Hantera val
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-zinc-300 hover:bg-zinc-50"
          >
            Stäng
          </button>
        </div>

        {/* Samma innehåll som tidigare sidopanel */}
        <div className="mt-3">
          <Controls
            canSpin={canSpin}
            spinning={spinning}
            onSpin={onSpin}
            onReset={onReset}
            onAdd={onAdd}
          />
          <SegmentList segments={segments} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
}