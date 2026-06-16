export default function CelestialBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.1] dark:opacity-[0.15]">
      {/* Star chart rings */}
      <div className="w-[1000px] h-[1000px] rounded-full border-[1px] border-[var(--color-gold)] absolute border-dashed opacity-30 animate-[spin_240s_linear_infinite]" />
      <div className="w-[800px] h-[800px] rounded-full border-[1px] border-[var(--color-gold)] absolute opacity-50" />
      <div className="w-[600px] h-[600px] rounded-full border-[1px] border-[var(--color-gold)] absolute animate-[spin_120s_linear_infinite_reverse]">
        <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_20px_var(--color-gold)]" />
      </div>
      <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent absolute opacity-50" />
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent absolute opacity-50" />
    </div>
  );
}
