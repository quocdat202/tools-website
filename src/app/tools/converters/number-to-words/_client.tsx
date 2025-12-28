"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

const onesVi = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const tensVi = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
const teensVi = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];

function convertToEnglish(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return "negative " + convertToEnglish(-num);

  let result = "";

  if (num >= 1000000000000) {
    result += convertToEnglish(Math.floor(num / 1000000000000)) + " trillion ";
    num %= 1000000000000;
  }

  if (num >= 1000000000) {
    result += convertToEnglish(Math.floor(num / 1000000000)) + " billion ";
    num %= 1000000000;
  }

  if (num >= 1000000) {
    result += convertToEnglish(Math.floor(num / 1000000)) + " million ";
    num %= 1000000;
  }

  if (num >= 1000) {
    result += convertToEnglish(Math.floor(num / 1000)) + " thousand ";
    num %= 1000;
  }

  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + " hundred ";
    num %= 100;
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num >= 10) {
    result += teens[num - 10] + " ";
    num = 0;
  }

  if (num > 0) {
    result += ones[num] + " ";
  }

  return result.trim();
}

function convertToVietnamese(num: number): string {
  if (num === 0) return "không";
  if (num < 0) return "âm " + convertToVietnamese(-num);

  let result = "";

  if (num >= 1000000000000) {
    result += convertToVietnamese(Math.floor(num / 1000000000000)) + " nghìn tỷ ";
    num %= 1000000000000;
  }

  if (num >= 1000000000) {
    result += convertToVietnamese(Math.floor(num / 1000000000)) + " tỷ ";
    num %= 1000000000;
  }

  if (num >= 1000000) {
    result += convertToVietnamese(Math.floor(num / 1000000)) + " triệu ";
    num %= 1000000;
  }

  if (num >= 1000) {
    result += convertToVietnamese(Math.floor(num / 1000)) + " nghìn ";
    num %= 1000;
  }

  if (num >= 100) {
    result += onesVi[Math.floor(num / 100)] + " trăm ";
    num %= 100;
  }

  if (num >= 20) {
    result += tensVi[Math.floor(num / 10)] + " ";
    num %= 10;
    if (num === 1) {
      result += "mốt ";
      num = 0;
    } else if (num === 5) {
      result += "lăm ";
      num = 0;
    }
  }

  if (num >= 10) {
    result += teensVi[num - 10] + " ";
    num = 0;
  }

  if (num > 0) {
    result += onesVi[num] + " ";
  }

  return result.trim();
}

export default function NumberToWordsClient() {
  const [input, setInput] = React.useState("");
  const [language, setLanguage] = React.useState("en");
  const [output, setOutput] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const num = parseFloat(input.replace(/,/g, ""));
    if (isNaN(num)) {
      setOutput("");
      return;
    }

    const intPart = Math.floor(Math.abs(num));
    const decimalPart = input.includes(".") ? input.split(".")[1] : "";

    let result = num < 0 ? (language === "en" ? "negative " : "âm ") : "";
    result += language === "en" ? convertToEnglish(intPart) : convertToVietnamese(intPart);

    if (decimalPart) {
      result += language === "en" ? " point" : " phẩy";
      for (const digit of decimalPart) {
        const d = parseInt(digit);
        result += " " + (language === "en" ? (d === 0 ? "zero" : ones[d]) : (d === 0 ? "không" : onesVi[d]));
      }
    }

    setOutput(result.trim());
  }, [input, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="Number to Words Converter"
      description="Convert numbers to words in English or Vietnamese"
    >
      <ToolGrid>
        <ToolCard title="Input">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="text"
                placeholder="Enter a number (e.g., 1234.56)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Output">
          <div className="space-y-4">
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="min-h-[120px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </ToolCard>
      </ToolGrid>
    </ToolShell>
  );
}
