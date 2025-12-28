import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import VietnameseKatakanaClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "vietnamese-katakana",
  "/tools/language/vietnamese-katakana"
);

export default function VietnameseKatakanaPage() {
  return <VietnameseKatakanaClient />;
}
