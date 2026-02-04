"use client";

import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  CellStyle,
} from "ag-grid-community";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { PivotConfig, AggregateFunction } from "@/types/pivot-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridPivotTableProps {
  data: Record<string, unknown>[];
  config: PivotConfig;
  onConfigChange?: (config: PivotConfig) => void;
  loading?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

const formatFieldName = (field: string): string => {
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getAggFunc = (aggType: AggregateFunction): string => {
  switch (aggType) {
    case "sum":
      return "sum";
    case "avg":
      return "avg";
    case "count":
      return "count";
    case "min":
      return "min";
    case "max":
      return "max";
    case "first":
      return "first";
    case "last":
      return "last";
    default:
      return "sum";
  }
};

export function AGGridPivotTable({
  data,
  config,
  loading = false,
  className,
  isDarkMode = false,
}: AGGridPivotTableProps) {
  const gridRef = React.useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

  const theme = React.useMemo(() => {
    return themeQuartz.withParams({
      accentColor: isDarkMode ? "#3b82f6" : "#2563eb",
      backgroundColor: isDarkMode ? "#09090b" : "#ffffff",
      foregroundColor: isDarkMode ? "#fafafa" : "#09090b",
      borderColor: isDarkMode ? "#27272a" : "#e4e4e7",
      headerBackgroundColor: isDarkMode ? "#18181b" : "#f4f4f5",
      rowHoverColor: isDarkMode ? "#27272a" : "#f4f4f5",
      selectedRowBackgroundColor: isDarkMode ? "#1e3a5f" : "#dbeafe",
      oddRowBackgroundColor: isDarkMode ? "#09090b" : "#ffffff",
      headerFontSize: 13,
      fontSize: 13,
      rowHeight: 40,
      headerHeight: 44,
      spacing: 4,
      borderRadius: 6,
    });
  }, [isDarkMode]);

  const columnDefs = React.useMemo<ColDef[]>(() => {
    const cols: ColDef[] = [];

    // Add group columns
    for (const groupCol of config.group_by) {
      cols.push({
        field: groupCol,
        headerName: formatFieldName(groupCol),
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      });
    }

    // Add metric columns with aggregation
    const visibleColumns =
      config.visibleColumns !== undefined
        ? config.visibleColumns
        : config.columns;

    for (const column of config.columns) {
      if (config.visibleColumns !== undefined && !visibleColumns.includes(column)) {
        continue;
      }

      const aggFunc = config.aggregates[column]
        ? getAggFunc(config.aggregates[column])
        : "sum";

      const colorConfig = config.columnColors?.[column];

      cols.push({
        field: column,
        headerName: formatFieldName(column),
        aggFunc: aggFunc,
        enableValue: true,
        width: config.columnWidths?.[column] || 150,
        type: "numericColumn",
        valueFormatter: (params) => {
          if (params.value == null) return "";
          if (typeof params.value === "number") {
            return params.value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
          }
          return String(params.value);
        },
        cellStyle: colorConfig
          ? (params): CellStyle | undefined => {
              if (typeof params.value === "number") {
                if (colorConfig.mode === "text") {
                  return { color: colorConfig.color };
                } else if (colorConfig.mode === "background") {
                  return {
                    backgroundColor: `${colorConfig.color}20`,
                    color: colorConfig.color,
                  };
                }
              }
              return undefined;
            }
          : undefined,
      });
    }

    // Add remaining columns that are not in group_by or columns
    const allConfiguredCols = new Set([...config.group_by, ...config.columns]);
    const remainingCols = Object.keys(data[0] || {}).filter(
      (col) => !allConfiguredCols.has(col)
    );

    for (const col of remainingCols) {
      cols.push({
        field: col,
        headerName: formatFieldName(col),
        hide: true,
      });
    }

    return cols;
  }, [config, data]);

  const defaultColDef = React.useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: 100,
    }),
    []
  );

  const autoGroupColumnDef = React.useMemo<ColDef>(
    () => ({
      headerName: config.group_by.map(formatFieldName).join(", ") || "Group",
      minWidth: 250,
      cellRendererParams: {
        suppressCount: false,
      },
    }),
    [config.group_by]
  );

  const onGridReady = React.useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const handleExportCSV = React.useCallback(() => {
    gridApi?.exportDataAsCsv({
      fileName: "pivot-table.csv",
    });
  }, [gridApi]);

  const handleExportExcel = React.useCallback(() => {
    // For Excel export, we'll use CSV as AG Grid community doesn't support Excel export
    gridApi?.exportDataAsCsv({
      fileName: "pivot-table.csv",
    });
  }, [gridApi]);

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
    <div
      className={cn("flex flex-col border rounded-lg overflow-hidden", className)}
    >
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
              Export as Excel (CSV)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* AG Grid */}
      <div className="flex-1" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          theme={theme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          animateRows={true}
          onGridReady={onGridReady}
          suppressAggFuncInHeader={false}
          groupDisplayType="singleColumn"
          rowGroupPanelShow="never"
          grandTotalRow="bottom"
        />
      </div>

      {/* Footer with row count */}
      <div className="flex justify-between items-center px-4 py-2 border-t bg-muted/50 text-sm text-muted-foreground">
        <span>{data.length.toLocaleString()} rows</span>
        <span>{config.columns.length} metric columns</span>
      </div>
    </div>
  );
}
