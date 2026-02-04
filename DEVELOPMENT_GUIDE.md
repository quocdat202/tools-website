# Hướng dẫn Xây dựng Tools Platform

> **Tài liệu hướng dẫn chi tiết về cách xây dựng một nền tảng công cụ trực tuyến hoàn chỉnh với Next.js 16, React 19 và Tailwind CSS 4**

---

## 📋 Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc và công nghệ](#2-kiến-trúc-và-công-nghệ)
3. [Cài đặt và thiết lập ban đầu](#3-cài-đặt-và-thiết-lập-ban-đầu)
4. [Cấu trúc thư mục chi tiết](#4-cấu-trúc-thư-mục-chi-tiết)
5. [Hệ thống routing](#5-hệ-thống-routing)
6. [Hệ thống theming và UI](#6-hệ-thống-theming-và-ui)
7. [Hệ thống đa ngôn ngữ (i18n)](#7-hệ-thống-đa-ngôn-ngữ-i18n)
8. [Xây dựng một Tool mới](#8-xây-dựng-một-tool-mới)
9. [Components hệ thống](#9-components-hệ-thống)
10. [Performance Optimization](#10-performance-optimization)
11. [Best Practices](#11-best-practices)
12. [Deployment](#12-deployment)

---

## 1. Tổng quan dự án

### 1.1 Mô tả

**Tools Platform** là một nền tảng web cung cấp hơn 24 công cụ trực tuyến miễn phí, được phân loại thành 5 danh mục chính:

- **Converters** (8 tools): Chuyển đổi định dạng số, ngày tháng, đơn vị, màu sắc, v.v.
- **Developer Tools** (6 tools): JSON/XML/SQL formatter, Regex tester, Hash generator, JWT decoder
- **Language & Text** (4 tools): Word counter, Vietnamese-Katakana converter, Text diff, Text normalizer
- **Finance Tools** (3 tools): Salary calculator (VN), VAT calculator (VN), Currency converter
- **Data Tools** (1 tool): Pivot Table với import CSV/Excel

### 1.2 Đặc điểm nổi bật

- ✅ **Modern Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- ✅ **Responsive Design**: Hoạt động tốt trên desktop, tablet, mobile
- ✅ **Dark/Light Mode**: Hỗ trợ theme switching với next-themes
- ✅ **Internationalization**: Đa ngôn ngữ với next-intl (EN/VI)
- ✅ **Client-side Processing**: Xử lý dữ liệu hoàn toàn trên client, không upload server
- ✅ **Keyboard Shortcuts**: Cmd/Ctrl + K để mở quick search
- ✅ **Accessibility**: Reduced motion, ARIA labels, keyboard navigation
- ✅ **Beautiful UI**: Purple/Violet theme với glassmorphism và smooth animations

### 1.3 Mục tiêu

- Tạo một nền tảng tập trung nhiều công cụ hữu ích cho developers và người dùng phổ thông
- Giao diện hiện đại, dễ sử dụng, hiệu năng cao
- Dễ dàng mở rộng thêm công cụ mới
- Bảo mật và riêng tư - mọi xử lý đều trên client-side

---

## 2. Kiến trúc và công nghệ

### 2.1 Tech Stack

#### Core Framework

```json
{
  "next": "16.1.1", // React framework với App Router
  "react": "19.2.3", // UI library
  "typescript": "^5" // Type safety
}
```

#### Styling & UI

```json
{
  "@tailwindcss/postcss": "^4", // CSS framework
  "tailwindcss": "^4",
  "tw-animate-css": "^1.4.0", // Animation utilities
  "next-themes": "^0.4.6", // Theme switching
  "lucide-react": "^0.562.0" // Icon library
}
```

#### UI Components (shadcn/ui - Radix UI based)

```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-tooltip": "^1.2.8"
  // ... và nhiều component khác
}
```

#### Data Processing

```json
{
  "@tanstack/react-table": "^8.21.3", // Table component cho Pivot Table
  "@tanstack/react-virtual": "^3.13.13", // Virtual scrolling
  "papaparse": "^5.5.3", // CSV parsing
  "xlsx": "^0.18.5" // Excel parsing
}
```

#### Internationalization

```json
{
  "next-intl": "^4.6.1" // i18n cho Next.js
}
```

#### Validation & Utilities

```json
{
  "zod": "^4.2.1", // Schema validation
  "class-variance-authority": "^0.7.1", // CSS variant utilities
  "clsx": "^2.1.1", // Conditional classNames
  "tailwind-merge": "^3.4.0" // Merge Tailwind classes
}
```

#### Drag & Drop

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

### 2.2 Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js App Router                    │
│  (Server Components + Client Components Pattern)       │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
    ┌───────▼──────┐              ┌────────▼─────────┐
    │   Layouts    │              │  Page Components │
    │  - Root      │              │  - Server Side   │
    │  - Tools     │              │  - Metadata      │
    └───────┬──────┘              └────────┬─────────┘
            │                               │
    ┌───────▼────────────────────────┬──────▼──────────┐
    │  Shared Components             │  Client Tools   │
    │  - Header (Search, Theme)      │  - _client.tsx  │
    │  - Sidebar (Navigation)        │  - State Logic  │
    │  - Tool Shell                  │  - Interactivity│
    └────────────────────────────────┴─────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼──────┐       ┌───────▼──────────┐
        │  UI Library  │       │   Utilities      │
        │  shadcn/ui   │       │  - Constants     │
        │  Radix UI    │       │  - Parsers       │
        └──────────────┘       │  - i18n          │
                               │  - Metadata      │
                               └──────────────────┘
```

### 2.3 Design Patterns

#### 2.3.1 Server/Client Component Pattern

- **Server Components**: Metadata, layout, routing
- **Client Components**: Interactive tools, state management, event handlers

#### 2.3.2 Composition Pattern

```tsx
// Tool Page Structure
ToolPage (Server Component)
  └── ToolClient (Client Component)
        ├── ToolShell (Wrapper)
        │     ├── Input Section
        │     ├── Config Panel
        │     └── Output Section
        └── Tool Logic
```

#### 2.3.3 Atomic Design

- **Atoms**: Button, Input, Label (từ shadcn/ui)
- **Molecules**: Form fields, Card sections
- **Organisms**: Tool Shell, Sidebar, Header
- **Templates**: Tool layouts
- **Pages**: Individual tool pages

---

## 3. Cài đặt và thiết lập ban đầu

### 3.1 Yêu cầu hệ thống

```bash
Node.js: >= 18.17.0
npm: >= 9.0.0 (hoặc pnpm/yarn)
```

### 3.2 Khởi tạo project từ đầu

#### Bước 1: Tạo Next.js project

```bash
npx create-next-app@latest tools-website --typescript --tailwind --app --use-npm
cd tools-website
```

Chọn các options sau:

```
✔ Would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? Yes
✔ Would you like to use `src/` directory? Yes
✔ Would you like to use App Router? Yes
✔ Would you like to customize the default import alias? Yes (@/*)
```

#### Bước 2: Cài đặt Tailwind CSS 4 (latest)

```bash
npm install tailwindcss@next @tailwindcss/postcss@next --save-dev
npm install tw-animate-css --save-dev
```

Cập nhật `postcss.config.mjs`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

#### Bước 3: Cài đặt shadcn/ui

```bash
npx shadcn@latest init
```

Chọn config:

```
✔ Which style would you like to use? Default
✔ Which color would you like to use as base color? Violet
✔ Would you like to use CSS variables for colors? Yes
```

Cài đặt các components cần thiết:

```bash
npx shadcn@latest add button input label card textarea select tabs
npx shadcn@latest add dialog dropdown-menu tooltip accordion
npx shadcn@latest add sidebar switch slider table
npx shadcn@latest add scroll-area separator sheet skeleton
```

#### Bước 4: Cài đặt dependencies khác

```bash
# Core utilities
npm install next-themes next-intl lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install zod

# Data processing
npm install @tanstack/react-table @tanstack/react-virtual
npm install papaparse xlsx
npm install --save-dev @types/papaparse

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Command palette
npm install cmdk

# Analytics (optional)
npm install @vercel/speed-insights
```

### 3.3 Clone project hiện có

```bash
# Clone repository
git clone <repository-url>
cd tools-website

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## 4. Cấu trúc thư mục chi tiết

### 4.1 Overview

```
tools-website/
├── public/                      # Static assets
│   ├── icon.png
│   ├── apple-icon.png
│   └── manifest.json
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Global styles, theme variables
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (redirects)
│   │   │
│   │   ├── (marketing)/         # Marketing pages group (optional)
│   │   │
│   │   └── tools/               # Tools section
│   │       ├── layout.tsx       # Tools layout với sidebar
│   │       ├── page.tsx         # Tool explorer
│   │       ├── _client.tsx      # Tool explorer client logic
│   │       │
│   │       ├── converters/      # Converter tools category
│   │       │   ├── number-to-words/
│   │       │   │   ├── page.tsx      # Server component (metadata)
│   │       │   │   └── _client.tsx   # Client component (logic)
│   │       │   ├── date-format/
│   │       │   ├── unit-converter/
│   │       │   ├── file-size/
│   │       │   ├── case-converter/
│   │       │   ├── base-converter/
│   │       │   ├── color-converter/
│   │       │   └── timestamp-converter/
│   │       │
│   │       ├── developer/       # Developer tools category
│   │       │   ├── json-formatter/
│   │       │   ├── xml-formatter/
│   │       │   ├── sql-formatter/
│   │       │   ├── regex-tester/
│   │       │   ├── hash-generator/
│   │       │   └── jwt-decoder/
│   │       │
│   │       ├── language/        # Language & Text tools
│   │       │   ├── word-counter/
│   │       │   ├── vietnamese-katakana/
│   │       │   ├── text-diff/
│   │       │   └── text-normalizer/
│   │       │
│   │       ├── finance/         # Finance tools
│   │       │   ├── salary-calculator/
│   │       │   ├── vat-calculator/
│   │       │   └── currency-converter/
│   │       │
│   │       └── data/            # Data tools
│   │           └── pivot-table/
│   │               ├── page.tsx
│   │               └── _client.tsx
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (40+ components)
│   │   │
│   │   ├── header/              # Header component
│   │   │   └── header.tsx
│   │   │
│   │   ├── sidebar/             # Sidebar navigation
│   │   │   └── sidebar.tsx
│   │   │
│   │   ├── tool-shell/          # Reusable tool wrapper
│   │   │   └── tool-shell.tsx
│   │   │
│   │   ├── language-switcher/   # Language switcher
│   │   │   └── language-switcher.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   └── tools-layout-client.tsx
│   │   │
│   │   ├── pivot-table/         # Pivot table specific
│   │   │   ├── PivotConfigPanel.tsx
│   │   │   ├── PivotDataProcessor.ts
│   │   │   └── VirtualizedPivotTable.tsx
│   │   │
│   │   └── theme-provider.tsx   # Theme provider wrapper
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── utils.ts             # Utility functions (cn, etc.)
│   │   ├── metadata.ts          # SEO metadata generator
│   │   │
│   │   ├── constants/           # Constants
│   │   │   └── tools.ts         # Tool categories & metadata
│   │   │
│   │   ├── i18n/                # Internationalization
│   │   │   ├── config.ts        # i18n config
│   │   │   ├── index.ts         # i18n exports
│   │   │   └── locale-provider.tsx
│   │   │
│   │   ├── parsers/             # File parsers
│   │   │   └── file-parser.ts   # CSV/Excel parser
│   │   │
│   │   └── utils/               # Other utilities
│   │
│   ├── messages/                # Translation files
│   │   ├── en.json              # English translations
│   │   └── vi.json              # Vietnamese translations
│   │
│   ├── types/                   # TypeScript types
│   │   └── pivot-table.ts       # Pivot table types
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── use-mobile.ts        # Mobile detection hook
│   │
│   └── configs/                 # Configuration files
│
├── components.json              # shadcn/ui config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config (if exists)
├── postcss.config.mjs           # PostCSS config
├── tsconfig.json                # TypeScript config
├── eslint.config.mjs            # ESLint config
├── package.json                 # Dependencies
└── README.md                    # Project readme
```

### 4.2 Chi tiết các thư mục quan trọng

#### 4.2.1 `src/app/` - App Router

**Routing Structure:**

- Next.js 16 sử dụng file-system based routing
- Mỗi folder có `page.tsx` sẽ là một route
- `layout.tsx` định nghĩa layout chung cho route group
- `_client.tsx` là convention cho client components (không phải route)

**Pattern cho mỗi tool:**

```tsx
// page.tsx - Server Component (SEO, Metadata)
import { Metadata } from "next";
import ToolClient from "./_client";

export const metadata: Metadata = {
  title: "Tool Name",
  description: "Tool description for SEO",
};

export default function ToolPage() {
  return <ToolClient />;
}

// _client.tsx - Client Component (Logic, Interactivity)
("use client");
import { useState } from "react";

export default function ToolClient() {
  const [state, setState] = useState("");

  return <div>{/* Tool UI and logic */}</div>;
}
```

#### 4.2.2 `src/components/` - Components

**Phân loại:**

- `ui/`: Các component cơ bản từ shadcn/ui
- `header/`, `sidebar/`, etc.: Feature-specific components
- `tool-shell/`: Wrapper component cho tools

#### 4.2.3 `src/lib/` - Utilities & Config

**Key files:**

- `utils.ts`: Helper functions (cn for classNames merging)
- `metadata.ts`: SEO metadata generation
- `constants/tools.ts`: Tool definitions & categories
- `i18n/`: Internationalization setup

---

## 5. Hệ thống routing

### 5.1 Route Structure

```
/                              → Redirect to /tools
/tools                         → Tool Explorer (grid view)
/tools/converters/number-to-words    → Number to Words tool
/tools/developer/json-formatter      → JSON Formatter tool
/tools/language/word-counter         → Word Counter tool
/tools/finance/salary-calculator     → Salary Calculator tool
/tools/data/pivot-table              → Pivot Table tool
```

### 5.2 Dynamic Routes

Tất cả tools follow pattern: `/tools/[category]/[tool-name]`

```tsx
// src/app/tools/[category]/[tool]/page.tsx
import { notFound } from "next/navigation";

export default function ToolPage({
  params,
}: {
  params: { category: string; tool: string };
}) {
  // Render tool based on params
}
```

### 5.3 Layouts

#### Root Layout (`src/app/layout.tsx`)

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Tools Layout (`src/app/tools/layout.tsx`)

```tsx
export default function ToolsLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  );
}
```

---

## 6. Hệ thống theming và UI

### 6.1 Color System - Purple/Violet Theme

Project sử dụng **OKLCH color space** cho màu sắc hiện đại và nhất quán.

#### Light Mode

```css
:root {
  --radius: 0.625rem;

  /* Background with subtle purple tint */
  --background: oklch(0.995 0.005 285);
  --foreground: oklch(0.18 0.02 285);

  /* Primary: Vivid Purple */
  --primary: oklch(0.55 0.25 285);
  --primary-foreground: oklch(0.98 0 0);

  /* Accent: Light purple */
  --accent: oklch(0.94 0.04 285);
  --accent-foreground: oklch(0.35 0.15 285);

  /* Border with purple tint */
  --border: oklch(0.92 0.02 285);
  --ring: oklch(0.55 0.25 285);
}
```

#### Dark Mode

```css
.dark {
  --background: oklch(0.14 0.015 285);
  --foreground: oklch(0.95 0.005 285);

  --primary: oklch(0.65 0.25 285);
  --primary-foreground: oklch(0.14 0.015 285);

  --accent: oklch(0.25 0.06 285);
  --accent-foreground: oklch(0.85 0.1 285);

  --border: oklch(0.25 0.02 285);
}
```

### 6.2 Theme Switching

Sử dụng `next-themes`:

```tsx
// components/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

Toggle component:

```tsx
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </button>
  );
}
```

### 6.3 Animations & Effects

#### Glassmorphism

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Glow Effects

```css
.glow-primary {
  box-shadow: 0 0 20px oklch(0.55 0.25 285 / 0.25);
}

.glow-primary-strong {
  box-shadow: 0 0 30px oklch(0.55 0.25 285 / 0.4);
}
```

#### Animations (tw-animate-css)

```tsx
<div className="animate-fadeIn animate-duration-300">
  Content with fade-in animation
</div>

<div className="animate-slideInUp animate-delay-100">
  Slide up with delay
</div>
```

### 6.4 Responsive Design

Tailwind breakpoints:

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

Example usage:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

### 6.5 Accessibility

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
```

---

## 7. Hệ thống đa ngôn ngữ (i18n)

### 7.1 Setup với next-intl

#### Config (`src/lib/i18n/config.ts`)

```typescript
export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  vi: "🇻🇳",
};
```

#### Provider (`src/lib/i18n/locale-provider.tsx`)

```tsx
"use client";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // Load messages for current locale
    import(`@/messages/${locale}.json`).then((module) =>
      setMessages(module.default)
    );
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

### 7.2 Translation Files

#### `src/messages/en.json`

```json
{
  "tools": {
    "numberToWords": {
      "title": "Number to Words",
      "description": "Convert numbers to words",
      "inputLabel": "Enter a number",
      "outputLabel": "Result"
    }
  },
  "common": {
    "copy": "Copy",
    "clear": "Clear",
    "download": "Download"
  }
}
```

#### `src/messages/vi.json`

```json
{
  "tools": {
    "numberToWords": {
      "title": "Chuyển số thành chữ",
      "description": "Chuyển đổi số thành chữ",
      "inputLabel": "Nhập số",
      "outputLabel": "Kết quả"
    }
  },
  "common": {
    "copy": "Sao chép",
    "clear": "Xóa",
    "download": "Tải xuống"
  }
}
```

### 7.3 Sử dụng trong Components

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function NumberToWords() {
  const t = useTranslations("tools.numberToWords");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <input placeholder={t("inputLabel")} />
    </div>
  );
}
```

### 7.4 Language Switcher

```tsx
"use client";
import { useLocale } from "@/lib/i18n";
import { localeNames, localeFlags } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Select value={locale} onValueChange={setLocale}>
      {Object.entries(localeNames).map(([code, name]) => (
        <SelectItem key={code} value={code}>
          {localeFlags[code]} {name}
        </SelectItem>
      ))}
    </Select>
  );
}
```

---

## 8. Xây dựng một Tool mới

### 8.1 Checklist để tạo tool mới

- [ ] Tạo folder structure
- [ ] Viết page.tsx (server component + metadata)
- [ ] Viết \_client.tsx (client component + logic)
- [ ] Thêm tool vào constants
- [ ] Thêm translations (en.json, vi.json)
- [ ] Test functionality
- [ ] Test responsive design
- [ ] Test dark/light mode

### 8.2 Template cơ bản

#### Step 1: Tạo folder

```bash
mkdir -p src/app/tools/converters/my-new-tool
```

#### Step 2: `page.tsx` (Server Component)

```tsx
// src/app/tools/converters/my-new-tool/page.tsx
import { Metadata } from "next";
import { generateToolMetadata } from "@/lib/metadata";
import MyNewToolClient from "./_client";

export const metadata: Metadata = generateToolMetadata({
  title: "My New Tool",
  description: "Description of my new tool for SEO",
  path: "/tools/converters/my-new-tool",
});

export default function MyNewToolPage() {
  return <MyNewToolClient />;
}
```

#### Step 3: `_client.tsx` (Client Component)

```tsx
// src/app/tools/converters/my-new-tool/_client.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MyNewToolClient() {
  const t = useTranslations("tools.myNewTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = () => {
    // Your conversion logic here
    const result = processInput(input);
    setOutput(result);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("inputSection")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="input">{t("inputLabel")}</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConvert} className="flex-1">
                {t("convert")}
              </Button>
              <Button onClick={handleClear} variant="outline">
                {t("clear")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("outputSection")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="output">{t("outputLabel")}</Label>
              <Textarea
                id="output"
                value={output}
                readOnly
                className="min-h-[200px]"
                placeholder={t("outputPlaceholder")}
              />
            </div>

            <Button onClick={handleCopy} variant="outline" className="w-full">
              {t("copy")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional sections: examples, tips, etc. */}
    </div>
  );
}

function processInput(input: string): string {
  // Implement your logic here
  return input.toUpperCase(); // Example
}
```

#### Step 4: Thêm vào constants

```tsx
// src/lib/constants/tools.ts
export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "converters",
    name: "Converters",
    icon: "ArrowRightLeft",
    tools: [
      // ... existing tools
      {
        id: "my-new-tool",
        name: "My New Tool",
        description: "Brief description",
        icon: "Zap", // Lucide icon name
        href: "/tools/converters/my-new-tool",
        category: "converters",
      },
    ],
  },
];
```

#### Step 5: Thêm translations

```json
// src/messages/en.json
{
  "tools": {
    "myNewTool": {
      "title": "My New Tool",
      "description": "Tool description",
      "inputSection": "Input",
      "outputSection": "Output",
      "inputLabel": "Enter value",
      "outputLabel": "Result",
      "inputPlaceholder": "Type here...",
      "outputPlaceholder": "Result will appear here",
      "convert": "Convert",
      "clear": "Clear",
      "copy": "Copy to Clipboard"
    }
  }
}
```

```json
// src/messages/vi.json
{
  "tools": {
    "myNewTool": {
      "title": "Công cụ mới",
      "description": "Mô tả công cụ",
      "inputSection": "Đầu vào",
      "outputSection": "Kết quả",
      "inputLabel": "Nhập giá trị",
      "outputLabel": "Kết quả",
      "inputPlaceholder": "Nhập vào đây...",
      "outputPlaceholder": "Kết quả sẽ hiển thị ở đây",
      "convert": "Chuyển đổi",
      "clear": "Xóa",
      "copy": "Sao chép"
    }
  }
}
```

### 8.3 Advanced Tool Features

#### File Upload

```tsx
const [file, setFile] = useState<File | null>(null);

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const uploadedFile = e.target.files?.[0];
  if (uploadedFile) {
    setFile(uploadedFile);
    // Process file
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processFileContent(content);
    };
    reader.readAsText(uploadedFile);
  }
};

