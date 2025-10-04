// src/App.jsx
import React, { useMemo, useRef, useState } from "react";
import Wheel from "./components/Wheel.jsx";
import ManageChoicesModal from "./components/ManageChoicesModal.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { pickRandomIndex } from "./utils/random.js";

const PALETTE = [
  "#60a5fa", "#f59e0b", "#34d399", "#f472b6",
  "#a78bfa", "#fb7185", "#22d3ee", "#facc15",
];

export default function App() {
  const [items, setItems] = useLocalStorage("wheel.items.v1", [
    "Pizza", "Burgare", "Sallad", "Sushi", "Tacos", "Pasta",
  ]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
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
    const n = segments.length;
    const winner = pickRandomIndex(n);

    const segSize = 360 / n;
    const center = winner * segSize + segSize / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 4);
    const target = extraTurns * 360 + (360 - center);

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
    }
  }

  function resetWheel() {
    if (spinning) return;
    setRotation(0);
    setWinnerIndex(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 font-[system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif]">
      {/* Rubrik */}
      <h1 className="text-3xl sm:text-4xl font-extrabold">Spin the Wheel</h1>
      <p className="text-zinc-600 mt-2 mb-4 max-w-sm">
        Lägg till egna val och låt ödet (ibland) bestämma ✨
      </p>

      {/* Knapp för att öppna popup */}
      <button
        onClick={() => setManageOpen(true)}
        className="mb-8 px-5 py-3 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-black"
      >
        Lägg till val
      </button>

      {/* Själva hjulet */}
      <Wheel
        segments={segments}
        rotation={rotation}
        spinning={spinning}
        onTransitionEnd={onTransitionEnd}
      />

      {/* Snurra-knapp direkt under hjulet */}
<div className="mt-6">
  <button
    disabled={!canSpin}
    onClick={spin}
    className="px-8 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-lg disabled:opacity-50 hover:bg-black transition-colors"
  >
    Snurra
  </button>
</div>

      {/* Resultattext */}
      <div
        role="status"
        aria-live="polite"
        ref={liveRef}
        className="h-6 mt-4 text-center font-bold"
      />
      <div className="mt-1 text-sm text-zinc-600">{segments.length} val</div>

      {/* Popup med valhantering */}
      <ManageChoicesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        segments={segments}
        canSpin={canSpin}
        spinning={spinning}
        onSpin={spin}
        onReset={resetWheel}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  );
}