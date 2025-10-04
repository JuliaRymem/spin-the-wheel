import React, { useMemo, useRef, useState } from "react";
import Wheel from "./components/Wheel.jsx";
import ManageChoicesModal from "./components/ManageChoicesModal.jsx";
import WinnerPanel from "./components/WinnerPanel.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { pickRandomIndex } from "./utils/random.js";

// Pastellfärger till hjulet
const PALETTE = [
  "#FBCFE8", "#BFDBFE", "#A7F3D0", "#FDE68A", "#C7D2FE",
  "#FECACA", "#BAE6FD", "#F5D0FE", "#FDE1D3", "#D9F99D",
];

export default function App() {
  const [items, setItems] = useLocalStorage("wheel.items.v1", [
    "Pizza", "Burgare", "Sallad", "Sushi", "Tacos", "Pasta",
  ]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const liveRef = useRef(null);

  const segments = useMemo(
    () =>
      items.map((label, i) => ({
        label,
        color: PALETTE[i % PALETTE.length],
      })),
    [items]
  );

  const canSpin = segments.length >= 2 && !spinning;

  function onAdd(value) {
    const v = (value || "").trim();
    if (!v) return;
    if (items.some((s) => s.toLowerCase() === v.toLowerCase())) return;
    setItems((prev) => [...prev, v]);
  }

  function onRemove(idx) {
    if (spinning) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
    if (winnerIndex === idx) setWinnerIndex(null);
  }

  function spin() {
    if (!canSpin) return;
    setSpinning(true);
    setWinnerIndex(null);
    setWinOpen(false);
  
    const n = segments.length;
    const winner = pickRandomIndex(n);
    const segSize = 360 / n;
  
    // Mittpunkten av vinnarsegmentet (geometriskt)
    const center = (winner + 0.5) * segSize;
  
    // Vinkel relativt toppen pga "from -90deg" i conic-gradient
    const centerFromTop = -90 + center;
  
    // Normalisera till [0, 360)
    const normalized = ((centerFromTop % 360) + 360) % 360;
  
    // Rotera så att mittpunkten landar vid indikatorn (toppen)
    const extraTurns = 5 + Math.floor(Math.random() * 4); // 5..8 varv
    const target = extraTurns * 360 + (360 - normalized);
  
    // Reset → target för att få snygg transition varje gång
    requestAnimationFrame(() => {
      setRotation((prev) => prev % 360);
      requestAnimationFrame(() => {
        setRotation(target);
        setWinnerIndex(winner);
      });
    });
  }

  function onTransitionEnd() {
    setSpinning(false);
    if (winnerIndex != null && liveRef.current) {
      liveRef.current.textContent = `Vinnare: ${segments[winnerIndex].label}`;
      setWinOpen(true);
    }
  }

  const winner = winnerIndex != null ? segments[winnerIndex] : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10 text-center bg-gradient-to-b from-rose-50 via-sky-50 to-violet-50">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mx-auto mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
            Spin the Wheel
          </h1>
          <p className="text-zinc-600 mt-2">
            Lägg till egna val och låt ödet (ibland) bestämma ✨
          </p>

          <button
            onClick={() => setManageOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/80 border border-white/70 shadow-sm
                       px-5 py-3 font-bold text-zinc-800 hover:bg-white transition
                       focus:outline-none focus:ring-4 focus:ring-pink-200"
          >
            <span>➕</span> Lägg till val
          </button>
        </div>

        {/* Wheel */}
        <div className="mx-auto rounded-3xl bg-white/70 backdrop-blur-sm border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-6">
          <Wheel
            segments={segments}
            rotation={rotation}
            spinning={spinning}
            onTransitionEnd={onTransitionEnd}
          />

          {/* Stor Snurra-knapp */}
<div className="mt-6">
  <button
    disabled={!canSpin}
    onClick={spin}
    className="group relative inline-flex items-center justify-center rounded-full
               h-16 w-32 sm:h-20 sm:w-40
               bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200
               text-zinc-900 font-extrabold text-lg sm:text-xl
               shadow-[0_8px_24px_rgba(244,114,182,0.35)] disabled:opacity-50
               transition-transform active:scale-95 hover:scale-[1.06]"
    aria-label="Snurra"
    title="Snurra"
  >
    <span className="absolute inset-0 rounded-full ring-1 ring-white/70" />
    <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
      Snurra
    </span>
  </button>
</div>

          {/* Result */}
          <div
            role="status"
            aria-live="polite"
            ref={liveRef}
            className="h-6 mt-4 font-bold text-zinc-700"
          />
          <div className="mt-1 text-sm text-zinc-500">{segments.length} val</div>
        </div>
      </div>

      {/* Popup: Hantera val */}
      <ManageChoicesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        segments={segments}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      {/* Popup: Vinstpanel */}
      <WinnerPanel
        open={winOpen && !!winner}
        label={winner?.label}
        color={winner?.color}
        onClose={() => setWinOpen(false)}
        onSpinAgain={() => {
          setWinOpen(false);
          spin();
        }}
      />
    </div>
  );
}