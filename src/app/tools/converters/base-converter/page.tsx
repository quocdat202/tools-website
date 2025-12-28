"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bases = [
  { value: 2, label: "Binary (Base 2)", prefix: "0b" },
  { value: 8, label: "Octal (Base 8)", prefix: "0o" },
  { value: 10, label: "Decimal (Base 10)", prefix: "" },
  { value: 16, label: "Hexadecimal (Base 16)", prefix: "0x" },
  { value: 32, label: "Base 32", prefix: "" },
  { value: 36, label: "Base 36", prefix: "" },
];

export default function BaseConverterPage() {
  const [input, setInput] = React.useState("");
  const [fromBase, setFromBase] = React.useState("10");
  const [copied, setCopied] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const conversions = React.useMemo(() => {
    if (!input.trim()) {
      setError(null);
      return null;
    }

    const base = parseInt(fromBase);
    let cleanInput = input.trim().toLowerCase();

    // Remove common prefixes
    if (cleanInput.startsWith("0x")) cleanInput = cleanInput.slice(2);
    else if (cleanInput.startsWith("0b")) cleanInput = cleanInput.slice(2);
    else if (cleanInput.startsWith("0o")) cleanInput = cleanInput.slice(2);

    // Validate input characters for the given base
    const validChars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
    const isValid = cleanInput.split("").every((c) => validChars.includes(c));

    if (!isValid) {
      setError(`Invalid character for base ${base}`);
      return null;
    }

    try {
      const decimal = parseInt(cleanInput, base);
      if (isNaN(decimal)) {
        setError("Invalid number");
        return null;
      }

      setError(null);
      return bases.map((b) => ({
        ...b,
        result: decimal.toString(b.value).toUpperCase(),
      }));
    } catch {
      setError("Conversion error");
      return null;
    }
  }, [input, fromBase]);

  const handleCopy = async (text: string, base: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolShell
      title="Base Converter"
      description="Convert numbers between different bases (binary, octal, decimal, hexadecimal)"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="text"
                placeholder="Enter a number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="base">Input Base</Label>
              <Select value={fromBase} onValueChange={setFromBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bases.map((base) => (
                    <SelectItem key={base.value} value={base.value.toString()}>
                      {base.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ToolCard>

        {conversions && (
          <ToolCard title="Conversions">
            <div className="grid gap-3">
              {conversions.map((conv) => (
                <div
                  key={conv.value}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1 min-w-0 flex-1 mr-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {conv.label}
                    </p>
                    <p className="font-mono text-lg break-all">
                      {conv.prefix}
                      {conv.result}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleCopy(conv.prefix + conv.result, conv.value)
                    }
                    className="shrink-0"
                  >
                    {copied === conv.value ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ToolCard>
        )}
      </div>
    </ToolShell>
  );
}
