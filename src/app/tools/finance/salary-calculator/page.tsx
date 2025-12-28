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

// Vietnam salary calculation constants (2024)
const SOCIAL_INSURANCE_EMPLOYEE = 0.08; // 8%
const HEALTH_INSURANCE_EMPLOYEE = 0.015; // 1.5%
const UNEMPLOYMENT_INSURANCE_EMPLOYEE = 0.01; // 1%

const SOCIAL_INSURANCE_EMPLOYER = 0.175; // 17.5%
const HEALTH_INSURANCE_EMPLOYER = 0.03; // 3%
const UNEMPLOYMENT_INSURANCE_EMPLOYER = 0.01; // 1%

const INSURANCE_SALARY_CAP = 46800000; // 20 x base salary (2,340,000)
const UNEMPLOYMENT_SALARY_CAP = 93600000; // 20 x regional minimum

const PERSONAL_DEDUCTION = 11000000; // 11M VND
const DEPENDENT_DEDUCTION = 4400000; // 4.4M VND per dependent

// Progressive tax rates
const TAX_BRACKETS = [
  { max: 5000000, rate: 0.05 },
  { max: 10000000, rate: 0.1 },
  { max: 18000000, rate: 0.15 },
  { max: 32000000, rate: 0.2 },
  { max: 52000000, rate: 0.25 },
  { max: 80000000, rate: 0.3 },
  { max: Infinity, rate: 0.35 },
];

interface SalaryBreakdown {
  gross: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  totalInsurance: number;
  taxableIncome: number;
  personalIncomeTax: number;
  net: number;
  employerSocialInsurance: number;
  employerHealthInsurance: number;
  employerUnemploymentInsurance: number;
  totalEmployerCost: number;
}

function calculateProgressiveTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  let remaining = taxableIncome;
  let previousMax = 0;

  for (const bracket of TAX_BRACKETS) {
    const bracketAmount = bracket.max - previousMax;
    const taxableAmount = Math.min(remaining, bracketAmount);

    if (taxableAmount <= 0) break;

    tax += taxableAmount * bracket.rate;
    remaining -= taxableAmount;
    previousMax = bracket.max;
  }

  return tax;
}

function calculateFromGross(
  gross: number,
  dependents: number = 0
): SalaryBreakdown {
  // Calculate insurance
  const insurableSalary = Math.min(gross, INSURANCE_SALARY_CAP);
  const unemploymentInsurableSalary = Math.min(gross, UNEMPLOYMENT_SALARY_CAP);

  const socialInsurance = insurableSalary * SOCIAL_INSURANCE_EMPLOYEE;
  const healthInsurance = insurableSalary * HEALTH_INSURANCE_EMPLOYEE;
  const unemploymentInsurance =
    unemploymentInsurableSalary * UNEMPLOYMENT_INSURANCE_EMPLOYEE;
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  // Calculate taxable income
  const deductions =
    PERSONAL_DEDUCTION + dependents * DEPENDENT_DEDUCTION;
  const taxableIncome = Math.max(0, gross - totalInsurance - deductions);

  // Calculate PIT
  const personalIncomeTax = calculateProgressiveTax(taxableIncome);

  // Calculate net
  const net = gross - totalInsurance - personalIncomeTax;

  // Employer costs
  const employerSocialInsurance = insurableSalary * SOCIAL_INSURANCE_EMPLOYER;
  const employerHealthInsurance = insurableSalary * HEALTH_INSURANCE_EMPLOYER;
  const employerUnemploymentInsurance =
    unemploymentInsurableSalary * UNEMPLOYMENT_INSURANCE_EMPLOYER;
  const totalEmployerCost =
    gross +
    employerSocialInsurance +
    employerHealthInsurance +
    employerUnemploymentInsurance;

  return {
    gross,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    taxableIncome,
    personalIncomeTax,
    net,
    employerSocialInsurance,
    employerHealthInsurance,
    employerUnemploymentInsurance,
    totalEmployerCost,
  };
}

function calculateFromNet(
  targetNet: number,
  dependents: number = 0
): SalaryBreakdown {
  // Binary search to find gross that produces target net
  let low = targetNet;
  let high = targetNet * 2;
  let gross = targetNet;

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const result = calculateFromGross(mid, dependents);

    if (Math.abs(result.net - targetNet) < 1) {
      gross = mid;
      break;
    }

    if (result.net < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
    gross = mid;
  }

  return calculateFromGross(Math.round(gross), dependents);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalaryCalculatorPage() {
  const [mode, setMode] = React.useState<"gross-to-net" | "net-to-gross">(
    "gross-to-net"
  );
  const [salary, setSalary] = React.useState("");
  const [dependents, setDependents] = React.useState("0");
  const [result, setResult] = React.useState<SalaryBreakdown | null>(null);

  React.useEffect(() => {
    const amount = parseFloat(salary.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) {
      setResult(null);
      return;
    }

    const deps = parseInt(dependents) || 0;

    if (mode === "gross-to-net") {
      setResult(calculateFromGross(amount, deps));
    } else {
      setResult(calculateFromNet(amount, deps));
    }
  }, [salary, dependents, mode]);

  const handleSwapMode = () => {
    setMode(mode === "gross-to-net" ? "net-to-gross" : "gross-to-net");
    setSalary("");
    setResult(null);
  };

  return (
    <ToolShell
      title="Vietnam Salary Calculator"
      description="Calculate Gross ⇄ Net salary with insurance and tax deductions"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleSwapMode}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                {mode === "gross-to-net" ? "Gross → Net" : "Net → Gross"}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">
                  {mode === "gross-to-net" ? "Gross Salary" : "Net Salary"} (VND)
                </Label>
                <Input
                  id="salary"
                  type="text"
                  placeholder="e.g., 20000000"
                  value={salary}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setSalary(value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Select value={dependents} onValueChange={setDependents}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} dependent{n !== 1 ? "s" : ""}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Gross Salary
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(result.gross)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Net Salary
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency(result.net)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ToolGrid>
              <ToolCard title="Employee Deductions">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Social Insurance (8%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.socialInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Health Insurance (1.5%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.healthInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Unemployment Insurance (1%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.unemploymentInsurance)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>Total Insurance</span>
                    <span className="font-mono">
                      {formatCurrency(result.totalInsurance)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Personal Deduction
                    </span>
                    <span className="font-mono">
                      {formatCurrency(PERSONAL_DEDUCTION)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Dependent Deduction
                    </span>
                    <span className="font-mono">
                      {formatCurrency(parseInt(dependents) * DEPENDENT_DEDUCTION)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxable Income</span>
                    <span className="font-mono">
                      {formatCurrency(result.taxableIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Personal Income Tax</span>
                    <span className="font-mono">
                      {formatCurrency(result.personalIncomeTax)}
                    </span>
                  </div>
                </div>
              </ToolCard>

              <ToolCard title="Employer Cost">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Social Insurance (17.5%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.employerSocialInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Health Insurance (3%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.employerHealthInsurance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Unemployment Insurance (1%)
                    </span>
                    <span className="font-mono">
                      {formatCurrency(result.employerUnemploymentInsurance)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total Employer Cost</span>
                    <span className="font-mono">
                      {formatCurrency(result.totalEmployerCost)}
                    </span>
                  </div>
                </div>
              </ToolCard>
            </ToolGrid>
          </>
        )}
      </div>
    </ToolShell>
  );
}
