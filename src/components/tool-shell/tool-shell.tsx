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
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0 -ml-2 mt-0.5 hover:bg-accent/80 hover:text-primary transition-all duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>{children}</div>
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
    <Card className={cn("", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
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
        "grid gap-6",
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
