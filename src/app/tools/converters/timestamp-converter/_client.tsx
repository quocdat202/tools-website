"use client";

import * as React from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
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

export default function TimestampConverterClient() {
  const [timestamp, setTimestamp] = React.useState("");
  const [unit, setUnit] = React.useState<"s" | "ms">("s");
  const [dateInput, setDateInput] = React.useState("");
  const [timeInput, setTimeInput] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedDate = React.useMemo(() => {
    if (!timestamp) return null;
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return null;
    const ms = unit === "s" ? ts * 1000 : ts;
    return new Date(ms);
  }, [timestamp, unit]);

  const dateToTimestamp = React.useMemo(() => {
    if (!dateInput) return null;
    const dateStr = timeInput ? `${dateInput}T${timeInput}` : dateInput;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  }, [dateInput, timeInput]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUseNow = () => {
    const now = Date.now();
    setTimestamp(unit === "s" ? Math.floor(now / 1000).toString() : now.toString());
  };

  const handleUseDateNow = () => {
    const now = new Date();
    setDateInput(now.toISOString().split("T")[0]);
    setTimeInput(now.toTimeString().split(" ")[0]);
  };

  const currentTimestampS = Math.floor(currentTime / 1000);
  const currentTimestampMs = currentTime;

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates"
    >
      <div className="space-y-6">
        <ToolCard title="Current Time">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Unix Timestamp (seconds)</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg">{currentTimestampS}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(currentTimestampS.toString(), "current-s")}
                >
                  {copied === "current-s" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Unix Timestamp (milliseconds)</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg">{currentTimestampMs}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(currentTimestampMs.toString(), "current-ms")}
                >
                  {copied === "current-ms" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ISO 8601</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{new Date(currentTime).toISOString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(new Date(currentTime).toISOString(), "current-iso")}
                >
                  {copied === "current-iso" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ToolCard>

        <ToolGrid>
          <ToolCard title="Timestamp → Date">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">Unix Timestamp</Label>
                  <Input
                    id="timestamp"
                    type="text"
                    placeholder="e.g., 1704067200"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={(v) => setUnit(v as "s" | "ms")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s">Seconds</SelectItem>
                      <SelectItem value="ms">Milliseconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleUseNow}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Use Current Time
              </Button>

              {parsedDate && (
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Local Time</span>
                      <span className="font-mono text-sm">
                        {parsedDate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">UTC</span>
                      <span className="font-mono text-sm">
                        {parsedDate.toUTCString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ISO 8601</span>
                      <span className="font-mono text-sm">
                        {parsedDate.toISOString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Day of Week</span>
                      <span className="font-mono text-sm">
                        {parsedDate.toLocaleDateString("en-US", { weekday: "long" })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {timestamp && !parsedDate && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Invalid timestamp
                </p>
              )}
            </div>
          </ToolCard>

          <ToolCard title="Date → Timestamp">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time (optional)</Label>
                  <Input
                    id="time"
                    type="time"
                    step="1"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleUseDateNow}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Use Current Time
              </Button>

              {dateToTimestamp && (
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Seconds
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">
                        {dateToTimestamp.seconds}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleCopy(dateToTimestamp.seconds.toString(), "date-s")
                        }
                      >
                        {copied === "date-s" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Milliseconds
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">
                        {dateToTimestamp.milliseconds}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleCopy(
                            dateToTimestamp.milliseconds.toString(),
                            "date-ms"
                          )
                        }
                      >
                        {copied === "date-ms" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ToolCard>
        </ToolGrid>
      </div>
    </ToolShell>
  );
}
