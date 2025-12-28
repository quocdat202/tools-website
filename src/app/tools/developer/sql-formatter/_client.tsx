"use client";

import * as React from "react";
import { Copy, Check, Wand2, Minimize2 } from "lucide-react";
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

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "FULL", "ON", "AS", "GROUP",
  "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "DISTINCT",
  "CASE", "WHEN", "THEN", "ELSE", "END", "NULL", "NOT", "IN", "EXISTS",
  "BETWEEN", "LIKE", "IS", "TRUE", "FALSE", "ASC", "DESC", "PRIMARY",
  "KEY", "FOREIGN", "REFERENCES", "CONSTRAINT", "DEFAULT", "AUTO_INCREMENT",
  "VARCHAR", "INT", "INTEGER", "BIGINT", "TEXT", "BOOLEAN", "DATE",
  "DATETIME", "TIMESTAMP", "FLOAT", "DOUBLE", "DECIMAL", "WITH",
  "RECURSIVE", "OVER", "PARTITION", "ROWS", "RANGE", "UNBOUNDED",
  "PRECEDING", "FOLLOWING", "CURRENT", "ROW",
];

const NEW_LINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
  "INNER JOIN", "OUTER JOIN", "FULL JOIN", "ON", "GROUP BY", "ORDER BY",
  "HAVING", "LIMIT", "OFFSET", "UNION", "INSERT", "UPDATE", "DELETE",
  "CREATE", "ALTER", "DROP", "SET", "VALUES",
];

function formatSql(sql: string, indent: string = "  "): string {
  let formatted = sql.replace(/\s+/g, " ").trim();

  for (const keyword of KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(regex, keyword);
  }

  for (const keyword of NEW_LINE_BEFORE) {
    const regex = new RegExp(`\\s+${keyword.replace(" ", "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${keyword}`);
  }

  let result = "";
  let indentLevel = 0;
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const prevChar = formatted[i - 1] || "";

    if ((char === "'" || char === '"') && prevChar !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (char === "(") {
        result += char;
        if (formatted[i + 1] !== ")") {
          indentLevel++;
          result += "\n" + indent.repeat(indentLevel);
        }
      } else if (char === ")") {
        if (prevChar !== "(") {
          indentLevel = Math.max(0, indentLevel - 1);
          result += "\n" + indent.repeat(indentLevel);
        }
        result += char;
      } else if (char === ",") {
        result += char + "\n" + indent.repeat(indentLevel);
      } else if (char === "\n") {
        result += char + indent.repeat(indentLevel);
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }

  result = result
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return result.trim();
}

function minifySql(sql: string): string {
  let minified = sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  minified = minified.replace(/\s+/g, " ").trim();
  return minified;
}

export default function SqlFormatterClient() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [indentSize, setIndentSize] = React.useState("2");
  const [copied, setCopied] = React.useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    const indent = indentSize === "tab" ? "\t" : " ".repeat(parseInt(indentSize));
    setOutput(formatSql(input, indent));
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setOutput(minifySql(input));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleSql = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 10`;

  const loadSample = () => {
    setInput(sampleSql);
    setOutput("");
  };

  return (
    <ToolShell
      title="SQL Formatter"
      description="Format and beautify SQL queries"
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
                <Label htmlFor="input">SQL Query</Label>
                <Textarea
                  id="input"
                  placeholder="SELECT * FROM users WHERE id = 1"
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
                    <SelectItem value="tab">Tab</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="output">Formatted SQL</Label>
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
