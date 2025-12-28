"use client";

import * as React from "react";
import { Copy, Check, AlertCircle, ShieldCheck, ShieldX } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface JWTDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  return atob(base64);
}

function decodeJWT(token: string): JWTDecoded | null {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return null;
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { header, payload, signature };
  } catch {
    return null;
  }
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function isExpired(exp: number): boolean {
  return Date.now() > exp * 1000;
}

export default function JwtDecoderPage() {
  const [token, setToken] = React.useState("");
  const [decoded, setDecoded] = React.useState<JWTDecoded | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }

    const result = decodeJWT(token);
    if (result) {
      setDecoded(result);
      setError(null);
    } else {
      setDecoded(null);
      setError("Invalid JWT format. Token should have 3 parts separated by dots.");
    }
  }, [token]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sampleToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzU2ODk2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  const loadSample = () => {
    setToken(sampleToken);
  };

  const payloadExp = decoded?.payload.exp as number | undefined;
  const payloadIat = decoded?.payload.iat as number | undefined;
  const payloadNbf = decoded?.payload.nbf as number | undefined;

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens (JWT)"
      actions={
        <Button variant="outline" size="sm" onClick={loadSample}>
          Load Sample
        </Button>
      }
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-2">
            <Label htmlFor="token">JWT Token</Label>
            <Textarea
              id="token"
              placeholder="Paste your JWT token here..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </ToolCard>

        {decoded && (
          <>
            {/* Token Status */}
            {payloadExp && (
              <Alert variant={isExpired(payloadExp) ? "destructive" : "default"}>
                {isExpired(payloadExp) ? (
                  <ShieldX className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                <AlertDescription>
                  {isExpired(payloadExp)
                    ? `Token expired on ${formatTimestamp(payloadExp)}`
                    : `Token valid until ${formatTimestamp(payloadExp)}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Header */}
            <ToolCard title="Header">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {typeof decoded.header.alg === "string" && (
                    <Badge variant="secondary">
                      Algorithm: {decoded.header.alg}
                    </Badge>
                  )}
                  {typeof decoded.header.typ === "string" && (
                    <Badge variant="secondary">
                      Type: {decoded.header.typ}
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <pre className="rounded-lg bg-muted p-4 font-mono text-sm overflow-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() =>
                      handleCopy(JSON.stringify(decoded.header, null, 2), "header")
                    }
                  >
                    {copied === "header" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </ToolCard>

            {/* Payload */}
            <ToolCard title="Payload">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {payloadIat && (
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Issued At (iat)</p>
                      <p className="font-mono text-sm">{formatTimestamp(payloadIat)}</p>
                    </div>
                  )}
                  {payloadExp && (
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Expires (exp)</p>
                      <p className="font-mono text-sm">{formatTimestamp(payloadExp)}</p>
                    </div>
                  )}
                  {payloadNbf && (
                    <div className="rounded-lg border p-3">
                      <p className="text-sm text-muted-foreground">Not Before (nbf)</p>
                      <p className="font-mono text-sm">{formatTimestamp(payloadNbf)}</p>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <pre className="rounded-lg bg-muted p-4 font-mono text-sm overflow-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() =>
                      handleCopy(JSON.stringify(decoded.payload, null, 2), "payload")
                    }
                  >
                    {copied === "payload" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </ToolCard>

            {/* Signature */}
            <ToolCard title="Signature">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  The signature cannot be verified without the secret key. This tool
                  only decodes the token.
                </p>
                <div className="relative">
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm break-all">
                    {decoded.signature}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleCopy(decoded.signature, "signature")}
                  >
                    {copied === "signature" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </ToolCard>
          </>
        )}
      </div>
    </ToolShell>
  );
}
