"use client";

import * as React from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { ToolShell, ToolCard } from "@/components/tool-shell/tool-shell";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { parseFile, detectColumnTypes } from "@/lib/parsers/file-parser";
import { VirtualizedPivotTable } from "@/components/pivot-table/VirtualizedPivotTable";
import { PivotConfigPanel } from "@/components/pivot-table/PivotConfigPanel";
import { PivotConfig, getDefaultPivotConfig } from "@/types/pivot-table";

export default function PivotTableClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [data, setData] = React.useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const [columnTypes, setColumnTypes] = React.useState<
    Record<string, "string" | "number" | "date" | "boolean">
  >({});
  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [config, setConfig] = React.useState<PivotConfig>(getDefaultPivotConfig());

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setLoading(true);
    setErrors([]);

    try {
      const result = await parseFile(selectedFile);

      if (result.errors.length > 0) {
        setErrors(result.errors);
      }

      if (result.data.length > 0) {
        setFile(selectedFile);
        setData(result.data);
        setColumns(result.columns);

        const types = detectColumnTypes(result.data, result.columns);
        setColumnTypes(types);

        // Auto-configure with numeric columns as metrics
        const numericColumns = result.columns.filter(
          (col) => types[col] === "number"
        );
        const stringColumns = result.columns.filter(
          (col) => types[col] === "string"
        );

        const newConfig = getDefaultPivotConfig();
        newConfig.columns = numericColumns.slice(0, 5);
        newConfig.aggregates = {};
        for (const col of numericColumns.slice(0, 5)) {
          newConfig.aggregates[col] = "sum";
        }

        // Auto-select first string column for grouping
        if (stringColumns.length > 0) {
          newConfig.group_by = [stringColumns[0]];
        }

        setConfig(newConfig);
      }
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setColumnTypes({});
    setErrors([]);
    setConfig(getDefaultPivotConfig());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLoadSample = async () => {
    // Create sample data
    const sampleData = [
      { region: "North", product: "Widget A", sales: 1200, quantity: 100, date: "2024-01" },
      { region: "North", product: "Widget B", sales: 800, quantity: 60, date: "2024-01" },
      { region: "South", product: "Widget A", sales: 1500, quantity: 120, date: "2024-01" },
      { region: "South", product: "Widget B", sales: 950, quantity: 75, date: "2024-01" },
      { region: "East", product: "Widget A", sales: 1100, quantity: 90, date: "2024-01" },
      { region: "East", product: "Widget B", sales: 700, quantity: 55, date: "2024-01" },
      { region: "West", product: "Widget A", sales: 1300, quantity: 105, date: "2024-01" },
      { region: "West", product: "Widget B", sales: 850, quantity: 65, date: "2024-01" },
      { region: "North", product: "Widget A", sales: 1400, quantity: 115, date: "2024-02" },
      { region: "North", product: "Widget B", sales: 900, quantity: 70, date: "2024-02" },
      { region: "South", product: "Widget A", sales: 1600, quantity: 130, date: "2024-02" },
      { region: "South", product: "Widget B", sales: 1000, quantity: 80, date: "2024-02" },
      { region: "East", product: "Widget A", sales: 1250, quantity: 100, date: "2024-02" },
      { region: "East", product: "Widget B", sales: 750, quantity: 60, date: "2024-02" },
      { region: "West", product: "Widget A", sales: 1450, quantity: 118, date: "2024-02" },
      { region: "West", product: "Widget B", sales: 900, quantity: 72, date: "2024-02" },
    ];

    const sampleColumns = ["region", "product", "sales", "quantity", "date"];
    const sampleTypes = {
      region: "string" as const,
      product: "string" as const,
      sales: "number" as const,
      quantity: "number" as const,
      date: "string" as const,
    };

    setData(sampleData);
    setColumns(sampleColumns);
    setColumnTypes(sampleTypes);
    setFile({ name: "sample-data.csv" } as File);

    setConfig({
      ...getDefaultPivotConfig(),
      group_by: ["region"],
      columns: ["sales", "quantity"],
      aggregates: { sales: "sum", quantity: "sum" },
    });
  };

  return (
    <ToolShell
      title="Pivot Table"
      description="Create pivot tables from CSV or Excel files. All processing happens in your browser."
      actions={
        file && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <FileSpreadsheet className="h-3 w-3" />
              {file.name}
            </Badge>
            <Badge variant="outline">
              {data.length.toLocaleString()} rows
            </Badge>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        )
      }
    >
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {errors.map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {!file ? (
        <div className="space-y-6">
          <ToolCard>
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors hover:border-primary cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">
                Drop your file here or click to browse
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Supports CSV and Excel files (.csv, .xlsx, .xls)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    handleFileSelect(selectedFile);
                  }
                }}
              />
            </div>
          </ToolCard>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleLoadSample}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Load Sample Data
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <PivotConfigPanel
              availableColumns={columns}
              columnTypes={columnTypes}
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          <VirtualizedPivotTable
            data={data}
            config={config}
            onConfigChange={setConfig}
            loading={loading}
          />
        </div>
      )}
    </ToolShell>
  );
}
