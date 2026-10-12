import type { RequisitionStatus } from '@/types/models';

const STATUS_LABELS: Record<RequisitionStatus, string> = {
  draft: 'ฉบับร่าง',
  submitted: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  fulfilled: 'จ่ายยาแล้ว',
  rejected: 'ถูกปฏิเสธ',
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return '-';
  return STATUS_LABELS[status as RequisitionStatus] ?? status;
}

const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const THAI_MONTHS_LONG = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Buddhist-era date, e.g. "12 ตุลาคม 2569". */
export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return '-';
  return `${date.getDate()} ${THAI_MONTHS_LONG[date.getMonth()]} ${date.getFullYear() + 543}`;
}

/** Short Buddhist-era date, e.g. "12 ต.ค. 69". */
export function formatDateShort(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return '-';
  const year = String((date.getFullYear() + 543) % 100).padStart(2, '0');
  return `${date.getDate()} ${THAI_MONTHS_SHORT[date.getMonth()]} ${year}`;
}

/** Date + 24h time, e.g. "12 ต.ค. 2569 14:30". */
export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return '-';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${THAI_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear() + 543} ${hours}:${minutes}`;
}

/** Thai baht amount with two decimals, e.g. "1,234.50". */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Quantity with thousand separators. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return Number(value).toLocaleString('th-TH');
}
