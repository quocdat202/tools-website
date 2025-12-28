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
import { Switch } from "@/components/ui/switch";

const units = [
  { value: "b", label: "Bits (b)", bytes: 0.125 },
  { value: "B", label: "Bytes (B)", bytes: 1 },
  { value: "KB", label: "Kilobytes (KB)", bytes: 1024 },
  { value: "MB", label: "Megabytes (MB)", bytes: 1024 ** 2 },
  { value: "GB", label: "Gigabytes (GB)", bytes: 1024 ** 3 },
  { value: "TB", label: "Terabytes (TB)", bytes: 1024 ** 4 },
  { value: "PB", label: "Petabytes (PB)", bytes: 1024 ** 5 },
];

const siUnits = [
  { value: "b", label: "Bits (b)", bytes: 0.125 },
  { value: "B", label: "Bytes (B)", bytes: 1 },
  { value: "kB", label: "Kilobytes (kB)", bytes: 1000 },
  { value: "MB", label: "Megabytes (MB)", bytes: 1000 ** 2 },
  { value: "GB", label: "Gigabytes (GB)", bytes: 1000 ** 3 },
  { value: "TB", label: "Terabytes (TB)", bytes: 1000 ** 4 },
  { value: "PB", label: "Petabytes (PB)", bytes: 1000 ** 5 },
];

export default function FileSizeConverterPage() {
  const [input, setInput] = React.useState("");
  const [fromUnit, setFromUnit] = React.useState("MB");
  const [useSI, setUseSI] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  const currentUnits = useSI ? siUnits : units;

  const calculateAll = React.useMemo(() => {
    const value = parseFloat(input);
    if (isNaN(value) || value < 0) return null;

    const fromUnitData = currentUnits.find((u) => u.value === fromUnit);
    if (!fromUnitData) return null;

    const bytes = value * fromUnitData.bytes;

    return currentUnits.map((unit) => ({
      ...unit,
      result: bytes / unit.bytes,
    }));
  }, [input, fromUnit, currentUnits]);

  const handleCopy = async (text: string, unit: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(unit);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (num < 0.001) return num.toExponential(4);
    if (num > 1e12) return num.toExponential(4);
    return num.toLocaleString("en-US", { maximumFractionDigits: 6 });
  };

  return (
    <ToolShell
      title="File Size Converter"
      description="Convert between file size units (KB, MB, GB, etc.)"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Enter file size"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="si" checked={useSI} onCheckedChange={setUseSI} />
              <Label htmlFor="si" className="text-sm text-muted-foreground">
                Use SI units (1 KB = 1000 bytes instead of 1024)
              </Label>
            </div>
          </div>
        </ToolCard>

        {calculateAll && (
          <ToolCard title="Conversions">
            <div className="grid gap-3">
              {calculateAll.map((unit) => (
                <div
                  key={unit.value}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{unit.label}</p>
                    <p className="font-mono text-lg">
                      {formatNumber(unit.result)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleCopy(unit.result.toString(), unit.value)
                    }
                  >
                    {copied === unit.value ? (
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
