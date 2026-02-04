# Pivot Table Component Documentation

**Version:** 2.1
**Last Updated:** 2026-01-06

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Components](#3-components)
4. [Configuration (PivotConfig)](#4-configuration-pivotconfig)
5. [Data Processing](#5-data-processing)
6. [Features](#6-features)
7. [View Modes](#7-view-modes)
8. [Column Filtering](#8-column-filtering)
9. [Settings Management](#9-settings-management)
10. [API Integration](#10-api-integration)
11. [Usage Examples](#11-usage-examples)
12. [Styling & Formatting](#12-styling--formatting)
13. [Export Functionality](#13-export-functionality)
14. [Field Name Mappings](#14-field-name-mappings)

---

## 1. Overview

Pivot Table is a powerful data visualization component that allows users to:

- **Switch view modes** between flat table and pivot table
- **Group data** by dimensions (row pivoting)
- **Aggregate metrics** using various functions (sum, avg, count, etc.)
- **Sort and filter** data interactively
- **Filter by dimension** in group_by column with autocomplete
- **Customize column** visibility, order, colors, and formats
- **Export data** to multiple formats (JSON, CSV, Excel)
- **Virtualize rendering** for large datasets (react-window)
- **Reset settings** to initial state
- **Copy data** to clipboard
- **Pin columns** to the left for horizontal scrolling
- **Fullscreen mode** with ESC key support

### Tech Stack

- **React 19** + TypeScript
- **@tanstack/react-table** - Table state management
- **react-window** - Virtualized rendering
- **@dnd-kit** - Drag and drop
- **xlsx** + **papaparse** - Export utilities
- **Ant Design** - UI components

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PivotTable                               │
│  (src/pages/PivotTable/index.tsx)                               │
│  - Wrapper component                                             │
│  - Manages data state & settings                                 │
│  - Handles reset functionality                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VirtualizedPivotTable                         │
│  (src/components/pivot-table/VirtualizedPivotTable.tsx)         │
│  - Main table rendering with virtualization                      │
│  - Column generation & resizing                                  │
│  - View mode handling (flat/pivot)                               │
│  - Sorting, filtering & expanding                                │
│  - Fixed (pinned) columns support                                │
│  - Fullscreen mode                                               │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ PivotDataProcessor│  │ PivotConfigPanel │  │  ExportButton   │
│ - View mode check│  │ - View mode toggle│  │ - JSON/CSV/Excel│
│ - Filtering      │  │ - Dimensions tab │  │ - Pivot/Raw data│
│ - Grouping       │  │ - Metrics tab    │  │                 │
│ - Aggregation    │  │ - Reset button   │  │                 │
│ - Split by       │  │ - Drag & drop    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│ColumnFilterPopover│
│ - String filters │
│ - Number filters │
│ - Dimension mode │
│ - Autocomplete   │
└─────────────────┘
```

### File Structure

```
src/
├── components/pivot-table/
│   ├── index.ts                    # Barrel exports
│   ├── VirtualizedPivotTable.tsx   # Main virtualized table (70KB)
│   ├── PivotConfigPanel.tsx        # Configuration sidebar (43KB)
│   ├── PivotDataProcessor.ts       # Data transformation (13KB)
│   ├── ColumnFilterPopover.tsx     # Column filtering UI (17KB)
│   ├── DragDropColumnList.tsx      # Dimension selector (10KB)
│   ├── EditableCell.tsx            # Cell editing (2.5KB)
│   ├── ExportButton.tsx            # Export dropdown (3KB)
│   ├── exportUtils.ts              # Export functions (6.4KB)
│   └── helpers.ts                  # Formatting utilities (4.6KB)
│
├── pages/PivotTable/
│   └── index.tsx                   # Wrapper with settings hook
│
├── types/
│   └── pivot-table.ts              # TypeScript interfaces
│
├── hooks/api/
│   └── usePivotSettings.ts         # Settings persistence
│
├── services/
│   └── pivotSettings.ts            # API service
│
├── utils/
│   ├── pivotStorage.ts             # localStorage helpers
│   └── stringUtils.ts              # Field name formatting
│
└── configs/
    └── pivotTableDefaults.ts       # Default configurations (85+ metrics)
```

---

## 3. Components

### 3.1 PivotTable (Wrapper)

**Location:** `src/pages/PivotTable/index.tsx`

Main entry point that connects data, settings, and the virtualized table.

```tsx
interface PivotTableProps {
  pageId?: string                      // Unique ID for settings persistence
  data?: Record<string, unknown>[]     // External data
  loading?: boolean                    // Loading state
  imageMapping?: Record<string, string> // Map values to image URLs
  autoFetchSettings?: boolean          // Auto-fetch from API
  apiMetrics?: string[]                // Available metrics from API
  availableDimensions?: string[]       // Available dimensions
}
```

**Key Features:**
- Manages internal data state
- Syncs with `usePivotSettings` hook for persistence
- Provides `createImageMapping` utility function
- Passes `onReset` and `hasChanges` props to config panel

### 3.2 VirtualizedPivotTable

**Location:** `src/components/pivot-table/VirtualizedPivotTable.tsx`

The core table component with virtualized rendering.

```tsx
interface VirtualizedPivotTableProps {
  data: unknown[]
  config: PivotConfig
  onConfigChange: (config: PivotConfig) => void
  loading?: boolean
  imageMapping?: Record<string, string>
  apiMetrics?: string[]
  availableDimensions?: string[]
  onReset?: () => void                  // Reset settings handler
  hasChanges?: boolean                  // Whether settings have changed
}
```

**Key Features:**
- Uses `react-window` for virtualization (handles 50k+ rows)
- **View Mode Support:** Flat table or Pivot table
- Fixed (pinned) columns with scroll sync
- Column resizing and sorting
- Fullscreen mode with ESC key
- Automatic column color gradients
- Copy button with "Copied!" tooltip
- Column filtering with popover UI
- Total row always at top

**Performance Constants:**
```typescript
const ROW_HEIGHT = 45
const LIST_HEIGHT_THRESHOLD = 900
```

### 3.3 PivotConfigPanel

**Location:** `src/components/pivot-table/PivotConfigPanel.tsx`

Sidebar panel for configuring the pivot table.

**Tabs:**

1. **Dimensions** - View mode toggle + drag & drop columns to create row groups
2. **Metrics** - Configure aggregation, visibility, colors, order

**Features:**

- **View Mode Toggle:** Switch between "Flat table" and "Pivot table"
- Drag & drop reordering with `@dnd-kit`
- Aggregate function selection per column (hidden in flat mode)
- Color configuration (text or background mode with gradient)
- Show/Hide column toggles
- **Reset Settings Button:** Restores initial configuration
- External config change detection (syncs with reset)
- Select All / Clear All buttons for dimensions

### 3.4 PivotDataProcessor

**Location:** `src/components/pivot-table/PivotDataProcessor.ts`

Transforms raw data into pivot table format.

**Processing Pipeline:**
```
Raw Data → Filter → Group Hierarchy → Split By → Aggregate → Pivot Rows
         ↓
    (View Mode Check: Flat mode uses empty group_by)
```

**View Mode Handling:**

```typescript
// In flat mode, treat group_by as empty
const effectiveGroupBy = this.config.viewMode === 'flat' ? [] : this.config.group_by
```

**Aggregate Functions:**
| Function | Description |
|----------|-------------|
| `sum` | Sum all values |
| `avg` | Average of values |
| `count` | Count of values |
| `min` | Minimum value |
| `max` | Maximum value |
| `first` | First value in group |
| `last` | Last value in group |
| `none` | No aggregation (raw value) |

### 3.5 ColumnFilterPopover

**Location:** `src/components/pivot-table/ColumnFilterPopover.tsx`

Column-level filtering UI with support for both standard columns and dimension filtering.

```tsx
interface ColumnFilterPopoverProps {
  columnId: string
  columnType: 'number' | 'string'
  currentFilter?: ColumnFilterValue
  onFilterChange: (columnId: string, filter: ColumnFilterValue | undefined) => void
  // For dimension mode (group_by column in pivot mode)
  dimensionMode?: boolean
  availableDimensions?: string[]
  data?: Record<string, unknown>[]  // For autocomplete values
}
```

**Features:**
- Multiple filter conditions per column (AND logic)
- Different operators for string vs number columns
- Dimension mode for group_by column filtering with:
  - Dimension selector dropdown
  - Autocomplete for dimension values
  - Text wrapping in autocomplete options
- Filter icon shows active state (blue when filter applied)
- z-index: 10000 for fullscreen mode support

---

## 4. Configuration (PivotConfig)

**Location:** `src/types/pivot-table.ts`

```typescript
type ViewMode = 'flat' | 'pivot'

interface PivotConfig {
  // Core pivoting
  group_by: string[]              // Dimensions for row grouping
  split_by: string[]              // Dimensions for column pivoting (currently unused)
  columns: string[]               // Metrics with active aggregates
  aggregates: Record<string, AggregateFunction>

  // Filtering & Sorting
  filters?: FilterConfig[]
  sort?: SortConfig[]

  // Column display
  hideColumns?: string[]          // Columns to hide
  columnOrder?: string[]          // Display order (for flat table mode)
  columnWidths?: Record<string, number>
  pinnedColumnsCount?: number     // Fixed columns count

  // Styling
  columnColors?: Record<string, ColumnColorConfig>
  columnFormats?: Record<string, ColumnFormatConfig>

  // Metrics panel order
  metricsOrder?: string[]         // Order in config panel

  // View mode
  viewMode?: ViewMode             // 'flat' or 'pivot' (default: 'pivot')
  savedGroupBy?: string[]         // Preserved group_by when switching to flat mode
}
```

### 4.1 Column Color Configuration

```typescript
interface ColumnColorConfig {
  mode: 'text' | 'background'     // Color mode
  color: string                   // Hex color (e.g., '#1890ff')
}
```

**Background Mode:** Creates gradient based on value range (min-max)
- Uses logarithmic scale for large ranges (ratio > 100)
- Linear scale for tight ranges
- Opacity varies from 20% (min) to 100% (max)

**Text Mode:** Applies solid color to text

### 4.2 Column Format Configuration

```typescript
interface ColumnFormatConfig {
  prefix?: string    // e.g., '$' for currency
  suffix?: string    // e.g., '%' for percentage
  decimalPlaces?: number  // Number of decimal places (default: 2, LTV columns: 4)
}
```

---

## 5. Data Processing

### 5.1 Processing Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Raw Data  │ -> │   Filter    │ -> │   Group     │
│ (API/File)  │    │ (FilterConfig)│   │ (group_by)  │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                        ▼                   ▼                   ▼
              ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
              │  Flat Mode      │ │  Pivot Mode     │ │                 │
              │  (no grouping)  │ │  (with grouping)│ │    Split By     │
              └─────────────────┘ └─────────────────┘ └─────────────────┘
                        │                   │                   │
                        └───────────────────┼───────────────────┘
                                            ▼
                                  ┌─────────────────┐
                                  │   Aggregate     │
                                  │   (aggregates)  │
                                  └─────────────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │   Pivot Rows    │
                                  │   (PivotRow[])  │
                                  └─────────────────┘
```

### 5.2 Group Hierarchy (Pivot Mode)

When `group_by = ['country', 'campaign', 'ad']`:

```
Total (level 0)
├── US (level 1)
│   ├── Campaign A (level 2)
│   │   ├── Ad 1 (level 3)
│   │   └── Ad 2 (level 3)
│   └── Campaign B (level 2)
├── VN (level 1)
│   └── Campaign C (level 2)
```

### 5.3 Flat Mode

When `viewMode = 'flat'`:

- No grouping hierarchy
- Each row represents one record from raw data
- No Total row
- Shows selected dimensions as regular columns + all metrics
- Preserves `group_by` in `savedGroupBy` for mode switching

### 5.4 PivotRow Structure

```typescript
interface PivotRow {
  __ROW_PATH__: (string | number)[]  // Path in hierarchy
  __GROUP_LEVEL__: number            // Nesting level (0 = Total)
  __IS_EXPANDED__: boolean           // Expansion state
  __ORIGINAL_INDEX__?: number        // Index in raw data
  subRows?: PivotRow[]               // Child rows
  [key: string]: unknown             // Data columns
}
```

---

## 6. Features

### 6.1 Column Pinning

Pin columns to the left side for horizontal scrolling.

```tsx
// Click pin icon in header
setFixedColumnsCount(columnIndex + 1)
```

**Implementation:**
- Uses two synchronized `react-window` Lists
- Fixed list has `pointer-events: none` for pass-through scrolling
- Scroll sync prevents infinite loops with `isSyncingScrollRef`
- Shadow on pinned columns for visual separation

### 6.2 Column Sorting

Click column header to cycle: `none → asc → desc → none`

**Custom Sorting:**
- Total row always stays at top
- Numeric sort for numbers
- Locale-aware string sort with `numeric: true`

### 6.3 Column Resizing

Drag the column edge to resize.

```tsx
columnResizeMode: 'onChange'  // Real-time resize
```

### 6.4 Expand/Collapse (Pivot Mode Only)

Hierarchical rows can be expanded/collapsed.

```tsx
row.getToggleExpandedHandler()  // Toggle expansion
row.getCanExpand()              // Check if expandable
row.getIsExpanded()             // Current state
```

### 6.5 Fullscreen Mode

Toggle fullscreen with ESC key support.

```tsx
const [isFullscreen, setIsFullscreen] = useState(false)

// Container styles
const fullscreenStyles = isFullscreen ? {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  backgroundColor: '#fff'
} : {}

// ESC key handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false)
    }
  }
  // ...
}, [isFullscreen])
```

### 6.6 Image Display

Map cell values to image URLs:

```tsx
const imageMapping = createImageMapping(
  data,
  'ad_name',              // Source column
  'creative_thumbnail_url' // Image URL column
)

// Result: { 'Ad Name 1': 'https://...', ... }
```

### 6.7 Copy to Clipboard

Copy visible data to clipboard with visual feedback:

```tsx
// Button with tooltip that shows "Copied!" on success
<Tooltip title={copyTooltip}>
  <Button icon={<CopyOutlined />} onClick={handleCopy} />
</Tooltip>
```

---

## 7. View Modes

### 7.1 Overview

The pivot table supports two view modes:

| Mode    | Description               | Grouping | Total Row | Aggregation |
|---------|---------------------------|----------|-----------|-------------|
| `pivot` | Hierarchical grouped view | Yes      | Yes       | Yes         |
| `flat`  | Raw data table view       | No       | No        | No          |

### 7.2 View Mode Toggle

Located in the **Dimensions tab** of PivotConfigPanel:

```tsx
<Segmented
  options={[
    { label: 'Flat table', value: 'flat' },
    { label: 'Pivot table', value: 'pivot' },
  ]}
  value={viewMode}
  onChange={handleViewModeChange}
/>
```

### 7.3 Mode Switching Behavior

**Switching to Flat Mode:**

1. Current `group_by` is saved to `savedGroupBy`
2. Selected dimensions become regular columns
3. All rows show raw data without aggregation
4. Metrics panel hides aggregation dropdown

**Switching to Pivot Mode:**

1. `savedGroupBy` is restored to `group_by`
2. Data is grouped and aggregated
3. Total row appears at top
4. Metrics panel shows aggregation dropdown

### 7.4 Column Display by Mode

**Flat Mode:**

```
[Selected Dimensions from group_by] + [All Metrics from metricsOrder]
```

**Pivot Mode:**

```
[Group Column (hierarchy)] + [Visible Metrics]
```

---

## 8. Column Filtering

### 8.1 Filter Types

**Standard Column Filtering:**
- Applied to individual metric columns
- Filter icon in column header
- Opens popover with filter conditions

**Dimension Mode Filtering (Pivot Mode):**
- Applied to group_by column (first column in pivot mode)
- Allows filtering by any dimension in the hierarchy
- Autocomplete dropdown for dimension values
- Values extracted from raw data

### 8.2 Filter Operators

**String Column Operators:**

| Operator      | Description         |
| ------------- | ------------------- |
| `equals`      | Matches exactly     |
| `contains`    | Contains substring  |
| `notContains` | Does not contain    |

**Number Column Operators:**

| Operator      | Description               |
| ------------- | ------------------------- |
| `gt`          | Greater than              |
| `gte`         | Greater than or equal to  |
| `lt`          | Less than                 |
| `lte`         | Less than or equal to     |
| `equals`      | Is equal to               |
| `notEquals`   | Does not equal            |

### 8.3 Filter Condition Interface

```typescript
type FilterOperator =
  | 'equals' | 'notEquals'       // String & Number
  | 'contains' | 'notContains'   // String only
  | 'gt' | 'gte' | 'lt' | 'lte'  // Number only

interface ColumnFilterCondition {
  operator: FilterOperator
  value: string | number | null
  dimension?: string           // For dimension mode - which dimension to filter
  dimensionIndex?: number      // Index of dimension in group_by
}

interface ColumnFilterValue {
  conditions: ColumnFilterCondition[]
  // Note: Always uses AND logic (all conditions must match)
}
```

### 8.4 Dimension Mode Filtering

In pivot mode, the group_by column supports special dimension filtering:

```tsx
<ColumnFilterPopover
  columnId="__GROUP_BY__"
  columnType="string"
  dimensionMode={true}
  availableDimensions={config.group_by}  // e.g., ['country', 'campaign', 'ad']
  data={rawData}                          // For autocomplete values
  onFilterChange={handleFilterChange}
/>
```

**UI Components:**
1. **Dimension Selector:** Choose which dimension to filter (e.g., "Campaign")
2. **Operator Selector:** Choose filter type (equals, contains, etc.)
3. **Value Input:** Autocomplete with values from data, text wrapping for long values

**Behavior:**
- Changing dimension clears the value field
- Multiple conditions can be added (AND logic)
- `filterFromLeafRows: true` ensures parent rows show if any child matches
- Total row (level 0) is always excluded from dimension filters

### 8.5 Custom Filter Function

```typescript
export function columnFilterFn(
  row: { getValue: (columnId: string) => unknown; original: Record<string, unknown> },
  columnId: string,
  filterValue: ColumnFilterValue
): boolean {
  // For dimension mode, get value from __ROW_PATH__[dimensionIndex]
  if (condition.dimension !== undefined && condition.dimensionIndex !== undefined) {
    const rowPath = row.original.__ROW_PATH__ as (string | number)[]
    const groupLevel = row.original.__GROUP_LEVEL__ as number

    // Skip Total row
    if (groupLevel === 0) return false

    // Get value at dimension index in path
    if (rowPath && rowPath.length > condition.dimensionIndex) {
      cellValue = rowPath[condition.dimensionIndex]
    }
  }

  // ... evaluate condition
}
```

---

## 9. Settings Management

### 9.1 usePivotSettings Hook

**Location:** `src/hooks/api/usePivotSettings.ts`

```tsx
const {
  config,              // Current configuration
  loading,             // Loading state
  error,               // Error state
  updateSettings,      // Update and save to localStorage
  saveToLocalStorage,  // Manual save (with optional isInit flag)
  fetchSettings,       // Fetch from API
  resetSettings,       // Reset to initial settings
  clearSettings,       // Clear localStorage
  getApiFormat,        // Convert to API format
} = usePivotSettings({
  pageId: 'data-explorer',
  autoFetch: false,
  defaultConfig: { ... }
})
```

### 9.2 localStorage Keys

| Key                            | Description                  |
|--------------------------------|------------------------------|
| `pivot-settings-{pageId}`      | Current user settings        |
| `pivot-settings-{pageId}-init` | Initial settings for reset   |

### 9.3 Settings Fallback Chain

```
1. localStorage (fastest)
   ↓ (if empty)
2. API endpoint
   ↓ (if fails)
3. Page-specific defaults (pivotTableDefaults.ts)
   ↓ (if not defined)
4. Custom defaultConfig prop
```

### 9.4 Reset Functionality

**Saving Initial Settings:**

```tsx
// When initializing, save with isInit = true
saveToLocalStorage(initialConfig, true)
// This saves to both:
// - pivot-settings-{pageId}
// - pivot-settings-{pageId}-init
```

**Resetting Settings:**

```tsx
const resetSettings = useCallback(async () => {
  const initSettings = localStorage.getItem(`${storageKey}-init`)
  updateSettings(initSettings ? JSON.parse(initSettings) : null)
}, [storageKey, updateSettings])
```

---

## 10. API Integration

### 10.1 Settings Persistence

Uses `usePivotSettings` hook with localStorage fallback.

```tsx
const { config, updateSettings, loading } = usePivotSettings({
  pageId: 'data-explorer',
  autoFetch: false,
  defaultConfig: { ... }
})
```

### 10.2 API Metadata Integration

The component integrates with `/api/v1/insights/fields/` for:

- **Metrics metadata:** operator, unit, label, source, index
- **Dynamic aggregates:** Map API `operator` to aggregate function
- **Column formats:** Map API `unit` to prefix/suffix
- **Sorted metrics:** Filter out system fields (index > 900)

```typescript
// Mapping from API operator to aggregate
const operatorToAggregate = {
  sum: 'sum',
  avg: 'avg',
  last: 'last',
  calculated: 'avg',
  client: 'none',
}

// Mapping from API unit to format
const unitToFormat = {
  USD: { prefix: '$' },
  '%': { suffix: '%' },
}
```

---

## 11. Usage Examples

### 11.1 Basic Usage

```tsx
import PivotTable from '@/pages/PivotTable'

function MyPage() {
  const [data, setData] = useState([])

  return (
    <PivotTable
      pageId="my-report"
      data={data}
      loading={isLoading}
    />
  )
}
```

### 11.2 With Image Mapping

```tsx
import PivotTable, { createImageMapping } from '@/pages/PivotTable'

function AdsReport() {
  const imageMapping = useMemo(() => {
    return createImageMapping(data, 'ad_name', 'thumbnail_url')
  }, [data])

  return (
    <PivotTable
      pageId="ads"
      data={data}
      imageMapping={imageMapping}
    />
  )
}
```

### 11.3 With API Metrics

```tsx
import PivotTable from '@/pages/PivotTable'

function DataExplorer() {
  const { fieldsMetadata } = useInsightsFields()

  const apiMetrics = useMemo(() => {
    return getSortedMetrics(fieldsMetadata.metrics.metadata)
  }, [fieldsMetadata])

  const availableDimensions = useMemo(() => {
    return fieldsMetadata.dimensions.available
  }, [fieldsMetadata])

  return (
    <PivotTable
      pageId="data-explorer"
      data={data}
      apiMetrics={apiMetrics}
      availableDimensions={availableDimensions}
    />
  )
}
```

### 11.4 Direct VirtualizedPivotTable

```tsx
import { VirtualizedPivotTable } from '@/components/pivot-table'

function CustomTable() {
  const [config, setConfig] = useState<PivotConfig>({
    group_by: ['country'],
    split_by: [],
    columns: ['spend', 'installs'],
    aggregates: { spend: 'sum', installs: 'sum' },
    viewMode: 'pivot',
  })

  const handleReset = () => {
    setConfig(initialConfig)
  }

  return (
    <VirtualizedPivotTable
      data={data}
      config={config}
      onConfigChange={setConfig}
      onReset={handleReset}
      hasChanges={hasSettingsChanged}
    />
  )
}
```

### 11.5 Flat Table Mode

```tsx
// Start in flat mode
const [config, setConfig] = useState<PivotConfig>({
  group_by: ['country', 'campaign'],  // Will be shown as columns
  split_by: [],
  columns: [],
  aggregates: {},
  viewMode: 'flat',  // Flat table mode
  metricsOrder: ['spend', 'installs', 'cpi', 'roas'],
})
```

---

## 12. Styling & Formatting

### 12.1 Number Formatting

```typescript
function formatNumber(
  value: number,
  formatConfig?: ColumnFormatConfig
): string
```

**Features:**
- Configurable decimal places (default: 2, LTV columns: 4)
- Uses `Intl.NumberFormat` for thousand separators
- Handles negative numbers with prefix correctly (`-$1.23` not `$-1.23`)

### 12.2 Default Number Colors

```typescript
function getDefaultNumberColor(value: number): string {
  if (value > 0) return '#1890ff'  // Blue
  if (value < 0) return '#ff4d4f'  // Red
  return '#333'                     // Black
}
```

### 12.3 Background Gradient

```typescript
function getBackgroundStyle(
  value: number,
  column: string,
  color: string,
  columnRanges: Record<string, { min: number; max: number }>
): React.CSSProperties
```

**Algorithm:**
1. Normalize value to 0-1 range
2. Use log scale if range ratio > 100
3. Calculate opacity: `0.2 + normalized * 0.8`
4. Return `rgba(r, g, b, opacity)`

---

## 13. Export Functionality

### 13.1 Export Formats

| Format | Function | Library |
|--------|----------|---------|
| JSON | `exportToJSON()` | Native |
| CSV | `exportToCSV()` | papaparse |
| Excel | `exportToExcel()` | xlsx |

### 13.2 Export Options

```typescript
interface ExportOptions {
  fileName?: string           // Default: 'pivot-table-export'
  includeHeaders?: boolean    // Include column headers
  flattenHierarchy?: boolean  // Flatten nested rows
}
```

### 13.3 Export Modes

**Pivot Data (Current View):**
- Exports processed/grouped data
- Flattens hierarchy with indentation
- Adds `Groups` column for visual hierarchy

**Raw Data (Original):**
- Exports unchanged original dataset
- No grouping or aggregation applied

### 13.4 Usage

```typescript
import { exportToExcel, exportRawData } from '@/components/pivot-table'

// Export pivot data
exportToExcel(pivotData, {
  fileName: 'my-report',
  flattenHierarchy: true
})

// Export raw data
exportRawData(rawData, 'excel', 'raw-export')
```

---

## 14. Field Name Mappings

### 14.1 Custom Column Names

**Location:** `src/utils/stringUtils.ts`

The `formatFieldName` function provides custom mappings for field names:

```typescript
const fieldNameMappings: Record<string, string> = {
  ad_name: 'Creative Name',
  adset_name: 'Adgroup Name',
}
```

### 14.2 Automatic Formatting

For fields without custom mappings, the function:

1. Converts snake_case and camelCase to Title Case
2. Uppercases abbreviations: `id`, `url`, `ctr`, `cpc`, `cpm`, `cpi`, `cvr`, `roas`, `api`, `ui`
3. Handles special patterns: `p25` → `P25`, `p50` → `P50`, etc.

**Examples:**
```typescript
formatFieldName('ad_name')        // "Creative Name"
formatFieldName('adset_name')     // "Adgroup Name"
formatFieldName('campaign_id')    // "Campaign ID"
formatFieldName('video_p25')      // "Video P25"
formatFieldName('user_ctr')       // "User CTR"
```

---

## Appendix: Type Definitions

### ViewMode

```typescript
type ViewMode = 'flat' | 'pivot'
```

### AggregateFunction

```typescript
type AggregateFunction =
  | 'sum'
  | 'avg'
  | 'count'
  | 'min'
  | 'max'
  | 'first'
  | 'last'
  | 'none'
```

### FilterConfig

```typescript
interface FilterConfig {
  column: string
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte'
  value: unknown
}
```

### SortConfig

```typescript
interface SortConfig {
  column: string
  direction: 'asc' | 'desc'
}
```

### PivotConfig (Complete)

```typescript
interface PivotConfig {
  // Core pivoting
  group_by: string[]
  split_by: string[]
  columns: string[]
  aggregates: Record<string, AggregateFunction>

  // Filtering & Sorting
  filters?: FilterConfig[]
  sort?: SortConfig[]

  // Column display
  hideColumns?: string[]
  columnOrder?: string[]
  columnWidths?: Record<string, number>
  pinnedColumnsCount?: number

  // Styling
  columnColors?: Record<string, ColumnColorConfig>
  columnFormats?: Record<string, ColumnFormatConfig>

  // Metrics panel order
  metricsOrder?: string[]

  // View mode
  viewMode?: ViewMode
  savedGroupBy?: string[]
}
```

---

## Changelog

### Version 2.1 (2026-01-06)

- Added **Dimension Mode Filtering** for group_by column with autocomplete
- Updated Column Filtering to always use AND logic (removed mode selector)
- Added **Text Wrapping** in autocomplete dropdown options
- Added **Field Name Mappings** (ad_name → Creative Name, adset_name → Adgroup Name)
- Fixed **ColumnFilterPopover z-index** for fullscreen mode (z-index: 10000)
- Added **Clear value on dimension change** in filter popover
- Updated documentation with comprehensive filtering section

### Version 2.0 (2026-01-02)

- Added **View Mode Toggle** (Flat table / Pivot table)
- Added **Reset Settings** functionality with initial config storage
- Added **Copy to Clipboard** button with visual feedback
- Added **External Config Change Detection** for proper reset sync
- Added `viewMode` and `savedGroupBy` to PivotConfig
- Updated data processing to handle flat mode (no grouping)
- Updated PivotConfigPanel with view mode toggle in Dimensions tab
- Metrics panel now hides aggregation dropdown in flat mode

### Version 1.0 (2024-12-30)

- Initial release with core pivot table functionality

---

**Document Maintained By:** Frontend Team
**Questions:** Contact the development team for clarification.
