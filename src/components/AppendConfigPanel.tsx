import { Columns, Plus, X, ArrowRight, Link2 } from 'lucide-react';
import type { TableData, ColumnMapping } from '@/types';

interface AppendConfigPanelProps {
  file1: TableData | null;
  file2: TableData | null;
  columnMappings: ColumnMapping[];
  onColumnMappingsChange: (mappings: ColumnMapping[]) => void;
  onAppend: () => void;
  isMerging: boolean;
}

function ColumnMappingSelector({
  file1Headers,
  file2Headers,
  mappings,
  onChange,
  disabled,
}: {
  file1Headers: string[];
  file2Headers: string[];
  mappings: ColumnMapping[];
  onChange: (mappings: ColumnMapping[]) => void;
  disabled: boolean;
}) {
  const addMapping = () => {
    const nextSource = file2Headers.find(h => !mappings.some(m => m.sourceField === h));
    const nextTarget = file1Headers.find(h => !mappings.some(m => m.targetField === h));
    if (nextSource && nextTarget) {
      onChange([...mappings, { sourceField: nextSource, targetField: nextTarget }]);
    } else if (nextSource) {
      onChange([...mappings, { sourceField: nextSource, targetField: nextSource }]);
    }
  };

  const updateMapping = (index: number, field: 'sourceField' | 'targetField', value: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    onChange(newMappings);
  };

  const removeMapping = (index: number) => {
    onChange(mappings.filter((_, i) => i !== index));
  };

  const autoMatch = () => {
    const newMappings: ColumnMapping[] = [];
    for (const h2 of file2Headers) {
      const sameName = file1Headers.find(h1 => h1 === h2);
      if (sameName) {
        newMappings.push({ sourceField: h2, targetField: sameName });
      }
    }
    onChange(newMappings);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">选择列映射（文件2 → 文件1）</span>
        {!disabled && file2Headers.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={autoMatch}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
            >
              <Link2 size={12} />
              自动匹配
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              清空
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {mappings.map((mapping, index) => (
          <div key={index} className="flex items-center gap-2 bg-green-50 rounded-lg p-2">
            <span className="text-xs text-green-500 font-medium w-6">
              {index + 1}
            </span>
            
            <select
              value={mapping.sourceField}
              onChange={(e) => updateMapping(index, 'sourceField', e.target.value)}
              disabled={disabled}
              className="flex-1 px-2 py-1.5 rounded-md border border-green-300 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">选择文件2的列</option>
              {file2Headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
            
            <ArrowRight className="text-green-500 flex-shrink-0" size={14} />
            
            <select
              value={mapping.targetField}
              onChange={(e) => updateMapping(index, 'targetField', e.target.value)}
              disabled={disabled}
              className="flex-1 px-2 py-1.5 rounded-md border border-green-300 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">选择文件1的列</option>
              {file1Headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
            
            {!disabled && (
              <button
                type="button"
                onClick={() => removeMapping(index)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        
        {!disabled && mappings.length < file2Headers.length && (
          <button
            type="button"
            onClick={addMapping}
            className="w-full py-3 text-sm text-gray-500 border border-dashed border-green-300 rounded-lg hover:border-green-400 hover:text-green-500 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            添加列映射
          </button>
        )}
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          已映射 {mappings.length} 个字段
        </span>
      </div>
    </div>
  );
}

export function AppendConfigPanel({
  file1,
  file2,
  columnMappings,
  onColumnMappingsChange,
  onAppend,
  isMerging,
}: AppendConfigPanelProps) {
  const hasColumnMappings = columnMappings.length > 0;
  const canStart = file1 && file2 && hasColumnMappings;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Columns className="text-orange-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">列映射追加</h3>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
          板块二
        </span>
      </div>

      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 mb-5">
        <p className="text-sm text-orange-700 font-medium">✓ 文件1格式和内容完全保留</p>
        <p className="text-xs text-orange-600 mt-1">
          将文件2的数据按列映射追加到文件1底部，未映射列留空
        </p>
      </div>

      <div className="space-y-4">
        <ColumnMappingSelector
          file1Headers={file1?.headers || []}
          file2Headers={file2?.headers || []}
          mappings={columnMappings}
          onChange={onColumnMappingsChange}
          disabled={!file1 || !file2}
        />

        <button
          onClick={onAppend}
          disabled={!canStart || isMerging}
          className={`
            w-full py-3 rounded-lg font-medium text-white transition-all duration-300
            flex items-center justify-center gap-2
            ${canStart && !isMerging
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isMerging ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              追加中...
            </>
          ) : (
            '开始追加'
          )}
        </button>

        {!canStart && file1 && file2 && (
          <p className="text-xs text-center text-gray-400">
            请选择列映射
          </p>
        )}
      </div>
    </div>
  );
}