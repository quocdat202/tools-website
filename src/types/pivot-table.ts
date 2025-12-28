export type AggregateFunction =
  | "sum"
  | "avg"
  | "count"
  | "min"
  | "max"
  | "first"
  | "last"
  | "none";

export interface ColumnColorConfig {
  mode: "text" | "background";
  color: string;
}

export interface FilterConfig {
  column: string;
  operator: "equals" | "contains" | "gt" | "lt" | "gte" | "lte";
  value: unknown;
}

export interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

export interface PivotConfig {
  group_by: string[];
  split_by: string[];
  columns: string[];
  aggregates: Record<string, AggregateFunction>;
  filters?: FilterConfig[];
  sort?: SortConfig[];
  visibleColumns?: string[];
  columnColors?: Record<string, ColumnColorConfig>;
  columnOrder?: string[];
  columnWidths?: Record<string, number>;
  pinnedColumnsCount?: number;
  metricsOrder?: string[];
}

export interface PivotSettingsResponse {
  group_by: string[];
  split_by: string[];
  metrics: string[];
  aggregates: Record<string, AggregateFunction>;
  filters: FilterConfig[];
  sort: SortConfig[];
  visible_columns: string[];
  column_colors: Record<string, ColumnColorConfig>;
  column_order: string[];
  column_widths: Record<string, number>;
  pinned_columns_count: number;
}

export interface PivotData {
  rows: Record<string, unknown>[];
  columns: string[];
  groupedData?: GroupedRow[];
}

export interface GroupedRow {
  __ROW_PATH__: string[];
  __ROW_LEVEL__: number;
  __IS_EXPANDED__: boolean;
  __CHILDREN_COUNT__: number;
  [key: string]: unknown;
}

export interface ColumnSchema {
  name: string;
  type: "string" | "number" | "date" | "boolean" | "unknown";
  nullable: boolean;
  uniqueValues?: number;
  minValue?: number | string | Date;
  maxValue?: number | string | Date;
}

export interface DataSchema {
  columns: ColumnSchema[];
  rowCount: number;
}

export const convertApiToPivotConfig = (
  response: PivotSettingsResponse
): PivotConfig => {
  return {
    group_by: response.group_by,
    split_by: response.split_by,
    columns: response.metrics,
    aggregates: response.aggregates,
    filters: response.filters,
    sort: response.sort,
    visibleColumns: response.visible_columns,
    columnColors: response.column_colors,
    columnOrder: response.column_order,
    columnWidths: response.column_widths,
    pinnedColumnsCount: response.pinned_columns_count,
  };
};

export const convertPivotConfigToApi = (
  config: PivotConfig
): PivotSettingsResponse => {
  return {
    group_by: config.group_by,
    split_by: config.split_by,
    metrics: config.columns,
    aggregates: config.aggregates,
    filters: config.filters || [],
    sort: config.sort || [],
    visible_columns: config.visibleColumns || [],
    column_colors: config.columnColors || {},
    column_order: config.columnOrder || [],
    column_widths: config.columnWidths || {},
    pinned_columns_count: config.pinnedColumnsCount || 0,
  };
};

export const getDefaultPivotConfig = (): PivotConfig => {
  return {
    group_by: [],
    split_by: [],
    columns: [],
    aggregates: {},
    filters: [],
    sort: [],
    visibleColumns: undefined,
    columnColors: {},
    columnOrder: [],
    columnWidths: {},
    pinnedColumnsCount: 0,
    metricsOrder: [],
  };
};
