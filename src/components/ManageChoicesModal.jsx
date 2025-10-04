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

  const existingLabels = segments.map((s) => s.label);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-choices-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-[92vw] max-w-lg rounded-3xl bg-white/85 backdrop-blur border border-white/70
                   shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="manage-choices-title" className="text-lg font-extrabold text-zinc-800">
            
          </h2>
          <button
            onClick={() => onClose?.()}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white/70 hover:bg-white font-semibold"
          >
            Stäng
          </button>
        </div>

        <p className="text-sm text-zinc-600 mt-1">
          Här kan du lägga till val för hjulet. <br /> Vill du skriva flera val samtidigt? använd ett <br /> <span className="font-semibold">kommatecken</span> eller <span className="font-semibold">radbrytning</span>.
        </p>

        {/* Större, enklare skriv-ruta */}
        <div className="mt-4">
          <Controls
            variant="modal"                // större styling
            onAdd={onAdd}                  // anropas per nytt värde
            existingLabels={existingLabels} // dedupe (case-insensitive)
          />
        </div>

        {/* Större lista */}
        <SegmentList size="lg" segments={segments} onRemove={onRemove} />

        {/* Knapp under listan: stäng och tillbaka till hjulet */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => onClose?.()}
            className="px-5 py-3 rounded-2xl font-bold text-zinc-900
                       bg-gradient-to-r from-sky-200 to-emerald-200
                       shadow-[0_8px_20px_rgba(59,130,246,0.2)]
                       hover:brightness-105 transition"
          >
            Klar – tillbaka till hjulet
          </button>
        </div>
      </div>
    </div>
  );
}