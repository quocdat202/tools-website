"use client";

import * as React from "react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DiffResult {
  type: "equal" | "insert" | "delete";
  value: string;
}

function diff(text1: string, text2: string): DiffResult[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");

  const result: DiffResult[] = [];

  // Simple line-by-line diff using LCS approach
  const lcs = longestCommonSubsequence(lines1, lines2);
  let i = 0;
  let j = 0;
  let lcsIndex = 0;

  while (i < lines1.length || j < lines2.length) {
    if (
      lcsIndex < lcs.length &&
      i < lines1.length &&
      lines1[i] === lcs[lcsIndex]
    ) {
      if (j < lines2.length && lines2[j] === lcs[lcsIndex]) {
        result.push({ type: "equal", value: lcs[lcsIndex] });
        i++;
        j++;
        lcsIndex++;
      } else if (j < lines2.length) {
        result.push({ type: "insert", value: lines2[j] });
        j++;
      }
    } else if (
      lcsIndex < lcs.length &&
      j < lines2.length &&
      lines2[j] === lcs[lcsIndex]
    ) {
      result.push({ type: "delete", value: lines1[i] });
      i++;
    } else if (i < lines1.length && j < lines2.length) {
      result.push({ type: "delete", value: lines1[i] });
      result.push({ type: "insert", value: lines2[j] });
      i++;
      j++;
    } else if (i < lines1.length) {
      result.push({ type: "delete", value: lines1[i] });
      i++;
    } else if (j < lines2.length) {
      result.push({ type: "insert", value: lines2[j] });
      j++;
    }
  }

  return result;
}

function longestCommonSubsequence(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length;
  const n = arr2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS
  const lcs: string[] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}

export default function TextDiffPage() {
  const [text1, setText1] = React.useState("");
  const [text2, setText2] = React.useState("");
  const [diffResult, setDiffResult] = React.useState<DiffResult[]>([]);

  const handleCompare = () => {
    const result = diff(text1, text2);
    setDiffResult(result);
  };

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setDiffResult([]);
  };

  const handleClear = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
  };

  const stats = React.useMemo(() => {
    const additions = diffResult.filter((d) => d.type === "insert").length;
    const deletions = diffResult.filter((d) => d.type === "delete").length;
    const unchanged = diffResult.filter((d) => d.type === "equal").length;
    return { additions, deletions, unchanged };
  }, [diffResult]);

  return (
    <ToolShell
      title="Text Diff"
      description="Compare two texts and find differences"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSwap}>
            Swap
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <ToolGrid>
          <ToolCard title="Original Text">
            <div className="space-y-2">
              <Label htmlFor="text1">Text 1</Label>
              <Textarea
                id="text1"
                placeholder="Enter original text..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </ToolCard>

          <ToolCard title="Modified Text">
            <div className="space-y-2">
              <Label htmlFor="text2">Text 2</Label>
              <Textarea
                id="text2"
                placeholder="Enter modified text..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </ToolCard>
        </ToolGrid>

        <div className="flex justify-center">
          <Button onClick={handleCompare} size="lg">
            Compare Texts
          </Button>
        </div>

        {diffResult.length > 0 && (
          <ToolCard title="Differences">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  +{stats.additions} additions
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  -{stats.deletions} deletions
                </Badge>
                <Badge variant="secondary">
                  {stats.unchanged} unchanged
                </Badge>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <pre className="p-4 font-mono text-sm overflow-auto max-h-[400px]">
                  {diffResult.map((d, i) => (
                    <div
                      key={i}
                      className={`${
                        d.type === "insert"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                          : d.type === "delete"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                          : ""
                      } ${d.value === "" ? "h-5" : ""}`}
                    >
                      <span className="select-none opacity-50 mr-2">
                        {d.type === "insert"
                          ? "+"
                          : d.type === "delete"
                          ? "-"
                          : " "}
                      </span>
                      {d.value || "\u00A0"}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </ToolCard>
        )}
      </div>
    </ToolShell>
  );
}
