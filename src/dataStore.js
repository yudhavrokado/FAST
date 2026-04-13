/**
 * FAST Data Store
 * Centralized local storage management for the FAST Settlement System.
 * All data is persisted in localStorage under a single key: 'fast_data'.
 */

const STORAGE_KEY = 'fast_data';

// Generate a unique Invoice ID like "INV/26/BL-XXXX"
const generateInvoiceId = () => {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV/${y}/BL-${seq}`;
};

// Generate a unique lifting record ID like "LFT-20260318-XXXX"
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
      invoiceId: 'INV/26/BL-8812',
      blNumber: 'CT-2026/03-1120',
      blDate: '2026-03-08',
      vesselName: 'MV Pertamina Pride',
      loadPort: 'Dumai',
      dischargePort: 'Balongan',
      liftingDate: '2026-03-08',
      kkks: 'PT KKKS Alpha Energi',
      jenisMm: 'SLC (Sumatera Light Crude)',
      bagianPembelian: '85% Indonesia',
      kategoriInvoice: 'First Invoice',
      volumeGross: 152000,
      totalVolume: 150000,
      volumeNominasi: 150000,
      volumeK3s: 127500, // 85%
      volumeGoi: 22500,  // 15%
      kkksVolume: 127500,
      skkVolume: 22500,
      kkksPrice: 82.45,
      skkPrice: 82.45,
      priceUsdBbl: 82.45,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-08',
      dueDateFinal: '2026-04-15',
      waterContent: 0.05,
      apiGravity: 32.5,
      status: 'approved',
      statusText: 'Approved',
      createdAt: '08 Mar 2026, 14:30',
      updatedAt: '08 Mar 2026, 14:30',
      submittedAt: '08 Mar 2026, 14:30',
      createdBy: 'Budi Santoso (Pertamina)',
      updatedBy: 'Rahmat Hidayat (Pertamina)',
      catatan: '',
      verifikasiCatatan: '',
      fileInvoice: 'invoice_alpha_8812.pdf',
      fileBL: 'bl_alpha_8812.pdf'
    },
    {
      id: 'LFT-20260301-C3D4',
      invoiceId: 'INV/26/BL-8813',
      blNumber: 'CT-2026/03-1115',
      blDate: '2026-03-01',
      vesselName: 'MT Agung Samudra',
      loadPort: 'Cilacap',
      dischargePort: 'Plaju',
      liftingDate: '2026-03-01',
      kkks: 'PT KKKS Bravo Petroleum',
      jenisMm: 'Arjuna',
      bagianPembelian: '100% Indonesia',
      kategoriInvoice: 'Second Invoice',
      volumeGross: 128000,
      totalVolume: 125500,
      volumeNominasi: 130000, // Discrepancy for testing
      volumeK3s: 125500,
      volumeGoi: 0,
      kkksVolume: 125500,
      skkVolume: 0,
      kkksPrice: 84.12,
      skkPrice: 0,
      priceUsdBbl: 84.12,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-01',
      dueDateFinal: '2026-04-08',
      waterContent: 0.03,
      apiGravity: 33.1,
      status: 'approved',
      statusText: 'Approved',
      createdAt: '01 Mar 2026, 09:15',
      updatedAt: '01 Mar 2026, 09:15',
      submittedAt: '01 Mar 2026, 09:15',
      approvedAt: '02 Mar 2026, 10:00',
      catatan: '',
      verifikasiCatatan: 'Data sesuai dengan B/L dan Nominasi bulan lalu.',
      fileInvoice: 'invoice_bravo_8813.pdf'
    },
    {
      id: 'LFT-20260406-YSLE',
      blNumber: 'CT-2026/04-2201',
      blDate: '2026-04-06',
      vesselName: 'MT Phoenix',
      loadPort: 'Tuban',
      dischargePort: 'Cilacap',
      liftingDate: '2026-04-06',
      kkks: 'PT Delta Energy',
      jenisMm: 'Banyu Urip',
      bagianPembelian: '85% Indonesia',
      kategoriInvoice: 'First Invoice',
      totalVolume: 500000,
      volumeNominasi: 480000, // +4.1% (within 5% tolerance)
      volumeK3s: 425000,
      volumeGoi: 75000,
      kkksVolume: 425000,
      skkVolume: 75000,
      kkksPrice: 79.50,
      skkPrice: 79.50,
      priceUsdBbl: 79.50,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-05-06',
      dueDateFinal: '2026-05-13',
      status: 'submitted',
      statusText: 'Submitted',
      createdAt: '06 Apr 2026, 10:00',
      updatedAt: '06 Apr 2026, 10:00',
      submittedAt: '06 Apr 2026, 10:00',
      createdBy: 'Siti Aminah (KKKS Alpha)',
      updatedBy: 'Andi Wijaya (KKKS Alpha)',
      catatan: 'Lifting April batch 1',
      verifikasiCatatan: ''
    },
    {
      id: 'LFT-20260303-E5F6',
      invoiceId: 'INV/26/BL-8814',
      blNumber: 'CT-2026/03-1118',
      blDate: '2026-03-03',
      vesselName: 'MT Segara',
      loadPort: 'Bontang',
      dischargePort: 'Bontang',
      liftingDate: '2026-03-03',
      kkks: 'PT KKKS Charlie',
      jenisMm: 'Duri',
      bagianPembelian: '70% Indonesia, 30% Singapore',
      kategoriInvoice: 'Provisional Invoice',
      volumeGross: 155000,
      volumeNet: 150000,
      totalVolume: 150000,
      volumeNominasi: 155000,
      volumeK3s: 105000,
      volumeGoi: 45000,
      kkksVolume: 105000,
      skkVolume: 45000,
      kkksPrice: 75.20,
      skkPrice: 75.20,
      priceUsdBbl: 75.20,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-03',
      dueDateFinal: '2026-04-10',
      waterContent: 0.08,
      apiGravity: 31.2,
      status: 'revisi',
      statusText: 'Need Revision',
      createdAt: '26 Mar 2026, 10:00',
      updatedAt: '28 Mar 2026, 12:00',
      submittedAt: '03 Mar 2026, 11:00',
      createdBy: 'John Doe (Pertamina)',
      updatedBy: 'Samsul Arifin (Verifikator)',
      catatan: '',
      verifikasiCatatan: 'Angka Net Volume keliru. Mohon cek water content.',
    },
    {
      id: 'LFT-20260310-G7H8',
      invoiceId: 'INV/26/BL-8815',
      blNumber: 'BL-2026-8815',
      blDate: '2026-03-09',
      vesselName: 'MT Borneo Star',
      loadPort: 'Bontang',
      liftingDate: '2026-03-10',
      kkks: 'Pertamina EP',
      jenisMm: 'Attaka',
      pembelian: 'Domestik',
      bagianPembelian: '100% Indonesia',
      kategoriInvoice: 'Final Invoice',
      volumeGross: 310000,
      volumeNet: 300000,
      totalVolume: 300000,
      volumeNominasi: 295000,
      volumeK3s: 300000,
      volumeGoi: 0,
      kkksVolume: 300000,
      skkVolume: 0,
      kkksPrice: 81.10,
      skkPrice: 0,
      priceUsdBbl: 81.10,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-10',
      dueDateFinal: '2026-04-17',
      waterContent: 0.02,
      apiGravity: 34.0,
      status: 'submitted',
      statusText: 'Submitted',
      createdAt: '10 Mar 2026, 08:00',
      updatedAt: '10 Mar 2026, 08:00',
      submittedAt: '10 Mar 2026, 08:00',
      createdBy: 'Ahmad Faisal (Pertamina EP)',
      updatedBy: 'Ahmad Faisal (Pertamina EP)',
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260309-DRFT',
      invoiceId: null,
      blNumber: 'CT-2026/03-1122',
      blDate: '2026-03-09',
      vesselName: 'MT Pertamina Prime',
      loadPort: 'Dumai',
      dischargePort: 'Plaju',
      liftingDate: '2026-03-09',
      periodeLiftingBulan: '03',
      periodeLiftingTahun: '2026',
      seller: 'PT KKKS Alpha Energi',
      kkks: 'PT KKKS Alpha Energi',
      jenisMm: 'SLC (Sumatera Light Crude)',
      tipeLifting: 'vessel',
      pembelian: 'Import',
      bagianPembelian: '85% Indonesia',
      kategoriInvoice: 'Provisional Invoice',
      totalVolume: 250000,
      volumeNominasi: 248000,
      volumeGross: 252000,
      volumeNet: 250000,
      volumeK3s: 212500,
      volumeGoi: 37500,
      kkksVolume: 212500,
      skkVolume: 37500,
      kkksPrice: 82.45,
      skkPrice: 82.45,
      priceUsdBbl: 82.45,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-09',
      dueDateFinal: '2026-04-16',
      waterContent: 0.05,
      apiGravity: 32.5,
      status: 'draft',
      statusText: 'Draft',
      createdAt: '09 Mar 2026, 10:00',
      updatedAt: '09 Mar 2026, 10:00',
      submittedAt: null,
      createdBy: 'John Doe (Pertamina)',
      updatedBy: 'John Doe (Pertamina)',
      catatan: '',
      verifikasiCatatan: '',
    },
    {
      id: 'LFT-20260305-I9J0',
      invoiceId: 'INV/26/BL-8816',
      blNumber: 'CT-2026/03-0105',
      blDate: '2026-03-05',
      vesselName: 'MT Sriwijaya',
      loadPort: 'Merak',
      dischargePort: 'Cilacap',
      liftingDate: '2026-03-05',
      kkks: 'PT Delta Energy',
      jenisMm: 'SLC (Sumatera Light Crude)',
      pembelian: 'Import',
      bagianPembelian: '60% Indonesia, 40% Japan',
      kategoriInvoice: 'First Invoice',
      volumeGross: 88000,
      volumeNet: 85000,
      totalVolume: 85000,
      volumeNominasi: 85500,
      volumeK3s: 51000,
      volumeGoi: 34000,
      kkksVolume: 51000,
      skkVolume: 34000,
      kkksPrice: 80.00,
      skkPrice: 80.00,
      priceUsdBbl: 80.00,
      kursBeliBi: 15450,
      dueDateInvoice: '2026-04-05',
      dueDateFinal: '2026-04-12',
      waterContent: 0.06,
      apiGravity: 30.8,
      status: 'revisi',
      statusText: 'Need Revision',
      createdAt: '25 Feb 2026, 16:20',
      updatedAt: '25 Feb 2026, 16:55',
      submittedAt: '25 Feb 2026, 16:20',
      catatan: '',
      verifikasiCatatan: 'File B/L tidak terbaca. Mohon unggah ulang.',
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

  // K3S (Kontraktor Kontrak Kerja Sama) list
  k3sList: [
    { id: 'K3S-001', nama: 'PT KKKS Alpha Energi', wilayahKerja: 'Blok Mahakam', negara: 'Indonesia', kontakPIC: 'Budi Santoso', email: 'budi@kkksalpha.com', status: 'Aktif' },
    { id: 'K3S-002', nama: 'PT KKKS Bravo Petroleum', wilayahKerja: 'Blok Cepu', negara: 'Indonesia', kontakPIC: 'Siti Rahma', email: 'siti@bravopetro.com', status: 'Aktif' },
    { id: 'K3S-003', nama: 'PT KKKS Charlie', wilayahKerja: 'Blok Rokan', negara: 'Indonesia', kontakPIC: 'Ahmad Fauzi', email: 'ahmad@charlie.co.id', status: 'Aktif' },
    { id: 'K3S-004', nama: 'Pertamina EP', wilayahKerja: 'Multiple Blocks', negara: 'Indonesia', kontakPIC: 'Retno Wulandari', email: 'retno@pertaminaep.com', status: 'Aktif' },
    { id: 'K3S-005', nama: 'PT Delta Energy', wilayahKerja: 'Blok Tangguh', negara: 'Indonesia', kontakPIC: 'Hendra Wijaya', email: 'hendra@deltaenergy.id', status: 'Aktif' },
    { id: 'K3S-006', nama: 'PT Echo Resources', wilayahKerja: 'Blok Masela', negara: 'Indonesia', kontakPIC: 'Dewi Kusuma', email: 'dewi@echoresources.com', status: 'Tidak Aktif' },
  ],

  // Supplier list
  supplierList: [
    { id: 'SUP-001', nama: 'Shell Trading & Shipping', negara: 'Netherlands', komoditas: 'Crude Oil, LNG', kontakPIC: 'James Wilson', email: 'jwilson@shell.com', status: 'Aktif' },
    { id: 'SUP-002', nama: 'BP Singapore Pte Ltd', negara: 'Singapore', komoditas: 'Crude Oil, Condensate', kontakPIC: 'Sarah Chen', email: 'schen@bp.com', status: 'Aktif' },
    { id: 'SUP-003', nama: 'Vitol Asia Pte Ltd', negara: 'Singapore', komoditas: 'Crude Oil', kontakPIC: 'Michael Park', email: 'mpark@vitol.com', status: 'Aktif' },
    { id: 'SUP-004', nama: 'Trafigura Pte Ltd', negara: 'Singapore', komoditas: 'LPG, Condensate', kontakPIC: 'Anna Müller', email: 'amuller@trafigura.com', status: 'Aktif' },
    { id: 'SUP-005', nama: 'Gunvor International BV', negara: 'Netherlands', komoditas: 'Crude Oil', kontakPIC: 'Pierre Dubois', email: 'pdubois@gunvor.com', status: 'Aktif' },
    { id: 'SUP-006', nama: 'Mitsui & Co Petroleum', negara: 'Japan', komoditas: 'Crude Oil, LNG', kontakPIC: 'Takashi Yamamoto', email: 'tyamamoto@mitsui.com', status: 'Aktif' },
  ],

  // Dated Brent daily prices
  datedBrentPrices: [
    { id: 'DBR-260330', tanggal: '2026-03-30', harga: 74.85, perubahan: +0.42, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260329', tanggal: '2026-03-29', harga: 74.43, perubahan: -0.71, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260328', tanggal: '2026-03-28', harga: 75.14, perubahan: +1.02, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260327', tanggal: '2026-03-27', harga: 74.12, perubahan: -0.35, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260326', tanggal: '2026-03-26', harga: 74.47, perubahan: +0.88, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260325', tanggal: '2026-03-25', harga: 73.59, perubahan: -0.22, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260324', tanggal: '2026-03-24', harga: 73.81, perubahan: +0.53, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260323', tanggal: '2026-03-23', harga: 73.28, perubahan: -1.12, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260322', tanggal: '2026-03-22', harga: 74.40, perubahan: +0.65, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260321', tanggal: '2026-03-21', harga: 73.75, perubahan: -0.48, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260320', tanggal: '2026-03-20', harga: 74.23, perubahan: +1.35, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260319', tanggal: '2026-03-19', harga: 72.88, perubahan: -0.90, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260318', tanggal: '2026-03-18', harga: 73.78, perubahan: +0.25, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260317', tanggal: '2026-03-17', harga: 73.53, perubahan: +0.72, sumber: 'Platts Brent Assessment' },
    { id: 'DBR-260316', tanggal: '2026-03-16', harga: 72.81, perubahan: -1.20, sumber: 'Platts Brent Assessment' },
  ],

  // Kurs BI (JISDOR) daily prices
  kursBI: [
    { id: 'KRS-260330', tanggal: '2026-03-30', harga: 15725.00, sumber: 'Bank Indonesia' },
    { id: 'KRS-260329', tanggal: '2026-03-29', harga: 15710.00, sumber: 'Bank Indonesia' },
    { id: 'KRS-260328', tanggal: '2026-03-28', harga: 15735.00, sumber: 'Bank Indonesia' },
    { id: 'KRS-260327', tanggal: '2026-03-27', harga: 15705.00, sumber: 'Bank Indonesia' },
    { id: 'KRS-260326', tanggal: '2026-03-26', harga: 15690.00, sumber: 'Bank Indonesia' },
  ],

  // Price Formula Crude Domestik
  priceFormulas: [
    { id: 'PF-001', namaFormula: 'Crude Domestik Standard', dasarHarga: 'ICP', penyesuaian: -1.50, satuan: 'USD/bbl', berlakuDari: '2026-01-01', berlakuSampai: '2026-03-31', keterangan: 'Formula standar crude domestik Q1 2026', status: 'Aktif' },
    { id: 'PF-002', namaFormula: 'Crude Domestik Premium', dasarHarga: 'Dated Brent', penyesuaian: -2.25, satuan: 'USD/bbl', berlakuDari: '2026-01-01', berlakuSampai: '2026-03-31', keterangan: 'Formula premium grade crude', status: 'Aktif' },
    { id: 'PF-003', namaFormula: 'Crude Rokan Formula', dasarHarga: 'ICP', penyesuaian: +0.75, satuan: 'USD/bbl', berlakuDari: '2026-02-01', berlakuSampai: '2026-04-30', keterangan: 'Formula khusus Blok Rokan', status: 'Aktif' },
    { id: 'PF-004', namaFormula: 'Condensate Standard', dasarHarga: 'Dated Brent', penyesuaian: +1.00, satuan: 'USD/bbl', berlakuDari: '2026-01-01', berlakuSampai: '2026-06-30', keterangan: 'Formula condensate semua blok', status: 'Aktif' },
    { id: 'PF-005', namaFormula: 'Crude Mahakam 2025', dasarHarga: 'ICP', penyesuaian: -0.50, satuan: 'USD/bbl', berlakuDari: '2025-01-01', berlakuSampai: '2025-12-31', keterangan: 'Formula Mahakam tahun 2025', status: 'Kadaluarsa' },
  ],

  // ICP System Data
  icpPeriode: 'Maret 2026',
  datedBrentRef: 73.50,
  mopsNaphthaRef: 620.75,

  // Price History — log setiap kali user mengubah harga referensi/alpha
  priceHistory: [
    { periode: 'Oktober 2025', datedBrent: 71.20, mopsNaphtha: 605.30, timestamp: '2025-10-15T10:00:00' },
    { periode: 'November 2025', datedBrent: 72.80, mopsNaphtha: 612.45, timestamp: '2025-11-15T10:00:00' },
    { periode: 'Desember 2025', datedBrent: 74.10, mopsNaphtha: 618.90, timestamp: '2025-12-15T10:00:00' },
    { periode: 'Januari 2026', datedBrent: 72.50, mopsNaphtha: 610.20, timestamp: '2026-01-15T10:00:00' },
    { periode: 'Februari 2026', datedBrent: 73.90, mopsNaphtha: 616.50, timestamp: '2026-02-15T10:00:00' },
    { periode: 'Maret 2026', datedBrent: 73.50, mopsNaphtha: 620.75, timestamp: '2026-03-15T10:00:00' },
  ],

  // Minyak Mentah Utama (Kepmen ESDM) — Price = Reference + Alpha
  // refType: 'brent' = Dated Brent, 'mops' = MOPS Naphtha
  primaryCrudes: [
    { id: 'PC-001', namaCrude: 'SLC (Sumatera Light Crude)', kode: 'SLC', refType: 'brent', alpha: 2.15, used: true },
    { id: 'PC-002', namaCrude: 'Attaka', kode: 'ATTAKA', refType: 'brent', alpha: 0.85, used: true },
    { id: 'PC-003', namaCrude: 'Duri', kode: 'DURI', refType: 'brent', alpha: -6.30, used: true },
    { id: 'PC-004', namaCrude: 'Belida', kode: 'BELIDA', refType: 'brent', alpha: 1.45, used: true },
    { id: 'PC-005', namaCrude: 'Senipah Condensate', kode: 'SENIPAH', refType: 'brent', alpha: 3.20, used: true },
    { id: 'PC-006', namaCrude: 'Banyu Urip', kode: 'BANYUURIP', refType: 'brent', alpha: 1.70, used: true },
  ],

  // Minyak Mentah Turunan — Price = Primary Crude Price + Alpha (or = Primary Crude Price)
  derivedCrudes: [
    { id: 'DC-001', namaCrude: 'Arjuna', baseRef: 'SLC', alpha: -0.50, used: true },
    { id: 'DC-002', namaCrude: 'Cinta', baseRef: 'SLC', alpha: -1.25, used: true },
    { id: 'DC-003', namaCrude: 'Widuri', baseRef: 'DURI', alpha: 0.00, used: true },
    { id: 'DC-004', namaCrude: 'Handil', baseRef: 'ATTAKA', alpha: -0.30, used: true },
    { id: 'DC-005', namaCrude: 'Badak (NGL)', baseRef: 'SENIPAH', alpha: -1.00, used: true },
    { id: 'DC-006', namaCrude: 'Minas', baseRef: 'SLC', alpha: 0.00, used: false },
    { id: 'DC-007', namaCrude: 'Jatibarang', baseRef: 'SLC', alpha: -2.10, used: true },
    { id: 'DC-008', namaCrude: 'Geragai', baseRef: 'SLC', alpha: -0.75, used: true },
    { id: 'DC-009', namaCrude: 'Sepinggan', baseRef: 'ATTAKA', alpha: 0.50, used: false },
    { id: 'DC-010', namaCrude: 'Cepu (Light)', baseRef: 'BANYUURIP', alpha: -0.20, used: true },
  ],
  // Value Added Tax (VAT) history
  vatList: [
    { id: 'VAT-001', bulan: 'Januari', tahun: '2026', rate: 11 },
    { id: 'VAT-002', bulan: 'Februari', tahun: '2026', rate: 11 },
    { id: 'VAT-003', bulan: 'Maret', tahun: '2026', rate: 11 },
    { id: 'VAT-004', bulan: 'April', tahun: '2026', rate: 11 },
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
  if (!raw) return { ...SEED_DATA };
  
  const saved = JSON.parse(raw);
  // Ensure liftings have the new fields
  if (saved.liftings) {
    const personnel = [
      'John Doe (Pertamina)',
      'Andi Wijaya (KKKS Alpha)',
      'Budi Santoso (Pertamina)',
      'Siti Aminah (KKKS Alpha)',
      'Rahmat Hidayat (Pertamina)',
      'Samsul Arifin (Verifikator)',
      'Ahmad Faisal (Pertamina EP)'
    ];
    saved.liftings = saved.liftings.map((l, index) => ({
      ...l,
      createdBy: l.createdBy || personnel[index % personnel.length],
      updatedBy: l.updatedBy || personnel[(index + 1) % personnel.length]
    }));
  }

  // Merge top-level keys to ensure new datasets from SEED_DATA are available
  const merged = { ...SEED_DATA, ...saved };
  return merged;
};

/**
 * Save data to the store.
 */
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ─── LIFTING CRUD ─────────────────────────────────────────

export const getAllLiftings = () => {
  const data = getData();
  return data.liftings || [];
};

export const getLiftingById = (id) => {
  const liftings = getAllLiftings();
  return liftings.find((l) => l.id === id) || null;
};

export const getLiftingsByStatus = (status) => {
  return getAllLiftings().filter((l) => l.status === status);
};

export const createDraft = (formData) => {
  const data = getData();
  const newLifting = {
    id: generateId(),
    invoiceId: null,
    createdBy: formData.createdBy || 'John Doe (Pertamina)',
    updatedBy: formData.createdBy || 'John Doe (Pertamina)',
    invoiceNumber: formData.invoiceNumber || '',
    invoiceDate: formData.invoiceDate || '',
    dueDateInvoice: formData.dueDateInvoice || '',
    blNumber: formData.blNumber || generateBLRef(),
    blDate: formData.blDate || '',
    vesselName: formData.vesselName || '',
    isPipeline: formData.isPipeline || false,
    loadPort: formData.loadPort || '',
    dischargePort: formData.dischargePort || '',
    liftingDate: formData.liftingDate || '',
    periodeLiftingBulan: formData.periodeLiftingBulan || '',
    periodeLiftingTahun: formData.periodeLiftingTahun || '',
    seller: formData.seller || '',
    kkks: formData.seller || formData.kkks || '',
    tipeLifting: formData.tipeLifting || '',
    kindOfTransaction: formData.kindOfTransaction || '',
    jenisMm: formData.jenisMm || '',
    pembelian: formData.pembelian || '',
    bagianPembelian: formData.bagianPembelian || '',
    kategoriInvoice: formData.kategoriInvoice || '',
    totalVolume: formData.totalVolume ? Number(formData.totalVolume) : null,
    volumeNominasi: formData.volumeNominasi ? Number(formData.volumeNominasi) : null,
    volumeK3s: formData.volumeNominasi ? Number(formData.volumeNominasi) : (formData.volumeK3s ? Number(formData.volumeK3s) : null),
    volumeGoi: formData.volumeGoi ? Number(formData.volumeGoi) : null,
    priceUsdBbl: formData.priceUsdBbl ? Number(formData.priceUsdBbl) : null,
    volumeGross: formData.volumeGross ? Number(formData.volumeGross) : null,
    volumeNet: formData.volumeNet ? Number(formData.volumeNet) : null,
    waterContent: formData.waterContent ? Number(formData.waterContent) : null,
    apiGravity: formData.apiGravity ? Number(formData.apiGravity) : null,
    status: 'draft',
    statusText: 'Draft',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
    submittedAt: null,
    createdBy: formData.createdBy || 'John Doe (Pertamina)', 
    catatan: formData.catatan || '',
    verifikasiCatatan: '',
    poMySap: formData.poMySap || '',
    poHardcopy: formData.poHardcopy || '',
    files: {
      invoice: formData.fileInvoice || null,
      bl: formData.fileBL || null,
      docLain: formData.fileDocLain || null,
    }
  };
  data.liftings.unshift(newLifting);
  saveData(data);
  return newLifting;
};

export const updateLifting = (id, formData) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const existing = data.liftings[index];
  const updated = {
    ...existing,
    invoiceNumber: formData.invoiceNumber ?? existing.invoiceNumber,
    invoiceDate: formData.invoiceDate ?? existing.invoiceDate,
    dueDateInvoice: formData.dueDateInvoice ?? existing.dueDateInvoice,
    dueDateFinal: formData.dueDateFinal ?? existing.dueDateFinal,
    blNumber: formData.blNumber ?? existing.blNumber,
    blDate: formData.blDate ?? existing.blDate,
    vesselName: formData.vesselName ?? existing.vesselName,
    isPipeline: formData.isPipeline ?? existing.isPipeline,
    loadPort: formData.loadPort ?? existing.loadPort,
    dischargePort: formData.dischargePort ?? existing.dischargePort,
    liftingDate: formData.liftingDate ?? existing.liftingDate,
    periodeLiftingBulan: formData.periodeLiftingBulan ?? existing.periodeLiftingBulan,
    periodeLiftingTahun: formData.periodeLiftingTahun ?? existing.periodeLiftingTahun,
    seller: formData.seller ?? existing.seller,
    kkks: formData.seller ?? (formData.kkks ?? existing.kkks),
    tipeLifting: formData.tipeLifting ?? existing.tipeLifting,
    kindOfTransaction: formData.kindOfTransaction ?? existing.kindOfTransaction,
    jenisMm: formData.jenisMm ?? existing.jenisMm,
    pembelian: formData.pembelian ?? existing.pembelian,
    bagianPembelian: formData.bagianPembelian ?? existing.bagianPembelian,
    kategoriInvoice: formData.kategoriInvoice ?? existing.kategoriInvoice,
    totalVolume: formData.totalVolume !== undefined ? (formData.totalVolume ? Number(formData.totalVolume) : null) : existing.totalVolume,
    volumeNominasi: formData.volumeNominasi !== undefined ? (formData.volumeNominasi ? Number(formData.volumeNominasi) : null) : existing.volumeNominasi,
    volumeK3s: formData.volumeK3s !== undefined ? (formData.volumeK3s ? Number(formData.volumeK3s) : null) : existing.volumeK3s,
    volumeGoi: formData.volumeGoi !== undefined ? (formData.volumeGoi ? Number(formData.volumeGoi) : null) : existing.volumeGoi,
    priceUsdBbl: formData.priceUsdBbl !== undefined ? (formData.priceUsdBbl ? Number(formData.priceUsdBbl) : null) : existing.priceUsdBbl,
    kursBeliBi: formData.kursBeliBi ?? existing.kursBeliBi,
    kkksProvEntitlement: formData.kkksProvEntitlement ?? existing.kkksProvEntitlement,
    kkksVolume: formData.kkksVolume ?? existing.kkksVolume,
    kkksAlpha: formData.kkksAlpha ?? existing.kkksAlpha,
    kkksPrice: formData.kkksPrice ?? existing.kkksPrice,
    skkProvEntitlement: formData.skkProvEntitlement ?? existing.skkProvEntitlement,
    skkVolume: formData.skkVolume ?? existing.skkVolume,
    skkAlpha: formData.skkAlpha ?? existing.skkAlpha,
    skkPrice: formData.skkPrice ?? existing.skkPrice,
    alpha: formData.alpha ?? existing.alpha,
    catatan: formData.catatan ?? existing.catatan,
    remarks: formData.remarks ?? existing.remarks,
    poMySap: formData.poMySap ?? existing.poMySap,
    poHardcopy: formData.poHardcopy ?? existing.poHardcopy,
    totalAmount: formData.totalAmount ?? existing.totalAmount,
    provEntilement: formData.provEntilement ?? existing.provEntilement,
    statusSp3: formData.statusSp3 ?? existing.statusSp3,
    nomorSp3: formData.nomorSp3 ?? existing.nomorSp3,
    updatedAt: getTimestamp(),
    updatedBy: formData.updatedBy || 'John Doe (Pertamina)', 
    files: {
      invoice: formData.fileInvoice ?? existing.files?.invoice,
      bl: formData.fileBL ?? existing.files?.bl,
      docLain: formData.fileDocLain ?? existing.files?.docLain,
    }
  };
  data.liftings[index] = updated;
  saveData(data);
  return updated;
};

export const submitLifting = (id) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  data.liftings[index] = {
    ...data.liftings[index],
    invoiceId: data.liftings[index].invoiceId || generateInvoiceId(),
    status: 'submitted',
    statusText: 'Submitted',
    submittedAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  saveData(data);
  return data.liftings[index];
};

export const generateAndAssignInvoiceId = (id) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;
  
  if (!data.liftings[index].invoiceId) {
    const newInvId = generateInvoiceId();
    data.liftings[index].invoiceId = newInvId;
    data.liftings[index].updatedAt = getTimestamp();
    saveData(data);
    return newInvId;
  }
  return data.liftings[index].invoiceId;
};

export const createAndSubmit = (formData) => {
  const draft = createDraft(formData);
  return submitLifting(draft.id);
};

export const approveLifting = (id, catatan = '', acuanHarga = '') => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  data.liftings[index] = {
    ...data.liftings[index],
    status: 'approved',
    statusText: 'Approved',
    approvedAt: getTimestamp(),
    updatedAt: getTimestamp(),
    verifikasiCatatan: catatan || data.liftings[index].verifikasiCatatan,
    acuanHarga: acuanHarga || data.liftings[index].acuanHarga,
  };
  saveData(data);
  return data.liftings[index];
};

export const rejectLifting = (id, catatan = '', isFinalReject = false) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const targetStatus = isFinalReject ? 'rejected' : 'revisi';
  const targetLabel = isFinalReject ? 'Rejected' : 'Need Revision';

  data.liftings[index] = {
    ...data.liftings[index],
    status: targetStatus,
    statusText: targetLabel,
    updatedAt: getTimestamp(),
    verifikasiCatatan: catatan,
  };
  saveData(data);
  return data.liftings[index];
};

export const deleteLifting = (id) => {
  const data = getData();
  const index = data.liftings.findIndex((l) => l.id === id);
  if (index === -1) return false;
  if (data.liftings[index].status !== 'draft' && data.liftings[index].status !== 'revisi') return false;

  data.liftings.splice(index, 1);
  saveData(data);
  return true;
};

// ─── KKKS REGISTRY ────────────────────────────────────────

export const getKKKSList = () => {
  const data = getData();
  return data.kkksRegistry || [];
};

// ─── K3S LIST ─────────────────────────────────────────────

export const getK3SList = () => {
  const data = getData();
  return data.k3sList || SEED_DATA.k3sList;
};

// ─── SUPPLIER LIST ────────────────────────────────────────

export const getSupplierList = () => {
  const data = getData();
  return data.supplierList || SEED_DATA.supplierList;
};

export const saveK3S = (k3s) => {
  const data = getData();
  if (!data.k3sList) data.k3sList = [...SEED_DATA.k3sList];
  if (k3s.id) {
    const idx = data.k3sList.findIndex(x => x.id === k3s.id);
    if (idx !== -1) data.k3sList[idx] = k3s;
  } else {
    data.k3sList.unshift({ ...k3s, id: `K3S-${String(data.k3sList.length + 1).padStart(3, '0')}` });
  }
  saveData(data);
};

export const saveSupplier = (sup) => {
  const data = getData();
  if (!data.supplierList) data.supplierList = [...SEED_DATA.supplierList];
  if (sup.id) {
    const idx = data.supplierList.findIndex(x => x.id === sup.id);
    if (idx !== -1) data.supplierList[idx] = sup;
  } else {
    data.supplierList.unshift({ ...sup, id: `SUP-${String(data.supplierList.length + 1).padStart(3, '0')}` });
  }
  saveData(data);
};

export const deleteK3S = (id) => {
  const data = getData();
  data.k3sList = data.k3sList.filter(x => x.id !== id);
  saveData(data);
};

export const deleteSupplier = (id) => {
  const data = getData();
  data.supplierList = data.supplierList.filter(x => x.id !== id);
  saveData(data);
};

// ─── KURS BI ──────────────────────────────────────────────

export const getKursBIList = () => {
  const data = getData();
  return data.kursBI || SEED_DATA.kursBI;
};

export const saveKursBI = (entry) => {
  const data = getData();
  if (!data.kursBI) data.kursBI = [...SEED_DATA.kursBI];
  if (entry.id) {
    const idx = data.kursBI.findIndex(x => x.id === entry.id);
    if (idx !== -1) data.kursBI[idx] = entry;
  } else {
    data.kursBI.unshift({ ...entry, id: `KRS-${Date.now()}` });
  }
  saveData(data);
};

export const deleteKursBI = (id) => {
  const data = getData();
  data.kursBI = data.kursBI.filter(x => x.id !== id);
  saveData(data);
};

export const getLatestKursBI = () => {
  const list = getKursBIList();
  if (list && list.length > 0) {
    return list[0]; // Assumes first is the latest by date (unshift used)
  }
  return null;
};

// ─── DATED BRENT ──────────────────────────────────────────

export const getDatedBrentPrices = () => {
  const data = getData();
  return data.datedBrentPrices || SEED_DATA.datedBrentPrices;
};

export const addDatedBrentPrice = (entry) => {
  const data = getData();
  if (!data.datedBrentPrices) data.datedBrentPrices = [];
  data.datedBrentPrices.unshift({ ...entry, id: `DBR-${Date.now()}` });
  saveData(data);
};

// ─── PRICE FORMULAS ───────────────────────────────────────

export const getPriceFormulas = () => {
  const data = getData();
  return data.priceFormulas || SEED_DATA.priceFormulas;
};

export const savePriceFormula = (formula) => {
  const data = getData();
  if (!data.priceFormulas) data.priceFormulas = [];
  if (formula.id) {
    const idx = data.priceFormulas.findIndex(f => f.id === formula.id);
    if (idx !== -1) data.priceFormulas[idx] = formula;
  } else {
    data.priceFormulas.unshift({ ...formula, id: `PF-${String(data.priceFormulas.length + 1).padStart(3, '0')}` });
  }
  saveData(data);
};

// ─── ICP SYSTEM ───────────────────────────────────────────

export const getIcpPeriode = () => {
  const data = getData();
  return data.icpPeriode || SEED_DATA.icpPeriode;
};

export const saveIcpPeriode = (periode) => {
  const data = getData();
  data.icpPeriode = periode;
  saveData(data);
};

export const getDatedBrentRef = () => {
  const data = getData();
  return data.datedBrentRef ?? SEED_DATA.datedBrentRef;
};

export const saveDatedBrentRef = (price) => {
  const data = getData();
  data.datedBrentRef = parseFloat(price);
  saveData(data);
};

export const getMopsNaphthaRef = () => {
  const data = getData();
  return data.mopsNaphthaRef ?? SEED_DATA.mopsNaphthaRef;
};

export const saveMopsNaphthaRef = (price) => {
  const data = getData();
  data.mopsNaphthaRef = parseFloat(price);
  saveData(data);
};

// Save all reference prices + log to history
export const saveRefPrices = ({ periode, datedBrent, mopsNaphtha }) => {
  const data = getData();
  data.icpPeriode = periode;
  data.datedBrentRef = parseFloat(datedBrent);
  data.mopsNaphthaRef = parseFloat(mopsNaphtha);
  // Append to history
  if (!data.priceHistory) data.priceHistory = [];
  const existing = data.priceHistory.findIndex(h => h.periode === periode);
  const entry = { periode, datedBrent: parseFloat(datedBrent), mopsNaphtha: parseFloat(mopsNaphtha), timestamp: new Date().toISOString() };
  if (existing !== -1) {
    data.priceHistory[existing] = entry;
  } else {
    data.priceHistory.push(entry);
  }
  saveData(data);
};

export const getPriceHistory = () => {
  const data = getData();
  return data.priceHistory || SEED_DATA.priceHistory;
};

export const getPrimaryCrudes = () => {
  const data = getData();
  return data.primaryCrudes || SEED_DATA.primaryCrudes;
};

export const savePrimaryCrude = (crude) => {
  const data = getData();
  if (!data.primaryCrudes) data.primaryCrudes = [...SEED_DATA.primaryCrudes];
  if (crude.id) {
    const idx = data.primaryCrudes.findIndex(c => c.id === crude.id);
    if (idx !== -1) {
      data.primaryCrudes[idx] = crude;
    } else {
      data.primaryCrudes.push(crude);
    }
  } else {
    const nextId = `PC-${String(data.primaryCrudes.length + 1).padStart(3, '0')}`;
    data.primaryCrudes.push({ ...crude, id: nextId });
  }
  saveData(data);
};

export const getDerivedCrudes = () => {
  const data = getData();
  return data.derivedCrudes || SEED_DATA.derivedCrudes;
};

export const saveDerivedCrude = (crude) => {
  const data = getData();
  if (!data.derivedCrudes) data.derivedCrudes = [...SEED_DATA.derivedCrudes];
  if (crude.id) {
    const idx = data.derivedCrudes.findIndex(c => c.id === crude.id);
    if (idx !== -1) {
      data.derivedCrudes[idx] = crude;
    } else {
      data.derivedCrudes.push(crude);
    }
  } else {
    const nextId = `DC-${String(data.derivedCrudes.length + 1).padStart(3, '0')}`;
    data.derivedCrudes.push({ ...crude, id: nextId });
  }
  saveData(data);
};

// ─── VAT LIST ─────────────────────────────────────────────

export const getVatList = () => {
  const data = getData();
  return data.vatList || SEED_DATA.vatList;
};

export const saveVat = (vat) => {
  const data = getData();
  if (!data.vatList) data.vatList = [...SEED_DATA.vatList];
  if (vat.id) {
    const idx = data.vatList.findIndex(x => x.id === vat.id);
    if (idx !== -1) data.vatList[idx] = vat;
  } else {
    data.vatList.unshift({ ...vat, id: `VAT-${Date.now()}` });
  }
  saveData(data);
};

export const deleteVat = (id) => {
  const data = getData();
  data.vatList = data.vatList.filter(x => x.id !== id);
  saveData(data);
};

// Helper: compute a primary crude's ICP price
export const getPrimaryCrudePrice = (kode) => {
  const brent = getDatedBrentRef();
  const mops = getMopsNaphthaRef();
  const primaries = getPrimaryCrudes();
  const crude = primaries.find(c => c.kode === kode);
  if (!crude) return null;
  const basePrice = crude.refType === 'mops' ? mops : brent;
  return parseFloat((basePrice + crude.alpha).toFixed(2));
};

// ─── STATISTICS ───────────────────────────────────────────

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

export const resetStore = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
};

// ─── STATIC REFERENCE DATA ────────────────────────────────

export const LOAD_PORT_OPTIONS = [
  'Dumai', 'Cilacap', 'Balikpapan', 'Bontang', 'Merak', 'Tuban',
  'Sungai Pakning', 'Tanjung Uban', 'Lawe-lawe', 'Sorong',
  'Singapore', 'Rotterdam', 'Fujairah', 'Ras Tanura', 'Ruwais',
];

export const JENIS_MM_OPTIONS = [
  'Crude Oil', 'Condensate', 'LPG', 'LNG', 'Naphtha', 'Fuel Oil', 'Gasoline',
];

export const KATEGORI_INVOICE_OPTIONS = [
  'Provisional Invoice', 'First Invoice', 'Second Invoice',
  'Final Invoice', 'Supplementary Invoice', 'Credit Note', 'Debit Note',
];

export const DISCHARGE_PORT_OPTIONS = [
  'Dumai', 'Cilacap', 'Balikpapan', 'Bontang', 'Merak', 'Tuban',
  'Sungai Pakning', 'Tanjung Uban', 'Lawe-lawe', 'Sorong',
  'Plaju', 'Balongan', 'Kasim',
];

export const KIND_OF_TRANSACTION_OPTIONS = [
  'Provisional',
  'Final',
  'Adjustment',
  'Adjusment SP3 Kurang Bayar',
  'Adjusment SP3 Lebih Bayar',
  'Adjusment SP3 PPL Kurang Bayar',
  'Adjusment SP3 PPL Lebih Bayar',
  'PPL Provisional',
  'PPL Realisasi',
  'PPL Realisasi (Provisional)',
  'SP3 PPL',
  'SP3 Reguler (Final)',
  'SP3 Reguler (Nett Off)',
  'SP3 Reguler (Prov)',
];

export const STATUS_SP3_OPTIONS = [
  'Create SP3',
  'Done',
  'Wait Invoice'
];

export const PEMBELIAN_OPTIONS = [
  'Import',
  'Domestik',
];
