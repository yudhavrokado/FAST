/**
 * FAST Data Store
 * Centralized local storage management for the FAST Settlement System.
 * All data is persisted in localStorage under a single key: 'fast_data'.
 */

const STORAGE_KEY = 'fast_data';

// Generate a unique ID like "LFT-20260318-XXXX"
const generateId = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LFT-${y}${m}${d}-${rand}`;
};

// Generate B/L reference number
const generateBLRef = () => {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `CT-20${y}/${m}-${seq}`;
};

// Get current timestamp string
const getTimestamp = () => {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = String(now.getDate()).padStart(2, '0');
  const mmm = months[now.getMonth()];
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${dd} ${mmm} ${yyyy}, ${hh}:${mi}`;
};

// Initial seed data so the app isn't empty on first load
const SEED_DATA = {
  liftings: [
    {
      id: 'LFT-20260308-A1B2',
      blNumber: 'CT-2026/03-1120',
      tanggalLifting: '2026-03-08',
      kkks: 'PT KKKS Alpha Energi',
      volumeGross: 152000,
      volumeNet: 150000,
      waterContent: 0.05,
      apiGravity: 32.5,
      status: 'submitted', // submitted → needs L1 verification
      statusText: 'Menunggu Review L1',
      createdAt: '08 Mar 2026, 14:30',
      updatedAt: '08 Mar 2026, 14:30',
      submittedAt: '08 Mar 2026, 14:30',
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260301-C3D4',
      blNumber: 'CT-2026/03-1115',
      tanggalLifting: '2026-03-01',
      kkks: 'PT KKKS Bravo Petroleum',
      volumeGross: 128000,
      volumeNet: 125500,
      waterContent: 0.03,
      apiGravity: 33.1,
      status: 'approved',
      statusText: 'Approved (Tembus L2)',
      createdAt: '01 Mar 2026, 09:15',
      updatedAt: '01 Mar 2026, 09:15',
      submittedAt: '01 Mar 2026, 09:15',
      approvedAt: '02 Mar 2026, 10:00',
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260303-E5F6',
      blNumber: 'CT-2026/03-0092',
      tanggalLifting: '2026-03-03',
      kkks: 'PT KKKS Charlie',
      volumeGross: 155000,
      volumeNet: 150000,
      waterContent: 0.08,
      apiGravity: 31.2,
      status: 'revisi',
      statusText: 'Butuh Perbaikan',
      createdAt: '03 Mar 2026, 11:00',
      updatedAt: '05 Mar 2026, 14:00',
      submittedAt: '03 Mar 2026, 11:00',
      catatan: '',
      verifikasiCatatan: 'Angka Net Volume keliru. Mohon cek water content.',
    },
    {
      id: 'LFT-20260310-G7H8',
      blNumber: 'BL-2026-8815',
      tanggalLifting: '2026-03-10',
      kkks: 'Pertamina EP',
      volumeGross: 310000,
      volumeNet: 300000,
      waterContent: 0.02,
      apiGravity: 34.0,
      status: 'submitted',
      statusText: 'Menunggu Review L1',
      createdAt: '10 Mar 2026, 08:00',
      updatedAt: '10 Mar 2026, 08:00',
      submittedAt: '10 Mar 2026, 08:00',
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260309-DRFT',
      blNumber: 'CT-2026/03-1122',
      tanggalLifting: '2026-03-09',
      kkks: 'PT KKKS Alpha Energi',
      volumeGross: null,
      volumeNet: null,
      waterContent: null,
      apiGravity: null,
      status: 'draft',
      statusText: 'Draft Tersimpan',
      createdAt: '09 Mar 2026, 10:00',
      updatedAt: '09 Mar 2026, 10:00',
      submittedAt: null,
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260305-I9J0',
      blNumber: 'CT-2026/03-0105',
      tanggalLifting: '2026-03-05',
      kkks: 'PT Delta Energy',
      volumeGross: 88000,
      volumeNet: 85000,
      waterContent: 0.06,
      apiGravity: 30.8,
      status: 'revisi',
      statusText: 'Butuh Perbaikan',
      createdAt: '05 Mar 2026, 13:00',
      updatedAt: '07 Mar 2026, 09:30',
      submittedAt: '05 Mar 2026, 13:00',
      catatan: '',
      verifikasiCatatan: 'Lampiran manifest buram, mohon unggah ulang.',
    },
  ],
  // Master data & KKKS registry
  kkksRegistry: [
    'PT KKKS Alpha Energi',
    'PT KKKS Bravo Petroleum',
    'PT KKKS Charlie',
    'Pertamina EP',
    'PT Delta Energy',
    'PT Echo Resources',
  ],
};

/**
 * Initialize data store. Seeds data if localStorage is empty.
 */
export const initStore = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  }
};

/**
 * Get all data from the store.
 */
const getData = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : SEED_DATA;
};

/**
 * Save data to the store.
 */
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ─── LIFTING CRUD ─────────────────────────────────────────

/**
 * Get all lifting records.
 */
export const getAllLiftings = () => {
  const data = getData();
  return data.liftings || [];
};

