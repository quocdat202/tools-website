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
    <Sidebar>
      <SidebarHeader className="border-b border-primary/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-accent/80 transition-colors duration-200"
            >
              <Link href="/tools">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src={toolsLogo}
                    alt="Tools Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold gradient-text">
                    {tApp("name")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/tools"}>
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
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Icon className="h-4 w-4 text-primary/70" />
                    <span className="flex-1 text-left text-sm">
                      {tCategories(`${category.id}.name`)}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                          >
                            <Link href={tool.href}>
                              {tTools(`${tool.id}.name`)}
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
