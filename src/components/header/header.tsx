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
    <header className="sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b border-primary/10 px-4 h-12.5 glass">
      <SidebarTrigger className="-ml-1 hover:bg-accent/80 transition-colors duration-200" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-primary/10" />

      <div className="flex-1">
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-64 md:w-80 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10 transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 text-primary/60" />
          <span>{t("searchPlaceholder")}</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border border-primary/20 bg-accent px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <LanguageSwitcher />

      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent/80 hover:text-primary transition-all duration-200"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-primary" />
        <span className="sr-only">{t("toggleTheme")}</span>
      </Button>

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
                  <span className="ml-2 text-xs text-muted-foreground">
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
