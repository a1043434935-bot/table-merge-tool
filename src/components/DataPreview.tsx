import { useState, useMemo } from 'react';
import { Table, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TableData, MergeResult } from '@/types';

interface DataPreviewProps {
  type: 'file1' | 'file2' | 'result';
  title: string;
  tableData?: TableData;
  result?: MergeResult;
}

export function DataPreview({ type, title, tableData, result }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { headers, rows, totalRows } = useMemo(() => {
    if (type === 'result' && result) {
      return {
        headers: result.headers,
        rows: result.mergedRows,
        totalRows: result.mergedRows.length,
      };
    }
    if (tableData) {
      return {
        headers: tableData.headers,
        rows: tableData.rows,
        totalRows: tableData.rows.length,
      };
    }
    return { headers: [], rows: [], totalRows: 0 };
  }, [type, tableData, result]);

  const totalPages = Math.ceil(totalRows / pageSize);
  const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'file1': return 'text-blue-600 bg-blue-50';
      case 'file2': return 'text-purple-600 bg-purple-50';
      case 'result': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Table className={`${type === 'file1' ? 'text-blue-500' : type === 'file2' ? 'text-purple-500' : 'text-green-500'}`} size={20} />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {totalRows > 0 && (
          <span className={`ml-auto text-sm px-2 py-1 rounded-full ${getTypeColor()}`}>
            {totalRows} 行
          </span>
        )}
        {type === 'result' && (
          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
            文件1格式保留
          </span>
        )}
      </div>

      {headers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Table size={48} className="mx-auto mb-3 opacity-30" />
          <p>暂无数据</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left font-medium text-gray-600 rounded-l-lg">序号</th>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2 text-left font-medium text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-gray-500">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-3 py-2 text-gray-700"
                    >
                      {String(row[header] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
