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

const dateFormats = [
  { value: "ISO", label: "ISO 8601", example: "2024-01-15T10:30:00Z" },
  { value: "US", label: "US (MM/DD/YYYY)", example: "01/15/2024" },
  { value: "EU", label: "EU (DD/MM/YYYY)", example: "15/01/2024" },
  { value: "UK", label: "UK (DD-MM-YYYY)", example: "15-01-2024" },
  { value: "LONG_US", label: "Long US", example: "January 15, 2024" },
  { value: "LONG_EU", label: "Long EU", example: "15 January 2024" },
  { value: "SHORT", label: "Short (Jan 15, 2024)", example: "Jan 15, 2024" },
  { value: "TIMESTAMP", label: "Unix Timestamp", example: "1705314600" },
  { value: "RFC2822", label: "RFC 2822", example: "Mon, 15 Jan 2024 10:30:00 +0000" },
  { value: "RELATIVE", label: "Relative", example: "2 days ago" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const dayOfWeek = date.getDay();

  const pad = (n: number) => n.toString().padStart(2, "0");

  switch (format) {
    case "ISO":
      return date.toISOString();
    case "US":
      return `${pad(month + 1)}/${pad(day)}/${year}`;
    case "EU":
      return `${pad(day)}/${pad(month + 1)}/${year}`;
    case "UK":
      return `${pad(day)}-${pad(month + 1)}-${year}`;
    case "LONG_US":
      return `${months[month]} ${day}, ${year}`;
    case "LONG_EU":
      return `${day} ${months[month]} ${year}`;
    case "SHORT":
      return `${shortMonths[month]} ${day}, ${year}`;
    case "TIMESTAMP":
      return Math.floor(date.getTime() / 1000).toString();
    case "RFC2822":
      return `${shortDays[dayOfWeek]}, ${pad(day)} ${shortMonths[month]} ${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)} +0000`;
    case "RELATIVE":
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diff / (1000 * 60));

      if (diffMinutes < 1) return "just now";
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
    default:
      return date.toISOString();
  }
}

function parseDate(input: string): Date | null {
  // Try various formats
  const date = new Date(input);
  if (!isNaN(date.getTime())) return date;

  // Try timestamp
  const timestamp = parseInt(input);
  if (!isNaN(timestamp)) {
    if (input.length === 10) return new Date(timestamp * 1000);
    if (input.length === 13) return new Date(timestamp);
  }

  // Try DD/MM/YYYY or DD-MM-YYYY
  const euMatch = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (euMatch) {
    return new Date(parseInt(euMatch[3]), parseInt(euMatch[2]) - 1, parseInt(euMatch[1]));
  }

  return null;
}

export default function DateFormatConverterPage() {
  const [input, setInput] = React.useState("");
  const [outputFormat, setOutputFormat] = React.useState("ISO");
  const [parsedDate, setParsedDate] = React.useState<Date | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input.trim()) {
      setParsedDate(null);
      return;
    }
    const date = parseDate(input);
    setParsedDate(date);
  }, [input]);

  const handleCopy = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUseNow = () => {
    setInput(new Date().toISOString());
  };

  return (
    <ToolShell
      title="Date Format Converter"
      description="Convert dates between different formats"
      actions={
        <Button variant="outline" size="sm" onClick={handleUseNow}>
          Use Current Time
        </Button>
      }
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date Input</Label>
              <Input
                id="date"
                type="text"
                placeholder="Enter a date (e.g., 2024-01-15, 01/15/2024, or timestamp)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Supports ISO 8601, US/EU formats, and Unix timestamps
              </p>
            </div>
            {parsedDate && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Parsed as: {parsedDate.toLocaleString()}
              </p>
            )}
            {input && !parsedDate && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Could not parse date
              </p>
            )}
          </div>
        </ToolCard>

        {parsedDate && (
          <ToolCard title="Output Formats">
            <div className="grid gap-3">
              {dateFormats.map((format) => {
                const formattedDate = formatDate(parsedDate, format.value);
                return (
                  <div
                    key={format.value}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{format.label}</p>
                      <p className="font-mono text-sm">{formattedDate}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(formattedDate, format.value)}
                    >
                      {copied === format.value ? (
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
