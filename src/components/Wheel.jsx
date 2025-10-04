import React, { useEffect, useRef, useState } from "react";

/**
 * Pastell-hjul med etiketter i MITTEN av varje tårtbit.
 * Matchar conic-gradient(from -90deg, ...).
 */
export default function Wheel({ segments, rotation, spinning, onTransitionEnd }) {
  const n = Math.max(segments.length, 1);
  const wrapRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const update = () => setSize(Math.min(el.offsetWidth, el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Färgstopp
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / n) * 360;
    acc += 1;
    const end = (acc / n) * 360;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");
  const background = `conic-gradient(from -90deg, ${stops || "#E5E7EB 0 360deg"})`;

  // Placering: centroid av tårtbit
  const R = size / 2;
  const theta = (2 * Math.PI) / n;
  const rCentroid = R > 0 ? (4 * R * Math.sin(theta / 2)) / (3 * theta) : 0;
  const r = rCentroid * 0.95; // liten marginal
  const arcLen = r * theta;
  const maxWpx = Math.max(40, Math.min(arcLen * 0.9, size * 0.55));

  return (
    <div
      ref={wrapRef}
      className="relative w-[86vw] max-w-[520px] aspect-square mx-auto"
    >
      {/* Pastellig ram/skugga */}
      <div className="absolute inset-0 rounded-full p-3 bg-gradient-to-b from-white to-pink-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        <div
          onTransitionEnd={onTransitionEnd}
          className="relative w-full h-full rounded-full overflow-hidden border border-white/80"
          style={{
            background,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.6s cubic-bezier(.12,.7,.13,1)"
              : "none",
          }}
        >
          {/* Etiketter i mitten av tårtbit */}
          {segments.map((seg, i) => {
            const angleDeg = -90 + (i + 0.5) * (360 / n); // matchar -90 offset
            return (
              <div
                key={i}
                className="absolute text-sm sm:text-base md:text-lg font-bold select-none text-center
                           whitespace-nowrap overflow-hidden text-ellipsis text-zinc-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${angleDeg}deg) translate(0, -${r}px) rotate(${-angleDeg}deg) translate(-50%, -50%)`,
                  transformOrigin: "0 0",
                  maxWidth: `${Math.round(maxWpx)}px`,
                }}
                title={seg.label}
              >
                {seg.label}
              </div>
            );
          })}

          {/* Nav i mitten */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 border border-white/90 shadow-inner" />
        </div>
      </div>

      {/* Pilen (nu åt rätt håll — pekar NER mot hjulet) */}
      <div
        aria-hidden
        className="absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0
                   border-l-[10px] border-l-transparent
                   border-r-[10px] border-r-transparent
                   border-t-[16px] border-t-rose-300 drop-shadow"
      />
    </div>
  );
}