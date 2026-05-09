"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import type { BulletRewrite } from "../types/analysis.types";
import {
  RISK_LABELS,
  RISK_COLOR_CLASSES,
} from "../constants/analysis.constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type BulletRewriteSectionProps = {
  rewrites: BulletRewrite[];
};

export function BulletRewriteSection({ rewrites }: BulletRewriteSectionProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Bullet rewrite suggestions</CardTitle>
        {rewrites.length > 0 && (
          <CardDescription>
            {rewrites.length} bullet{rewrites.length !== 1 ? "s" : ""} improved
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-5">
        {rewrites.length === 0 ? (
          <EmptyState
            title="No rewrite suggestions"
            description="No resume bullets were matched to job requirements."
          />
        ) : (
          <div className="space-y-0">
            {rewrites.map((rewrite, i) => (
              <div key={i}>
                <RewriteCard rewrite={rewrite} />
                {i < rewrites.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RewriteCard({ rewrite }: { rewrite: BulletRewrite }) {
  return (
    <div className="space-y-3">
      {/* Before */}
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground w-12">
          Before
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {rewrite.originalBullet}
        </p>
      </div>

      {/* After */}
      <div className="flex items-start gap-2">
        <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
        <span className="mt-0.5 shrink-0 text-xs font-medium text-foreground w-12">
          After
        </span>
        <p className="flex-1 text-sm font-medium text-foreground leading-relaxed">
          {rewrite.improvedBullet}
        </p>
        <CopyButton value={rewrite.improvedBullet} className="shrink-0" />
      </div>

      {/* Why better */}
      <p className="text-xs text-muted-foreground italic pl-14">
        {rewrite.whyBetter}
      </p>

      {/* Footer row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {rewrite.targetedRequirements.map((req) => (
            <Badge key={req} variant="secondary" className="text-xs">
              {req}
            </Badge>
          ))}
        </div>

        <Badge
          variant="outline"
          className={cn("text-xs", RISK_COLOR_CLASSES[rewrite.riskLevel])}
        >
          {RISK_LABELS[rewrite.riskLevel]}
        </Badge>
      </div>

      {/* Factuality notes */}
      {rewrite.factualityNotes.length > 0 && (
        <ul className="space-y-0.5 pl-3 pt-0.5">
          {rewrite.factualityNotes.map((note, i) => (
            <li
              key={i}
              className="relative text-xs text-muted-foreground before:absolute before:left-[-0.75rem] before:content-['·']"
            >
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
