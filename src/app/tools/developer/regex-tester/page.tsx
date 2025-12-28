"use client";

import * as React from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

const commonPatterns = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "URL", pattern: "https?://[\\w.-]+(?:/[\\w.-]*)*" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}" },
  { name: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Time (HH:MM)", pattern: "\\d{2}:\\d{2}" },
  { name: "Hex Color", pattern: "#[a-fA-F0-9]{6}\\b" },
  { name: "UUID", pattern: "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}" },
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = React.useState("");
  const [testString, setTestString] = React.useState("");
  const [flags, setFlags] = React.useState({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [matches, setMatches] = React.useState<RegexMatch[]>([]);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const flagStr = Object.entries(flags)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join("");
      const regex = new RegExp(pattern, flagStr);
      const results: RegexMatch[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  }, [pattern, testString, flags]);

  const highlightedText = React.useMemo(() => {
    if (!pattern || !testString || error || matches.length === 0) {
      return testString;
    }

    let result = "";
    let lastIndex = 0;

    for (const match of matches) {
      result += testString.slice(lastIndex, match.index);
      result += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">${match.match}</mark>`;
      lastIndex = match.index + match.match.length;
    }

    result += testString.slice(lastIndex);
    return result;
  }, [pattern, testString, error, matches]);

  const handleCopy = async () => {
    const flagStr = Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("");
    await navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPattern = (pat: string) => {
    setPattern(pat);
  };

  return (
    <ToolShell
      title="Regex Tester"
      description="Test and debug regular expressions with real-time matching"
    >
      <div className="space-y-6">
        <ToolCard title="Pattern">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pattern">Regular Expression</Label>
              <div className="flex gap-2">
                <div className="flex flex-1 items-center gap-1 rounded-md border px-3">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="pattern"
                    type="text"
                    placeholder="Enter regex pattern..."
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="border-0 px-0 focus-visible:ring-0"
                  />
                  <span className="text-muted-foreground">/</span>
                  <span className="font-mono text-sm">
                    {Object.entries(flags)
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join("")}
                  </span>
                </div>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flag-g"
                  checked={flags.g}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, g: checked as boolean })
                  }
                />
                <Label htmlFor="flag-g" className="text-sm">
                  Global (g)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flag-i"
                  checked={flags.i}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, i: checked as boolean })
                  }
                />
                <Label htmlFor="flag-i" className="text-sm">
                  Case Insensitive (i)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flag-m"
                  checked={flags.m}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, m: checked as boolean })
                  }
                />
                <Label htmlFor="flag-m" className="text-sm">
                  Multiline (m)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flag-s"
                  checked={flags.s}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, s: checked as boolean })
                  }
                />
                <Label htmlFor="flag-s" className="text-sm">
                  Dot All (s)
                </Label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </ToolCard>

        <ToolCard title="Common Patterns">
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((p) => (
              <Button
                key={p.name}
                variant="outline"
                size="sm"
                onClick={() => loadPattern(p.pattern)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </ToolCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Test String">
            <div className="space-y-2">
              <Label htmlFor="test">Text to test against</Label>
              <Textarea
                id="test"
                placeholder="Enter text to test..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </ToolCard>

          <ToolCard title="Matches">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {matches.length} match{matches.length !== 1 ? "es" : ""}
                </Badge>
              </div>

              {testString && (
                <div
                  className="rounded-lg border p-4 font-mono text-sm whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              )}

              {matches.length > 0 && (
                <div className="space-y-2">
                  <Label>Match Details</Label>
                  <div className="max-h-[200px] overflow-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Match</th>
                          <th className="px-3 py-2 text-left">Index</th>
                          <th className="px-3 py-2 text-left">Groups</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map((match, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2">{i + 1}</td>
                            <td className="px-3 py-2 font-mono">
                              {match.match}
                            </td>
                            <td className="px-3 py-2">{match.index}</td>
                            <td className="px-3 py-2 font-mono">
                              {match.groups.length > 0
                                ? match.groups.join(", ")
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </ToolCard>
        </div>
      </div>
    </ToolShell>
  );
}
