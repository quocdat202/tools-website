"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

// Vietnam VAT rates
const VAT_RATES = [
  { value: "0", label: "0% (Export, international transport)", rate: 0 },
  { value: "5", label: "5% (Essential goods)", rate: 0.05 },
  { value: "8", label: "8% (Reduced rate - 2024)", rate: 0.08 },
  { value: "10", label: "10% (Standard rate)", rate: 0.1 },
];

interface VATResult {
  priceBeforeVAT: number;
  vatAmount: number;
  priceWithVAT: number;
  vatRate: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateVAT(
  amount: number,
  vatRate: number,
  mode: "add" | "remove"
): VATResult {
  if (mode === "add") {
    // Amount is before VAT, calculate with VAT
    const vatAmount = amount * vatRate;
    return {
      priceBeforeVAT: amount,
      vatAmount,
      priceWithVAT: amount + vatAmount,
      vatRate,
    };
  } else {
    // Amount includes VAT, calculate before VAT
    const priceBeforeVAT = amount / (1 + vatRate);
    const vatAmount = amount - priceBeforeVAT;
    return {
      priceBeforeVAT,
      vatAmount,
      priceWithVAT: amount,
      vatRate,
    };
  }
}

export default function VatCalculatorPage() {
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const [amount, setAmount] = React.useState("");
  const [vatRate, setVatRate] = React.useState("10");
  const [result, setResult] = React.useState<VATResult | null>(null);

  React.useEffect(() => {
    const value = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }

    const rate = parseFloat(vatRate) / 100;
    setResult(calculateVAT(value, rate, mode));
  }, [amount, vatRate, mode]);

  const handleSwapMode = () => {
    setMode(mode === "add" ? "remove" : "add");
    setAmount("");
    setResult(null);
  };

  return (
    <ToolShell
      title="Vietnam VAT Calculator"
      description="Calculate VAT for Vietnamese goods and services"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleSwapMode}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                {mode === "add" ? "Add VAT to price" : "Remove VAT from price"}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {mode === "add" ? "Price (before VAT)" : "Price (with VAT)"}{" "}
                  (VND)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="e.g., 1000000"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate</Label>
                <Select value={vatRate} onValueChange={setVatRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VAT_RATES.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ToolCard>

        {result && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Price before VAT
                    </p>
                    <p className="text-xl font-bold">
                      {formatCurrency(result.priceBeforeVAT)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      VAT ({vatRate}%)
                    </p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                      {formatCurrency(result.vatAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Price with VAT
                    </p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(result.priceWithVAT)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ToolCard title="Summary">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price before VAT</span>
                  <span className="font-mono">
                    {formatCurrency(result.priceBeforeVAT)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    VAT Amount ({vatRate}%)
                  </span>
                  <span className="font-mono text-orange-600 dark:text-orange-400">
                    + {formatCurrency(result.vatAmount)}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total (with VAT)</span>
                  <span className="font-mono">
                    {formatCurrency(result.priceWithVAT)}
                  </span>
                </div>
              </div>
            </ToolCard>
          </>
        )}

        <ToolCard title="Vietnam VAT Rates (2024)">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>0%</span>
              <span className="text-muted-foreground">
                Exported goods, international transport
              </span>
            </div>
            <div className="flex justify-between">
              <span>5%</span>
              <span className="text-muted-foreground">
                Essential goods (water, fertilizer, medical equipment)
              </span>
            </div>
            <div className="flex justify-between">
              <span>8%</span>
              <span className="text-muted-foreground">
                Reduced rate (applied until end of 2024)
              </span>
            </div>
            <div className="flex justify-between">
              <span>10%</span>
              <span className="text-muted-foreground">
                Standard rate (most goods and services)
              </span>
            </div>
          </div>
        </ToolCard>
      </div>
    </ToolShell>
  );
}
