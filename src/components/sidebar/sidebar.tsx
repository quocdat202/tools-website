"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { TOOL_CATEGORIES } from "@/lib/constants/tools";
import {
  ArrowRightLeft,
  ChevronRight,
  Code,
  LayoutGrid,
  Languages,
  Table,
  Wallet,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import toolsLogo from "@/app/tools_logo.png";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRightLeft,
  Code,
  Languages,
  Wallet,
  Table,
};

export function AppSidebar() {
  const pathname = usePathname();
  const tApp = useTranslations("app");
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tTools = useTranslations("tools");

  return (
    <Sidebar className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-accent/80 transition-all duration-200 rounded-xl gap-3"
            >
              <Link href="/tools">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-primary/10 ring-1 ring-primary/20">
                  <Image
                    src={toolsLogo}
                    alt="Tools Logo"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <span className="font-semibold text-foreground tracking-tight text-[15px]">
                    {tApp("name")}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal tracking-wide uppercase">
                    Workspace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-3 px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/tools"}
                  className="hover:bg-accent/80 transition-all duration-200 rounded-lg h-9 font-medium"
                >
                  <Link href="/tools">
                    <LayoutGrid className="h-4 w-4 text-primary/70" />
                    <span>{tNav("explorer")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 my-1.5 h-px bg-border/50" />

        {TOOL_CATEGORIES.map((category) => {
          const Icon = iconMap[category.icon] || Table;
          const hasActiveChild = category.tools.some(
            (tool) => pathname === tool.href
          );

          return (
            <Collapsible
              key={category.id}
              defaultOpen={hasActiveChild}
              className="group/collapsible"
            >
              <SidebarGroup className="py-0.5">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center gap-2.5 hover:bg-accent/60 rounded-lg px-2.5 py-2 transition-all duration-200 text-muted-foreground hover:text-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary/50" />
                    <span className="flex-1 text-left text-[13px] font-medium tracking-tight">
                      {tCategories(`${category.id}.name`)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 opacity-50" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub className="border-l-primary/15">
                      {category.tools.map((tool) => (
                        <SidebarMenuSubItem key={tool.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === tool.href}
                            className="hover:bg-accent/60 transition-all duration-200 rounded-lg text-[13px]"
                          >
                            <Link href={tool.href}>
                              <span>{tTools(`${tool.id}.name`)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
