import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import SalaryCalculatorClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "salary-calculator",
  "/tools/finance/salary-calculator"
);

export default function SalaryCalculatorPage() {
  return <SalaryCalculatorClient />;
}
