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
import { EmptyState } from "@/components/common/EmptyState";
import type { EvidenceMapItem } from "../types/analysis.types";
import {
  STRENGTH_LABELS,
  STRENGTH_COLOR_CLASSES,
  CATEGORY_LABELS,
} from "../constants/analysis.constants";
import { cn } from "@/lib/utils";

type RequirementEvidenceMapProps = {
  evidenceMap: EvidenceMapItem[];
};

export function RequirementEvidenceMap({
  evidenceMap,
}: RequirementEvidenceMapProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Requirement evidence map</CardTitle>
        {evidenceMap.length > 0 && (
          <CardDescription>
            {evidenceMap.length} requirements evaluated
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-5">
        {evidenceMap.length === 0 ? (
          <EmptyState
            title="No requirements extracted"
            description="The job description may not have been processed correctly."
          />
        ) : (
          <div className="space-y-0">
            {evidenceMap.map((item, i) => (
              <div key={item.requirementId}>
                <EvidenceRow item={item} />
                {i < evidenceMap.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EvidenceRow({ item }: { item: EvidenceMapItem }) {
  return (
    <div className="space-y-2.5">
      {/* Header: requirement text + strength badge */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">{item.requirement}</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-xs">
              {CATEGORY_LABELS[item.category] ?? item.category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {item.priority === "must_have" ? "Must have" : "Nice to have"}
            </Badge>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn("shrink-0 text-xs", STRENGTH_COLOR_CLASSES[item.strength])}
        >
          {STRENGTH_LABELS[item.strength]}
        </Badge>
      </div>

      {/* Evidence list */}
      {item.matchingEvidence.length > 0 && (
        <ul className="space-y-1 pl-3">
          {item.matchingEvidence.map((e, i) => (
            <li
              key={i}
              className="relative pl-3 text-xs text-muted-foreground before:absolute before:left-0 before:top-[0.45rem] before:size-1 before:rounded-full before:bg-zinc-400"
            >
              {e}
            </li>
          ))}
        </ul>
      )}

      {/* Explanation */}
      <p className="text-xs text-muted-foreground italic">{item.explanation}</p>
    </div>
  );
}
