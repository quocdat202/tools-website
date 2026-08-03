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
import { cn } from "@/lib/utils";

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

  const totalTools = TOOL_CATEGORIES.reduce((n, c) => n + c.tools.length, 0);

  /** Cấp toạ độ con trỏ cho lớp .spotlight vẽ viền sáng theo chuột. */
  const trackPointer = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div className="flex flex-col gap-14 max-w-6xl animate-fade-in">
      {/* Hero: không đóng khung trong thẻ nữa. Khung viền + nền gradient khiến
          phần mở đầu trông như một thẻ nội dung ngang hàng với danh sách bên
          dưới, thay vì là điểm bắt đầu của trang. */}
      <header className="relative -mx-5 -mt-5 overflow-hidden px-5 pb-10 pt-12 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-16 gradient-mesh grain">
        <div className="relative z-10 flex flex-col gap-5">
          <p className="label-eyebrow tabular">
            {tExplorer("tagline", { count: totalTools })}
          </p>
          <h1 className="max-w-[16ch] text-4xl font-semibold text-foreground lg:text-5xl">
            {tExplorer("title")}
          </h1>
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
            {tExplorer("description")}
          </p>
          <div className="relative mt-2 max-w-md">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t("searchPlaceholder")}
              className="h-11 border-border bg-card/80 pl-10 text-[15px] shadow-none backdrop-blur-sm"
            />
          </div>
        </div>
      </header>

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
              <section
                key={category.id}
                aria-labelledby={`cat-${category.id}`}
                className="flex flex-col gap-5 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${catIdx * 0.06}s`, animationFillMode: "forwards" }}
              >
                {/* Tiêu đề nhóm nằm trên một đường kẻ chạy hết chiều ngang —
                    neo thị giác cho từng nhóm, thay vì icon + chữ trôi nổi. */}
                <div className="flex items-baseline gap-4 border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon aria-hidden className="h-4 w-4 text-primary" />
                    <h2
                      id={`cat-${category.id}`}
                      className="text-[15px] font-semibold text-foreground"
                    >
                      {tCategories(`${category.id}.name`)}
                    </h2>
                  </div>
                  <span className="tabular text-xs text-muted-foreground">
                    {tExplorer("toolsCount", { count: category.tools.length })}
                  </span>
                </div>

                {/* Lưới bất đối xứng: công cụ đầu nhóm chiếm ô đôi. Bốn cột đều
                    tăm tắp là bố cục dễ đoán nhất — phá nhịp để mắt có điểm dừng
                    và để công cụ chính của nhóm nổi lên. */}
                <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.tools.map((tool, i) => {
                    const Icon = iconMap[tool.icon] || Table;
                    const featured = i === 0;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        onMouseMove={trackPointer}
                        className={cn(
                          "group relative flex h-full flex-col rounded-xl border border-border/70 bg-card p-4 card-hover spotlight",
                          featured && "sm:col-span-2 sm:p-5"
                        )}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <span
                            aria-hidden
                            className={cn(
                              "icon-box flex items-center justify-center rounded-lg text-primary",
                              featured ? "h-10 w-10" : "h-9 w-9"
                            )}
                          >
                            <Icon className={featured ? "h-[18px] w-[18px]" : "h-4 w-4"} />
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="h-4 w-4 -translate-x-1 text-transparent transition-all duration-200 group-hover:translate-x-0 group-hover:text-muted-foreground"
                          />
                        </div>
                        <p
                          className={cn(
                            "font-medium text-foreground transition-colors group-hover:text-primary",
                            featured ? "text-base" : "text-sm"
                          )}
                        >
                          {tTools(`${tool.id}.name`)}
                        </p>
                        <p
                          className={cn(
                            "mt-1 leading-relaxed text-muted-foreground",
                            featured ? "max-w-[52ch] text-sm" : "line-clamp-2 text-[13px]"
                          )}
                        >
                          {tTools(`${tool.id}.description`)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
