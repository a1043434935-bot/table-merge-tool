export interface TableData {
  fileName: string;
  headers: string[];
  rows: Record<string, unknown>[];
  fileType: 'csv' | 'xlsx';
}

export interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

export interface MergeConfig {
  matchFields1: string[];
  matchFields2: string[];
  columnMappings: ColumnMapping[];
}

export interface MergeResult {
  mergedRows: Record<string, unknown>[];
  headers: string[];
  matchedCount: number;
  unmatchedCount1: number;
  unmatchedCount2: number;
  filledCellsCount: number;
  sourceFileHeaders?: {
    file1: string[];
    file2: string[];
  };
}

export interface AppState {
  file1: TableData | null;
  file2: TableData | null;
  mergeConfig: MergeConfig;
  mergeResult: MergeResult | null;
  isMerging: boolean;
  error: string | null;
}
