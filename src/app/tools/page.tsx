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
} from "lucide-react";
import { TOOL_CATEGORIES, searchTools, Tool } from "@/lib/constants/tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

export default function ToolExplorerPage() {
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{tExplorer("title")}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {tExplorer("description")}
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {searchQuery.trim() && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            {t("search")} ({filteredTools.length})
          </h2>
          {filteredTools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => {
                const Icon = iconMap[tool.icon] || Table;
                return (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="h-full transition-colors hover:bg-accent">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-base">{tTools(`${tool.id}.name`)}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2">
                          {tTools(`${tool.id}.description`)}
                        </CardDescription>
                        <Badge variant="secondary" className="mt-2">
                          {tCategories(`${tool.category}.name`)}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">{t("noResults")}</p>
          )}
        </div>
      )}

      {!searchQuery.trim() && (
        <div className="flex flex-col gap-8">
          {TOOL_CATEGORIES.map((category) => {
            const CategoryIcon = iconMap[category.icon] || Table;
            return (
              <div key={category.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{tCategories(`${category.id}.name`)}</h2>
                  <Badge variant="outline">{tExplorer("toolsCount", { count: category.tools.length })}</Badge>
                </div>
                <p className="text-muted-foreground">{tCategories(`${category.id}.description`)}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool) => {
                    const Icon = iconMap[tool.icon] || Table;
                    return (
                      <Link key={tool.id} href={tool.href}>
                        <Card className="h-full transition-colors hover:bg-accent">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                              </div>
                              <CardTitle className="text-base">{tTools(`${tool.id}.name`)}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-2">
                              {tTools(`${tool.id}.description`)}
                            </CardDescription>
                          </CardContent>
                        </Card>
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
