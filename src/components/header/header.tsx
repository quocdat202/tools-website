"use client";

import * as React from "react";
import { Search, Moon, Sun, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-50 flex shrink-0 items-center gap-3 border-b border-border/60 glass px-4 h-14">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200 rounded-lg" />

      <div className="h-4 w-px bg-border/60" />

      <div className="flex-1">
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-72 md:w-80 border-border/60 bg-background/50 hover:bg-accent/60 hover:border-primary/20 transition-all duration-200 rounded-lg"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-3.5 w-3.5 text-primary/60" />
          <span className="font-normal">{t("searchPlaceholder")}</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded-md border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>
      </div>

      <LanguageSwitcher />

      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-primary hover:bg-accent/80 transition-all duration-200 rounded-lg"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
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
                  className="rounded-lg"
                >
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-primary/50" />
                  <span className="font-medium">{tTools(`${tool.id}.name`)}</span>
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
