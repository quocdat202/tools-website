# Tools Platform

A modern, feature-rich collection of free online developer tools built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **24+ Tools** across 5 categories
- **Modern UI** with Purple/Violet theme, glassmorphism, and smooth animations
- **Dark/Light Mode** support
- **Internationalization (i18n)** ready with next-intl
- **Responsive Design** - works on desktop, tablet, and mobile
- **Keyboard Shortcuts** - `Cmd/Ctrl + K` for quick search
- **Accessibility** - reduced motion support, ARIA labels

## Tools Categories

### Converters (8 tools)
| Tool | Description |
|------|-------------|
| Number to Words | Convert numbers to words in multiple languages |
| Date Format Converter | Convert dates between different formats |
| Unit Converter | Convert between different units of measurement |
| File Size Converter | Convert between file size units (KB, MB, GB, etc.) |
| Case Converter | Convert text between different cases (camelCase, snake_case, etc.) |
| Base Converter | Convert numbers between different bases (binary, hex, etc.) |
| Color Converter | Convert colors between HEX, RGB, HSL formats |
| Timestamp Converter | Convert between Unix timestamps and dates |

### Developer Tools (6 tools)
| Tool | Description |
|------|-------------|
| JSON Formatter | Format and validate JSON data |
| XML Formatter | Format and validate XML data |
| SQL Formatter | Format SQL queries |
| Regex Tester | Test and debug regular expressions |
| Hash Generator | Generate MD5, SHA-1, SHA-256 hashes |
| JWT Decoder | Decode and inspect JWT tokens |

### Language & Text (4 tools)
| Tool | Description |
|------|-------------|
| Word Counter | Count words, characters, sentences, and paragraphs |
| Vietnamese ⇄ Katakana | Convert between Vietnamese and Katakana |
| Text Diff | Compare two texts and find differences |
| Text Normalizer | Normalize and clean text |

### Finance Tools (3 tools)
| Tool | Description |
|------|-------------|
| Salary Calculator (VN) | Calculate Vietnam salary Gross to Net and vice versa |
| VAT Calculator (VN) | Calculate VAT for Vietnam |
| Currency Converter | Convert between currencies |

### Data Tools (1 tool)
| Tool | Description |
|------|-------------|
| Pivot Table | Create pivot tables from CSV/Excel files |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Data Tables**: [@tanstack/react-table](https://tanstack.com/table)
- **Animations**: tw-animate-css + custom CSS animations
- **Type Safety**: TypeScript 5
- **Validation**: Zod

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles, theme, animations
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to /tools)
│   └── tools/                    # Tools pages
│       ├── _client.tsx           # Tool explorer client component
│       ├── layout.tsx            # Tools layout with sidebar
│       ├── page.tsx              # Tool explorer page
│       └── [category]/[tool]/    # Individual tool pages
│           ├── page.tsx          # Server component with metadata
│           └── _client.tsx       # Client component with logic
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── header/                   # Header with search, theme toggle
│   ├── sidebar/                  # Navigation sidebar
│   ├── tool-shell/               # Reusable tool wrapper components
│   ├── language-switcher/        # Language switcher
│   └── theme-provider.tsx        # Theme provider
│
├── lib/
│   ├── constants/tools.ts        # Tool categories & metadata
│   ├── metadata.ts               # SEO metadata generation
│   ├── i18n/                     # Internationalization config
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── messages/                     # i18n translation files
└── configs/                      # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tools-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## UI/UX Features

### Theme
- **Primary Color**: Purple/Violet (oklch color space)
- **Gradient Backgrounds**: Subtle purple gradient
- **Glassmorphism**: Header and overlays with blur effect
- **Glow Effects**: Buttons and cards on hover

### Animations
- **Fade-in-up**: Staggered animation on page load
- **Hover Effects**: Lift + shadow for cards and buttons
- **Smooth Transitions**: 200-300ms ease-out
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Components
- **Cards**: Hover shadow + border highlight
- **Buttons**: Multiple variants (default, gradient, outline, ghost)
- **Tool Shell**: Consistent wrapper for all tools with back button
- **Sidebar**: Collapsible navigation with categories

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

No environment variables required for basic usage.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library
- [Vercel](https://vercel.com/) for Next.js and hosting
