/**
 * Top-level product header.
 *
 * Server Component — purely presentational.
 */

export function PageHeader() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-tight select-none border border-emerald-400/30">
            RF
          </div>
          <span className="text-sm font-semibold text-zinc-100">
            ResumeFit
            <span className="ml-1 text-zinc-500 font-normal">Agent</span>
          </span>
        </div>

        <p className="hidden text-[11px] tracking-wider uppercase text-zinc-500 sm:block">
          Evidence-based resume tailoring
        </p>
      </div>
    </header>
  );
}
