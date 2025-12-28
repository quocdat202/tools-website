import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import NumberToWordsClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "number-to-words",
  "/tools/converters/number-to-words"
);

export default function NumberToWordsPage() {
  return <NumberToWordsClient />;
}
