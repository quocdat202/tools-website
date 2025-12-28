import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import JwtDecoderClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "jwt-decoder",
  "/tools/developer/jwt-decoder"
);

export default function JwtDecoderPage() {
  return <JwtDecoderClient />;
}
