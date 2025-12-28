"use client";

import * as React from "react";
import { Copy, Check, Wand2, Minimize2, AlertCircle } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatXml(xml: string, indent: string = "  "): string {
  let formatted = "";
  let pad = 0;
  const lines = xml
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
    .replace(/(<\w+)(\s)/g, "$1\n$2")
    .split("\n");

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    let padding = "";

    if (line.match(/^<\/\w/)) {
      pad -= 1;
    }

    padding = indent.repeat(Math.max(0, pad));

    if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      pad += 1;
    } else if (line.match(/^<\w[^>]*\/\s*>$/)) {
      // self closing, no pad change
    } else if (line.match(/^<\w/)) {
      pad += 1;
    }

    formatted += padding + line + "\n";
  }

  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .replace(/>\s+/g, ">")
    .replace(/\s+</g, "<")
    .trim();
}

function validateXml(xml: string): { valid: boolean; error?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return {
        valid: false,
        error: errorNode.textContent || "Invalid XML",
      };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export default function XmlFormatterPage() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const validation = validateXml(input);
    if (!validation.valid) {
      setError(validation.error || "Invalid XML");
      setOutput("");
      return;
    }

    setOutput(formatXml(input));
    setError(null);
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const validation = validateXml(input);
    if (!validation.valid) {
      setError(validation.error || "Invalid XML");
      setOutput("");
      return;
    }

    setOutput(minifyXml(input));
    setError(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><author>John Doe</author><title>XML Guide</title><price>29.99</price></book><book id="2"><author>Jane Smith</author><title>Web Development</title><price>39.99</price></book></catalog>`;

  const loadSample = () => {
    setInput(sampleXml);
    setError(null);
    setOutput("");
  };

  return (
    <ToolShell
      title="XML Formatter"
      description="Format, validate, and minify XML data"
      actions={
        <Button variant="outline" size="sm" onClick={loadSample}>
          Load Sample
        </Button>
      }
    >
      <div className="space-y-6">
        <ToolGrid>
          <ToolCard title="Input">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">XML Input</Label>
                <Textarea
                  id="input"
                  placeholder="<root><element>value</element></root>"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleFormat}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Format
                </Button>
                <Button variant="outline" onClick={handleMinify}>
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Minify
                </Button>
              </div>
            </div>
          </ToolCard>

          <ToolCard title="Output">
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="whitespace-pre-wrap text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="output">Formatted XML</Label>
                  {output && (
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="output"
                  value={output}
                  readOnly
                  placeholder="Formatted output will appear here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </div>
          </ToolCard>
        </ToolGrid>
      </div>
    </ToolShell>
  );
}
