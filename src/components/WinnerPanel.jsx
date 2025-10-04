import React, { useEffect, useRef } from "react";

export default function WinnerPanel({ open, label, color, onClose, onSpinAgain }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => dialogRef.current?.focus(), 0);
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") onSpinAgain?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onSpinAgain]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-[92vw] max-w-md rounded-3xl bg-white/85 backdrop-blur border border-white/70
                   shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-6
                   animate-[pop_.25s_ease-out]"
      >
        <div
          className="absolute -inset-x-0 -top-1 h-2 rounded-t-3xl"
          style={{ background: color || "#FBCFE8" }}
          aria-hidden
        />

        <h2 id="winner-title" className="text-2xl sm:text-3xl font-extrabold text-zinc-800">
          Vi har en vinnare! 🎉
        </h2>

        <div className="mt-4">
          <div
            className="mx-auto w-full rounded-2xl border border-white shadow-sm p-5"
            style={{ background: color ? `${color}80` : "#FBCFE880" }}
          >
            <div className="text-lg sm:text-xl font-extrabold text-zinc-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
              {label}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={onSpinAgain}
            className="px-5 py-3 rounded-2xl font-bold text-zinc-900
                       bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200
                       shadow-[0_8px_20px_rgba(244,114,182,0.25)]
                       hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Snurra igen
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-zinc-200 bg-white/80 font-semibold hover:bg-white"
          >
            Stäng
          </button>
        </div>
      </div>

      {/* Keyframe för pop-effekt */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(.9); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  );
}