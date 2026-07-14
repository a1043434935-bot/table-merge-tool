import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import type { MergeResult } from '@/types';
import { exportToCSV, exportToExcel } from '@/utils/exporter';

interface DownloadButtonsProps {
  result: MergeResult;
}

export function DownloadButtons({ result }: DownloadButtonsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Download className="text-green-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">下载结果</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => exportToCSV(result)}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileText size={20} />
          <span className="font-medium">下载 CSV</span>
        </button>

        <button
          onClick={() => exportToExcel(result)}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          <FileSpreadsheet size={20} />
          <span className="font-medium">下载 Excel</span>
        </button>
      </div>
    </div>
  );
}
