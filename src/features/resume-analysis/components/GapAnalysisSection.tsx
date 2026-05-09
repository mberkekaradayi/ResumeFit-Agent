"use client";

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import type { GapAnalysis, GapItem } from "../types/analysis.types";

type GapAnalysisSectionProps = {
  gaps: GapAnalysis;
};

export function GapAnalysisSection({ gaps }: GapAnalysisSectionProps) {
  const hasContent =
    gaps.strongAreas.length > 0 ||
    gaps.weakAreas.length > 0 ||
    gaps.missingAreas.length > 0;

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Gap analysis</CardTitle>
        <CardDescription>
          Where your resume is strong, where it needs work, and what&apos;s
          missing
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5">
        {!hasContent ? (
          <EmptyState
            title="No gap data available"
            description="Gap analysis will appear after a full analysis run."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <GapColumn
              title="Strong areas"
              icon={<CheckCircle2 className="size-4 text-emerald-600" />}
              items={gaps.strongAreas}
              badgeClass="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
              bgClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
            />
            <GapColumn
              title="Weak areas"
              icon={<AlertCircle className="size-4 text-amber-600" />}
              items={gaps.weakAreas}
              badgeClass="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
              bgClass="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
            />
            <GapColumn
              title="Missing areas"
              icon={<XCircle className="size-4 text-red-500" />}
              items={gaps.missingAreas}
              badgeClass="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              bgClass="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GapColumn({
  title,
  icon,
  items,
  badgeClass,
  bgClass,
}: {
  title: string;
  icon: React.ReactNode;
  items: GapItem[];
  badgeClass: string;
  bgClass: string;
}) {
  return (
    <div className={`rounded-lg border p-4 space-y-3 ${bgClass}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
          {title}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None identified.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="space-y-0.5">
              <Badge variant="outline" className={`text-xs ${badgeClass}`}>
                {item.label}
              </Badge>
              {item.explanation && (
                <p className="text-xs text-muted-foreground px-0.5">
                  {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
