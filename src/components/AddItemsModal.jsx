// src/components/AddItemsModal.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Enkel modal för att lägga till flera val (ett per rad).
 * Props:
 * - open: bool
 * - onClose: fn()
 * - onAddItems: fn(arrayOfStrings)
 */
export default function AddItemsModal({ open, onClose, onAddItems }) {
  const [text, setText] = useState("");
  const dialogRef = useRef(null);
  const textareaRef = useRef(null);

  // Submit som callback → stabil referens (bra för ESLint & effects)
  const handleSubmit = useCallback(() => {
    const lines = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      onClose?.();
      return;
    }
    onAddItems?.(lines);
    setText("");
    onClose?.();
  }, [text, onAddItems, onClose]);

  // Fokusera textarea när modalen öppnas
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => textareaRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [open]);

  // Escape för att stänga, Cmd/Ctrl+Enter för att lägga till
  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        handleSubmit();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, handleSubmit]); // ✅ fullständig dep-lista

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-items-title"
      onClick={(e) => {
        // klick utanför dialogen stänger
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white border border-zinc-200 shadow-xl p-4"
      >
        <h2 id="add-items-title" className="text-lg font-bold">
          Lägg till val
        </h2>
        <p className="text-sm text-zinc-600 mt-1">
          Skriv ett val per rad. Dubbletter ignoreras.
        </p>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Tacos\nSushi\nPasta"}
          rows={8}
          className="mt-3 w-full resize-y rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => onClose?.()}
            className="px-4 py-2 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-50"
          >
            Avbryt
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black"
          >
            Lägg till
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          Tips: ⌘/Ctrl + Enter för att lägga till snabbt.
        </p>
      </div>
    </div>
  );
}