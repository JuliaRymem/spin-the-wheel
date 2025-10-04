// src/components/Wheel.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Etiketter i MITTEN av sin tårtbit.
 * - Vinkel = -90 + (i + 0.5) * (360 / n)  (matchar conic-gradient(from -90deg))
 * - Radie = sektor-centroid: r = (4 R sin(θ/2)) / (3 θ)
 */
export default function Wheel({ segments, rotation, spinning, onTransitionEnd }) {
  const n = Math.max(segments.length, 1);
  const wrapRef = useRef(null);
  const [size, setSize] = useState(0); // kvadratens min(w,h)

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => setSize(Math.min(el.offsetWidth, el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Bygg bakgrund
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / n) * 360; acc += 1;
    const end = (acc / n) * 360;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");
  const background = `conic-gradient(from -90deg, ${stops || "#e5e7eb 0 360deg"})`;

  // Geometri för “mitt i rutan”
  const R = size / 2;
  const theta = (2 * Math.PI) / n;                         // segmentvinkel (rad)
  const rCentroid = R > 0 ? (4 * R * Math.sin(theta / 2)) / (3 * theta) : 0; // centroid
  const r = rCentroid * 0.95;                              // liten marginal
  const arcLen = r * theta;                                 // båglängd vid r
  const maxWpx = Math.max(40, Math.min(arcLen * 0.9, size * 0.5)); // rimlig maxbredd

  return (
    <div ref={wrapRef} className="relative w-[88vw] max-w-[520px] aspect-square">
      {/* indikator/pil */}
      <div
        aria-hidden
        className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-0 h-0
                   border-l-[10px] border-l-transparent
                   border-r-[10px] border-r-transparent
                   border-b-[16px] border-b-zinc-900"
      />

      {/* hjulet */}
      <div
        onTransitionEnd={onTransitionEnd}
        className="absolute inset-0 rounded-full shadow-xl overflow-hidden grid place-items-center"
        style={{
          background,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 4.6s cubic-bezier(.12,.7,.13,1)" : "none",
        }}
      >
        {/* etiketter – nu mitt i respektive tårtbit */}
        {segments.map((seg, i) => {
          const angleDeg = -90 + (i + 0.5) * (360 / n); // <-- NYCKELN: ta med -90°-offseten
          return (
            <div
              key={i}
              className="absolute text-xs sm:text-sm font-semibold select-none text-center
                         whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                left: "50%",
                top: "50%",
                // 1) rotera till segmentets mittlinje
                // 2) gå ut till centroid-radien
                // 3) rotera tillbaka för horisontell text
                // 4) centrera själva boxen på punkten
                transform: `rotate(${angleDeg}deg) translate(0, -${r}px) rotate(${-angleDeg}deg) translate(-50%, -50%)`,
                transformOrigin: "0 0",
                maxWidth: `${maxWpx | 0}px`,
              }}
              title={seg.label}
            >
              {seg.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}