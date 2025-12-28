import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import HashGeneratorClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "hash-generator",
  "/tools/developer/hash-generator"
);

export default function HashGeneratorPage() {
  return <HashGeneratorClient />;
}
