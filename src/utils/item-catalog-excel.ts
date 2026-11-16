import type { Item } from '@/types/models';
import { formatDate } from '@/utils/format';

const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/g;

/** Make a value safe to use as one part of a downloaded file name. */
export function sanitizeFilenamePart(value: string): string {
  const sanitized = value
    .replace(INVALID_FILENAME_CHARS, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '')
    .slice(0, 80);

  return sanitized || 'ไม่ระบุ';
}

function toDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export type ItemCatalogExportOptions = {
  items: Item[];
  pcuName: string;
  generatedAt?: Date;
};

/**
 * Export the PCU drug catalog as a single, readable Excel sheet.
 *
 * The exported sheet mirrors what the user sees in the catalog view:
 * category, item name, unit, current price, availability and notes.
 * Passing `filteredItems` keeps the file in sync with the active filters.
 */
export async function exportItemCatalogToExcel({
  items,
  pcuName,
  generatedAt = new Date(),
}: ItemCatalogExportOptions): Promise<string> {
  const { utils, writeFile } = await import('xlsx');

  const headerRows: (string | number)[][] = [
    ['บัญชียาและเวชภัณฑ์'],
    [`รพ.สต. ${pcuName}`],
    [`วันที่พิมพ์: ${formatDate(generatedAt)}`, '', '', `จำนวนรายการ: ${items.length} รายการ`],
    [],
  ];

  const tableHeader = [
    'ลำดับ',
    'หมวดหมู่',
    'รายการยา',
    'หน่วยนับ',
    'ราคาต่อหน่วย (บาท)',
    'สถานะการเบิก',
    'หมายเหตุ',
  ];

  const tableRows = items.map((item, index) => [
    index + 1,
    item.category,
    item.name,
    item.unit_pack,
    Number(item.price_per_unit),
    item.is_available ? 'เบิกได้' : 'ไม่พร้อมจ่าย',
    item.notes ?? '',
  ]);

  const worksheet = utils.aoa_to_sheet([...headerRows, tableHeader, ...tableRows]);

  const headerRowNumber = headerRows.length + 1;
  const lastRowNumber = headerRowNumber + tableRows.length;

  worksheet['!cols'] = [
    { wch: 7 },
    { wch: 18 },
    { wch: 44 },
    { wch: 12 },
    { wch: 18 },
    { wch: 14 },
    { wch: 34 },
  ];

  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
    { s: { r: 2, c: 3 }, e: { r: 2, c: 6 } },
  ];

  worksheet['!autofilter'] = {
    ref: `A${headerRowNumber}:G${lastRowNumber}`,
  };

  for (let row = headerRowNumber + 1; row <= lastRowNumber; row += 1) {
    const priceCell = worksheet[`E${row}`];
    if (priceCell) priceCell.z = '#,##0.00';
  }

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'บัญชียา');

  const fileName = `บัญชียา_${sanitizeFilenamePart(pcuName)}_${toDateStamp(generatedAt)}.xlsx`;
  writeFile(workbook, fileName);

  return fileName;
}
