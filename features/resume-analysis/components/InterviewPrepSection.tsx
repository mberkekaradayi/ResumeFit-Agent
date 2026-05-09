"use client";

import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import type { InterviewQuestion } from "../types/analysis.types";

type InterviewPrepSectionProps = {
  questions: InterviewQuestion[];
};

export function InterviewPrepSection({ questions }: InterviewPrepSectionProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Interview prep</CardTitle>
        {questions.length > 0 && (
          <CardDescription>
            {questions.length} likely question
            {questions.length !== 1 ? "s" : ""} based on this role
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-5">
        {questions.length === 0 ? (
          <EmptyState
            title="No interview questions generated"
            description="Interview prep will appear after a full analysis run."
          />
        ) : (
          <Accordion type="multiple" className="w-full">
            {questions.map((q, i) => (
              <AccordionItem key={i} value={`question-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium no-underline hover:no-underline gap-3">
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    {q.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 pb-4 pt-1 pl-7">
                  {/* Why they may ask */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Why they may ask
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {q.whyTheyMayAsk}
                    </p>
                  </div>

                  {/* Resume evidence */}
                  {q.relevantResumeEvidence.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Relevant resume evidence
                      </p>
                      <ul className="space-y-1 pl-3">
                        {q.relevantResumeEvidence.map((e, j) => (
                          <li
                            key={j}
                            className="relative text-xs text-muted-foreground before:absolute before:left-[-0.75rem] before:content-['–']"
                          >
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Talking points */}
                  {q.suggestedTalkingPoints.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MessageSquare className="size-3" />
                        Suggested talking points
                      </p>
                      <ul className="space-y-1 pl-3">
                        {q.suggestedTalkingPoints.map((point, j) => (
                          <li
                            key={j}
                            className="relative text-xs text-foreground/80 before:absolute before:left-[-0.75rem] before:content-['→']"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Related gap */}
                  {q.relatedGap && (
                    <Badge
                      variant="outline"
                      className="text-xs border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                    >
                      Gap area: {q.relatedGap}
                    </Badge>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
