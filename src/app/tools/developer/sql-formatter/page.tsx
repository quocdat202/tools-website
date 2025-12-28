import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import SqlFormatterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "sql-formatter",
  "/tools/developer/sql-formatter"
);

export default function SqlFormatterPage() {
  return <SqlFormatterClient />;
}
