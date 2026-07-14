import { useState, useEffect } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { MergeConfigPanel } from '@/components/MergeConfigPanel';
import { AppendConfigPanel } from '@/components/AppendConfigPanel';
import { DataPreview } from '@/components/DataPreview';
import { DownloadButtons } from '@/components/DownloadButtons';
import { MergeStats } from '@/components/MergeStats';
import { useAppStore } from '@/store';
import { mergeTables } from '@/utils/merger';
import type { ColumnMapping } from '@/types';

function App() {
  const {
    file1,
    file2,
    mergeConfig,
    appendColumnMappings,
    mergeResult,
    isMerging,
    error,
    setFile1,
    setFile2,
    setMergeConfig,
    setAppendColumnMappings,
    setMergeResult,
    setIsMerging,
    setError,
    clearAll,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'file1' | 'file2' | 'result'>('file1');

  useEffect(() => {
    if (file1 && file2) {
      const newMappings: ColumnMapping[] = [];
      
      for (const h2 of file2.headers) {
        const sameName = file1.headers.find(h1 => h1 === h2);
        if (sameName) {
          newMappings.push({ sourceField: h2, targetField: sameName });
        }
      }
      
      if (mergeConfig.columnMappings.length === 0 && newMappings.length > 0) {
        setMergeConfig({ columnMappings: newMappings });
      }
    }
  }, [file1, file2]);

  const handleMerge = async () => {
    if (!file1 || !file2) {
      setError('请先上传两个文件');
      return;
    }

    const hasMatchFields = mergeConfig.matchFields1.length > 0 && mergeConfig.matchFields2.length > 0;
    const hasColumnMappings = mergeConfig.columnMappings.length > 0;

    if (!hasMatchFields) {
      setError('请先配置匹配字段（行坐标）');
      return;
    }

    if (!hasColumnMappings) {
      setError('请先配置列映射（列坐标）');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = mergeTables(file1, file2, mergeConfig);
      setMergeResult(result);
      setActiveTab('result');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsMerging(false);
    }
  };

  const handleAppend = async () => {
    if (!file1 || !file2) {
      setError('请先上传两个文件');
      return;
    }

    if (appendColumnMappings.length === 0) {
      setError('请先配置列映射');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const appendConfig = {
        matchFields1: [],
        matchFields2: [],
        columnMappings: appendColumnMappings,
      };

      const result = mergeTables(file1, file2, appendConfig);
      setMergeResult(result);
      setActiveTab('result');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Database className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">表格数据合并工具</h1>
          <p className="text-white/80">板块一：匹配合并（按行匹配填入数据） | 板块二：列映射追加（追加新行）</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploader
                fileNumber={1}
                onFileSelect={setFile1}
                onFileClear={() => setFile1(null)}
                existingFile={file1}
              />
              <FileUploader
                fileNumber={2}
                onFileSelect={setFile2}
                onFileClear={() => setFile2(null)}
                existingFile={file2}
              />
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">板块一：匹配合并</h2>
              <MergeConfigPanel
                file1={file1}
                file2={file2}
                matchFields1={mergeConfig.matchFields1}
                matchFields2={mergeConfig.matchFields2}
                columnMappings={mergeConfig.columnMappings}
                onMatchFields1Change={(fields) => setMergeConfig({ matchFields1: fields })}
                onMatchFields2Change={(fields) => setMergeConfig({ matchFields2: fields })}
                onColumnMappingsChange={(mappings) => setMergeConfig({ columnMappings: mappings })}
                onMerge={handleMerge}
                isMerging={isMerging}
              />
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">板块二：列映射追加</h2>
              <AppendConfigPanel
                file1={file1}
                file2={file2}
                columnMappings={appendColumnMappings}
                onColumnMappingsChange={setAppendColumnMappings}
                onAppend={handleAppend}
                isMerging={isMerging}
              />
            </div>
          </div>

          <div className="space-y-6">
            {mergeResult && (
              <>
                <MergeStats result={mergeResult} />
                <DownloadButtons result={mergeResult} />
              </>
            )}

            {error && (
              <div className="bg-red-500 text-white rounded-xl p-4">
                <p className="font-medium">错误</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {(file1 || file2) && (
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200"
              >
                <RefreshCw size={18} />
                清除所有数据
              </button>
            )}
          </div>
        </div>

        {file1 || file2 || mergeResult ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <div className="flex gap-2 mb-4">
              {file1 && (
                <button
                  onClick={() => setActiveTab('file1')}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'file1'
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  文件1预览
                </button>
              )}
              {file2 && (
                <button
                  onClick={() => setActiveTab('file2')}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'file2'
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  文件2预览
                </button>
              )}
              {mergeResult && (
                <button
                  onClick={() => setActiveTab('result')}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'result'
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  合并结果
                </button>
              )}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'file1' && file1 && (
                <DataPreview type="file1" title="文件1预览" tableData={file1} />
              )}
              {activeTab === 'file2' && file2 && (
                <DataPreview type="file2" title="文件2预览" tableData={file2} />
              )}
              {activeTab === 'result' && mergeResult && (
                <DataPreview type="result" title="合并结果" result={mergeResult} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-4">
              <Database className="text-white/50" size={48} />
            </div>
            <p className="text-white/60 text-lg">上传两个表格文件开始合并</p>
            <p className="text-white/40 text-sm mt-1">支持 CSV 和 Excel 格式</p>
          </div>
        )}

        <footer className="mt-8 text-center text-white/40 text-sm">
          <p>数据仅在浏览器中处理，不会上传到服务器</p>
        </footer>
      </div>
    </div>
  );
}

export default App;