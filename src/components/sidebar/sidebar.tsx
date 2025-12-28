"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRightLeft,
  Code,
  Languages,
  Wallet,
  Table,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_CATEGORIES } from "@/lib/constants/tools";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRightLeft,
  Code,
  Languages,
  Wallet,
  Table,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = React.useState<string[]>([]);
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tTools = useTranslations("tools");

  React.useEffect(() => {
    const currentCategory = TOOL_CATEGORIES.find((cat) =>
      cat.tools.some((tool) => pathname === tool.href)
    );
    if (currentCategory && !openCategories.includes(currentCategory.id)) {
      setOpenCategories((prev) => [...prev, currentCategory.id]);
    }
  }, [pathname, openCategories]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/tools" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <span>Tools Platform</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Link
            href="/tools"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/tools"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            {tNav("explorer")}
          </Link>
        </div>
        <div className="mt-4 space-y-1">
          {TOOL_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || Table;
            const isOpen = openCategories.includes(category.id);
            const hasActiveChild = category.tools.some(
              (tool) => pathname === tool.href
            );

            return (
              <Collapsible
                key={category.id}
                open={isOpen}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    hasActiveChild
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {tCategories(`${category.id}.name`)}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4">
                  <div className="mt-1 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === tool.href
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {tTools(`${tool.id}.name`)}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
