import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import VatCalculatorClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "vat-calculator",
  "/tools/finance/vat-calculator"
);

export default function VatCalculatorPage() {
  return <VatCalculatorClient />;
}
