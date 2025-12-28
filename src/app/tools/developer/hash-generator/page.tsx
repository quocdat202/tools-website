"use client";

import * as React from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function hashString(
  message: string,
  algorithm: string
): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateUUID(): string {
  return crypto.randomUUID();
}

function generateRandomString(length: number, charset: string): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => charset[n % charset.length]).join("");
}

export default function HashGeneratorPage() {
  const [input, setInput] = React.useState("");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});
  const [uuid, setUuid] = React.useState("");
  const [randomString, setRandomString] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateHashes = async () => {
      if (!input) {
        setHashes({});
        return;
      }

      const [sha1, sha256, sha384, sha512] = await Promise.all([
        hashString(input, "SHA-1"),
        hashString(input, "SHA-256"),
        hashString(input, "SHA-384"),
        hashString(input, "SHA-512"),
      ]);

      setHashes({
        "SHA-1": sha1,
        "SHA-256": sha256,
        "SHA-384": sha384,
        "SHA-512": sha512,
      });
    };

    generateHashes();
  }, [input]);

  React.useEffect(() => {
    setUuid(generateUUID());
    setRandomString(
      generateRandomString(
        32,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      )
    );
  }, []);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const regenerateUUID = () => {
    setUuid(generateUUID());
  };

  const regenerateRandom = () => {
    setRandomString(
      generateRandomString(
        32,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      )
    );
  };

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes and UUIDs"
    >
      <Tabs defaultValue="hash" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hash">Hash Text</TabsTrigger>
          <TabsTrigger value="uuid">UUID Generator</TabsTrigger>
          <TabsTrigger value="random">Random String</TabsTrigger>
        </TabsList>

        <TabsContent value="hash" className="space-y-6">
          <ToolCard title="Input">
            <div className="space-y-2">
              <Label htmlFor="input">Text to Hash</Label>
              <Textarea
                id="input"
                placeholder="Enter text to generate hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </ToolCard>

          {Object.keys(hashes).length > 0 && (
            <ToolCard title="Generated Hashes">
              <div className="space-y-4">
                {Object.entries(hashes).map(([algo, hash]) => (
                  <div
                    key={algo}
                    className="flex items-start justify-between gap-4 rounded-lg border p-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-medium">{algo}</p>
                      <p className="font-mono text-xs break-all text-muted-foreground">
                        {hash}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(hash, algo)}
                      className="shrink-0"
                    >
                      {copied === algo ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ToolCard>
          )}
        </TabsContent>

        <TabsContent value="uuid" className="space-y-6">
          <ToolCard title="UUID v4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate cryptographically secure UUIDs (Universally Unique
                Identifiers)
              </p>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <p className="font-mono text-lg flex-1 break-all">{uuid}</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(uuid, "uuid")}
                  >
                    {copied === "uuid" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={regenerateUUID}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ToolCard>
        </TabsContent>

        <TabsContent value="random" className="space-y-6">
          <ToolCard title="Random String">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate cryptographically secure random strings (alphanumeric,
                32 characters)
              </p>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <p className="font-mono text-lg flex-1 break-all">
                  {randomString}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(randomString, "random")}
                  >
                    {copied === "random" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={regenerateRandom}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ToolCard>
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}
