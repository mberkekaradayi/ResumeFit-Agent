/**
 * Root page — Server Component.
 *
 * Intentionally minimal: wraps the app shell and renders the single client
 * feature view. All state, loading, and analysis logic lives inside
 * ResumeAnalysisView and its hooks.
 */

import { AppShell } from "@/components/layout/AppShell";
import { ResumeAnalysisView } from "@/features/resume-analysis/components/ResumeAnalysisView";

export default function Home() {
  return (
    <AppShell>
      <ResumeAnalysisView />
    </AppShell>
  );
}
