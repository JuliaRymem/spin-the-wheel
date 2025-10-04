import React, { useState, useCallback, useRef, useEffect } from "react";

/**
 * Controls – modal-variant med stor textarea för flera val.
 * Props:
 * - onAdd(value: string) – lägger till ett (kallas per nytt, dedupas här)
 * - existingLabels?: string[] – för att deduplicera mot befintliga
 * - variant?: "modal" | "default" – styr styling (vi använder "modal")
 */
export default function Controls({ onAdd, existingLabels = [], variant = "default" }) {
  const [text, setText] = useState("");
  const areaRef = useRef(null);

  useEffect(() => {
    // Autofokus när den visas i modal
    if (variant === "modal") {
      const id = setTimeout(() => areaRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [variant]);

  const submitTokens = useCallback(() => {
    const lower = new Set(existingLabels.map((s) => s.toLowerCase()));
    const tokens = text
      .split(/[\n,;]+/g)      // dela på radbrytning, komma, semikolon
      .map((s) => s.trim())
      .filter(Boolean);

    let added = 0;
    for (const t of tokens) {
      const key = t.toLowerCase();
      if (lower.has(key)) continue;
      lower.add(key);
      onAdd?.(t);             // lägg till ett och ett
      added++;
    }
    if (added > 0) setText("");
  }, [text, existingLabels, onAdd]);

  function onKey(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitTokens();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitTokens();
    }
  }

  const baseInput =
    "w-full rounded-2xl border bg-white/80 backdrop-blur placeholder:text-zinc-400 focus:outline-none";

  const cls =
    variant === "modal"
      ? `${baseInput} border-white shadow-sm px-4 py-3 text-base sm:text-lg focus:ring-4 focus:ring-sky-200`
      : `${baseInput} border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-zinc-400`;

  return (
    <div className="space-y-2">
      <label className="block text-left font-semibold text-zinc-800">Lägg till i hjulet</label>
      <textarea
        ref={areaRef}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder={"Skriv dina val här…"}
        className={cls}
      />

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setText("")}
          className="px-4 py-2 rounded-xl border border-white bg-white/70 hover:bg-white font-medium"
          type="button"
        >
          Rensa
        </button>
        <button
          onClick={submitTokens}
          className="px-5 py-2.5 rounded-2xl font-bold text-zinc-900
                     bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200
                     shadow-[0_8px_20px_rgba(244,114,182,0.25)]
                     hover:scale-[1.02] active:scale-95 transition-transform"
          type="button"
        >
          Lägg till
        </button>
      </div>
    </div>
  );
}