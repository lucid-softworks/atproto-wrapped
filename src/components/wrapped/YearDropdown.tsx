import { useEffect, useRef, useState } from "react";

export function YearDropdown({
  years,
  year,
  onChange,
}: {
  years: number[];
  year: number | "all";
  onChange: (y: number | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = year === "all" ? "All time" : String(year);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1.5 font-mono text-xs tracking-widest uppercase shadow-[3px_3px_0_0_var(--color-ink)] transition hover:bg-wrap-yellow focus:outline-none"
      >
        <span>{label}</span>
        <span aria-hidden className="font-mono text-[10px]">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 max-h-72 w-32 overflow-auto rounded-2xl border-2 border-ink bg-cream py-1 shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          <Option
            label="All time"
            selected={year === "all"}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
          />
          {years.map((y) => (
            <Option
              key={y}
              label={String(y)}
              selected={year === y}
              onClick={() => {
                onChange(y);
                setOpen(false);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Option({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onClick}
        className={`flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-xs tracking-widest uppercase transition hover:bg-wrap-yellow ${
          selected ? "bg-ink/5 font-semibold" : ""
        }`}
      >
        <span>{label}</span>
        {selected && (
          <span aria-hidden className="font-mono text-[10px]">
            ●
          </span>
        )}
      </button>
    </li>
  );
}
