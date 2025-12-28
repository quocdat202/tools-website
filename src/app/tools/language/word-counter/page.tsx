import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import WordCounterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "word-counter",
  "/tools/language/word-counter"
);

export default function WordCounterPage() {
  return <WordCounterClient />;
}
