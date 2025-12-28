"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface NormalizationOptions {
  trimWhitespace: boolean;
  removeExtraSpaces: boolean;
  removeExtraLines: boolean;
  removeAllLineBreaks: boolean;
  removeSpecialChars: boolean;
  removeNumbers: boolean;
  removePunctuation: boolean;
  toLowerCase: boolean;
  toUpperCase: boolean;
  removeAccents: boolean;
  removeEmojis: boolean;
  removeUrls: boolean;
  removeEmails: boolean;
  removeHtmlTags: boolean;
}

const defaultOptions: NormalizationOptions = {
  trimWhitespace: true,
  removeExtraSpaces: true,
  removeExtraLines: false,
  removeAllLineBreaks: false,
  removeSpecialChars: false,
  removeNumbers: false,
  removePunctuation: false,
  toLowerCase: false,
  toUpperCase: false,
  removeAccents: false,
  removeEmojis: false,
  removeUrls: false,
  removeEmails: false,
  removeHtmlTags: false,
};

function removeAccentsFn(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeText(text: string, options: NormalizationOptions): string {
  let result = text;

  if (options.removeHtmlTags) {
    result = result.replace(/<[^>]*>/g, "");
  }

  if (options.removeUrls) {
    result = result.replace(/https?:\/\/[^\s]+/g, "");
  }

  if (options.removeEmails) {
    result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "");
  }

  if (options.removeEmojis) {
    result = result.replace(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ""
    );
  }

  if (options.removeAccents) {
    result = removeAccentsFn(result);
  }

  if (options.removeNumbers) {
    result = result.replace(/[0-9]/g, "");
  }

  if (options.removePunctuation) {
    result = result.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, "");
  }

  if (options.removeSpecialChars) {
    result = result.replace(/[^a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]/g, "");
  }

  if (options.removeAllLineBreaks) {
    result = result.replace(/[\r\n]+/g, " ");
  }

  if (options.removeExtraLines && !options.removeAllLineBreaks) {
    result = result.replace(/(\r?\n){3,}/g, "\n\n");
  }

  if (options.removeExtraSpaces) {
    result = result.replace(/[ \t]+/g, " ");
  }

  if (options.trimWhitespace) {
    result = result
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
  }

  if (options.toLowerCase && !options.toUpperCase) {
    result = result.toLowerCase();
  } else if (options.toUpperCase && !options.toLowerCase) {
    result = result.toUpperCase();
  }

  return result;
}

export default function TextNormalizerClient() {
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState<NormalizationOptions>(defaultOptions);
  const [copied, setCopied] = React.useState(false);

  const output = React.useMemo(() => {
    if (!input) return "";
    return normalizeText(input, options);
  }, [input, options]);

  const handleOptionChange = (key: keyof NormalizationOptions, value: boolean) => {
    if (key === "toLowerCase" && value) {
      setOptions({ ...options, toLowerCase: true, toUpperCase: false });
    } else if (key === "toUpperCase" && value) {
      setOptions({ ...options, toUpperCase: true, toLowerCase: false });
    } else if (key === "removeAllLineBreaks" && value) {
      setOptions({ ...options, removeAllLineBreaks: true, removeExtraLines: false });
    } else {
      setOptions({ ...options, [key]: value });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setOptions(defaultOptions);
  };

  const optionGroups = [
    {
      title: "Whitespace",
      options: [
        { key: "trimWhitespace" as const, label: "Trim whitespace" },
        { key: "removeExtraSpaces" as const, label: "Remove extra spaces" },
        { key: "removeExtraLines" as const, label: "Remove extra line breaks" },
        { key: "removeAllLineBreaks" as const, label: "Remove all line breaks" },
      ],
    },
    {
      title: "Characters",
      options: [
        { key: "removeSpecialChars" as const, label: "Remove special characters" },
        { key: "removeNumbers" as const, label: "Remove numbers" },
        { key: "removePunctuation" as const, label: "Remove punctuation" },
        { key: "removeAccents" as const, label: "Remove accents/diacritics" },
        { key: "removeEmojis" as const, label: "Remove emojis" },
      ],
    },
    {
      title: "Content",
      options: [
        { key: "removeUrls" as const, label: "Remove URLs" },
        { key: "removeEmails" as const, label: "Remove email addresses" },
        { key: "removeHtmlTags" as const, label: "Remove HTML tags" },
      ],
    },
    {
      title: "Case",
      options: [
        { key: "toLowerCase" as const, label: "Convert to lowercase" },
        { key: "toUpperCase" as const, label: "Convert to UPPERCASE" },
      ],
    },
  ];

  return (
    <ToolShell
      title="Text Normalizer"
      description="Clean and normalize text with various options"
      actions={
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Options
        </Button>
      }
    >
      <div className="space-y-6">
        <ToolCard title="Normalization Options">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {optionGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="font-medium text-sm">{group.title}</h4>
                <div className="space-y-2">
                  {group.options.map((opt) => (
                    <div key={opt.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={opt.key}
                        checked={options[opt.key]}
                        onCheckedChange={(checked) =>
                          handleOptionChange(opt.key, checked as boolean)
                        }
                      />
                      <Label htmlFor={opt.key} className="text-sm font-normal">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ToolCard>

        <ToolGrid>
          <ToolCard title="Input">
            <div className="space-y-2">
              <Label htmlFor="input">Original Text</Label>
              <Textarea
                id="input"
                placeholder="Paste text to normalize..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px]"
              />
            </div>
          </ToolCard>

          <ToolCard title="Output">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">Normalized Text</Label>
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
                placeholder="Normalized output will appear here..."
                className="min-h-[250px]"
              />
            </div>
          </ToolCard>
        </ToolGrid>
      </div>
    </ToolShell>
  );
}
