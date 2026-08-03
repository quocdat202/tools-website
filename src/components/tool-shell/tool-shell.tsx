"use client";

import * as React from "react";
import Link from "next/link";
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
  /** Nhóm công cụ, hiện ở dòng dẫn đường phía trên tiêu đề. */
  category?: string;
}

export function ToolShell({
  title,
  description,
  children,
  className,
  actions,
  category,
}: ToolShellProps) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-8 max-w-5xl animate-fade-in", className)}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {/* Dẫn đường thay cho mỗi nút mũi tên: router.back() phụ thuộc lịch sử
              trình duyệt nên vào thẳng từ Google là bấm xong không biết về đâu. */}
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[13px]">
            <Link
              href="/tools"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Tools
            </Link>
            {category && (
              <>
                <span aria-hidden className="text-muted-foreground/50">
                  /
                </span>
                <span className="text-muted-foreground">{category}</span>
              </>
            )}
          </nav>

          <div className="flex items-start gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="-ml-2 mt-1 h-8 w-8 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Quay lại trang trước"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-[1.75rem] font-semibold text-foreground sm:text-[2rem]">
                {title}
              </h1>
              {description && (
                <p className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}

interface ToolCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Ghi chú phụ ở góc phải tiêu đề (ví dụ: đơn vị, số dòng…). */
  meta?: React.ReactNode;
}

export function ToolCard({ title, description, children, className, meta }: ToolCardProps) {
  return (
    <Card className={cn("border-border/60 shadow-none", className)}>
      {(title || description) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="min-w-0">
            {title && (
              <CardTitle className="text-[15px] font-semibold tracking-[-0.01em]">
                {title}
              </CardTitle>
            )}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {meta && <div className="shrink-0 text-xs text-muted-foreground tabular">{meta}</div>}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? "pt-6" : ""}>{children}</CardContent>
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

interface ToolEmptyProps {
  /** Câu hướng dẫn việc cần làm tiếp. */
  hint: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Chỗ kết quả khi người dùng chưa nhập gì.
 *
 * Trước đây các trang công cụ để trống hẳn nửa dưới màn hình cho tới khi có dữ
 * liệu — nhìn như trang bị lỗi. Khối này giữ chỗ và nói rõ cần làm gì tiếp.
 */
export function ToolEmpty({ hint, icon, className }: ToolEmptyProps) {
  return (
    <div
      className={cn(
        "flex min-h-45 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="text-muted-foreground/60">{icon}</div>}
      <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}
