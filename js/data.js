/**
 * FAST Data Store — Star Schema Architecture with LocalStorage Persistence
 */

const SEED_DATA = {
  Dim_Partner: [
    { PartnerKey: 1, PartnerID: 'K3S-001', PartnerName: 'Pertamina Hulu Mahakam', PartnerType: 'KKKS', Country: 'Indonesia' },
    { PartnerKey: 2, PartnerID: 'K3S-002', PartnerName: 'Chevron Pacific Indonesia', PartnerType: 'KKKS', Country: 'USA' },
    { PartnerKey: 3, PartnerID: 'SUP-001', PartnerName: 'Shell Trading', PartnerType: 'Supplier', Country: 'Singapore' }
  ],
  Dim_Crude: [
    { CrudeKey: 1, CrudeName: 'SLC (Sumatra Light Crude)', CrudeCode: 'SLC', IsDerived: 0, BaseCrudeKey: null, RefType: 'Brent', Alpha: 1.50 },
    { CrudeKey: 2, CrudeName: 'Banyu Urip', CrudeCode: 'BU', IsDerived: 0, BaseCrudeKey: null, RefType: 'Brent', Alpha: -0.50 },
    { CrudeKey: 3, CrudeName: 'Attaka', CrudeCode: 'ATT', IsDerived: 1, BaseCrudeKey: 1, RefType: 'Brent', Alpha: 0.20 }
  ],
  Dim_Port: [
    { PortKey: 1, PortName: 'Dumai Terminal', PortType: 'Loading', Country: 'Indonesia' },
    { PortKey: 2, PortName: 'Senipah Terminal', PortType: 'Loading', Country: 'Indonesia' },
    { PortKey: 3, PortName: 'Cilacap Ref. Port', PortType: 'Discharge', Country: 'Indonesia' }
  ],
  Dim_KursBI: [
    { KursKey: 1, Tanggal: '2026-05-01', Harga: 15750.00, Sumber: 'Bank Indonesia' },
    { KursKey: 2, Tanggal: '2026-05-02', Harga: 15725.50, Sumber: 'Bank Indonesia' }
  ],
  Dim_Vat: [
    { VatKey: 1, Bulan: 'Januari', Tahun: 2026, Rate: 11 },
    { VatKey: 2, Bulan: 'Februari', Tahun: 2026, Rate: 11 }
  ],
  Dim_NonCrude: [
    { ProductKey: 1, Name: 'Homc', Formula: 'MOPS Naphtha', Reference: 'MOPS', Alpha: 2.5, Type: 'variable', Price: 85.00 },
    { ProductKey: 2, Name: 'Fame', Formula: 'Fixed Price', Reference: '-', Alpha: 0, Type: 'fixed', Price: 90.00 }
  ],
  Dim_Status: [
    { StatusKey: 1, StatusCode: 'draft', StatusLabel: 'Drafted', CssClass: 'bg-secondary-subtle text-secondary' },
    { StatusKey: 2, StatusCode: 'lifting_locked', StatusLabel: 'Lifting Locked', CssClass: 'bg-purple-subtle text-purple' },
    { StatusKey: 3, StatusCode: 'submitted', StatusLabel: 'Submitted', CssClass: 'bg-info-subtle text-info' },
    { StatusKey: 4, StatusCode: 'revisi', StatusLabel: 'Need Revision', CssClass: 'bg-warning-subtle text-warning' },
    { StatusKey: 5, StatusCode: 'approved', StatusLabel: 'Approved', CssClass: 'bg-success-subtle text-success' },
    { StatusKey: 6, StatusCode: 'rejected', StatusLabel: 'Rejected', CssClass: 'bg-danger-subtle text-danger' }
  ],
  Fact_Lifting: [
    // Data di bawah ini adalah data awal (SEED). Data yang Anda input via form disimpan di localStorage browser,
    // sehingga TIDAK AKAN tertulis secara langsung ke dalam file data.js ini.
    { LiftingKey: 1, LiftingID: 'LFT-20260401-X1A2', StatusKey: 1, TransactionType: 'Import', LiftingType: 'Vessel', CommodityType: 'Crude', BLDate: '2026-05-01', BLNumber: 'BL-2026/05-01', PartnerKey: 1, CrudeKey: 1, VolumeBbls: 150000, LoadPortKey: 1, DischargePortKey: 2, CreatedAt: '2026-05-01T10:00:00Z', PeriodBulan: '05', PeriodTahun: '2026' }
  ],
  Fact_Settlement: [],
  Fact_Daily_Price: [
    { DateKey: '2026-04-01', Benchmark: 'Brent', PriceUsd: 82.45 },
    { DateKey: '2026-04-01', Benchmark: 'ICP', PriceUsd: 79.50 }
  ],
  signals: []
};

