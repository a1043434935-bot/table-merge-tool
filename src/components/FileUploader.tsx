import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import type { TableData } from '@/types';
import { parseFile } from '@/utils/fileParser';

interface FileUploaderProps {
  fileNumber: number;
  onFileSelect: (data: TableData) => void;
  onFileClear: () => void;
  existingFile: TableData | null;
}

export function FileUploader({ fileNumber, onFileSelect, onFileClear, existingFile }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseFile(file);
      onFileSelect(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };
    input.click();
  }, [handleFileChange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">文件 {fileNumber}</h3>
        {existingFile && (
          <button
            onClick={onFileClear}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {existingFile ? (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">{existingFile.fileName}</p>
              <p className="text-sm text-green-600">
                {existingFile.headers.length} 列, {existingFile.rows.length} 行
              </p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-white rounded border border-green-100">
            <p className="text-xs text-gray-500">字段:</p>
            <p className="text-sm text-gray-700 truncate">
              {existingFile.headers.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">正在解析文件...</p>
            </div>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDragging ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <Upload size={24} />
              </div>
              <p className="text-gray-700 font-medium mb-1">
                {isDragging ? '释放文件以上传' : '点击或拖拽文件到此处'}
              </p>
              <p className="text-sm text-gray-400">
                支持 CSV, Excel (.xlsx, .xls) 格式
              </p>
            </>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
