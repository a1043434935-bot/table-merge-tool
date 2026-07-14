import { Columns, Plus, X, ArrowRight, Link2, Hash, CheckCircle2, Circle } from 'lucide-react';
import type { TableData, ColumnMapping } from '@/types';

interface MergeConfigPanelProps {
  file1: TableData | null;
  file2: TableData | null;
  matchFields1: string[];
  matchFields2: string[];
  columnMappings: ColumnMapping[];
  onMatchFields1Change: (fields: string[]) => void;
  onMatchFields2Change: (fields: string[]) => void;
  onColumnMappingsChange: (mappings: ColumnMapping[]) => void;
  onMerge: () => void;
  isMerging: boolean;
}

function StepIndicator({ step, total, title }: { step: number; total: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
        step === 1 ? 'bg-blue-500 text-white' : 
        step === 2 ? 'bg-green-500 text-white' : 
        'bg-gray-200 text-gray-500'
      }`}>
        {step === 1 && <Hash size={16} />}
        {step === 2 && <Columns size={16} />}
      </div>
      <div className="flex-1">
        <p className={`font-medium text-sm ${step <= total ? 'text-gray-800' : 'text-gray-400'}`}>
          {title}
        </p>
        <p className="text-xs text-gray-400">
          {step === 1 ? '选择用于匹配行的字段，确定哪一行对应哪一行' : ''}
          {step === 2 ? '选择需要填入信息的列，确定哪一列填入哪一列的数据' : ''}
        </p>
      </div>
      {step <= total ? (
        <CheckCircle2 size={18} className="text-green-500" />
      ) : (
        <Circle size={18} className="text-gray-300" />
      )}
    </div>
  );
}

function MatchFieldSelector({
  file1Headers,
  file2Headers,
  matchFields1,
  matchFields2,
  onChange1,
  onChange2,
  disabled,
}: {
  file1Headers: string[];
  file2Headers: string[];
  matchFields1: string[];
  matchFields2: string[];
  onChange1: (fields: string[]) => void;
  onChange2: (fields: string[]) => void;
  disabled: boolean;
}) {
  const addMatchField = () => {
    const nextField1 = file1Headers.find(h => !matchFields1.includes(h));
    const nextField2 = file2Headers.find(h => !matchFields2.includes(h));
    if (nextField1 && nextField2) {
      onChange1([...matchFields1, nextField1]);
      onChange2([...matchFields2, nextField2]);
    }
  };

  const updateMatchField = (index: number, field: 'file1' | 'file2', value: string) => {
    if (field === 'file1') {
      const newFields = [...matchFields1];
      newFields[index] = value;
      onChange1(newFields);
    } else {
      const newFields = [...matchFields2];
      newFields[index] = value;
      onChange2(newFields);
    }
  };

  const removeMatchField = (index: number) => {
    onChange1(matchFields1.filter((_, i) => i !== index));
    onChange2(matchFields2.filter((_, i) => i !== index));
  };

  const autoMatchFields = () => {
    const newFields1: string[] = [];
    const newFields2: string[] = [];
    for (const h2 of file2Headers) {
      const sameName = file1Headers.find(h1 => h1 === h2);
      if (sameName) {
        newFields1.push(sameName);
        newFields2.push(h2);
        break;
      }
    }
    onChange1(newFields1);
    onChange2(newFields2);
  };

  const clearAll = () => {
    onChange1([]);
    onChange2([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">选择匹配字段（行坐标）</span>
        {!disabled && file1Headers.length > 0 && file2Headers.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={autoMatchFields}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
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
        {matchFields1.map((field1, index) => (
          <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
            <span className="text-xs text-blue-500 font-medium w-6">
              {index + 1}
            </span>
            
            <select
              value={field1}
              onChange={(e) => updateMatchField(index, 'file1', e.target.value)}
              disabled={disabled}
              className="flex-1 px-2 py-1.5 rounded-md border border-blue-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">选择文件1的字段</option>
              {file1Headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
            
            <ArrowRight className="text-blue-500 flex-shrink-0" size={14} />
            
            <select
              value={matchFields2[index] || ''}
              onChange={(e) => updateMatchField(index, 'file2', e.target.value)}
              disabled={disabled}
              className="flex-1 px-2 py-1.5 rounded-md border border-blue-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">选择文件2的字段</option>
              {file2Headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
            
            {!disabled && (
              <button
                type="button"
                onClick={() => removeMatchField(index)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        
        {!disabled && matchFields1.length === 0 && (
          <button
            type="button"
            onClick={addMatchField}
            className="w-full py-3 text-sm text-gray-500 border border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            添加匹配字段
          </button>
        )}
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          用于确定文件1的哪一行对应文件2的哪一行
        </span>
      </div>
    </div>
  );
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
        <span className="text-sm font-medium text-gray-700">选择列映射（列坐标）</span>
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
        
        {!disabled && mappings.length === 0 && (
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
          用于确定文件2的哪一列数据填入文件1的哪一列
        </span>
      </div>
    </div>
  );
}

export function MergeConfigPanel({
  file1,
  file2,
  matchFields1,
  matchFields2,
  columnMappings,
  onMatchFields1Change,
  onMatchFields2Change,
  onColumnMappingsChange,
  onMerge,
  isMerging,
}: MergeConfigPanelProps) {
  const hasMatchFields = matchFields1.length > 0 && matchFields2.length > 0;
  const hasColumnMappings = columnMappings.length > 0;
  const canStart = file1 && file2 && hasMatchFields && hasColumnMappings;

  const step1Done = hasMatchFields ? 1 : 0;
  const step2Done = hasColumnMappings ? 1 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Columns className="text-primary" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">数据合并配置</h3>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-5">
        <p className="text-sm text-blue-700 font-medium">✓ 文件1格式和内容完全保留</p>
        <p className="text-xs text-blue-600 mt-1">
          通过「行坐标」和「列坐标」确定数据填入位置，只有匹配的行才会填入数据，只有勾选的列才会被填充
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <StepIndicator step={1} total={step1Done} title="第一步：选择行坐标（匹配字段）" />
          <MatchFieldSelector
            file1Headers={file1?.headers || []}
            file2Headers={file2?.headers || []}
            matchFields1={matchFields1}
            matchFields2={matchFields2}
            onChange1={onMatchFields1Change}
            onChange2={onMatchFields2Change}
            disabled={!file1 || !file2}
          />
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <StepIndicator step={2} total={step2Done} title="第二步：选择列坐标（列映射）" />
          <ColumnMappingSelector
            file1Headers={file1?.headers || []}
            file2Headers={file2?.headers || []}
            mappings={columnMappings}
            onChange={onColumnMappingsChange}
            disabled={!file1 || !file2}
          />
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>合并规则：</strong>
            根据行坐标找到对应行，如果列坐标对应的单元格在文件1中为空且文件2中有数据，则填入；
            如果文件1和文件2的数据不同，则该行不填入任何数据。
          </p>
        </div>

        <button
          onClick={onMerge}
          disabled={!canStart || isMerging}
          className={`
            w-full py-3 rounded-lg font-medium text-white transition-all duration-300
            flex items-center justify-center gap-2
            ${canStart && !isMerging
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isMerging ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              合并中...
            </>
          ) : (
            '开始合并'
          )}
        </button>

        {!canStart && file1 && file2 && (
          <p className="text-xs text-center text-gray-400">
            {!hasMatchFields && !hasColumnMappings && '请先完成第一步和第二步的配置'}
            {hasMatchFields && !hasColumnMappings && '请完成第二步：选择列映射'}
            {!hasMatchFields && hasColumnMappings && '请完成第一步：选择匹配字段'}
          </p>
        )}
      </div>
    </div>
  );
}