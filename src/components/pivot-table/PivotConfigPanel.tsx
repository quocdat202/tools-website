"use client";

import * as React from "react";
import { X, GripVertical } from "lucide-react";
import { PivotConfig, AggregateFunction } from "@/types/pivot-table";
import { formatFieldName } from "./PivotDataProcessor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PivotConfigPanelProps {
  availableColumns: string[];
  columnTypes: Record<string, string>;
  config: PivotConfig;
  onConfigChange: (config: PivotConfig) => void;
}

const AGGREGATE_FUNCTIONS: { value: AggregateFunction; label: string }[] = [
  { value: "sum", label: "Sum" },
  { value: "avg", label: "Average" },
  { value: "count", label: "Count" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
  { value: "first", label: "First" },
  { value: "last", label: "Last" },
  { value: "none", label: "None" },
];

interface SortableColumnProps {
  id: string;
  onRemove: () => void;
}

function SortableColumn({ id, onRemove }: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-background px-2 py-1"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm flex-1">{formatFieldName(id)}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function PivotConfigPanel({
  availableColumns,
  columnTypes,
  config,
  onConfigChange,
}: PivotConfigPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddToGroupBy = (column: string) => {
    if (!config.group_by.includes(column)) {
      onConfigChange({
        ...config,
        group_by: [...config.group_by, column],
      });
    }
  };

  const handleRemoveFromGroupBy = (column: string) => {
    onConfigChange({
      ...config,
      group_by: config.group_by.filter((c) => c !== column),
    });
  };

  const handleAddToSplitBy = (column: string) => {
    if (!config.split_by.includes(column)) {
      onConfigChange({
        ...config,
        split_by: [...config.split_by, column],
      });
    }
  };

  const handleRemoveFromSplitBy = (column: string) => {
    onConfigChange({
      ...config,
      split_by: config.split_by.filter((c) => c !== column),
    });
  };

  const handleAddMetric = (column: string) => {
    if (!config.columns.includes(column)) {
      onConfigChange({
        ...config,
        columns: [...config.columns, column],
        aggregates: {
          ...config.aggregates,
          [column]: columnTypes[column] === "number" ? "sum" : "count",
        },
      });
    }
  };

  const handleRemoveMetric = (column: string) => {
    const newAggregates = { ...config.aggregates };
    delete newAggregates[column];

    onConfigChange({
      ...config,
      columns: config.columns.filter((c) => c !== column),
      aggregates: newAggregates,
    });
  };

  const handleAggregateChange = (column: string, func: AggregateFunction) => {
    onConfigChange({
      ...config,
      aggregates: {
        ...config.aggregates,
        [column]: func,
      },
    });
  };

  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    const currentVisible = config.visibleColumns ?? availableColumns;
    const newVisible = visible
      ? [...currentVisible, column]
      : currentVisible.filter((c) => c !== column);

    onConfigChange({
      ...config,
      visibleColumns: newVisible,
    });
  };

  const handleGroupByDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = config.group_by.indexOf(active.id as string);
      const newIndex = config.group_by.indexOf(over.id as string);
      onConfigChange({
        ...config,
        group_by: arrayMove(config.group_by, oldIndex, newIndex),
      });
    }
  };

  const handleSplitByDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = config.split_by.indexOf(active.id as string);
      const newIndex = config.split_by.indexOf(over.id as string);
      onConfigChange({
        ...config,
        split_by: arrayMove(config.split_by, oldIndex, newIndex),
      });
    }
  };

  const usedColumns = new Set([
    ...config.group_by,
    ...config.split_by,
    ...config.columns,
  ]);

  const unusedColumns = availableColumns.filter((col) => !usedColumns.has(col));
  const numericColumns = availableColumns.filter(
    (col) => columnTypes[col] === "number"
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-4 mt-4">
            {/* Group By */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Group By (Rows)
                <Badge variant="secondary">{config.group_by.length}</Badge>
              </Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleGroupByDragEnd}
              >
                <SortableContext
                  items={config.group_by}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {config.group_by.map((col) => (
                      <SortableColumn
                        key={col}
                        id={col}
                        onRemove={() => handleRemoveFromGroupBy(col)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Select onValueChange={handleAddToGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Add column..." />
                </SelectTrigger>
                <SelectContent>
                  {unusedColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {formatFieldName(col)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Split By */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Split By (Columns)
                <Badge variant="secondary">{config.split_by.length}</Badge>
              </Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSplitByDragEnd}
              >
                <SortableContext
                  items={config.split_by}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {config.split_by.map((col) => (
                      <SortableColumn
                        key={col}
                        id={col}
                        onRemove={() => handleRemoveFromSplitBy(col)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Select onValueChange={handleAddToSplitBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Add column..." />
                </SelectTrigger>
                <SelectContent>
                  {unusedColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {formatFieldName(col)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Metrics
                <Badge variant="secondary">{config.columns.length}</Badge>
              </Label>

              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-4">
                  {config.columns.map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <span className="text-sm flex-1">
                        {formatFieldName(col)}
                      </span>
                      <Select
                        value={config.aggregates[col] || "sum"}
                        onValueChange={(value) =>
                          handleAggregateChange(col, value as AggregateFunction)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AGGREGATE_FUNCTIONS.map((func) => (
                            <SelectItem key={func.value} value={func.value}>
                              {func.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveMetric(col)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Select onValueChange={handleAddMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Add metric..." />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns
                    .filter((col) => !config.columns.includes(col))
                    .map((col) => (
                      <SelectItem key={col} value={col}>
                        {formatFieldName(col)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="columns" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Visible Columns</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        visibleColumns: availableColumns,
                      })
                    }
                  >
                    Show All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onConfigChange({ ...config, visibleColumns: [] })
                    }
                  >
                    Hide All
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[250px]">
                <div className="space-y-2 pr-4">
                  {availableColumns.map((col) => {
                    const isVisible =
                      config.visibleColumns === undefined ||
                      config.visibleColumns.includes(col);

                    return (
                      <div
                        key={col}
                        className="flex items-center space-x-2 rounded-md border p-2"
                      >
                        <Checkbox
                          id={`col-${col}`}
                          checked={isVisible}
                          onCheckedChange={(checked) =>
                            handleColumnVisibilityChange(col, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`col-${col}`}
                          className="flex-1 text-sm font-normal cursor-pointer"
                        >
                          {formatFieldName(col)}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {columnTypes[col] || "unknown"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
