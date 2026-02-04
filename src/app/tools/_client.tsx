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
  ArrowUpRight,
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
    <div className="flex flex-col gap-10 max-w-6xl animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl border border-border/50 bg-card p-8 overflow-hidden gradient-mesh">
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tExplorer("title")}
          </h1>
          <p className="text-muted-foreground max-w-lg text-[15px] leading-relaxed">
            {tExplorer("description")}
          </p>
          <div className="relative max-w-sm mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-background/80 border-border"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">
              {t("search")}
            </h2>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {filteredTools.length}
            </span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => {
                const Icon = iconMap[tool.icon] || Table;
                return (
                  <Link key={tool.id} href={tool.href}>
                    <div className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card card-hover h-full">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {tTools(`${tool.id}.name`)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tCategories(`${tool.category}.name`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-6 text-center">{t("noResults")}</p>
          )}
        </div>
      )}

      {/* Categories */}
      {!searchQuery.trim() && (
        <div className="flex flex-col gap-12">
          {TOOL_CATEGORIES.map((category, catIdx) => {
            const CategoryIcon = iconMap[category.icon] || Table;
            return (
              <div
                key={category.id}
                className="flex flex-col gap-4 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${catIdx * 0.06}s`, animationFillMode: "forwards" }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {tCategories(`${category.id}.name`)}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {tExplorer("toolsCount", { count: category.tools.length })}
                    </p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool) => {
                    const Icon = iconMap[tool.icon] || Table;
                    return (
                      <Link key={tool.id} href={tool.href}>
                        <div className="group flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-card card-hover h-full">
                          <div className="flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary group-hover:bg-primary/12 transition-colors">
                              <Icon className="h-4 w-4" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all -translate-x-1 group-hover:translate-x-0" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {tTools(`${tool.id}.name`)}
                            </p>
                            <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                              {tTools(`${tool.id}.description`)}
                            </p>
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
