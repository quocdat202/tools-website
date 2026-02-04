"use client";

import * as React from "react";
import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TOOL_CATEGORIES } from "@/lib/constants/tools";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations("common");
  const tCategories = useTranslations("categories");
  const tTools = useTranslations("tools");

  React.useEffect(() => {
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
    <header className="sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b border-border/50 glass px-4 h-13">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" className="h-4 bg-border/50" />

      <div className="flex-1 flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 h-8 w-full max-w-70 rounded-lg border border-border/50 bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-muted hover:border-border transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-[13px]">{t("searchPlaceholder")}</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground/70">
            <span className="text-[11px]">&#8984;</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          {TOOL_CATEGORIES.map((category) => (
            <CommandGroup
              key={category.id}
              heading={tCategories(`${category.id}.name`)}
            >
              {category.tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={tool.name}
                  onSelect={() => {
                    router.push(tool.href);
                    setOpen(false);
                  }}
                >
                  <span>{tTools(`${tool.id}.name`)}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tTools(`${tool.id}.description`)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
