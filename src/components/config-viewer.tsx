"use client";

interface ConfigViewerProps {
  title: string;
  content: string | null;
  language?: "markdown" | "json";
}

export function ConfigViewer({
  title,
  content,
  language = "markdown",
}: ConfigViewerProps) {
  if (!content) {
    return (
      <div className="rounded-lg border border-card-border bg-card-bg p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-foreground/40 italic">Not found</p>
      </div>
    );
  }

  const formatted =
    language === "json"
      ? JSON.stringify(JSON.parse(content), null, 2)
      : content;

  return (
    <div className="rounded-lg border border-card-border bg-card-bg p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      <pre className="text-xs font-mono bg-background rounded-md p-3 overflow-auto max-h-[600px] whitespace-pre-wrap">
        {formatted}
      </pre>
    </div>
  );
}