// --- DB Engine (API Connected) ---
const API_BASE = 'http://localhost:3000/api';

window.FAST_DATA = {}; // Will be populated by the backend

// Fetch all initial data from backend
async function initFASTData(callback) {
  try {
    const res = await fetch(`${API_BASE}/sync`);
    const json = await res.json();
    if (json.success) {
      window.FAST_DATA = json.data;
      if(callback) callback();
    }
  } catch (error) {
    console.error("Gagal terhubung ke Backend:", error);
    showToast("Gagal mengambil data dari server. Pastikan backend aktif.", "error");
  }
}

// Ensure backward compatibility: wait for DOM and fetch data before triggering original events
// Note: individual pages will now call initFASTData directly

// --- CRUD FACT_LIFTING ---
function generateId(prefix) {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rdm = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${rdm}`;
}

async function createDraft(data) {
  try {
    const res = await fetch(`${API_BASE}/fact/lifting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success) {
      window.FAST_DATA.Fact_Lifting.unshift(json.data);
      return json.data;
    }
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    showToast("Gagal menyimpan data ke server.", "error");
  }
  return null;
}

function updateLifting(id, data) {
  // Simulasi sinkron sementara (belum ada endpoint PUT di server.js)
  // Nantinya diubah menjadi fetch(..., { method: 'PUT' })
  const idx = window.FAST_DATA.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx > -1) {
    window.FAST_DATA.Fact_Lifting[idx] = { ...window.FAST_DATA.Fact_Lifting[idx], ...data, UpdatedAt: new Date().toISOString() };
    return window.FAST_DATA.Fact_Lifting[idx];
  }
  return null;
}

function deleteLifting(id) {
  // Simulasi DELETE
  window.FAST_DATA.Fact_Lifting = window.FAST_DATA.Fact_Lifting.filter(l => l.LiftingID !== id);
}

function createSettlement(data) {
  // Simulasi POST ke Fact_Settlement
  window.FAST_DATA.Fact_Settlement.push({
    SettlementKey: Date.now(),
    PaymentStatus: 'Unpaid',
    ...data
  });
}

function lockLifting(id) {
  // Simulasi sinkron
  const idx = window.FAST_DATA.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx > -1) {
    window.FAST_DATA.Fact_Lifting[idx].StatusKey = 2; // Locked
  }
}

function submitLifting(id) {
  const idx = window.FAST_DATA.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx > -1) {
    window.FAST_DATA.Fact_Lifting[idx].StatusKey = 3; // Submitted
  }
}

function approveLifting(id, notes) {
  const idx = window.FAST_DATA.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx > -1) {
    window.FAST_DATA.Fact_Lifting[idx].StatusKey = 5; // Approved
    window.FAST_DATA.Fact_Lifting[idx].ApprovalNotes = notes;
  }
}

function rejectLifting(id, notes) {
  const idx = window.FAST_DATA.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx > -1) {
    window.FAST_DATA.Fact_Lifting[idx].StatusKey = 4; // Revisi
    window.FAST_DATA.Fact_Lifting[idx].RejectionNotes = notes;
  }
}

// --- UTILITIES ---
function getLiftingDetail(id) {
  const db = window.FAST_DATA;
  const lifting = db.Fact_Lifting.find(l => l.LiftingID === id);
  if (!lifting) return null;

  return {
    ...lifting,
    Partner: db.Dim_Partner.find(p => p.PartnerName === lifting.Seller) || {},
    Crude: db.Dim_Crude.find(c => c.CrudeCode === lifting.Commodity) || {},
    Status: db.Dim_Status.find(s => s.StatusKey === lifting.StatusKey) || {}
  };
}

function formatNumber(num) {
  if (!num && num !== 0) return '-';
  return Number(num).toLocaleString('id-ID');
}

function formatCurrency(num) {
  if (!num && num !== 0) return '$0.00';
  return '$' + Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getStatusBadge(statusKey) {
  const db = _db();
  const s = db.Dim_Status.find(st => st.StatusKey === statusKey) || { StatusLabel: 'Unknown', CssClass: 'bg-light text-muted' };
  return `<span class="badge rounded-pill ${s.CssClass}" style="font-size:11px;font-weight:700;padding:5px 12px">${s.StatusLabel}</span>`;
}

// Exports (for browser window)
window.createDraft = createDraft;
window.updateLifting = updateLifting;
window.deleteLifting = deleteLifting;
window.submitLifting = submitLifting;
window.approveLifting = approveLifting;
window.rejectLifting = rejectLifting;
window.getLiftingDetail = getLiftingDetail;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.getStatusBadge = getStatusBadge;
