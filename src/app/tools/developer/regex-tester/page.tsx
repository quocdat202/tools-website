import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import RegexTesterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "regex-tester",
  "/tools/developer/regex-tester"
);

export default function RegexTesterPage() {
  return <RegexTesterClient />;
}
