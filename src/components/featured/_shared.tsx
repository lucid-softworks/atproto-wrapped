export function FeaturedRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase opacity-60">
      <span className="inline-block h-px w-6 bg-ink/60" />
      {label}
    </div>
  );
}
