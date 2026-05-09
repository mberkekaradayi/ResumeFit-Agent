"use client";

import { ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { FactualityWarning } from "../types/analysis.types";
import { RISK_LABELS, RISK_COLOR_CLASSES } from "../constants/analysis.constants";
import { cn } from "@/lib/utils";

type FactualityWarningsProps = {
  warnings: FactualityWarning[];
};

export function FactualityWarnings({ warnings }: FactualityWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Factuality warnings</CardTitle>
        <CardDescription>
          These claims in the suggested rewrites need your confirmation
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-3">
        {warnings.map((w, i) => (
          <Alert
            key={i}
            variant={w.riskLevel === "high" ? "destructive" : "default"}
            className="gap-3"
          >
            <ShieldAlert />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AlertTitle className="mb-0">{w.claim}</AlertTitle>
              <Badge
                variant="outline"
                className={cn("text-xs shrink-0", RISK_COLOR_CLASSES[w.riskLevel])}
              >
                {RISK_LABELS[w.riskLevel]}
              </Badge>
            </div>
            <AlertDescription>
              {w.reason}
              {w.relatedBullet && (
                <span className="block mt-1 opacity-70 italic">
                  Relates to: &ldquo;{w.relatedBullet}&rdquo;
                </span>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
