"use client";

import * as React from "react";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Header } from "@/components/header/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function ToolsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="relative flex-1 overflow-auto p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
