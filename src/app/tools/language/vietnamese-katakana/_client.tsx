"use client";

import * as React from "react";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const vnToKatakana: Record<string, string> = {
  a: "ア", à: "ア", á: "ア", ả: "ア", ã: "ア", ạ: "ア",
  ă: "ア", ằ: "ア", ắ: "ア", ẳ: "ア", ẵ: "ア", ặ: "ア",
  â: "アウ", ầ: "アウ", ấ: "アウ", ẩ: "アウ", ẫ: "アウ", ậ: "アウ",
  e: "エ", è: "エ", é: "エ", ẻ: "エ", ẽ: "エ", ẹ: "エ",
  ê: "エ", ề: "エ", ế: "エ", ể: "エ", ễ: "エ", ệ: "エ",
  i: "イ", ì: "イ", í: "イ", ỉ: "イ", ĩ: "イ", ị: "イ",
  o: "オ", ò: "オ", ó: "オ", ỏ: "オ", õ: "オ", ọ: "オ",
  ô: "オウ", ồ: "オウ", ố: "オウ", ổ: "オウ", ỗ: "オウ", ộ: "オウ",
  ơ: "ウー", ờ: "ウー", ớ: "ウー", ở: "ウー", ỡ: "ウー", ợ: "ウー",
  u: "ウ", ù: "ウ", ú: "ウ", ủ: "ウ", ũ: "ウ", ụ: "ウ",
  ư: "ウー", ừ: "ウー", ứ: "ウー", ử: "ウー", ữ: "ウー", ự: "ウー",
  y: "イ", ỳ: "イ", ý: "イ", ỷ: "イ", ỹ: "イ", ỵ: "イ",
  b: "ブ", c: "ク", d: "ズ", đ: "ド", g: "グ", h: "ホ",
  k: "ク", l: "ル", m: "ム", n: "ン", p: "プ", q: "ク",
  r: "ル", s: "ス", t: "ト", v: "ヴ", x: "ス",
  ch: "チ", gi: "ジ", kh: "カ", ng: "ング", ngh: "ング",
  nh: "ニ", ph: "フ", qu: "ク", th: "タ", tr: "チ",
};

const katakanaToVn: Record<string, string> = {
  ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o",
  カ: "ka", キ: "ki", ク: "ku", ケ: "ke", コ: "ko",
  サ: "sa", シ: "shi", ス: "su", セ: "se", ソ: "so",
  タ: "ta", チ: "chi", ツ: "tsu", テ: "te", ト: "to",
  ナ: "na", ニ: "ni", ヌ: "nu", ネ: "ne", ノ: "no",
  ハ: "ha", ヒ: "hi", フ: "fu", ヘ: "he", ホ: "ho",
  マ: "ma", ミ: "mi", ム: "mu", メ: "me", モ: "mo",
  ヤ: "ya", ユ: "yu", ヨ: "yo",
  ラ: "ra", リ: "ri", ル: "ru", レ: "re", ロ: "ro",
  ワ: "wa", ヲ: "wo", ン: "n",
  ガ: "ga", ギ: "gi", グ: "gu", ゲ: "ge", ゴ: "go",
  ザ: "za", ジ: "ji", ズ: "zu", ゼ: "ze", ゾ: "zo",
  ダ: "da", ヂ: "di", ヅ: "du", デ: "de", ド: "do",
  バ: "ba", ビ: "bi", ブ: "bu", ベ: "be", ボ: "bo",
  パ: "pa", ピ: "pi", プ: "pu", ペ: "pe", ポ: "po",
  ヴ: "vu", ー: "",
};

function vietnameseToKatakana(text: string): string {
  let result = "";
  const lower = text.toLowerCase();
  let i = 0;

  while (i < lower.length) {
    if (i + 2 < lower.length) {
      const three = lower.slice(i, i + 3);
      if (vnToKatakana[three]) {
        result += vnToKatakana[three];
        i += 3;
        continue;
      }
    }

    if (i + 1 < lower.length) {
      const two = lower.slice(i, i + 2);
      if (vnToKatakana[two]) {
        result += vnToKatakana[two];
        i += 2;
        continue;
      }
    }

    const char = lower[i];
    if (vnToKatakana[char]) {
      result += vnToKatakana[char];
    } else if (char === " ") {
      result += "・";
    } else if (/[a-z]/.test(char)) {
      result += char.toUpperCase();
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

function katakanaToVietnamese(text: string): string {
  let result = "";

  for (const char of text) {
    if (katakanaToVn[char] !== undefined) {
      result += katakanaToVn[char];
    } else if (char === "・") {
      result += " ";
    } else {
      result += char;
    }
  }

  return result;
}

export default function VietnameseKatakanaClient() {
  const [mode, setMode] = React.useState<"vn-to-kata" | "kata-to-vn">("vn-to-kata");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (mode === "vn-to-kata") {
      setOutput(vietnameseToKatakana(input));
    } else {
      setOutput(katakanaToVietnamese(input));
    }
  }, [input, mode]);

  const handleSwap = () => {
    setMode(mode === "vn-to-kata" ? "kata-to-vn" : "vn-to-kata");
    setInput(output);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="Vietnamese ⇄ Katakana"
      description="Convert between Vietnamese and Japanese Katakana (phonetic approximation)"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleSwap}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {mode === "vn-to-kata" ? "Vietnamese → Katakana" : "Katakana → Vietnamese"}
          </Button>
        </div>

        <ToolGrid>
          <ToolCard title={mode === "vn-to-kata" ? "Vietnamese" : "Katakana"}>
            <div className="space-y-2">
              <Label htmlFor="input">Input</Label>
              <Textarea
                id="input"
                placeholder={
                  mode === "vn-to-kata"
                    ? "Xin chào, tôi là người Việt Nam"
                    : "シンチャオ・トイラングイヴィエトナム"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </ToolCard>

          <ToolCard title={mode === "vn-to-kata" ? "Katakana" : "Vietnamese"}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">Output</Label>
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
                placeholder="Result will appear here..."
                className="min-h-[150px]"
              />
            </div>
          </ToolCard>
        </ToolGrid>

        <ToolCard title="Notes">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This is a phonetic approximation and may not be 100% accurate.
              Vietnamese tones are not represented in Katakana.
            </p>
            <p>
              Word boundaries are marked with ・ (middle dot) in Katakana.
            </p>
          </div>
        </ToolCard>
      </div>
    </ToolShell>
  );
}
