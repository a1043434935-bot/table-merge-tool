import * as XLSX from 'xlsx';
import type { TableData } from '@/types';

export async function parseFile(file: File): Promise<TableData> {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  if (!fileExtension || !['csv', 'xlsx', 'xls'].includes(fileExtension)) {
    throw new Error('不支持的文件格式，请上传CSV或Excel文件');
  }

  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | boolean | undefined)[][];
  
  if (rawData.length === 0) {
    throw new Error('文件为空');
  }
  
  const headers = rawData[0].map((h, i) => {
    if (h === undefined || h === null || String(h).trim() === '') {
      return `列_${i + 1}`;
    }
    return String(h).trim();
  });
  
  const rows: Record<string, unknown>[] = [];
  for (let i = 1; i < rawData.length; i++) {
    const rowData = rawData[i];
    const row: Record<string, unknown> = {};
    
    for (let j = 0; j < headers.length; j++) {
      const value = rowData[j];
      row[headers[j]] = value !== undefined && value !== null ? value : '';
    }
    
    const hasAnyValue = Object.values(row).some(v => v !== '' && v !== undefined);
    if (hasAnyValue) {
      rows.push(row);
    }
  }

  return {
    fileName,
    headers,
    rows,
    fileType: fileExtension === 'csv' ? 'csv' : 'xlsx',
  };
}