import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import CurrencyConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "currency-converter",
  "/tools/finance/currency-converter"
);

export default function CurrencyConverterPage() {
  return <CurrencyConverterClient />;
}
