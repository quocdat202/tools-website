import {
  PivotConfig,
  AggregateFunction,
  FilterConfig,
  SortConfig,
} from "@/types/pivot-table";

export interface ProcessedPivotData {
  rows: Record<string, unknown>[];
  groupedRows: GroupedRow[];
  splitCombinations: string[];
}

export interface GroupedRow {
  __ROW_PATH__: string[];
  __ROW_LEVEL__: number;
  __IS_EXPANDED__: boolean;
  __CHILDREN_COUNT__: number;
  __IS_TOTAL__: boolean;
  [key: string]: unknown;
}

function applyFilters(
  data: Record<string, unknown>[],
  filters: FilterConfig[]
): Record<string, unknown>[] {
  if (!filters || filters.length === 0) return data;

  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.column];
      const filterValue = filter.value;

      switch (filter.operator) {
        case "equals":
          return value === filterValue;
        case "contains":
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case "gt":
          return Number(value) > Number(filterValue);
        case "lt":
          return Number(value) < Number(filterValue);
        case "gte":
          return Number(value) >= Number(filterValue);
        case "lte":
          return Number(value) <= Number(filterValue);
        default:
          return true;
      }
    });
  });
}

function applySort(
  data: Record<string, unknown>[],
  sort: SortConfig[]
): Record<string, unknown>[] {
  if (!sort || sort.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const s of sort) {
      const aVal = a[s.column];
      const bVal = b[s.column];

      let comparison = 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      if (comparison !== 0) {
        return s.direction === "asc" ? comparison : -comparison;
      }
    }
    return 0;
  });
}

function aggregate(
  values: unknown[],
  func: AggregateFunction
): number | string | null {
  const numbers = values
    .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)))
    .map(Number);

  switch (func) {
    case "sum":
      return numbers.reduce((a, b) => a + b, 0);
    case "avg":
      return numbers.length > 0
        ? numbers.reduce((a, b) => a + b, 0) / numbers.length
        : 0;
    case "count":
      return values.length;
    case "min":
      return numbers.length > 0 ? Math.min(...numbers) : 0;
    case "max":
      return numbers.length > 0 ? Math.max(...numbers) : 0;
    case "first":
      return values[0] as string | number | null;
    case "last":
      return values[values.length - 1] as string | number | null;
    case "none":
    default:
      return null;
  }
}

function groupData(
  data: Record<string, unknown>[],
  groupBy: string[],
  columns: string[],
  aggregates: Record<string, AggregateFunction>,
  level: number = 0,
  parentPath: string[] = []
): GroupedRow[] {
  if (groupBy.length === 0 || level >= groupBy.length) {
    // Leaf level - return aggregated row
    const aggregatedRow: GroupedRow = {
      __ROW_PATH__: parentPath,
      __ROW_LEVEL__: level,
      __IS_EXPANDED__: false,
      __CHILDREN_COUNT__: data.length,
      __IS_TOTAL__: false,
    };

    for (const col of columns) {
      const func = aggregates[col] || "sum";
      const values = data.map((row) => row[col]);
      aggregatedRow[col] = aggregate(values, func);
    }

    return [aggregatedRow];
  }

  const groupColumn = groupBy[level];
  const groups = new Map<string, Record<string, unknown>[]>();

  for (const row of data) {
    const key = String(row[groupColumn] ?? "");
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  }

  const result: GroupedRow[] = [];

  // Sort groups alphabetically
  const sortedKeys = Array.from(groups.keys()).sort();

  for (const key of sortedKeys) {
    const groupItems = groups.get(key)!;
    const path = [...parentPath, key];

    // Create group header row
    const groupRow: GroupedRow = {
      __ROW_PATH__: path,
      __ROW_LEVEL__: level,
      __IS_EXPANDED__: true,
      __CHILDREN_COUNT__: groupItems.length,
      __IS_TOTAL__: false,
      [groupColumn]: key,
    };

    // Calculate aggregates for this group
    for (const col of columns) {
      const func = aggregates[col] || "sum";
      const values = groupItems.map((row) => row[col]);
      groupRow[col] = aggregate(values, func);
    }

    result.push(groupRow);

    // Recursively process child groups
    const childRows = groupData(
      groupItems,
      groupBy,
      columns,
      aggregates,
      level + 1,
      path
    );
    result.push(...childRows);
  }

  return result;
}

function getSplitCombinations(
  data: Record<string, unknown>[],
  splitBy: string[]
): string[] {
  if (splitBy.length === 0) return [];

  const combinations = new Set<string>();

  for (const row of data) {
    const values = splitBy.map((col) => String(row[col] ?? ""));
    combinations.add(values.join("|"));
  }

  return Array.from(combinations).sort();
}

export function processPivotData(
  data: Record<string, unknown>[],
  config: PivotConfig
): ProcessedPivotData {
  // Apply filters
  let processedData = applyFilters(data, config.filters || []);

  // Apply sort
  processedData = applySort(processedData, config.sort || []);

  // Get split combinations
  const splitCombinations = getSplitCombinations(processedData, config.split_by);

  // If no grouping, return flat data
  if (config.group_by.length === 0) {
    return {
      rows: processedData,
      groupedRows: [],
      splitCombinations,
    };
  }

  // Group data
  const groupedRows = groupData(
    processedData,
    config.group_by,
    config.columns,
    config.aggregates
  );

  // Add total row
  const totalRow: GroupedRow = {
    __ROW_PATH__: ["Total"],
    __ROW_LEVEL__: -1,
    __IS_EXPANDED__: true,
    __CHILDREN_COUNT__: processedData.length,
    __IS_TOTAL__: true,
  };

  for (const col of config.columns) {
    const func = config.aggregates[col] || "sum";
    const values = processedData.map((row) => row[col]);
    totalRow[col] = aggregate(values, func);
  }

  return {
    rows: processedData,
    groupedRows: [totalRow, ...groupedRows],
    splitCombinations,
  };
}

export function formatCellValue(
  value: unknown,
  column: string,
  aggregateFunc?: AggregateFunction
): string {
  if (value === null || value === undefined) return "-";

  if (typeof value === "number") {
    // Format based on aggregate function
    if (aggregateFunc === "count") {
      return value.toLocaleString();
    }

    // Check if it's a percentage-like value
    if (column.toLowerCase().includes("rate") || column.toLowerCase().includes("ctr")) {
      return (value * 100).toFixed(2) + "%";
    }

    // Default number formatting
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return String(value);
}

export function formatFieldName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
