import { useState } from "react";

export function Cover({
  src,
  alt,
  fallback,
  className,
  pixelated,
}: {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
  pixelated?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-ink/15 ${className ?? ""}`}
        aria-label={alt}
      >
        <span className="font-serif text-2xl italic opacity-60">
          {fallback}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
      style={pixelated ? { imageRendering: "pixelated" } : undefined}
    />
  );
}
