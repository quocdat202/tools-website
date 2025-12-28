import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import PivotTableClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "pivot-table",
  "/tools/data/pivot-table"
);

export default function PivotTablePage() {
  return <PivotTableClient />;
}
