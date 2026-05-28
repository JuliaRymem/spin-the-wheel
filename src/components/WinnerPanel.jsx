import React, { useEffect, useRef } from "react";

function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#FBCFE8", "#BFDBFE", "#A7F3D0", "#FDE68A", "#C7D2FE", "#FECACA", "#F5D0FE"];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 80,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1.5 + Math.random() * 2.5,
      drift: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
      opacity: 1,
    }));

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.spin;
        if (frame > 80) p.opacity -= 0.012;
        if (p.opacity <= 0 || p.y > canvas.height + 20) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      frame++;
      if (alive) animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
    />
  );
}

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
                   shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-6 overflow-hidden
                   animate-[pop_.25s_ease-out]"
      >
        <Confetti active={open} />

        <div
          className="absolute -inset-x-0 -top-1 h-2 rounded-t-3xl"
          style={{ background: color || "#FBCFE8" }}
          aria-hidden
        />

        <h2 id="winner-title" className="relative text-2xl sm:text-3xl font-extrabold text-zinc-800">
          Vi har en vinnare! 🎉
        </h2>

        <div className="mt-4 relative">
          <div
            className="mx-auto w-full rounded-2xl border border-white shadow-sm p-5"
            style={{ background: color ? `${color}80` : "#FBCFE880" }}
          >
            <div className="text-lg sm:text-xl font-extrabold text-zinc-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
              {label}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center relative">
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

      <style>{`
        @keyframes pop {
          0% { transform: scale(.9); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
