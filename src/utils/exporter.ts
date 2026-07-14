import * as XLSX from 'xlsx';
import type { MergeResult } from '@/types';

export function exportToCSV(result: MergeResult): void {
  const { headers, mergedRows } = result;
  
  const csvContent = [
    headers.join(','),
    ...mergedRows.map(row => 
      headers.map(header => {
        const value = String(row[header] ?? '');
        return value.includes(',') ? `"${value}"` : value;
      }).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `merged_result_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function exportToExcel(result: MergeResult): void {
  const { headers, mergedRows } = result;
  
  const worksheetData = [
    headers,
    ...mergedRows.map(row => headers.map(header => row[header] ?? '')),
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, '合并结果');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `merged_result_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  
  URL.revokeObjectURL(url);
}
