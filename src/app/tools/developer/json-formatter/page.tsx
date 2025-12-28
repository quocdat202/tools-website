"use client";

import * as React from "react";
import { Copy, Check, Wand2, Minimize2, AlertCircle } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JsonFormatterPage() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [indentSize, setIndentSize] = React.useState("2");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize));
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard access denied
    }
  };

  const sampleJson = {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: {
      street: "123 Main St",
      city: "New York",
      country: "USA",
    },
    hobbies: ["reading", "coding", "gaming"],
  };

  const loadSample = () => {
    setInput(JSON.stringify(sampleJson));
    setError(null);
    setOutput("");
  };

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate, and minify JSON data"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="input">JSON Input</Label>
                  <Button variant="ghost" size="sm" onClick={handlePaste}>
                    Paste
                  </Button>
                </div>
                <Textarea
                  id="input"
                  placeholder='{"key": "value"}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="1">1 tab</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={formatJson}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Format
                </Button>
                <Button variant="outline" onClick={minifyJson}>
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
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="output">Formatted JSON</Label>
                  {output && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
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
              {output && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Characters: {output.length.toLocaleString()}</span>
                  <span>Lines: {output.split("\n").length.toLocaleString()}</span>
                </div>
              )}
            </div>
          </ToolCard>
        </ToolGrid>
      </div>
    </ToolShell>
  );
}
