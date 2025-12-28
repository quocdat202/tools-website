export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "converters",
    name: "Converters",
    icon: "ArrowRightLeft",
    description: "Convert between different formats and units",
    tools: [
      {
        id: "number-to-words",
        name: "Number to Words",
        description: "Convert numbers to words in multiple languages",
        icon: "Hash",
        href: "/tools/converters/number-to-words",
        category: "converters",
      },
      {
        id: "date-format",
        name: "Date Format Converter",
        description: "Convert dates between different formats",
        icon: "Calendar",
        href: "/tools/converters/date-format",
        category: "converters",
      },
      {
        id: "unit-converter",
        name: "Unit Converter",
        description: "Convert between different units of measurement",
        icon: "Scale",
        href: "/tools/converters/unit-converter",
        category: "converters",
      },
      {
        id: "file-size",
        name: "File Size Converter",
        description: "Convert between file size units (KB, MB, GB, etc.)",
        icon: "HardDrive",
        href: "/tools/converters/file-size",
        category: "converters",
      },
      {
        id: "case-converter",
        name: "Case Converter",
        description: "Convert text between different cases",
        icon: "CaseSensitive",
        href: "/tools/converters/case-converter",
        category: "converters",
      },
      {
        id: "base-converter",
        name: "Base Converter",
        description: "Convert numbers between different bases",
        icon: "Binary",
        href: "/tools/converters/base-converter",
        category: "converters",
      },
      {
        id: "color-converter",
        name: "Color Converter",
        description: "Convert colors between HEX, RGB, HSL formats",
        icon: "Palette",
        href: "/tools/converters/color-converter",
        category: "converters",
      },
      {
        id: "timestamp-converter",
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps and dates",
        icon: "Clock",
        href: "/tools/converters/timestamp-converter",
        category: "converters",
      },
    ],
  },
  {
    id: "developer",
    name: "Developer Tools",
    icon: "Code",
    description: "Tools for developers",
    tools: [
      {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Format and validate JSON data",
        icon: "Braces",
        href: "/tools/developer/json-formatter",
        category: "developer",
      },
      {
        id: "xml-formatter",
        name: "XML Formatter",
        description: "Format and validate XML data",
        icon: "FileCode",
        href: "/tools/developer/xml-formatter",
        category: "developer",
      },
      {
        id: "sql-formatter",
        name: "SQL Formatter",
        description: "Format SQL queries",
        icon: "Database",
        href: "/tools/developer/sql-formatter",
        category: "developer",
      },
      {
        id: "regex-tester",
        name: "Regex Tester",
        description: "Test and debug regular expressions",
        icon: "Regex",
        href: "/tools/developer/regex-tester",
        category: "developer",
      },
      {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-256 hashes",
        icon: "KeyRound",
        href: "/tools/developer/hash-generator",
        category: "developer",
      },
      {
        id: "jwt-decoder",
        name: "JWT Decoder",
        description: "Decode and inspect JWT tokens",
        icon: "ShieldCheck",
        href: "/tools/developer/jwt-decoder",
        category: "developer",
      },
    ],
  },
  {
    id: "language",
    name: "Language & Text",
    icon: "Languages",
    description: "Text manipulation and language tools",
    tools: [
      {
        id: "word-counter",
        name: "Word Counter",
        description: "Count words, characters, sentences, and paragraphs",
        icon: "FileText",
        href: "/tools/language/word-counter",
        category: "language",
      },
      {
        id: "vietnamese-katakana",
        name: "Vietnamese ⇄ Katakana",
        description: "Convert between Vietnamese and Katakana",
        icon: "Languages",
        href: "/tools/language/vietnamese-katakana",
        category: "language",
      },
      {
        id: "text-diff",
        name: "Text Diff",
        description: "Compare two texts and find differences",
        icon: "GitCompare",
        href: "/tools/language/text-diff",
        category: "language",
      },
      {
        id: "text-normalizer",
        name: "Text Normalizer",
        description: "Normalize and clean text",
        icon: "Eraser",
        href: "/tools/language/text-normalizer",
        category: "language",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance Tools",
    icon: "Wallet",
    description: "Financial calculators and tools",
    tools: [
      {
        id: "salary-calculator",
        name: "Salary Gross ⇄ Net (VN)",
        description: "Calculate Vietnam salary Gross to Net and vice versa",
        icon: "Calculator",
        href: "/tools/finance/salary-calculator",
        category: "finance",
      },
      {
        id: "vat-calculator",
        name: "VAT Calculator (VN)",
        description: "Calculate VAT for Vietnam",
        icon: "Receipt",
        href: "/tools/finance/vat-calculator",
        category: "finance",
      },
      {
        id: "currency-converter",
        name: "Currency Converter",
        description: "Convert between currencies",
        icon: "DollarSign",
        href: "/tools/finance/currency-converter",
        category: "finance",
      },
    ],
  },
  {
    id: "data",
    name: "Data Tools",
    icon: "Table",
    description: "Data visualization and analysis tools",
    tools: [
      {
        id: "pivot-table",
        name: "Pivot Table",
        description: "Create pivot tables from CSV/Excel files",
        icon: "Table2",
        href: "/tools/data/pivot-table",
        category: "data",
      },
    ],
  },
];

export const getAllTools = (): Tool[] => {
  return TOOL_CATEGORIES.flatMap((category) => category.tools);
};

export const getToolById = (id: string): Tool | undefined => {
  return getAllTools().find((tool) => tool.id === id);
};

export const getCategoryById = (id: string): ToolCategory | undefined => {
  return TOOL_CATEGORIES.find((category) => category.id === id);
};

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllTools().filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery)
  );
};
