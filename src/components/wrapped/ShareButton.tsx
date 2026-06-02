import { useState } from "react";

type Status = "idle" | "working" | "shared" | "copied" | "error";

export function ShareButton({
  onShare,
  variant,
}: {
  onShare: () => Promise<"shared" | "copied" | "failed">;
  variant: "small" | "big";
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function go() {
    if (status === "working") return;
    setStatus("working");
    try {
      const result = await onShare();
      if (result === "shared") setStatus("shared");
      else if (result === "copied") setStatus("copied");
      else setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const label =
    status === "working"
      ? "Sharing…"
      : status === "shared"
        ? "✓ Shared"
        : status === "copied"
          ? "✓ Link copied"
          : status === "error"
            ? "Try again"
            : variant === "big"
              ? "Share your wrap →"
              : "Share";

  if (variant === "big") {
    return (
      <button
        onClick={go}
        disabled={status === "working"}
        className="rounded-full bg-ink px-7 py-3 font-mono text-sm tracking-widest text-cream uppercase shadow-[4px_4px_0_0_var(--color-wrap-pink)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--color-wrap-pink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-wrap-pink)] disabled:cursor-wait disabled:opacity-80"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={go}
      disabled={status === "working"}
      className="rounded-full border-2 border-ink bg-wrap-lime px-4 py-1.5 font-mono text-xs tracking-widest uppercase shadow-[3px_3px_0_0_var(--color-ink)] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] disabled:cursor-wait disabled:opacity-80"
    >
      {label}
    </button>
  );
}
