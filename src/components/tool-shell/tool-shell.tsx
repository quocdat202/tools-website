"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ToolShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function ToolShell({
  title,
  description,
  children,
  className,
  actions,
}: ToolShellProps) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-8 max-w-6xl animate-fade-in", className)}>
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0 -ml-2 mt-0.5 text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all duration-200 rounded-xl"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 mt-3 sm:mt-0">{actions}</div>}
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface ToolCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolCard({ title, description, children, className }: ToolCardProps) {
  return (
    <Card className={cn("border-border/60 shadow-sm", className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>}
          {description && <CardDescription className="text-[13px]">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? "pt-6" : ""}>
        {children}
      </CardContent>
    </Card>
  );
}

interface ToolGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function ToolGrid({ children, columns = 2, className }: ToolGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 lg:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
