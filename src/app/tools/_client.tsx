"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRightLeft,
  Code,
  Languages,
  Wallet,
  Table,
  Hash,
  Calendar,
  Scale,
  HardDrive,
  CaseSensitive,
  Binary,
  Palette,
  Clock,
  Braces,
  FileCode,
  Database,
  Regex,
  KeyRound,
  ShieldCheck,
  FileText,
  GitCompare,
  Eraser,
  Calculator,
  Receipt,
  DollarSign,
  Table2,
  Search,
  ArrowRight,
} from "lucide-react";
import { TOOL_CATEGORIES, searchTools, Tool } from "@/lib/constants/tools";
import { Input } from "@/components/ui/input";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRightLeft,
  Code,
  Languages,
  Wallet,
  Table,
  Hash,
  Calendar,
  Scale,
  HardDrive,
  CaseSensitive,
  Binary,
  Palette,
  Clock,
  Braces,
  FileCode,
  Database,
  Regex,
  KeyRound,
  ShieldCheck,
  FileText,
  GitCompare,
  Eraser,
  Calculator,
  Receipt,
  DollarSign,
  Table2,
};

export default function ToolExplorerClient() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredTools, setFilteredTools] = React.useState<Tool[]>([]);
  const t = useTranslations("common");
  const tExplorer = useTranslations("explorer");
  const tCategories = useTranslations("categories");
  const tTools = useTranslations("tools");

  React.useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredTools(searchTools(searchQuery));
    } else {
      setFilteredTools([]);
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-12 max-w-6xl animate-fade-in">
      {/* Hero Section */}
      <div className="flex flex-col gap-5 relative">
        <div className="flex items-center gap-2 text-primary/70 text-sm font-medium tracking-wide uppercase">
          <div className="w-8 h-px bg-primary/40" />
          Toolkit
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-[1.1]">
          {tExplorer("title")}
        </h1>
        <p className="text-muted-foreground max-w-lg text-[15px] leading-relaxed">
          {tExplorer("description")}
        </p>
        <div className="relative max-w-sm mt-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border/60 focus:border-primary/40 focus:ring-primary/10 transition-all duration-200 rounded-xl text-[14px] shadow-sm"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="flex flex-col gap-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {t("search")}
            </h2>
            <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              {filteredTools.length}
            </span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => {
                const Icon = iconMap[tool.icon] || Table;
                return (
                  <Link key={tool.id} href={tool.href}>
                    <div className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-border/60 bg-card card-hover h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10 group-hover:bg-primary/12 group-hover:ring-primary/20 transition-all duration-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                          {tTools(`${tool.id}.name`)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {tCategories(`${tool.category}.name`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm py-8 text-center bg-muted/30 rounded-xl border border-border/40">
              {t("noResults")}
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {!searchQuery.trim() && (
        <div className="flex flex-col gap-14">
          {TOOL_CATEGORIES.map((category, catIdx) => {
            const CategoryIcon = iconMap[category.icon] || Table;
            return (
              <div
                key={category.id}
                className="flex flex-col gap-5 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${catIdx * 0.08}s`, animationFillMode: "forwards" }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10">
                    <CategoryIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground tracking-tight">
                      {tCategories(`${category.id}.name`)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {tExplorer("toolsCount", { count: category.tools.length })}
                    </p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool) => {
                    const Icon = iconMap[tool.icon] || Table;
                    return (
                      <Link key={tool.id} href={tool.href}>
                        <div className="group relative flex flex-col gap-3.5 p-4.5 rounded-xl border border-border/60 bg-card card-hover h-full overflow-hidden">
                          {/* Subtle corner accent */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-primary/4 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="flex items-center gap-3.5 relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10 group-hover:bg-primary/12 group-hover:ring-primary/20 group-hover:scale-105 transition-all duration-300">
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {tTools(`${tool.id}.name`)}
                            </p>
                          </div>
                          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed relative">
                            {tTools(`${tool.id}.description`)}
                          </p>

                          {/* Arrow indicator on hover */}
                          <div className="flex items-center gap-1 text-primary/0 group-hover:text-primary/70 transition-all duration-300 text-xs font-medium mt-auto">
                            <span className="translate-x-0 group-hover:translate-x-0 transition-transform duration-300">Open</span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
