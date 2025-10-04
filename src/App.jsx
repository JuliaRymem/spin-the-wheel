import React, { useMemo, useRef, useState } from "react";
import Wheel from "./components/Wheel.jsx";
import SegmentList from "./components/SegmentList.jsx";
import Controls from "./components/Controls.jsx";
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
  const liveRef = useRef(null);

  const segments = useMemo(() => items.map((label, i) => ({
    label,
    color: PALETTE[i % PALETTE.length],
  })), [items]);

  const canSpin = segments.length >= 2 && !spinning;

  function onAdd(value) {
    const v = (value || "").trim();
    if (!v) return;
    if (items.some(s => s.toLowerCase() === v.toLowerCase())) return;
    setItems(prev => [...prev, v]);
  }

  function onRemove(idx) {
    if (spinning) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
    if (winnerIndex === idx) setWinnerIndex(null);
  }

  function spin() {
    if (!canSpin) return;
    setSpinning(true);
    setWinnerIndex(null);
    const n = segments.length;
    const winner = pickRandomIndex(n);

    const segSize = 360 / n;
    const center = winner * segSize + segSize / 2; // mitt på vinnande segmentet
    const extraTurns = 5 + Math.floor(Math.random() * 4); // 5..8 varv
    const target = extraTurns * 360 + (360 - center); // landa vid indikatorn

    // reset → target (för att kunna snurra flera gånger)
    requestAnimationFrame(() => {
      setRotation(prev => prev % 360);
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pt-safe pb-24">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Spin the Wheel</h1>
      <p className="text-zinc-600 mt-1">Lägg till egna val och låt ödet (ibland) bestämma ✨</p>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col items-center">
          <Wheel
            segments={segments}
            rotation={rotation}
            spinning={spinning}
            onTransitionEnd={onTransitionEnd}
          />
          <div role="status" aria-live="polite" ref={liveRef} className="h-6 mt-2 text-center font-bold" />
          <div className="mt-3 text-sm text-zinc-600">{segments.length} val</div>
        </div>

        <div className="bg-white/70 backdrop-blur border border-zinc-200 rounded-2xl p-4">
          <Controls
            canSpin={canSpin}
            spinning={spinning}
            onSpin={spin}
            onReset={resetWheel}
            onAdd={onAdd}
          />
          <SegmentList segments={segments} onRemove={onRemove} />
        </div>
      </div>

      {/* Mobil action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-white/90 backdrop-blur border-t border-zinc-200
                      px-4 pt-3 pb-4 pb-safe">
        <div className="flex gap-2">
          <button
            disabled={!canSpin}
            onClick={spin}
            className="flex-1 px-5 py-3 rounded-2xl bg-zinc-900 text-white font-bold disabled:opacity-50"
          >
            Snurra
          </button>
          <button
            disabled={spinning}
            onClick={resetWheel}
            className="px-4 py-3 rounded-2xl border border-zinc-300 font-bold disabled:opacity-50"
          >
            Nollställ
          </button>
        </div>
      </div>

      <footer className="mt-6 text-sm text-zinc-600">
        Tips: För tävlingar – avgör vinnare på servern och signera svaret till klienten.
      </footer>
    </div>
  );
}