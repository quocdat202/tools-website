import type { Metadata } from "next";

const SITE_NAME = "Tools Platform";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.example.com";
const SITE_DESCRIPTION =
  "A collection of free online developer tools, converters, and utilities. JSON formatter, unit converter, hash generator, and more.";

export interface GenerateMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  path = "",
  ogImage,
}: GenerateMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const defaultKeywords = [
    "developer tools",
    "online tools",
    "free tools",
    "converter",
    "formatter",
    "calculator",
    "utilities",
  ];

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: "vi_VN",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const siteMetadata: Metadata = generateMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    "json formatter",
    "unit converter",
    "hash generator",
    "regex tester",
    "base converter",
    "timestamp converter",
    "color converter",
    "text tools",
  ],
});

// Tool-specific metadata
export const toolsMetadata: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "number-to-words": {
    title: "Number to Words Converter",
    description:
      "Convert numbers to words in multiple languages. Support for English, Vietnamese and more.",
    keywords: ["number to words", "number converter", "spell numbers"],
  },
  "date-format": {
    title: "Date Format Converter",
    description:
      "Convert dates between different formats. ISO, Unix timestamp, custom formats and more.",
    keywords: ["date format", "date converter", "timestamp", "ISO date"],
  },
  "unit-converter": {
    title: "Unit Converter",
    description:
      "Convert between different units of measurement. Length, weight, temperature, and more.",
    keywords: [
      "unit converter",
      "measurement converter",
      "length converter",
      "weight converter",
    ],
  },
  "file-size": {
    title: "File Size Converter",
    description:
      "Convert between file size units. Bytes, KB, MB, GB, TB and more.",
    keywords: ["file size converter", "bytes converter", "storage units"],
  },
  "case-converter": {
    title: "Case Converter",
    description:
      "Convert text between different cases. Uppercase, lowercase, title case, camelCase, and more.",
    keywords: [
      "case converter",
      "text case",
      "uppercase",
      "lowercase",
      "camelCase",
    ],
  },
  "base-converter": {
    title: "Base Converter",
    description:
      "Convert numbers between different bases. Binary, octal, decimal, hexadecimal.",
    keywords: [
      "base converter",
      "binary converter",
      "hex converter",
      "number base",
    ],
  },
  "color-converter": {
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, HSL formats. Color picker included.",
    keywords: [
      "color converter",
      "hex to rgb",
      "rgb to hex",
      "color picker",
      "hsl converter",
    ],
  },
  "timestamp-converter": {
    title: "Timestamp Converter",
    description:
      "Convert between Unix timestamps and human-readable dates. Support multiple timezones.",
    keywords: [
      "timestamp converter",
      "unix timestamp",
      "epoch converter",
      "date to timestamp",
    ],
  },
  "json-formatter": {
    title: "JSON Formatter & Validator",
    description:
      "Format, validate and beautify JSON data. Minify JSON, fix common errors.",
    keywords: [
      "json formatter",
      "json validator",
      "json beautifier",
      "json minifier",
    ],
  },
  "xml-formatter": {
    title: "XML Formatter & Validator",
    description: "Format and validate XML data. Pretty print XML documents.",
    keywords: ["xml formatter", "xml validator", "xml beautifier", "xml parser"],
  },
  "sql-formatter": {
    title: "SQL Formatter",
    description:
      "Format and beautify SQL queries. Support multiple SQL dialects.",
    keywords: [
      "sql formatter",
      "sql beautifier",
      "format sql",
      "sql pretty print",
    ],
  },
  "regex-tester": {
    title: "Regex Tester",
    description:
      "Test and debug regular expressions online. Real-time matching with explanations.",
    keywords: [
      "regex tester",
      "regular expression",
      "regex debugger",
      "regex matcher",
    ],
  },
  "hash-generator": {
    title: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-512 hashes. Hash text and files online.",
    keywords: [
      "hash generator",
      "md5 hash",
      "sha256 hash",
      "checksum calculator",
    ],
  },
  "jwt-decoder": {
    title: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens (JWT). View header, payload and verify signature.",
    keywords: ["jwt decoder", "jwt parser", "json web token", "jwt debugger"],
  },
  "word-counter": {
    title: "Word Counter",
    description:
      "Count words, characters, sentences and paragraphs. Reading time estimation.",
    keywords: [
      "word counter",
      "character counter",
      "text statistics",
      "reading time",
    ],
  },
  "vietnamese-katakana": {
    title: "Vietnamese to Katakana Converter",
    description:
      "Convert Vietnamese text to Japanese Katakana and vice versa.",
    keywords: [
      "vietnamese katakana",
      "vietnamese japanese",
      "katakana converter",
    ],
  },
  "text-diff": {
    title: "Text Diff Tool",
    description:
      "Compare two texts and find differences. Side-by-side comparison with highlights.",
    keywords: ["text diff", "compare text", "diff tool", "text comparison"],
  },
  "text-normalizer": {
    title: "Text Normalizer",
    description:
      "Normalize and clean text. Remove extra spaces, fix unicode, standardize formatting.",
    keywords: [
      "text normalizer",
      "clean text",
      "remove spaces",
      "unicode normalizer",
    ],
  },
  "salary-calculator": {
    title: "Vietnam Salary Calculator (Gross/Net)",
    description:
      "Calculate Vietnam salary from Gross to Net and vice versa. Include social insurance, tax.",
    keywords: [
      "vietnam salary",
      "gross net calculator",
      "salary calculator vietnam",
      "tax calculator",
    ],
  },
  "vat-calculator": {
    title: "Vietnam VAT Calculator",
    description:
      "Calculate VAT (Value Added Tax) for Vietnam. 8% and 10% VAT rates.",
    keywords: [
      "vat calculator",
      "vietnam vat",
      "tax calculator",
      "value added tax",
    ],
  },
  "currency-converter": {
    title: "Currency Converter",
    description:
      "Convert between currencies with live exchange rates. Support 150+ currencies.",
    keywords: [
      "currency converter",
      "exchange rate",
      "money converter",
      "forex",
    ],
  },
  "pivot-table": {
    title: "Online Pivot Table",
    description:
      "Create pivot tables from CSV and Excel files. Group, aggregate and analyze data online.",
    keywords: [
      "pivot table",
      "data analysis",
      "csv pivot",
      "excel pivot",
      "data visualization",
    ],
  },
};

export function getToolMetadata(toolId: string, path: string): Metadata {
  const tool = toolsMetadata[toolId];
  if (!tool) {
    return generateMetadata({
      title: "Tool",
      description: "Online developer tool",
      path,
    });
  }

  return generateMetadata({
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    path,
  });
}
