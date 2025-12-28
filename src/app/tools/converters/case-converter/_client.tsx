"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CaseConversion {
  id: string;
  name: string;
  convert: (text: string) => string;
}

const conversions: CaseConversion[] = [
  {
    id: "lower",
    name: "lowercase",
    convert: (text) => text.toLowerCase(),
  },
  {
    id: "upper",
    name: "UPPERCASE",
    convert: (text) => text.toUpperCase(),
  },
  {
    id: "title",
    name: "Title Case",
    convert: (text) =>
      text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
  },
  {
    id: "sentence",
    name: "Sentence case",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    },
  },
  {
    id: "camel",
    name: "camelCase",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
    },
  },
  {
    id: "pascal",
    name: "PascalCase",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, c) => c.toUpperCase());
    },
  },
  {
    id: "snake",
    name: "snake_case",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    },
  },
  {
    id: "kebab",
    name: "kebab-case",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    },
  },
  {
    id: "constant",
    name: "CONSTANT_CASE",
    convert: (text) => {
      return text
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    },
  },
  {
    id: "dot",
    name: "dot.case",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, ".")
        .replace(/^\.|\.$/g, "");
    },
  },
  {
    id: "path",
    name: "path/case",
    convert: (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "/")
        .replace(/^\/|\/$/g, "");
    },
  },
  {
    id: "alternate",
    name: "aLtErNaTe CaSe",
    convert: (text) => {
      return text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    },
  },
  {
    id: "inverse",
    name: "iNVERSE cASE",
    convert: (text) => {
      return text
        .split("")
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join("");
    },
  },
];

export default function CaseConverterClient() {
  const [input, setInput] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolShell
      title="Case Converter"
      description="Convert text between different cases"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-2">
            <Label htmlFor="input">Text</Label>
            <Textarea
              id="input"
              placeholder="Enter text to convert..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </ToolCard>

        {input && (
          <ToolCard title="Conversions">
            <div className="grid gap-3 sm:grid-cols-2">
              {conversions.map((conversion) => {
                const result = conversion.convert(input);
                return (
                  <div
                    key={conversion.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1 mr-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {conversion.name}
                      </p>
                      <p className="font-mono text-sm truncate">{result}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(result, conversion.id)}
                      className="shrink-0"
                    >
                      {copied === conversion.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </ToolCard>
        )}
      </div>
    </ToolShell>
  );
}
