/**
 * Top-level product header.
 *
 * Server Component — purely presentational.
 */

export function PageHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold tracking-tight select-none">
            RF
          </div>
          <span className="text-sm font-semibold text-foreground">
            ResumeFit
            <span className="ml-1 text-muted-foreground font-normal">Agent</span>
          </span>
        </div>

        <p className="hidden text-xs text-muted-foreground sm:block">
          Evidence-based resume tailoring
        </p>
      </div>
    </header>
  );
}
