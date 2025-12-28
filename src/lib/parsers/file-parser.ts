import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedData {
  data: Record<string, unknown>[];
  columns: string[];
  errors: string[];
}

export async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, unknown>[];
        const columns = results.meta.fields || [];
        const errors = results.errors.map((e) => e.message);

        // Convert numeric strings to numbers
        const processedData = data.map((row) => {
          const newRow: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(row)) {
            if (typeof value === "string" && value !== "") {
              const num = parseFloat(value.replace(/,/g, ""));
              newRow[key] = isNaN(num) ? value : num;
            } else {
              newRow[key] = value;
            }
          }
          return newRow;
        });

        resolve({ data: processedData, columns, errors });
      },
      error: (error) => {
        resolve({ data: [], columns: [], errors: [error.message] });
      },
    });
  });
}

export async function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<
          string,
          unknown
        >[];
        const columns =
          jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

        resolve({ data: jsonData, columns, errors: [] });
      } catch (error) {
        resolve({
          data: [],
          columns: [],
          errors: [(error as Error).message],
        });
      }
    };

    reader.onerror = () => {
      resolve({ data: [], columns: [], errors: ["Failed to read file"] });
    };

    reader.readAsBinaryString(file);
  });
}

export async function parseFile(file: File): Promise<ParsedData> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCSV(file);
  } else if (extension === "xlsx" || extension === "xls") {
    return parseExcel(file);
  } else {
    return {
      data: [],
      columns: [],
      errors: ["Unsupported file format. Please use CSV or Excel files."],
    };
  }
}

export function detectColumnTypes(
  data: Record<string, unknown>[],
  columns: string[]
): Record<string, "string" | "number" | "date" | "boolean"> {
  const types: Record<string, "string" | "number" | "date" | "boolean"> = {};

  for (const column of columns) {
    let isNumber = true;
    let isDate = true;
    let isBoolean = true;

    for (const row of data.slice(0, 100)) {
      const value = row[column];

      if (value === null || value === undefined || value === "") continue;

      if (typeof value !== "number" && isNaN(Number(value))) {
        isNumber = false;
      }

      if (typeof value === "string") {
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          isDate = false;
        }
      } else if (typeof value !== "object" || !(value instanceof Date)) {
        isDate = false;
      }

      if (
        typeof value !== "boolean" &&
        value !== "true" &&
        value !== "false" &&
        value !== 0 &&
        value !== 1
      ) {
        isBoolean = false;
      }
    }

    if (isBoolean) {
      types[column] = "boolean";
    } else if (isNumber) {
      types[column] = "number";
    } else if (isDate) {
      types[column] = "date";
    } else {
      types[column] = "string";
    }
  }

  return types;
}
