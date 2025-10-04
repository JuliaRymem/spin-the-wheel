import React, { useState } from "react";

export default function Controls({ onAdd }) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  return (
    <div className="space-y-3">
      <label className="block text-left font-semibold text-zinc-800">
        Lägg till val
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 px-4 py-3 text-base rounded-2xl
                       border border-white shadow-sm
                       bg-white/80 backdrop-blur
                       placeholder:text-zinc-400
                       focus:outline-none focus:ring-4 focus:ring-sky-200"
            placeholder="t.ex. Tacos"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          />
          <button
            onClick={submit}
            className="px-5 py-3 rounded-2xl font-bold text-zinc-900
                       bg-gradient-to-r from-sky-200 to-emerald-200
                       shadow-[0_8px_20px_rgba(59,130,246,0.25)]
                       hover:brightness-105 transition"
          >
            Lägg till
          </button>
        </div>
      </label>
    </div>
  );
}