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
      {/* Người dùng bàn phím không phải tab qua toàn bộ menu mới tới nội dung. */}
      <a
        href="#tool-content"
        className="skip-link rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Bỏ qua điều hướng
      </a>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main id="tool-content" className="flex-1 overflow-auto p-5 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
