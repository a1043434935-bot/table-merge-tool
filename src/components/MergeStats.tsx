import { CheckCircle, AlertCircle, Square, FileText } from 'lucide-react';
import type { MergeResult } from '@/types';

interface MergeStatsProps {
  result: MergeResult;
}

export function MergeStats({ result }: MergeStatsProps) {
  const totalRows = result.mergedRows.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">合并统计</h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalRows}</p>
          <p className="text-xs text-blue-500 text-center">文件1行数</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">{result.matchedCount}</p>
          <p className="text-xs text-green-500 text-center">匹配成功</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 bg-yellow-50 rounded-lg">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-yellow-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{result.unmatchedCount1}</p>
          <p className="text-xs text-yellow-500 text-center">未匹配</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Square className="text-purple-600" size={16} />
          </div>
          <p className="text-xl font-bold text-purple-600">{result.filledCellsCount}</p>
          <p className="text-xs text-purple-500 text-center">填充单元格</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-gray-600" size={16} />
          </div>
          <p className="text-xl font-bold text-gray-600">{result.unmatchedCount2}</p>
          <p className="text-xs text-gray-500 text-center">文件2未匹配</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-600">
          ✓ 文件1格式和内容完全保留，{result.matchedCount} 行已填入文件2数据
        </p>
      </div>
    </div>
  );
}