/**
 * Get a single lifting record by ID.
 */
export const getLiftingById = (id) => {
  const liftings = getAllLiftings();
  return liftings.find((l) => l.id === id) || null;
};

/**
 * Get liftings filtered by status.
 * @param {'draft'|'submitted'|'revisi'|'approved'|'rejected'} status
 */
export const getLiftingsByStatus = (status) => {
  return getAllLiftings().filter((l) => l.status === status);
};

/**
 * Create a new draft lifting.
 * Returns the newly created record.
 */
export const createDraft = (formData) => {
  const data = getData();
  const newLifting = {
    id: generateId(),
    blNumber: formData.blNumber || generateBLRef(),
    tanggalLifting: formData.tanggalLifting || '',
    kkks: formData.kkks || '',
    volumeGross: formData.volumeGross ? Number(formData.volumeGross) : null,
    volumeNet: formData.volumeNet ? Number(formData.volumeNet) : null,
    waterContent: formData.waterContent ? Number(formData.waterContent) : null,
    apiGravity: formData.apiGravity ? Number(formData.apiGravity) : null,
    status: 'draft',
    statusText: 'Draft Tersimpan',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
    submittedAt: null,
    catatan: formData.catatan || '',
    verifikasiCatatan: '',
  };
  data.liftings.unshift(newLifting);
  saveData(data);
  return newLifting;
};

/**
 * Update an existing lifting (draft or revision).
 * Returns the updated record.
 */
export const updateLifting = (id, formData) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const existing = data.liftings[index];
  const updated = {
    ...existing,
    blNumber: formData.blNumber ?? existing.blNumber,
    tanggalLifting: formData.tanggalLifting ?? existing.tanggalLifting,
    kkks: formData.kkks ?? existing.kkks,
    volumeGross: formData.volumeGross !== undefined ? (formData.volumeGross ? Number(formData.volumeGross) : null) : existing.volumeGross,
    volumeNet: formData.volumeNet !== undefined ? (formData.volumeNet ? Number(formData.volumeNet) : null) : existing.volumeNet,
    waterContent: formData.waterContent !== undefined ? (formData.waterContent ? Number(formData.waterContent) : null) : existing.waterContent,
    apiGravity: formData.apiGravity !== undefined ? (formData.apiGravity ? Number(formData.apiGravity) : null) : existing.apiGravity,
    catatan: formData.catatan ?? existing.catatan,
    updatedAt: getTimestamp(),
  };
  data.liftings[index] = updated;
  saveData(data);
  return updated;
};

/**
 * Submit a draft/revision → changes status to 'submitted'.
 * KKKS clicks "Submit" → data goes to L1 verification queue.
 */
export const submitLifting = (id) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  data.liftings[index] = {
    ...data.liftings[index],
    status: 'submitted',
    statusText: 'Menunggu Review L1',
    submittedAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  saveData(data);
  return data.liftings[index];
};

/**
 * Create and immediately submit a new lifting.
 * Form → Submit button pressed.
 */
export const createAndSubmit = (formData) => {
  const draft = createDraft(formData);
  return submitLifting(draft.id);
};

/**
 * L1 approves a submission.
 */
export const approveLifting = (id, catatan = '') => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  data.liftings[index] = {
    ...data.liftings[index],
    status: 'approved',
    statusText: 'Approved (Tembus L2)',
    approvedAt: getTimestamp(),
    updatedAt: getTimestamp(),
    verifikasiCatatan: catatan || data.liftings[index].verifikasiCatatan,
  };
  saveData(data);
  return data.liftings[index];
};

/**
 * L1 rejects a submission (sends back for revision).
 */
export const rejectLifting = (id, catatan = '') => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  data.liftings[index] = {
    ...data.liftings[index],
    status: 'revisi',
    statusText: 'Butuh Perbaikan',
    updatedAt: getTimestamp(),
    verifikasiCatatan: catatan,
  };
  saveData(data);
  return data.liftings[index];
};

/**
 * Delete a lifting record (only drafts can be deleted).
 */
export const deleteLifting = (id) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return false;
  if (data.liftings[index].status !== 'draft') return false;

  data.liftings.splice(index, 1);
  saveData(data);
  return true;
};

// ─── KKKS REGISTRY ────────────────────────────────────────

/**
 * Get list of registered KKKS entities.
 */
export const getKKKSList = () => {
  const data = getData();
  return data.kkksRegistry || [];
};

// ─── STATISTICS ───────────────────────────────────────────

/**
 * Get summary counts for dashboard widgets.
 */
export const getStats = () => {
  const liftings = getAllLiftings();
  return {
    total: liftings.length,
    draft: liftings.filter((l) => l.status === 'draft').length,
    submitted: liftings.filter((l) => l.status === 'submitted').length,
    revisi: liftings.filter((l) => l.status === 'revisi').length,
    approved: liftings.filter((l) => l.status === 'approved').length,
    rejected: liftings.filter((l) => l.status === 'rejected').length,
  };
};

/**
 * Reset data store to seed data (useful for demo).
 */
export const resetStore = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
};
