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
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-accent transition-colors rounded-lg gap-2.5"
            >
              <Link href="/tools">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-primary/10 ring-1 ring-primary/20">
                  <Image
                    src={toolsLogo}
                    alt="Tools Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0 leading-tight">
                  <span className="font-semibold text-foreground text-[14px]">
                    {tApp("name")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/tools"}
                  className="hover:bg-accent transition-colors rounded-lg"
                >
                  <Link href="/tools">
                    <LayoutGrid className="h-4 w-4" />
                    <span>{tNav("explorer")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
              <SidebarGroup className="py-0">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center gap-2 hover:bg-accent rounded-lg px-2 py-1.5 transition-colors text-muted-foreground hover:text-foreground">
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left text-[13px] font-medium">
                      {tCategories(`${category.id}.name`)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenuSub>
                      {category.tools.map((tool) => (
                        <SidebarMenuSubItem key={tool.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === tool.href}
                            className="hover:bg-accent transition-colors rounded-lg text-[13px]"
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
