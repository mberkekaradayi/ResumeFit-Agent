"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ResumeTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function ResumeTextEditor({
  value,
  onChange,
  placeholder = "Paste or edit your resume text here…",
  className,
}: ResumeTextEditorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="resume-text">Resume text</Label>
        <span className="text-xs text-muted-foreground">
          {value.length} characters
        </span>
      </div>

      <Textarea
        id="resume-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={14}
        className="min-h-48 font-mono text-sm leading-relaxed"
      />

      <p className="text-xs text-muted-foreground">
        Review and correct the extracted text before running analysis. The
        quality of the analysis depends on this text.
      </p>
    </div>
  );
}
