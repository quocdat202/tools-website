"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight, ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { PivotConfig, AggregateFunction } from "@/types/pivot-table";
import {
  processPivotData,
  formatCellValue,
  formatFieldName,
  GroupedRow,
} from "./PivotDataProcessor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 45;

interface VirtualizedPivotTableProps {
  data: Record<string, unknown>[];
  config: PivotConfig;
  onConfigChange?: (config: PivotConfig) => void;
  loading?: boolean;
  className?: string;
}

export function VirtualizedPivotTable({
  data,
  config,
  onConfigChange,
  loading = false,
  className,
}: VirtualizedPivotTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const parentRef = React.useRef<HTMLDivElement>(null);

  const processedData = React.useMemo(() => {
    return processPivotData(data, config);
  }, [data, config]);

  const toggleRowExpansion = (rowPath: string[]) => {
    const key = rowPath.join("|");
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const isRowExpanded = (rowPath: string[]) => {
    return expandedRows.has(rowPath.join("|"));
  };

  const visibleGroupedRows = React.useMemo(() => {
    if (processedData.groupedRows.length === 0) return [];

    const result: GroupedRow[] = [];
    const expandedPaths = new Set<string>();

    // Always expand first level (total)
    expandedPaths.add("Total");

    // Build expanded paths set
    for (const path of expandedRows) {
      expandedPaths.add(path);
    }

    for (const row of processedData.groupedRows) {
      const pathKey = row.__ROW_PATH__.join("|");
      const parentPath = row.__ROW_PATH__.slice(0, -1).join("|");

      // Show if it's a top-level row or parent is expanded
      if (
        row.__ROW_LEVEL__ <= 0 ||
        parentPath === "" ||
        expandedPaths.has(parentPath)
      ) {
        result.push(row);
      }
    }

    return result;
  }, [processedData.groupedRows, expandedRows]);

  const columns = React.useMemo<ColumnDef<GroupedRow | Record<string, unknown>>[]>(() => {
    const cols: ColumnDef<GroupedRow | Record<string, unknown>>[] = [];

    if (config.group_by.length > 0) {
      // Group column with expand/collapse
      const groupByHeader = config.group_by.map(formatFieldName).join(", ");

      cols.push({
        id: "__ROW_PATH__",
        header: groupByHeader,
        size: 350,
        minSize: 150,
        maxSize: 1000,
        cell: ({ row }) => {
          const rowData = row.original as GroupedRow;
          const level = rowData.__ROW_LEVEL__ ?? 0;
          const path = rowData.__ROW_PATH__ ?? [];
          const hasChildren = level < config.group_by.length - 1;
          const isExpanded = isRowExpanded(path);
          const isTotalRow = rowData.__IS_TOTAL__;

          return (
            <div
              className={cn(
                "flex items-center gap-1",
                isTotalRow && "font-bold"
              )}
              style={{ paddingLeft: `${Math.max(0, level) * 20}px` }}
            >
              {hasChildren && !isTotalRow && (
                <button
                  onClick={() => toggleRowExpansion(path)}
                  className="p-0.5 hover:bg-accent rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <span className={cn(!hasChildren && !isTotalRow && "ml-5")}>
                {isTotalRow ? "Total" : path[path.length - 1]}
              </span>
              {!isTotalRow && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({rowData.__CHILDREN_COUNT__})
                </span>
              )}
            </div>
          );
        },
      });
    }

    // Add metric columns
    const visibleColumns =
      config.visibleColumns !== undefined
        ? config.visibleColumns
        : config.columns;

    for (const column of config.columns) {
      if (config.visibleColumns !== undefined && !visibleColumns.includes(column)) {
        continue;
      }

      const aggregateFunc = config.aggregates[column];
      const colorConfig = config.columnColors?.[column];

      cols.push({
        id: column,
        header: formatFieldName(column),
        size: config.columnWidths?.[column] || 200,
        minSize: 50,
        maxSize: 1000,
        cell: ({ row }) => {
          const value = row.original[column];
          const formatted = formatCellValue(value, column, aggregateFunc);

          let style: React.CSSProperties = {};
          if (colorConfig && typeof value === "number") {
            if (colorConfig.mode === "text") {
              style.color = colorConfig.color;
            } else if (colorConfig.mode === "background") {
              style.backgroundColor = `${colorConfig.color}20`;
              style.color = colorConfig.color;
            }
          }

          return (
            <div className="text-right font-mono" style={style}>
              {formatted}
            </div>
          );
        },
      });
    }

    return cols;
  }, [config, expandedRows]);

  const tableData = React.useMemo(() => {
    if (config.group_by.length > 0) {
      return visibleGroupedRows;
    }
    return processedData.rows;
  }, [config.group_by.length, visibleGroupedRows, processedData.rows]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleExportCSV = () => {
    const headers = columns.map((col) => col.header as string);
    const csvData = tableData.map((row) => {
      return columns.map((col) => {
        const value = row[col.id as string];
        return value ?? "";
      });
    });

    const csv = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pivot-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const headers = columns.map((col) => col.header as string);
    const excelData = tableData.map((row) => {
      const rowData: Record<string, unknown> = {};
      columns.forEach((col) => {
        rowData[col.header as string] = row[col.id as string] ?? "";
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(excelData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pivot Table");
    XLSX.writeFile(wb, "pivot-table.xlsx");
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-muted-foreground">No data to display</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col border rounded-lg overflow-hidden", className)}>
      {/* Export buttons */}
      <div className="flex justify-end gap-2 p-2 border-b bg-muted/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCSV}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header */}
      <div className="border-b bg-muted/50">
        {headerGroups.map((headerGroup) => (
          <div key={headerGroup.id} className="flex" style={{ height: HEADER_HEIGHT }}>
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="flex items-center px-4 font-medium border-r"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Virtualized body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: Math.min(rows.length * ROW_HEIGHT, 600) }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isGrouped = config.group_by.length > 0;
            const rowData = row.original as GroupedRow;
            const isTotalRow = isGrouped && rowData.__IS_TOTAL__;

            return (
              <div
                key={row.id}
                className={cn(
                  "flex border-b hover:bg-accent/50 absolute top-0 left-0 w-full",
                  isTotalRow && "bg-muted font-semibold"
                )}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center px-4 border-r"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with row count */}
      <div className="flex justify-between items-center px-4 py-2 border-t bg-muted/50 text-sm text-muted-foreground">
        <span>
          {tableData.length.toLocaleString()} rows
          {config.group_by.length > 0 && ` (${data.length.toLocaleString()} total)`}
        </span>
        <span>
          {columns.length} columns
        </span>
      </div>
    </div>
  );
}
