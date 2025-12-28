"use client";

import * as React from "react";
import { ToolShell, ToolCard, ToolGrid } from "@/components/tool-shell/tool-shell";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
}

function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: 0,
      speakingTime: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Count words (split by whitespace, filter empty)
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Count sentences (split by sentence-ending punctuation)
  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  // Count paragraphs (split by double newlines or more)
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  // Count lines
  const lines = text.split("\n").length;

  // Reading time: ~200 words per minute
  const readingTime = Math.ceil(words / 200);

  // Speaking time: ~150 words per minute
  const speakingTime = Math.ceil(words / 150);

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
  };
}

function getWordFrequency(text: string): { word: string; count: number }[] {
  if (!text.trim()) return [];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const frequency: Record<string, number> = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  return Object.entries(frequency)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export default function WordCounterPage() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => analyzeText(text), [text]);
  const wordFrequency = React.useMemo(() => getWordFrequency(text), [text]);

  const statCards = [
    { label: "Characters", value: stats.characters.toLocaleString() },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Reading Time", value: `${stats.readingTime} min` },
    { label: "Speaking Time", value: `${stats.speakingTime} min` },
  ];

  return (
    <ToolShell
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs"
    >
      <div className="space-y-6">
        <ToolCard title="Input">
          <div className="space-y-2">
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </ToolCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {wordFrequency.length > 0 && (
          <ToolCard title="Word Frequency (Top 20)">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {wordFrequency.map(({ word, count }) => (
                <div
                  key={word}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="font-mono text-sm truncate mr-2">{word}</span>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          </ToolCard>
        )}
      </div>
    </ToolShell>
  );
}
