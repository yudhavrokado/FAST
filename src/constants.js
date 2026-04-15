/**
 * FAST Constants & Static Options
 * Moving static reference data here helps keep the dataStore clean as it grows.
 */

export const STATUS = {
  DRAFT: 'draft',
  LOCKED: 'lifting_locked', // Data lifting dikunci, siap isi penagihan
  SUBMITTED: 'submitted',
  REVISION: 'revisi',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const LOAD_PORT_OPTIONS = [
  'Dumai', 'Cilacap', 'Balikpapan', 'Bontang', 'Merak', 'Tuban',
  'Sungai Pakning', 'Tanjung Uban', 'Lawe-lawe', 'Sorong',
  'Singapore', 'Rotterdam', 'Fujairah', 'Ras Tanura', 'Ruwais',
];

export const DISCHARGE_PORT_OPTIONS = [
  'Dumai', 'Cilacap', 'Balikpapan', 'Bontang', 'Merak', 'Tuban',
  'Sungai Pakning', 'Tanjung Uban', 'Lawe-lawe', 'Sorong',
  'Plaju', 'Balongan', 'Kasim',
];

export const JENIS_MM_OPTIONS = [
  'Crude Oil', 'Condensate', 'LPG', 'LNG', 'Naphtha', 'Fuel Oil', 'Gasoline',
];

export const KATEGORI_INVOICE_OPTIONS = [
  'Provisional Invoice', 'First Invoice', 'Second Invoice',
  'Final Invoice', 'Supplementary Invoice', 'Credit Note', 'Debit Note',
];

export const KIND_OF_TRANSACTION_OPTIONS = [
  'Provisional', 'Final',
  'PPL Provisional', 'PPL Realisasi', 'PPL Realisasi (Provisional)'
];

export const STATUS_SP3_OPTIONS = [
  'Create SP3', 'Done', 'Wait Invoice'
];

export const PEMBELIAN_OPTIONS = [
  'Import', 'Domestik',
];