return <Input type="file" accept=".csv,.txt" onChange={handleFileUpload} />;
```

#### Download Result

```tsx
const handleDownload = () => {
  const blob = new Blob([output], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  a.click();
  URL.revokeObjectURL(url);
};
```

#### Real-time Processing với useMemo

```tsx
import { useMemo } from "react";

export default function ToolClient() {
  const [input, setInput] = useState("");

  // Auto-compute result when input changes
  const output = useMemo(() => {
    if (!input) return "";
    return processInput(input);
  }, [input]);

  return <Textarea value={output} readOnly />;
}
```

---

## 9. Components hệ thống

### 9.1 Tool Shell Pattern

Tool Shell là wrapper component cung cấp layout và features chung cho tất cả tools.

```tsx
// components/tool-shell/tool-shell.tsx
interface ToolShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function ToolShell({
  title,
  description,
  children,
  actions,
}: ToolShellProps) {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
}

// Usage
<ToolShell
  title={t("title")}
  description={t("description")}
  actions={
    <>
      <Button onClick={handleClear}>Clear</Button>
      <Button onClick={handleDownload}>Download</Button>
    </>
  }
>
  {/* Tool content */}
</ToolShell>;
```

### 9.2 Sidebar Navigation

```tsx
// components/sidebar/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_CATEGORIES } from "@/lib/constants/tools";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-sidebar">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>

        {TOOL_CATEGORIES.map((category) => (
          <div key={category.id} className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {category.name}
            </h3>

            <ul className="space-y-1">
              {category.tools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      pathname === tool.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

### 9.3 Header với Command Palette

```tsx
// components/header/header.tsx
"use client";

import { useState } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "../language-switcher/language-switcher";

export function Header() {
  const [open, setOpen] = useState(false);

  // Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-6">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span>Search tools...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex">⌘K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}
```

---

## 10. Performance Optimization

### 10.1 Code Splitting & Dynamic Imports

```tsx
// Lazy load heavy components
import dynamic from "next/dynamic";

const PivotTable = dynamic(
  () => import("@/components/pivot-table/VirtualizedPivotTable"),
  { ssr: false, loading: () => <Skeleton /> }
);
```

### 10.2 Memoization

```tsx
import { useMemo, useCallback } from "react";

// Memo expensive calculations
const processedData = useMemo(() => {
  return heavyProcessing(data);
}, [data]);

// Memo callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 10.3 Virtual Scrolling (Pivot Table)

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
  overscan: 10,
});

return (
  <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
    <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div key={virtualRow.index} /* ... */ />
      ))}
    </div>
  </div>
);
```

### 10.4 Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/icon.png"
  alt="Logo"
  width={48}
  height={48}
  priority // For above-the-fold images
/>;
```

---

## 11. Best Practices

### 11.1 TypeScript

```tsx
// Always define types for props
interface ToolProps {
  initialValue?: string;
  onResult?: (result: string) => void;
}

// Use type inference where possible
const [value, setValue] = useState(""); // inferred as string

// Use proper return types
function processData(input: string): ProcessedData {
  // ...
}
```

### 11.2 Error Handling

```tsx
"use client";

export default function ToolClient() {
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    try {
      const result = processInput(input);
      setOutput(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
```

### 11.3 Accessibility

```tsx
// Proper labeling
<Label htmlFor="input">Input Value</Label>
<Input id="input" aria-describedby="input-desc" />
<p id="input-desc" className="text-sm text-muted-foreground">
  Enter a value to convert
</p>

// Keyboard navigation
<button
  onClick={handleAction}
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
  aria-label="Process input"
/>
```

### 11.4 SEO Optimization

```tsx
// Metadata trong page.tsx
export const metadata: Metadata = {
  title: "Tool Name | Tools Platform",
  description: "Detailed description for SEO with keywords",
  keywords: ["tool", "converter", "developer"],
  openGraph: {
    title: "Tool Name",
    description: "Description",
    type: "website",
  },
};
```

### 11.5 Code Organization

```
✅ DO:
- One component per file
- Group related utilities
- Use barrel exports (index.ts)
- Clear naming conventions

❌ DON'T:
- Mix server and client code
- Create overly nested components
- Duplicate logic across tools
```

---

## 12. Deployment

### 12.1 Build & Start

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

### 12.2 Vercel Deployment

#### One-Click Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Automatic Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Deploy automatically on push

### 12.3 Environment Variables

Create `.env.local`:

```bash
# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_id

# Optional: API keys for certain tools
NEXT_PUBLIC_API_KEY=your_api_key
```

### 12.4 Performance Monitoring

```tsx
// app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 📚 Tài liệu tham khảo

### Chính thức

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [TanStack Table](https://tanstack.com/table)
- [next-intl](https://next-intl-docs.vercel.app)

### Utilities

- [Lucide Icons](https://lucide.dev)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [CMDK](https://cmdk.paco.me)

---

## ❓ FAQ & Troubleshooting

### Q: Làm sao thêm icon mới?

A: Tìm icon tại [lucide.dev](https://lucide.dev), import và sử dụng:

```tsx
import { YourIcon } from "lucide-react";
<YourIcon className="h-4 w-4" />;
```

### Q: Tool không hiển thị trong sidebar?

A: Kiểm tra file `src/lib/constants/tools.ts`, đảm bảo tool đã được thêm vào đúng category.

### Q: Lỗi "Text content does not match server-rendered HTML"?

A: Thêm `suppressHydrationWarning` vào tag `<html>` trong root layout.

### Q: Theme không hoạt động?

A: Kiểm tra:

1. ThemeProvider đã wrap root layout?
2. CSS variables đã được define trong globals.css?
3. `attribute="class"` trong ThemeProvider?

### Q: Translations không load?

A: Kiểm tra:

1. File JSON trong `src/messages/`
2. LocaleProvider đã wrap app?
3. Key trong translation file match với code

---

## 🎯 Roadmap & Next Steps

### Tính năng có thể thêm

1. **More Tools**

   - Image converter/compressor
   - QR Code generator
   - Markdown editor
   - CSV to JSON converter

2. **Enhanced Features**

   - Tool history/favorites
   - Share tool results via URL
   - Export/import settings
   - Batch processing

3. **Technical Improvements**

   - PWA support
   - Offline mode
   - Web Workers for heavy processing
   - Better error boundaries

4. **Analytics**
   - Track popular tools
   - Usage statistics
   - Performance metrics

---

## 📝 Kết luận

Tài liệu này cung cấp hướng dẫn toàn diện về cách xây dựng Tools Platform từ đầu hoặc mở rộng project hiện có.

**Key takeaways:**

- ✅ Modern stack: Next.js 16 + React 19 + Tailwind CSS 4
- ✅ Scalable architecture với App Router
- ✅ Beautiful UI với purple theme
- ✅ i18n ready với next-intl
- ✅ Client-side processing for privacy
- ✅ Easy to extend với tool template

Để bắt đầu xây dựng tool mới, follow [Section 8](#8-xây-dựng-một-tool-mới).

---

**Happy coding! 🚀**

_Tài liệu được tạo bởi: Quoc Dat_  
_Ngày cập nhật cuối: January 2026_
