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

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  KRW: 1320,
  VND: 24500,
  THB: 35.5,
  SGD: 1.34,
  MYR: 4.72,
  IDR: 15700,
  PHP: 56.2,
  INR: 83.1,
  AUD: 1.53,
  NZD: 1.64,
  CAD: 1.36,
  CHF: 0.88,
  HKD: 7.82,
  TWD: 31.5,
  AED: 3.67,
};

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
];

function convert(amount: number, from: string, to: string): number {
  const fromRate = EXCHANGE_RATES[from];
  const toRate = EXCHANGE_RATES[to];

  if (!fromRate || !toRate) return 0;

  const usd = amount / fromRate;
  return usd * toRate;
}

function formatCurrency(value: number, code: string): string {
  const decimals = ["JPY", "KRW", "VND", "IDR"].includes(code) ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function CurrencyConverterClient() {
  const [amount, setAmount] = React.useState("1");
  const [fromCurrency, setFromCurrency] = React.useState("USD");
  const [toCurrency, setToCurrency] = React.useState("VND");

  const result = React.useMemo(() => {
    const value = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(value) || value < 0) return null;
    return convert(value, fromCurrency, toCurrency);
  }, [amount, fromCurrency, toCurrency]);

  const rate = React.useMemo(() => {
    return convert(1, fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const inverseRate = React.useMemo(() => {
    return convert(1, toCurrency, fromCurrency);
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromCurrencyData = CURRENCIES.find((c) => c.code === fromCurrency);
  const toCurrencyData = CURRENCIES.find((c) => c.code === toCurrency);

  return (
    <ToolShell
      title="Currency Converter"
      description="Convert between world currencies"
    >
      <div className="space-y-6">
        <ToolCard>
          <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setAmount(value);
                  }}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">
                            - {currency.name}
                          </span>
                        </span>
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
                <Label htmlFor="result">Result</Label>
                <Input
                  id="result"
                  type="text"
                  value={result !== null ? formatCurrency(result, toCurrency) : ""}
                  readOnly
                  className="text-lg bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">
                            - {currency.name}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ToolCard>

        {result !== null && (
          <ToolCard title="Exchange Rate">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-lg">
                  {fromCurrencyData?.flag} 1 {fromCurrency}
                </span>
                <span className="text-xl font-bold">
                  = {toCurrencyData?.flag} {formatCurrency(rate, toCurrency)}{" "}
                  {toCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-lg">
                  {toCurrencyData?.flag} 1 {toCurrency}
                </span>
                <span className="text-xl font-bold">
                  = {fromCurrencyData?.flag}{" "}
                  {formatCurrency(inverseRate, fromCurrency)} {fromCurrency}
                </span>
              </div>
            </div>
          </ToolCard>
        )}

        <ToolCard title="Quick Convert">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 10, 100, 1000].map((amt) => {
              const converted = convert(amt, fromCurrency, toCurrency);
              return (
                <div
                  key={amt}
                  className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-accent"
                  onClick={() => setAmount(amt.toString())}
                >
                  <span>
                    {amt.toLocaleString()} {fromCurrency}
                  </span>
                  <span className="font-mono">
                    {formatCurrency(converted, toCurrency)}
                  </span>
                </div>
              );
            })}
          </div>
        </ToolCard>

        <p className="text-sm text-muted-foreground text-center">
          Exchange rates are for reference only and may not reflect current market rates.
          Last updated: December 2024
        </p>
      </div>
    </ToolShell>
  );
}
