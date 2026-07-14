import { create } from 'zustand';
import type { TableData, MergeConfig, MergeResult, ColumnMapping } from '@/types';

interface AppStore {
  file1: TableData | null;
  file2: TableData | null;
  mergeConfig: MergeConfig;
  appendColumnMappings: ColumnMapping[];
  mergeResult: MergeResult | null;
  isMerging: boolean;
  error: string | null;
  
  setFile1: (file: TableData | null) => void;
  setFile2: (file: TableData | null) => void;
  setMergeConfig: (config: Partial<MergeConfig>) => void;
  setAppendColumnMappings: (mappings: ColumnMapping[]) => void;
  setMergeResult: (result: MergeResult | null) => void;
  setIsMerging: (isMerging: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  file1: null,
  file2: null,
  mergeConfig: {
    matchFields1: [],
    matchFields2: [],
    columnMappings: [],
  },
  appendColumnMappings: [],
  mergeResult: null,
  isMerging: false,
  error: null,
  
  setFile1: (file) => set({ file1: file, mergeResult: null, error: null }),
  setFile2: (file) => set({ file2: file, mergeResult: null, error: null }),
  setMergeConfig: (config) => set((state) => ({ 
    mergeConfig: { ...state.mergeConfig, ...config },
    mergeResult: null 
  })),
  setAppendColumnMappings: (mappings) => set({ appendColumnMappings: mappings, mergeResult: null }),
  setMergeResult: (result) => set({ mergeResult: result }),
  setIsMerging: (isMerging) => set({ isMerging }),
  setError: (error) => set({ error }),
  clearAll: () => set({
    file1: null,
    file2: null,
    mergeConfig: {
      matchFields1: [],
      matchFields2: [],
      columnMappings: [],
    },
    appendColumnMappings: [],
    mergeResult: null,
    isMerging: false,
    error: null,
  }),
}));
