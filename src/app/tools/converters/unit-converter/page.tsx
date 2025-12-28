"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UnitCategory {
  name: string;
  units: { value: string; label: string; toBase: number }[];
}

const unitCategories: Record<string, UnitCategory> = {
  length: {
    name: "Length",
    units: [
      { value: "mm", label: "Millimeters (mm)", toBase: 0.001 },
      { value: "cm", label: "Centimeters (cm)", toBase: 0.01 },
      { value: "m", label: "Meters (m)", toBase: 1 },
      { value: "km", label: "Kilometers (km)", toBase: 1000 },
      { value: "in", label: "Inches (in)", toBase: 0.0254 },
      { value: "ft", label: "Feet (ft)", toBase: 0.3048 },
      { value: "yd", label: "Yards (yd)", toBase: 0.9144 },
      { value: "mi", label: "Miles (mi)", toBase: 1609.344 },
    ],
  },
  weight: {
    name: "Weight",
    units: [
      { value: "mg", label: "Milligrams (mg)", toBase: 0.000001 },
      { value: "g", label: "Grams (g)", toBase: 0.001 },
      { value: "kg", label: "Kilograms (kg)", toBase: 1 },
      { value: "t", label: "Metric Tons (t)", toBase: 1000 },
      { value: "oz", label: "Ounces (oz)", toBase: 0.0283495 },
      { value: "lb", label: "Pounds (lb)", toBase: 0.453592 },
      { value: "st", label: "Stones (st)", toBase: 6.35029 },
    ],
  },
  temperature: {
    name: "Temperature",
    units: [
      { value: "c", label: "Celsius (°C)", toBase: 1 },
      { value: "f", label: "Fahrenheit (°F)", toBase: 1 },
      { value: "k", label: "Kelvin (K)", toBase: 1 },
    ],
  },
  area: {
    name: "Area",
    units: [
      { value: "mm2", label: "Square Millimeters (mm²)", toBase: 0.000001 },
      { value: "cm2", label: "Square Centimeters (cm²)", toBase: 0.0001 },
      { value: "m2", label: "Square Meters (m²)", toBase: 1 },
      { value: "ha", label: "Hectares (ha)", toBase: 10000 },
      { value: "km2", label: "Square Kilometers (km²)", toBase: 1000000 },
      { value: "in2", label: "Square Inches (in²)", toBase: 0.00064516 },
      { value: "ft2", label: "Square Feet (ft²)", toBase: 0.092903 },
      { value: "ac", label: "Acres (ac)", toBase: 4046.86 },
      { value: "mi2", label: "Square Miles (mi²)", toBase: 2589988 },
    ],
  },
  volume: {
    name: "Volume",
    units: [
      { value: "ml", label: "Milliliters (ml)", toBase: 0.001 },
      { value: "l", label: "Liters (L)", toBase: 1 },
      { value: "m3", label: "Cubic Meters (m³)", toBase: 1000 },
      { value: "gal_us", label: "US Gallons", toBase: 3.78541 },
      { value: "gal_uk", label: "UK Gallons", toBase: 4.54609 },
      { value: "qt", label: "Quarts (US)", toBase: 0.946353 },
      { value: "pt", label: "Pints (US)", toBase: 0.473176 },
      { value: "cup", label: "Cups (US)", toBase: 0.236588 },
      { value: "floz", label: "Fluid Ounces (US)", toBase: 0.0295735 },
    ],
  },
  speed: {
    name: "Speed",
    units: [
      { value: "ms", label: "Meters per second (m/s)", toBase: 1 },
      { value: "kmh", label: "Kilometers per hour (km/h)", toBase: 0.277778 },
      { value: "mph", label: "Miles per hour (mph)", toBase: 0.44704 },
      { value: "kn", label: "Knots (kn)", toBase: 0.514444 },
      { value: "fts", label: "Feet per second (ft/s)", toBase: 0.3048 },
    ],
  },
  time: {
    name: "Time",
    units: [
      { value: "ms", label: "Milliseconds (ms)", toBase: 0.001 },
      { value: "s", label: "Seconds (s)", toBase: 1 },
      { value: "min", label: "Minutes (min)", toBase: 60 },
      { value: "h", label: "Hours (h)", toBase: 3600 },
      { value: "d", label: "Days (d)", toBase: 86400 },
      { value: "wk", label: "Weeks (wk)", toBase: 604800 },
      { value: "mo", label: "Months (mo)", toBase: 2629746 },
      { value: "yr", label: "Years (yr)", toBase: 31556952 },
    ],
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;

  // Convert to Celsius first
  switch (from) {
    case "f":
      celsius = (value - 32) * (5 / 9);
      break;
    case "k":
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // Convert from Celsius to target
  switch (to) {
    case "f":
      return celsius * (9 / 5) + 32;
    case "k":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

function convert(value: number, from: string, to: string, category: string): number {
  if (category === "temperature") {
    return convertTemperature(value, from, to);
  }

  const units = unitCategories[category].units;
  const fromUnit = units.find((u) => u.value === from);
  const toUnit = units.find((u) => u.value === to);

  if (!fromUnit || !toUnit) return 0;

  // Convert to base unit, then to target unit
  const baseValue = value * fromUnit.toBase;
  return baseValue / toUnit.toBase;
}

export default function UnitConverterPage() {
  const [category, setCategory] = React.useState("length");
  const [fromUnit, setFromUnit] = React.useState("m");
  const [toUnit, setToUnit] = React.useState("ft");
  const [fromValue, setFromValue] = React.useState("");
  const [toValue, setToValue] = React.useState("");

  React.useEffect(() => {
    // Reset units when category changes
    const units = unitCategories[category].units;
    setFromUnit(units[0].value);
    setToUnit(units[1]?.value || units[0].value);
    setFromValue("");
    setToValue("");
  }, [category]);

  React.useEffect(() => {
    if (!fromValue) {
      setToValue("");
      return;
    }
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue("");
      return;
    }
    const result = convert(value, fromUnit, toUnit, category);
    setToValue(result.toLocaleString("en-US", { maximumFractionDigits: 10 }));
  }, [fromValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const currentUnits = unitCategories[category].units;

  return (
    <ToolShell
      title="Unit Converter"
      description="Convert between different units of measurement"
    >
      <div className="space-y-6">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            {Object.entries(unitCategories).map(([key, cat]) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ToolCard>
          <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromValue">From</Label>
                <Input
                  id="fromValue"
                  type="number"
                  placeholder="Enter value"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromUnit">Unit</Label>
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

            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" onClick={handleSwap}>
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toValue">To</Label>
                <Input
                  id="toValue"
                  type="text"
                  placeholder="Result"
                  value={toValue}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toUnit">Unit</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
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
          </div>
        </ToolCard>
      </div>
    </ToolShell>
  );
}
