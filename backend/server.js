const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Konfigurasi Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Parsing body request berbentuk JSON
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ─── MOCK DATASTORE (STAR SCHEMA) ─────────
// Ini memindahkan logika data.js dari frontend ke backend.
// Nantinya ini akan digantikan oleh koneksi SQL Server (mssql).
// ==========================================

const DATABASE = {
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
    { LiftingKey: 1, LiftingID: 'LFT-20260401-X1A2', StatusKey: 1, TransactionType: 'Import', LiftingType: 'Vessel', CommodityType: 'Crude', BLDate: '2026-05-01', BLNumber: 'BL-2026/05-01', PartnerKey: 1, CrudeKey: 1, VolumeBbls: 150000, LoadPortKey: 1, DischargePortKey: 2, CreatedAt: '2026-05-01T10:00:00Z', PeriodBulan: '05', PeriodTahun: '2026' }
  ],
  Fact_Settlement: [],
  Fact_Daily_Price: [
    { DateKey: '2026-04-01', Benchmark: 'Brent', PriceUsd: 82.45 },
    { DateKey: '2026-04-01', Benchmark: 'ICP', PriceUsd: 79.50 }
  ],
  signals: [],
  Metrics: { TopLoadports: { Import: [], Domestik: [] } },
  chartData: [
    { name: 'Jan 26', realisasi: 20000, estimasi: 22000 },
    { name: 'Feb 26', realisasi: 30000, estimasi: 31000 },
    { name: 'Mar 26', realisasi: 25000, estimasi: 26000 }
  ]
};

// ==========================================
// ─── ROUTING & ENDPOINTS (API) ────────────
// ==========================================

// --- SYNC ALL DATA ---
app.get('/api/sync', (req, res) => {
  res.json({ success: true, data: DATABASE });
});

// ==========================================
// ─── ROUTING & ENDPOINTS (API) ────────────
// ==========================================

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FAST System Backend is running.' });
});

// --- DIMENSIONS (GET Master Data) ---
app.get('/api/dim/partner', (req, res) => {
  res.json({ success: true, data: DATABASE.Dim_Partner });
});

app.get('/api/dim/crude', (req, res) => {
  res.json({ success: true, data: DATABASE.Dim_Crude });
});

app.get('/api/dim/port', (req, res) => {
  res.json({ success: true, data: DATABASE.Dim_Port });
});

app.get('/api/dim/status', (req, res) => {
  res.json({ success: true, data: DATABASE.Dim_Status });
});

// --- FACTS (Transaksi) ---

// Get All Liftings
app.get('/api/fact/lifting', (req, res) => {
  res.json({ success: true, data: DATABASE.Fact_Lifting });
});

// Create New Lifting (Simulasi POST)
app.post('/api/fact/lifting', (req, res) => {
  const payload = req.body;
  // TODO: Validasi data sesuai skema
  
  const newLifting = {
    LiftingKey: DATABASE.Fact_Lifting.length + 1,
    LiftingID: `LFT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    StatusKey: 1,
    ...payload,
    CreatedAt: new Date().toISOString()
  };
  
  DATABASE.Fact_Lifting.push(newLifting);
  
  res.status(201).json({ 
    success: true, 
    message: 'Data Lifting berhasil disimpan.',
    data: newLifting 
  });
});

// ==========================================
// ─── SERVER LISTENER ──────────────────────
// ==========================================
app.listen(PORT, () => {
  console.log(`[FAST Backend] Server berjalan di http://localhost:${PORT}`);
  console.log(`[FAST Backend] Arsitektur: Star Schema Ready`);
});
