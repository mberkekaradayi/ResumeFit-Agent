"use client";

import { useRef, useState } from "react";
import { Upload, FileText, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ResumeUploadProps = {
  isLoading: boolean;
  warning: string | null;
  error: string | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
};

export function ResumeUpload({
  isLoading,
  warning,
  error,
  onFileSelect,
  onRemoveFile,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({ name: file.name, size: file.size });
      onFileSelect(file);
    }
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile({ name: file.name, size: file.size });
      onFileSelect(file);
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    onRemoveFile();
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-foreground/30 hover:bg-muted/50",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          {isLoading ? (
            <FileText className="size-5 animate-pulse text-muted-foreground" />
          ) : (
            <Upload className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {isLoading ? "Extracting text…" : "Upload your resume PDF"}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse · PDF only
          </p>
        </div>

        {!isLoading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Choose file
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />

      {selectedFile && (
        <Alert>
          <FileText />
          <AlertDescription className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">
              {selectedFile.name}
            </span>
            <Badge variant="secondary" className="text-[11px]">
              {formatBytes(selectedFile.size)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              File selected
            </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-7 px-2 text-xs"
              disabled={isLoading}
            >
              <X className="size-3.5" />
              Remove
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {warning && (
        <Alert>
          <AlertTriangle />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
