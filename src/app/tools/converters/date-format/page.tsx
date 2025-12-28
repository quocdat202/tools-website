import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import DateFormatClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "date-format",
  "/tools/converters/date-format"
);

export default function DateFormatPage() {
  return <DateFormatClient />;
}
