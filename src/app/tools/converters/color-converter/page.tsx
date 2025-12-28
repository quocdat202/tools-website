"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export default function ColorConverterPage() {
  const [rgb, setRgb] = React.useState<RGB>({ r: 66, g: 135, b: 245 });
  const [hexInput, setHexInput] = React.useState("#4287f5");
  const [copied, setCopied] = React.useState<string | null>(null);

  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const formats = [
    { id: "hex", label: "HEX", value: hex.toUpperCase() },
    { id: "rgb", label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { id: "rgba", label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { id: "hsl", label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { id: "hsla", label: "HSLA", value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
    { id: "hsv", label: "HSV/HSB", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ];

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const rgbValue = hexToRgb(value);
    if (rgbValue) {
      setRgb(rgbValue);
    }
  };

  const handleRgbChange = (component: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [component]: value };
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (component: keyof HSL, value: number) => {
    const newHsl = { ...hsl, [component]: value };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolShell
      title="Color Converter"
      description="Convert colors between HEX, RGB, HSL, and HSV formats"
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Color Preview">
            <div className="space-y-4">
              <div
                className="h-32 w-full rounded-lg border"
                style={{ backgroundColor: hex }}
              />
              <div className="space-y-2">
                <Label htmlFor="hex">HEX</Label>
                <div className="flex gap-2">
                  <Input
                    id="hex"
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="font-mono"
                  />
                  <Input
                    type="color"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                </div>
              </div>
            </div>
          </ToolCard>

          <ToolCard title="Adjust Colors">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium">RGB</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Red</span>
                      <span>{rgb.r}</span>
                    </div>
                    <Slider
                      value={[rgb.r]}
                      onValueChange={(v) => handleRgbChange("r", v[0])}
                      max={255}
                      step={1}
                      className="[&_[role=slider]]:bg-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Green</span>
                      <span>{rgb.g}</span>
                    </div>
                    <Slider
                      value={[rgb.g]}
                      onValueChange={(v) => handleRgbChange("g", v[0])}
                      max={255}
                      step={1}
                      className="[&_[role=slider]]:bg-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Blue</span>
                      <span>{rgb.b}</span>
                    </div>
                    <Slider
                      value={[rgb.b]}
                      onValueChange={(v) => handleRgbChange("b", v[0])}
                      max={255}
                      step={1}
                      className="[&_[role=slider]]:bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium">HSL</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hue</span>
                      <span>{hsl.h}°</span>
                    </div>
                    <Slider
                      value={[hsl.h]}
                      onValueChange={(v) => handleHslChange("h", v[0])}
                      max={360}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Saturation</span>
                      <span>{hsl.s}%</span>
                    </div>
                    <Slider
                      value={[hsl.s]}
                      onValueChange={(v) => handleHslChange("s", v[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lightness</span>
                      <span>{hsl.l}%</span>
                    </div>
                    <Slider
                      value={[hsl.l]}
                      onValueChange={(v) => handleHslChange("l", v[0])}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ToolCard>
        </div>

        <ToolCard title="All Formats">
          <div className="grid gap-3 sm:grid-cols-2">
            {formats.map((format) => (
              <div
                key={format.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1 min-w-0 flex-1 mr-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {format.label}
                  </p>
                  <p className="font-mono text-sm">{format.value}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(format.value, format.id)}
                  className="shrink-0"
                >
                  {copied === format.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    </ToolShell>
  );
}
