/**
 * FAST Data Store
 * Centralized data management for the FAST Settlement System.
 * 
 * RELATIONAL SCHEMA DESIGN:
 * - liftings: Transactions table.
 * - partners: Master data (type: 'K3S' or 'Supplier').
 * - crudes: Master data (primary/derived).
 * - systemRef: Global reference settings (ICP Period, Brent/MOPS prices).
 * - datedBrentDaily: Historical daily Dated Brent prices.
 * - exchangeRates: Historical daily Kurs BI (JISDOR) rates.
 * - price_formulas: Calculated price logic.
 * - priceHistory: Log of past manual reference price changes.
 */

import { STATUS } from './constants';

const STORAGE_KEY = 'fast_data';

// ─── UTILITIES ─────────────────────────────────────────────────────────────

const generateId = (prefix) => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rdm = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${rdm}`;
};

const getTimestamp = () => new Date().toISOString();

// ─── SEED DATA (INITIAL SCHEMA & MASTER DATA) ──────────────────────────────

const SEED_DATA = {
  liftings: [],
  partners: [
    { id: 'PART-001', type: 'K3S', name: 'PT KKKS Alpha Energi', country: 'Indonesia', status: 'Active' },
    { id: 'PART-002', type: 'K3S', name: 'PT KKKS Bravo Petroleum', country: 'Indonesia', status: 'Active' },
    { id: 'PART-004', type: 'K3S', name: 'Pertamina EP', country: 'Indonesia', status: 'Active' },
    { id: 'PART-005', type: 'Supplier', name: 'Shell Trading & Shipping', country: 'Netherlands', status: 'Active' },
  ],
  systemRef: {
    icpPeriod: 'April 2026',
    datedBrentRef: 75.50,
    mopsNaphthaRef: 625.00,
    lastUpdate: getTimestamp()
  },
  crudes: {
    primary: [
      { id: 'PC-001', namaCrude: 'SLC (Sumatera Light Crude)', kode: 'SLC', refType: 'brent', alpha: 2.15 },
      { id: 'PC-002', namaCrude: 'Attaka', kode: 'ATTAKA', refType: 'brent', alpha: 0.85 },
      { id: 'PC-003', namaCrude: 'Duri', kode: 'DURI', refType: 'brent', alpha: -6.30 },
      { id: 'PC-004', namaCrude: 'Belida', kode: 'BELIDA', refType: 'brent', alpha: 1.45 },
      { id: 'PC-005', namaCrude: 'Senipah Condensate', kode: 'SENIPAH', refType: 'brent', alpha: 3.20 },
      { id: 'PC-006', namaCrude: 'Banyu Urip', kode: 'BANYUURIP', refType: 'brent', alpha: 1.70 },
    ],
    derived: [
      { id: 'DC-001', namaCrude: 'Arjuna', baseRef: 'SLC', alpha: -0.50 },
      { id: 'DC-002', namaCrude: 'Cinta', baseRef: 'SLC', alpha: -1.25 },
      { id: 'DC-003', namaCrude: 'Widuri', baseRef: 'DURI', alpha: 0.00 },
      { id: 'DC-004', namaCrude: 'Handil', baseRef: 'ATTAKA', alpha: -0.30 },
      { id: 'DC-005', namaCrude: 'Badak (NGL)', baseRef: 'SENIPAH', alpha: -1.00 },
      { id: 'DC-006', namaCrude: 'Minas', baseRef: 'SLC', alpha: 0.00 },
      { id: 'DC-007', namaCrude: 'Jatibarang', baseRef: 'SLC', alpha: -2.10 },
      { id: 'DC-008', namaCrude: 'Geragai', baseRef: 'SLC', alpha: -0.75 },
      { id: 'DC-009', namaCrude: 'Sepinggan', baseRef: 'ATTAKA', alpha: 0.50 },
      { id: 'DC-010', namaCrude: 'Cepu (Light)', baseRef: 'BANYUURIP', alpha: -0.20 },
    ]
  },
  exchangeRates: [
    { id: 'EX-20260415', date: '2026-04-15', rate: 15650.00, source: 'Bank Indonesia' },
  ],
  datedBrentDaily: [
    { id: 'DBR-260415', date: '2026-04-15', price: 76.50, change: 0.25 },
  ],
  priceHistory: [],
  price_formulas: [],
  vatList: []
};

// ─── CORE DATABASE ENGINE (WITH SCHEMA MIGRATION) ───────────────────────────

export const initStore = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  } else {
    // Schema Migration: Merge SEED_DATA structure into existing data
    // This ensures new keys (like crudes, systemRef) are added if they don't exist
    const current = JSON.parse(existing);
    const migrated = { ...SEED_DATA, ...current };
    
    // Deeper merge for crudes and systemRef
    migrated.systemRef = { ...SEED_DATA.systemRef, ...(current.systemRef || {}) };
    
    // For crudes, we want to restore standard dummy IDs (PC-*/DC-*) but keep user-created ones
    const userPrimary = (current.crudes?.primary || []).filter(c => !c.id.startsWith('PC-'));
    const userDerived = (current.crudes?.derived || []).filter(c => !c.id.startsWith('DC-'));
    
    migrated.crudes = {
      primary: [...SEED_DATA.crudes.primary, ...userPrimary],
      derived: [...SEED_DATA.crudes.derived, ...userDerived]
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  }
};

const _db = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return SEED_DATA;
  const db = JSON.parse(raw);
  // Fail-safe defaults for new relational keys
  if (!db.crudes) db.crudes = SEED_DATA.crudes;
  if (!db.systemRef) db.systemRef = SEED_DATA.systemRef;
  return db;
};

const _save = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// ─── TRANSACTIONS: LIFTINGS ────────────────────────────────────────────────

export const getAllLiftings = () => _db().liftings || [];

export const getLiftingById = (id) => getAllLiftings().find(l => l.id === id);

export const createDraft = (data) => {
  const db = _db();
  const newLifting = {
    ...data,
    id: generateId('LFT'),
    status: STATUS.DRAFT,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
    createdBy: data.createdBy || 'System User'
  };
  db.liftings.unshift(newLifting);
  _save(db);
  return newLifting;
};

export const updateLifting = (id, data) => {
  const db = _db();
  const idx = db.liftings.findIndex(l => l.id === id);
  if (idx === -1) return null;
  
  db.liftings[idx] = { 
    ...db.liftings[idx], 
    ...data, 
    updatedAt: getTimestamp() 
  };
  _save(db);
  return db.liftings[idx];
};

export const submitLifting = (id) => {
  const l = getLiftingById(id);
  return updateLifting(id, { 
    status: STATUS.SUBMITTED, 
    submittedAt: getTimestamp(),
    invoiceNumber: l.invoiceNumber || `INV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}` 
  });
};

export const approveLifting = (id, catatan = '') => {
  return updateLifting(id, { 
    status: STATUS.APPROVED, 
    approvedAt: getTimestamp(),
    verifikasiCatatan: catatan
  });
};

export const rejectLifting = (id, catatan = '') => {
  return updateLifting(id, { 
    status: STATUS.REVISION, 
    verifikasiCatatan: catatan 
  });
};

export const deleteLifting = (id) => {
  const db = _db();
  db.liftings = db.liftings.filter(l => l.id !== id);
  _save(db);
  return true;
};

export const lockLifting = (id) => {
  return updateLifting(id, { 
    status: STATUS.LOCKED, 
    lockedAt: getTimestamp() 
  });
};

export const createAndSubmit = (data) => {
  const draft = createDraft(data);
  return submitLifting(draft.id);
};

// ─── MASTER DATA: PARTNERS (K3S & SUPPLIERS) ──────────────────────────────

export const getPartners = (type = null) => {
  const partners = _db().partners || [];
  return type ? partners.filter(p => p.type === type) : partners;
};

export const getK3SList = () => getPartners('K3S').map(p => ({ ...p, nama: p.name }));
export const getSupplierList = () => getPartners('Supplier').map(p => ({ ...p, nama: p.name }));
export const getKKKSList = () => getPartners('K3S').map(p => p.name);

export const savePartner = (partner) => {
  const db = _db();
  if (partner.id) {
    const idx = db.partners.findIndex(p => p.id === partner.id);
    if (idx !== -1) db.partners[idx] = { ...db.partners[idx], ...partner };
  } else {
    partner.id = generateId(partner.type === 'K3S' ? 'K3S' : 'SUP');
    db.partners.unshift(partner);
  }
  _save(db);
};

export const saveK3S = (k) => savePartner({ ...k, type: 'K3S', name: k.nama });
export const saveSupplier = (s) => savePartner({ ...s, type: 'Supplier', name: s.nama });

export const deletePartner = (id) => {
  const db = _db();
  db.partners = db.partners.filter(p => p.id !== id);
  _save(db);
};

export const deleteK3S = deletePartner;
export const deleteSupplier = deletePartner;

// ─── MASTER DATA: CRUDE & PRICES ───────────────────────────────────────────

export const getPrimaryCrudes = () => _db().crudes?.primary || [];
export const getDerivedCrudes = () => _db().crudes?.derived || [];

export const savePrimaryCrude = (crude) => {
  const db = _db();
  if (!db.crudes) db.crudes = SEED_DATA.crudes;
  if (crude.id) {
    const idx = db.crudes.primary.findIndex(c => c.id === crude.id);
    if (idx !== -1) db.crudes.primary[idx] = crude;
  } else {
    crude.id = `PC-${String(db.crudes.primary.length + 1).padStart(3, '0')}`;
    db.crudes.primary.push(crude);
  }
  _save(db);
};

export const saveDerivedCrude = (crude) => {
  const db = _db();
  if (!db.crudes) db.crudes = SEED_DATA.crudes;
  if (crude.id) {
    const idx = db.crudes.derived.findIndex(c => c.id === crude.id);
    if (idx !== -1) db.crudes.derived[idx] = crude;
  } else {
    crude.id = `DC-${String(db.crudes.derived.length + 1).padStart(3, '0')}`;
    db.crudes.derived.push(crude);
  }
  _save(db);
};

export const getIcpPeriode = () => _db().systemRef?.icpPeriod || '';
export const saveIcpPeriode = (val) => {
  const db = _db();
  db.systemRef.icpPeriod = val;
  _save(db);
};

export const getDatedBrentRef = () => _db().systemRef?.datedBrentRef || 0;
export const saveDatedBrentRef = (val) => {
  const db = _db();
  db.systemRef.datedBrentRef = parseFloat(val);
  _save(db);
};

export const getMopsNaphthaRef = () => _db().systemRef?.mopsNaphthaRef || 0;
export const saveMopsNaphthaRef = (val) => {
  const db = _db();
  db.systemRef.mopsNaphthaRef = parseFloat(val);
  _save(db);
};

export const saveRefPrices = ({ periode, datedBrent, mopsNaphtha }) => {
  const db = _db();
  db.systemRef = { ...db.systemRef, icpPeriod: periode, datedBrentRef: parseFloat(datedBrent), mopsNaphthaRef: parseFloat(mopsNaphtha), lastUpdate: getTimestamp() };
  if (!db.priceHistory) db.priceHistory = [];
  db.priceHistory.push({ periode, datedBrent: parseFloat(datedBrent), mopsNaphtha: parseFloat(mopsNaphtha), timestamp: getTimestamp() });
  _save(db);
};

export const getPriceHistory = () => _db().priceHistory || [];
export const getDatedBrentPrices = () => _db().datedBrentDaily || [];
export const addDatedBrentPrice = (entry) => {
  const db = _db();
  db.datedBrentDaily.unshift({ ...entry, id: `DBR-${Date.now()}` });
  _save(db);
};

export const getPriceFormulas = () => _db().price_formulas || [];
export const savePriceFormula = (formula) => {
  const db = _db();
  if (!db.price_formulas) db.price_formulas = [];
  if (formula.id) {
    const idx = db.price_formulas.findIndex(f => f.id === formula.id);
    if (idx !== -1) db.price_formulas[idx] = formula;
  } else {
    formula.id = `PF-${String(db.price_formulas.length + 1).padStart(3, '0')}`;
    db.price_formulas.unshift(formula);
  }
  _save(db);
};

export const getPrimaryCrudePrice = (code) => {
  const db = _db();
  const crude = db.crudes.primary.find(c => c.kode === code);
  if (!crude) return 0;
  const ref = crude.refType === 'mops' ? db.systemRef.mopsNaphthaRef : db.systemRef.datedBrentRef;
  return parseFloat((ref + crude.alpha).toFixed(2));
};

// ─── FINANCE: EXCHANGE RATES & VAT ─────────────────────────────────────────

export const getExchangeRates = () => _db().exchangeRates || [];
export const getKursBIList = () => getExchangeRates().map(r => ({ ...r, harga: r.rate, tanggal: r.date }));

export const getLatestKursBI = () => {
  const list = getKursBIList();
  return list.length > 0 ? list[0] : null;
};

export const saveKursBI = (k) => {
  const db = _db();
  if (k.id) {
    const idx = db.exchangeRates.findIndex(r => r.id === k.id);
    if (idx !== -1) db.exchangeRates[idx] = { id: k.id, date: k.tanggal, rate: parseFloat(k.harga), source: k.sumber || 'Bank Indonesia' };
  } else {
    db.exchangeRates.unshift({ id: generateId('EX'), date: k.tanggal, rate: parseFloat(k.harga), source: k.sumber || 'Bank Indonesia' });
  }
  _save(db);
};

export const deleteKursBI = (id) => {
  const db = _db();
  db.exchangeRates = db.exchangeRates.filter(r => r.id !== id);
  _save(db);
};

export const getVatList = () => _db().vatList || [];
export const saveVat = (vat) => {
  const db = _db();
  if (!db.vatList) db.vatList = [];
  if (vat.id) {
    const idx = db.vatList.findIndex(v => v.id === vat.id);
    if (idx !== -1) db.vatList[idx] = vat;
  } else {
    vat.id = `VAT-${Date.now()}`;
    db.vatList.unshift(vat);
  }
  _save(db);
};

export const deleteVat = (id) => {
  const db = _db();
  db.vatList = db.vatList.filter(v => v.id !== id);
  _save(db);
};

// ─── STATISTICS & HELPERS ──────────────────────────────────────────────────

export const getStats = () => {
  const liftings = getAllLiftings();
  return {
    total: liftings.length,
    draft: liftings.filter(l => l.status === STATUS.DRAFT).length,
    locked: liftings.filter(l => l.status === STATUS.LOCKED).length,
    submitted: liftings.filter(l => l.status === STATUS.SUBMITTED).length,
    revisi: liftings.filter(l => l.status === STATUS.REVISION).length,
    approved: liftings.filter(l => l.status === STATUS.APPROVED).length,
  };
};

export const generateAndAssignInvoiceId = (id) => {
  const num = `INV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
  updateLifting(id, { invoiceNumber: num });
  return num;
};

export {
  STATUS, LOAD_PORT_OPTIONS, DISCHARGE_PORT_OPTIONS, JENIS_MM_OPTIONS,
  KATEGORI_INVOICE_OPTIONS, KIND_OF_TRANSACTION_OPTIONS,
  STATUS_SP3_OPTIONS, PEMBELIAN_OPTIONS
} from './constants';
