import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Activity, DollarSign, AlertCircle, CheckCircle, Upload, Save, FileText, Download, ChevronLeft, Search, Plus, Edit2, Trash2, Filter, MoreHorizontal, ArrowUpDown, CheckSquare, X, Eye, Bell, MapPin, Zap, Info } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  getAllLiftings, getLiftingById, createDraft, updateLifting, submitLifting, lockLifting, createAndSubmit,
  approveLifting, rejectLifting, deleteLifting, getKKKSList, getStats, getK3SList,
  getSupplierList, getDatedBrentPrices, getPriceFormulas,
  getIcpPeriode, saveIcpPeriode, getDatedBrentRef, saveDatedBrentRef,
  getMopsNaphthaRef, saveMopsNaphthaRef, saveRefPrices, getPriceHistory,
  getPrimaryCrudes, savePrimaryCrude, getDerivedCrudes, saveDerivedCrude, getPrimaryCrudePrice,
  getKursBIList, getLatestKursBI, saveKursBI, deleteKursBI, saveK3S, saveSupplier, deleteK3S, deleteSupplier,
  getVatList, saveVat, deleteVat,
  STATUS, JENIS_MM_OPTIONS,
  KATEGORI_INVOICE_OPTIONS, LOAD_PORT_OPTIONS, DISCHARGE_PORT_OPTIONS, KIND_OF_TRANSACTION_OPTIONS, STATUS_SP3_OPTIONS,
  PEMBELIAN_OPTIONS, SKEMA_KOMERSIALISASI_OPTIONS, generateAndAssignInvoiceId
} from './dataStore';
export const Dashboard = () => {
  const [viewMode, setViewMode] = useState('gabungan');

  // ICP & Brent price trend data
  const priceData = [
    { name: '01 Mar', ICP: 80.12, Brent: 82.40 },
    { name: '05 Mar', ICP: 81.00, Brent: 83.15 },
    { name: '10 Mar', ICP: 80.75, Brent: 82.90 },
    { name: '15 Mar', ICP: 81.50, Brent: 83.60 },
    { name: '20 Mar', ICP: 82.00, Brent: 84.10 },
    { name: '25 Mar', ICP: 82.45, Brent: 84.85 },
    { name: '30 Mar', ICP: 82.80, Brent: 74.85 },
  ];

  const chartData = [
    { name: 'Jan', realisasi: 4000, estimasi: 4400 },
    { name: 'Feb', realisasi: 3000, estimasi: 3200 },
    { name: 'Mar', realisasi: 2000, estimasi: 2400 },
    { name: 'Apr', realisasi: 2780, estimasi: 2900 },
    { name: 'May', realisasi: 1890, estimasi: 2000 },
    { name: 'Jun', realisasi: 2390, estimasi: 2500 },
  ];

  const topLoadportImport = [
    { name: 'Singapore', volume: 420000 },
    { name: 'Rotterdam', volume: 310000 },
    { name: 'Fujairah', volume: 280000 },
    { name: 'Ras Tanura', volume: 185000 },
  ];

  const topLoadportDomestik = [
    { name: 'Dumai', volume: 380000 },
    { name: 'Balikpapan', volume: 310000 },
    { name: 'Cilacap', volume: 260000 },
    { name: 'Bontang', volume: 175000 },
  ];

  const invoiceData = [
    { id: 'INV/26/BL-8812', tanggal: '09 Mar 2026', kkks: 'PT KKKS Alpha Energi', tipe: 'Realisasi', volume: 250000, totalUsd: 20612500.00, status: 'Selesai' },
    { id: 'INV/26/BL-8813', tanggal: '08 Mar 2026', kkks: 'PT KKKS Bravo Petroleum', tipe: 'Realisasi', volume: 125500, totalUsd: 10347238.12, status: 'Selesai' },
    { id: 'EST/26/BL-9001', tanggal: '15 Mar 2026', kkks: 'Pertamina EP', tipe: 'Estimasi', volume: 300000, totalUsd: 24735000.00, status: 'Proyeksi' },
    { id: 'EST/26/BL-9002', tanggal: '22 Mar 2026', kkks: 'PT KKKS Charlie', tipe: 'Estimasi', volume: 150000, totalUsd: 12367500.00, status: 'Proyeksi' },
    { id: 'INV/26/BL-8810', tanggal: '02 Mar 2026', kkks: 'Pertamina EP', tipe: 'Realisasi', volume: 280000, totalUsd: 23086000.00, status: 'Selesai' },
  ];

  const filteredInvoices = invoiceData.filter(inv => {
    if (viewMode === 'gabungan') return true;
    if (viewMode === 'estimasi') return inv.tipe === 'Estimasi';
    if (viewMode === 'realisasi') return inv.tipe === 'Realisasi';
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* ── Exception Signal Banner ── */}
      <div style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.03) 100%)', border: '1px solid rgba(239,68,68,0.25)', borderLeft: '4px solid #ef4444', borderRadius: '10px', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444', animation: 'exPulse 1.6s ease-in-out infinite', display: 'inline-block' }} />
          <span style={{ fontWeight: 700, color: '#ef4444', fontSize: 13 }}>EXCEPTION SIGNAL AKTIF</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>3 invoice sudah <strong style={{ color: '#ef4444' }}>Overdue</strong>, 2 invoice jatuh tempo dalam <strong style={{ color: '#f59e0b' }}>≤ 3 hari</strong> — total eksposur <strong>$129.5M</strong> belum dibayar.</span>
        <button onClick={() => window.location.href = '/settlement'} style={{ background: 'transparent', border: 'none', marginLeft: 'auto', fontSize: 12, color: '#ef4444', textDecoration: 'underline', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>Lihat Exception Signal →</button>
      </div>

      {/* ── Header ── */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h1>Dashboard Realisasi & Estimasi</h1>
          <p className="text-muted mt-2">Gambaran umum penyelesaian transaksi Feedstock & KKKS</p>
        </div>
        <div className="flex gap-4 w-full-mobile">
          <button className="btn btn-primary w-full-mobile"><Activity size={16} /> Unduh Ringkasan</button>
        </div>
      </div>

      {/* ── KPI Cards: 4 items ── */}
      <div className="grid-cols-4 mb-8">
        <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider">Total Tagihan (USD)</h3>
            <div style={{ background: 'rgba(0,82,156,0.1)', color: 'var(--accent)', padding: '7px', borderRadius: '8px' }}><DollarSign size={18} /></div>
          </div>
          <div className="text-3xl font-bold mb-1">$90.1M</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>7 invoice aktif bulan ini</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--success)' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider">Total Verified (USD)</h3>
            <div style={{ background: 'rgba(0,166,81,0.1)', color: 'var(--success)', padding: '7px', borderRadius: '8px' }}><CheckCircle size={18} /></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success)' }}>$30.9M</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Sudah terverifikasi L2</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--warning)' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider">Invoice Menunggu Verifikasi (Jumlah)</h3>
            <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', padding: '7px', borderRadius: '8px' }}><AlertCircle size={18} /></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--warning)' }}>24</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Menunggu review L1</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #8b5cf6' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider">Verified Invoice (Jumlah)</h3>
            <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '7px', borderRadius: '8px' }}><CheckSquare size={18} /></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#8b5cf6' }}>18</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Invoice selesai diverifikasi</div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-cols-2 mb-8">
        {/* ICP & Brent Price Chart */}
        <div className="card" style={{ height: '340px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pergerakan Harga ICP & Dated Brent</h3>
            <div className="flex gap-3 text-xs">
              <span style={{ color: '#00529c', fontWeight: 600 }}>● ICP</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>● Brent</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            ICP Mar: <strong style={{ color: 'var(--accent)' }}>$82.45/bbl</strong> &nbsp;|&nbsp; Brent: <strong style={{ color: '#f59e0b' }}>$74.85/bbl</strong>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={priceData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={[70, 90]} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(v, n) => [`$${v}/bbl`, n]} />
              <Line type="monotone" dataKey="ICP" stroke="#00529c" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Brent" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trend chart lifted vs estimated */}
        <div className="card" style={{ height: '340px' }}>
          <h3 className="mb-4 font-semibold">Tren Realisasi vs Estimasi Lifting</h3>
          <ResponsiveContainer width="100%" height="86%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRealisasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00529c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00529c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEstimasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00a651" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00a651" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}M`} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={30} />
              <Area type="monotone" dataKey="realisasi" stroke="#00529c" strokeWidth={2} fillOpacity={1} fill="url(#colorRealisasi)" />
              <Area type="monotone" dataKey="estimasi" stroke="#00a651" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorEstimasi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Loadport ── */}
      <div className="grid-cols-2 mb-8">
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={16} color="var(--accent)" /> Top Loadport Import</h3>
          {topLoadportImport.map((lp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="flex justify-between text-sm mb-1"><span>{lp.name}</span><span className="font-semibold">{lp.volume.toLocaleString()} BBL</span></div>
              <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                <div style={{ background: 'var(--accent)', borderRadius: 4, height: 6, width: `${(lp.volume / 420000) * 100}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={16} color="var(--success)" /> Top Loadport Domestik</h3>
          {topLoadportDomestik.map((lp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="flex justify-between text-sm mb-1"><span>{lp.name}</span><span className="font-semibold">{lp.volume.toLocaleString()} BBL</span></div>
              <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                <div style={{ background: 'var(--success)', borderRadius: 4, height: 6, width: `${(lp.volume / 380000) * 100}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transaction Table ── */}
      <div>
        <div className="flex-responsive justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rincian Transaksi Lifting</h2>
          <div className="flex gap-3">
            <div className="tabs-container" style={{ marginBottom: 0 }}>
              {['gabungan', 'estimasi', 'realisasi'].map(m => (
                <button key={m} className={`tab-btn ${viewMode === m ? 'active' : ''}`} onClick={() => setViewMode(m)} style={{ textTransform: 'capitalize' }}>{m}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead><tr>
              <th>No. Referensi</th><th>Tanggal</th><th>KKKS Tertaut</th>
              <th>Tipe Data</th><th>Volume (BBL)</th><th>Total Nilai (USD)</th><th>Status</th>
            </tr></thead>
            <tbody>
              {filteredInvoices.map((inv, idx) => (
                <tr key={idx}>
                  <td className="font-medium" style={{ color: 'var(--accent-light)' }}>{inv.id}</td>
                  <td>{inv.tanggal}</td><td>{inv.kkks}</td>
                  <td><span className="badge" style={{ background: inv.tipe === 'Realisasi' ? 'rgba(0,82,156,0.1)' : 'rgba(0,166,81,0.1)', color: inv.tipe === 'Realisasi' ? 'var(--accent)' : 'var(--success)' }}>{inv.tipe}</span></td>
                  <td>{inv.volume.toLocaleString()}</td>
                  <td className="font-medium">${inv.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td><span className="badge" style={{ background: inv.status === 'Selesai' ? '#f1f5f9' : 'rgba(245,158,11,0.1)', color: inv.status === 'Selesai' ? 'var(--text-muted)' : 'var(--warning)', border: inv.status === 'Selesai' ? '1px solid var(--border)' : '1px solid rgba(245,158,11,0.2)' }}>{inv.status}</span></td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-muted">Tidak ada data.</td></tr>}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
            <span className="text-sm text-muted">Menampilkan {filteredInvoices.length} baris data</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes exPulse{0%,100%{box-shadow:0 0 0 3px rgba(239,68,68,0.25)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0.06)}}`}</style>
    </div>
  );
};

export const DataSubmission = () => {
  const [tab, setTab] = useState('manual');
  const navigate = useNavigate();
  const kkksList = getKKKSList();

  // Mock current user mapping: Pertamina EP
  const MAPPED_K3S = 'Pertamina EP';

  const emptyLiftingForm = {
    periodeLiftingBulan: String(new Date().getMonth() + 1).padStart(2, '0'),
    periodeLiftingTahun: String(new Date().getFullYear()),
    seller: '',
    jenisMm: '',
    blNumber: '',
    blDate: '',
    tipeLifting: 'vessel',
    vesselName: '',
    loadPort: '',
    dischargePort: '',
    totalVolume: '',
    volumeNominasi: '',
    // additional fields preserved for compatibility
    kkks: '',
    isPipeline: false,
    kindOfTransaction: 'Provisional',
    pembelian: 'Domestik',
    bagianPembelian: '',
    volumeK3s: '',
    volumeGoi: 0,
    apiGravity: '',
    waterContent: '',
    catatan: '',
    poMySap: '',
    poHardcopy: '',
    skemaKomersialisasi: SKEMA_KOMERSIALISASI_OPTIONS[0],
  };

  const [form, setForm] = useState(emptyLiftingForm);
  const [toast, setToast] = useState(null);
  const [liftings, setLiftings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Detail Penagihan
  const [penagihanModal, setPenagihanModal] = useState({ isOpen: false, liftingId: null, form: {} });

  const refreshData = useCallback(() => setLiftings(getAllLiftings()), []);
  useEffect(() => { refreshData(); }, [refreshData]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (field, value) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      if (field === 'pembelian' && value === 'Import') {
        newForm.skemaKomersialisasi = '';
      }
      if (field === 'totalVolume' || field === 'volumeK3s') {
        const total = parseFloat(newForm.totalVolume) || 0;
        const k3s = parseFloat(newForm.volumeK3s) || 0;
        newForm.volumeGoi = total - k3s;
      }
      return newForm;
    });
  };

  const handleFileChange = (field, file) => {
    setPenagihanModal(prev => ({
      ...prev,
      form: { ...prev.form, [field]: file?.name || null }
    }));
  };

  const generateInternalInvoiceId = () => {
    const rdm = Math.floor(1000 + Math.random() * 9000);
    return `INV/26/BL-${rdm}`;
  };

  const handleSaveDataLifting = () => {
    if (!form.periodeLiftingBulan || !form.periodeLiftingTahun || !form.seller || !form.jenisMm || !form.blDate) {
      showToast('Lengkapi data mandatory (*): Periode, Seller, Jenis Cargo, dan BL Date', 'error'); return;
    }
    createDraft(form);
    showToast('Data Lifting berhasil disimpan sebagai Draft.');
    setForm(emptyLiftingForm);
    refreshData();
  };

  const handleOpenPenagihan = (l) => {
    navigate(`/operasional/submission/edit/${l.id}`);
  };

  const handleSubmitPenagihan = () => {
    const pForm = penagihanModal.form;
    if (!pForm.invoiceNumber || !pForm.priceUsdBbl) {
      showToast('Nomor Invoice dan Harga (USD/bbl) wajib diisi untuk Submit.', 'error'); return;
    }
    const targetLifting = liftings.find(x => x.id === penagihanModal.liftingId);

    if (targetLifting) {
      updateLifting(targetLifting.id, pForm);
      const submitted = submitLifting(targetLifting.id);
      showToast(`Invoice berhasil disubmit. Ref ID: ${submitted.invoiceId}`);
      setPenagihanModal({ isOpen: false, liftingId: null, form: {} });
      refreshData();
    }
  };


  return (
    <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>
      {toast && (
        <div className={`toast flex items-center gap-2 ${toast.type === 'error' ? 'toast-error' : toast.type === 'warning' ? 'toast-warning' : 'toast-success'}`} style={{ position: 'fixed', top: 20, right: 20, zIndex: 999 }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : toast.type === 'warning' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* ── Modal Detail Penagihan ── */}
      {penagihanModal.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content animate-pop-in" style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '12px', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Isi Detail Penagihan</h2>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px' }}
                onClick={() => setPenagihanModal({ isOpen: false, liftingId: null, form: {} })}
              >
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            <p className="text-sm text-muted mb-6">Lengkapi detail penagihan (harga dan dokumen) atas Data Lifting yang telah disiapkan sebelum di-submit ke sistem Verifikasi.</p>

            <div className="grid-cols-2" style={{ gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Nomor Invoice <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="input-control" placeholder="Contoh: INV/2026/001" value={penagihanModal.form.invoiceNumber} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, invoiceNumber: e.target.value } }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Price (USD/bbl) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="number" step="0.01" className="input-control" placeholder="0.00" value={penagihanModal.form.priceUsdBbl} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, priceUsdBbl: e.target.value } }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Invoice Date</label>
                <input type="date" className="input-control" value={penagihanModal.form.invoiceDate} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, invoiceDate: e.target.value } }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Due Date Invoice</label>
                <input type="date" className="input-control" value={penagihanModal.form.dueDateInvoice} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, dueDateInvoice: e.target.value } }))} />
              </div>
              <div className="input-group">
                <label className="input-label">No. PO MySAP</label>
                <input type="text" className="input-control" placeholder="Masukkan No. PO MySAP..." value={penagihanModal.form.poMySap || ''} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, poMySap: e.target.value } }))} />
              </div>
              <div className="input-group">
                <label className="input-label">No. PO Hardcopy</label>
                <input type="text" className="input-control" placeholder="Masukkan No. PO Hardcopy..." value={penagihanModal.form.poHardcopy || ''} onChange={e => setPenagihanModal(p => ({ ...p, form: { ...p.form, poHardcopy: e.target.value } }))} />
              </div>
            </div>

            <div className="mt-6 mb-4">
              <h3 className="text-sm font-semibold mb-3 tracking-wider">Upload Dokumen Penagihan</h3>
              <div className="flex flex-col gap-3">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    className={`card-upload ${penagihanModal.form.fileInvoice ? 'has-file' : ''}`}
                    style={{ padding: '12px 8px' }}
                    onClick={() => document.getElementById('modal-file-invoice').click()}
                  >
                    <input type="file" id="modal-file-invoice" hidden onChange={e => handleFileChange('fileInvoice', e.target.files[0])} />
                    <div className="card-upload-icon" style={{ width: 32, height: 32 }}>
                      {penagihanModal.form.fileInvoice ? <CheckCircle size={16} /> : <Upload size={16} />}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Invoice PDF</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {penagihanModal.form.fileInvoice || 'Belum ada file'}
                    </span>
                  </div>

                  <div
                    className={`card-upload ${penagihanModal.form.fileBL ? 'has-file' : ''}`}
                    style={{ padding: '12px 8px' }}
                    onClick={() => document.getElementById('modal-file-bl').click()}
                  >
                    <input type="file" id="modal-file-bl" hidden onChange={e => handleFileChange('fileBL', e.target.files[0])} />
                    <div className="card-upload-icon" style={{ width: 32, height: 32 }}>
                      {penagihanModal.form.fileBL ? <CheckCircle size={16} /> : <Upload size={16} />}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>B/L PDF</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {penagihanModal.form.fileBL || 'Belum ada file'}
                    </span>
                  </div>

                  <div
                    className={`card-upload ${penagihanModal.form.fileFakturPajak ? 'has-file' : ''}`}
                    style={{ padding: '12px 8px' }}
                    onClick={() => document.getElementById('modal-file-faktur').click()}
                  >
                    <input type="file" id="modal-file-faktur" hidden onChange={e => handleFileChange('fileFakturPajak', e.target.files[0])} />
                    <div className="card-upload-icon" style={{ width: 32, height: 32 }}>
                      {penagihanModal.form.fileFakturPajak ? <CheckCircle size={16} /> : <Upload size={16} />}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Faktur Pajak</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {penagihanModal.form.fileFakturPajak || 'Belum ada file'}
                    </span>
                  </div>

                  <div
                    className={`card-upload ${penagihanModal.form.fileDocLain ? 'has-file' : ''}`}
                    style={{ padding: '12px 8px' }}
                    onClick={() => document.getElementById('modal-file-doc').click()}
                  >
                    <input type="file" id="modal-file-doc" hidden onChange={e => handleFileChange('fileDocLain', e.target.files[0])} />
                    <div className="card-upload-icon" style={{ width: 32, height: 32 }}>
                      {penagihanModal.form.fileDocLain ? <CheckCircle size={16} /> : <Upload size={16} />}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Dokumen Lain</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {penagihanModal.form.fileDocLain || 'Lainnya'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setPenagihanModal({ isOpen: false, liftingId: null, form: {} })}>Batalkan</button>
              <button className="btn btn-primary" onClick={handleSubmitPenagihan}><CheckCircle size={16} /> Finalisasi & Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h1>Registrasi Data Lifting</h1>
          <p className="text-muted mt-2">Daftarkan data lifting baru atau upload melalui form Excel massal.</p>
        </div>
      </div>

      {/* ── Input Section Data Lifting ── */}
      <div className="card mb-8">
        <div className="mb-6 flex gap-3 tab-strip">
          <button className={`tab-pill ${tab === 'manual' ? 'active' : ''}`} onClick={() => setTab('manual')}>Input Manual Lifting</button>
          <button className={`tab-pill ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>Bulk Upload Lifting</button>
        </div>

        {tab === 'manual' ? (
          <>
            <h3 className="mb-4 font-semibold text-main">Rincian Data Lifting Minyak</h3>
            <div className="grid-cols-2 mb-8" style={{ gap: '20px' }}>
              {/* Section 1: Basic Info */}
              <div className="input-group">
                <label className="input-label">Periode Lifting <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px' }}>
                  <select className="input-control" value={form.periodeLiftingBulan} onChange={e => handleChange('periodeLiftingBulan', e.target.value)}>
                    <option value="01">Januari</option><option value="02">Februari</option><option value="03">Maret</option>
                    <option value="04">April</option><option value="05">Mei</option><option value="06">Juni</option>
                    <option value="07">Juli</option><option value="08">Agustus</option><option value="09">September</option>
                    <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
                  </select>
                  <select className="input-control" value={form.periodeLiftingTahun} onChange={e => handleChange('periodeLiftingTahun', e.target.value)}>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Seller <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select className="input-control" value={form.seller} onChange={e => handleChange('seller', e.target.value)}>
                  <option value="">-- Pilih Seller --</option>
                  <optgroup label="KKKS (K3S)">
                    {getK3SList().map((k) => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                  </optgroup>
                  <optgroup label="Suppliers">
                    {getSupplierList().map((s) => <option key={s.id} value={s.nama}>{s.nama}</option>)}
                  </optgroup>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Jenis Cargo (Master ICP) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select className="input-control" value={form.jenisMm} onChange={e => handleChange('jenisMm', e.target.value)}>
                  <option value="">-- Pilih Master ICP --</option>
                  <optgroup label="Primary Crudes">
                    {getPrimaryCrudes().map(c => <option key={c.id} value={c.namaCrude || c.nama}>{c.namaCrude || c.nama}</option>)}
                  </optgroup>
                  <optgroup label="Derived Crudes">
                    {getDerivedCrudes().map(c => <option key={c.id} value={c.namaCrude || c.nama}>{c.namaCrude || c.nama}</option>)}
                  </optgroup>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">B/L Dated <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="input-control" value={form.blDate} onChange={e => handleChange('blDate', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Tipe Lifting</label>
                <select className="input-control" value={form.tipeLifting} onChange={e => handleChange('tipeLifting', e.target.value)}>
                  <option value="vessel">Vessel</option>
                  <option value="pipeline">Pipeline</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Name Vessel</label>
                <input type="text" className="input-control" disabled={form.tipeLifting !== 'vessel'} placeholder={form.tipeLifting === 'vessel' ? "Contoh: MT Pertamina Prime" : "N/A (Pipeline)"} value={form.vesselName} onChange={e => handleChange('vesselName', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Loading Port (Dummy)</label>
                <select className="input-control" value={form.loadPort} onChange={e => handleChange('loadPort', e.target.value)}>
                  <option value="">-- Pilih Loading Port --</option>
                  {LOAD_PORT_OPTIONS.map(lp => <option key={lp} value={lp}>{lp}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Discharge Port (Dummy)</label>
                <select className="input-control" value={form.dischargePort} onChange={e => handleChange('dischargePort', e.target.value)}>
                  <option value="">-- Pilih Discharge Port --</option>
                  {DISCHARGE_PORT_OPTIONS.map(dp => <option key={dp} value={dp}>{dp}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">B/L Number</label>
                <input type="text" className="input-control" placeholder="Contoh: BL-88204" value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Volume Realisasi (bbls)</label>
                <input type="number" className="input-control" placeholder="0" value={form.totalVolume} onChange={e => handleChange('totalVolume', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Tipe Transaksi</label>
                <select className="input-control" value={form.pembelian} onChange={e => handleChange('pembelian', e.target.value)}>
                  {PEMBELIAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Skema Komersialisasi</label>
                <select
                  className="input-control"
                  disabled={form.pembelian === 'Import'}
                  value={form.skemaKomersialisasi}
                  onChange={e => handleChange('skemaKomersialisasi', e.target.value)}
                >
                  <option value="">-- Pilih Skema --</option>
                  {SKEMA_KOMERSIALISASI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary" onClick={handleSaveDataLifting} style={{ padding: '12px 24px' }}><Save size={18} /> Simpan Data Lifting (Draft)</button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center mb-4" style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,82,156,0.08)', color: 'var(--accent)' }}>
              <Upload size={28} />
            </div>
            <h2 className="mb-2">Bulk Upload (Excel/CSV)</h2>
            <p className="max-w-md mx-auto mb-6 text-muted text-sm">
              Upload form Data Lifting secara massal. Data yang diunggah akan otomatis disimpan sebagai <span className="font-semibold text-gray-700">Draft</span>. Detail Penagihan dapat ditambahkan kemudian.
            </p>
            <div className="flex justify-center gap-3 mb-8">
              <button className="btn btn-outline" style={{ background: 'var(--bg-surface)' }}><Download size={16} /> Unduh Template</button>
              <button className="btn btn-primary"><Upload size={16} /> Upload Form Data</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Draft Data Table ── */}
      <div className="card">
        <div className="flex justify-between items-center mb-4" style={{ padding: '0 8px' }}>
          <h2 className="text-base font-semibold" style={{ margin: 0 }}>Detail Invoice & Penagihan</h2>
          <div className="flex items-center gap-2" style={{ width: '300px', background: 'var(--bg-surface)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Cari KKKS, Cargo, atau No B/L..."
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px', width: '100%', height: '24px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="table-container">
          <table style={{ minWidth: '1000px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                <th>Nomor B/L & Tgl</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
                <th>Created By</th>
                <th>Vessel / Pipeline</th>
                <th>Transaction & Cargo</th>
                <th>Loading Port</th>
                <th style={{ textAlign: 'center' }}>Tipe Transaksi</th>
                <th style={{ textAlign: 'center' }}>BL Date</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = (liftings || []).filter(l => {
                  const s = searchTerm.toLowerCase();
                  return (
                    (l.seller && l.seller.toLowerCase().includes(s)) ||
                    (l.kkks && l.kkks.toLowerCase().includes(s)) ||
                    (l.jenisMm && l.jenisMm.toLowerCase().includes(s)) ||
                    (l.blNumber && l.blNumber.toLowerCase().includes(s))
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="10" className="text-center py-12">
                        <div className="text-muted mb-2">Tidak ada data yang cocok dengan pencarian "{searchTerm}"</div>
                        <button className="btn btn-outline btn-sm" onClick={() => setSearchTerm('')}>Reset Pencarian</button>
                      </td>
                    </tr>
                  );
                }

                return filtered.map(l => {
                  const statusStyles = {
                    draft: { label: 'Drafted', bg: '#f1f5f9', color: '#64748b' },
                    lifting_locked: { label: 'Lifting Locked', bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
                    submitted: { label: 'Submitted', bg: 'rgba(0,131,255,0.1)', color: '#0083ff' },
                    revisi: { label: 'Need Revision', bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
                    approved: { label: 'Approved', bg: 'rgba(0,166,81,0.1)', color: '#00a651' },
                    rejected: { label: 'Rejected', bg: 'rgba(239,68,68,0.1)', color: '#ef4444' }
                  };
                  const st = statusStyles[l.status] || statusStyles.draft;

                  return (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.blNumber || 'No B/L'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.blDate || '-'}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`btn btn-sm ${l.status === 'draft' || l.status === 'revisi' || l.status === 'lifting_locked' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ padding: '6px 14px', borderRadius: '4px' }}
                          onClick={() => navigate(`/operasional/submission/edit/${l.id}`)}
                        >
                          {l.status === 'draft' || l.status === 'revisi' ? (
                            <><Edit2 size={13} style={{ marginRight: '4px' }} /> Proses</>
                          ) : l.status === 'lifting_locked' ? (
                            <><Plus size={13} style={{ marginRight: '4px' }} /> Penagihan</>
                          ) : (
                            <><Eye size={13} style={{ marginRight: '4px' }} /> Detail</>
                          )}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{l.createdBy || 'John Doe (Pertamina)'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>{l.seller || l.kkks || '-'}</div>
                      </td>
                      <td>
                        <div>{l.isPipeline ? <span className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>Pipeline</span> : (l.vesselName || 'MT Unassigned')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.loadPort || 'Unknown'} → {l.dischargePort || 'Unknown'}</div>
                      </td>
                      <td>
                        <div>{l.kindOfTransaction || 'Regular'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.jenisMm || 'Crude Oil'}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {l.loadPort || '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge" style={{
                          background: l.pembelian === 'Import' ? 'rgba(239,68,68,0.08)' : 'rgba(0,166,81,0.08)',
                          color: l.pembelian === 'Import' ? '#ef4444' : '#00a651',
                          fontWeight: 600
                        }}>
                          {l.pembelian || 'Domestik'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: '13px' }}>
                        {l.blDate || '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}22`, fontWeight: 700, minWidth: '100px', textAlign: 'center' }}>
                          {st.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>{l.updatedBy || '-'}</div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



export const EditLifting = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const kkksList = getKKKSList();

  const emptyForm = {
    invoiceNumber: '',
    invoiceDate: '',
    dueDateInvoice: '', // Provisional
    dueDateFinal: '',
    blNumber: '',
    blDate: '',
    kkks: '',
    vesselName: '',
    isPipeline: false,
    tipeLifting: 'vessel',
    loadPort: '',
    dischargePort: '',
    kindOfTransaction: 'Provisional',
    jenisMm: '',
    pembelian: 'Domestik',
    bagianPembelian: '',
    kategoriInvoice: 'Provisional Invoice',
    totalVolume: '',
    volumeNominasi: '',
    volumeK3s: '',
    volumeGoi: 0,
    priceUsdBbl: '',
    volumeGross: '',
    volumeNet: '',
    apiGravity: '',
    waterContent: '',
    catatan: '',
    remarks: '',
    poMySap: '',
    poHardcopy: '',
    totalAmount: '',
    alpha: 0,
    provEntilement: '',
    kursBeliBi: '',
    statusSp3: 'Create SP3',
    nomorSp3: '',
    fileInvoice: null,
    fileBL: null,
    fileDocLain: null,
    icpPrice: 0,
  };

  const [form, setForm] = useState(emptyForm);
  const [originalStatus, setOriginalStatus] = useState('draft');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!id) return;
    const data = getLiftingById(id);
    if (data) {
      const latestKurs = getLatestKursBI();
      const primaries = getPrimaryCrudes();
      const deriveds = getDerivedCrudes();
      const crude = primaries.find(c => (c.namaCrude || c.nama) === data.jenisMm) || deriveds.find(c => (c.namaCrude || c.nama) === data.jenisMm);
      const currentIcp = crude ? getPrimaryCrudePrice(crude.kode || crude.baseRef) : 0;

      setForm({
        ...data,
        invoiceNumber: data.invoiceNumber || '',
        invoiceDate: data.invoiceDate || '',
        dueDateInvoice: data.dueDateInvoice || '',
        dueDateFinal: data.dueDateFinal || '',
        kindOfTransaction: data.kindOfTransaction || 'Provisional',
        pembelian: data.pembelian || 'Domestik',
        kategoriInvoice: data.kategoriInvoice || 'Provisional Invoice',
        totalVolume: data.totalVolume ?? '',
        volumeNominasi: data.volumeNominasi ?? '',
        priceUsdBbl: data.priceUsdBbl ?? '',
        kursBeliBi: data.kursBeliBi || (latestKurs ? latestKurs.harga : ''),
        statusSp3: data.statusSp3 || 'Create SP3',
        nomorSp3: data.nomorSp3 || `SP3-${Math.floor(100000 + Math.random() * 900000)}`,
        alpha: data.alpha ?? 0,
        remarks: data.remarks || '',
        icpPrice: currentIcp,
      });
      setOriginalStatus(data.status);
    }
  }, [id]);

  useEffect(() => {
    if (form.jenisMm) {
      const primaries = getPrimaryCrudes();
      const deriveds = getDerivedCrudes();
      const crude = primaries.find(c => (c.namaCrude || c.nama) === form.jenisMm) || deriveds.find(c => (c.namaCrude || c.nama) === form.jenisMm);
      if (crude) {
        const primaryPrice = getPrimaryCrudePrice(crude.kode || crude.baseRef);
        const finalPrice = primaryPrice + (crude.alpha || 0);
        setForm(prev => ({
          ...prev,
          alpha: crude.alpha ?? prev.alpha,
          icpPrice: primaryPrice,
          priceUsdBbl: finalPrice || prev.priceUsdBbl
        }));
      }
    }
  }, [form.jenisMm]);

  useEffect(() => {
    const vol = parseFloat(form.totalVolume) || 0;
    const prc = parseFloat(form.priceUsdBbl) || 0;
    const newTotal = (vol * prc).toFixed(2);
    if (form.totalAmount !== newTotal) {
      setForm(prev => ({ ...prev, totalAmount: newTotal }));
    }
  }, [form.totalVolume, form.priceUsdBbl]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleChange = (field, value) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      if (field === 'pembelian' && value === 'Import') {
        newForm.skemaKomersialisasi = '';
      }
      if (field === 'totalVolume' || field === 'volumeK3s') {
        const total = parseFloat(newForm.totalVolume) || 0;
        const k3s = parseFloat(newForm.volumeK3s) || 0;
        newForm.volumeGoi = total - k3s;
      }
      return newForm;
    });
  };

  const handleFileChange = (field, file) => {
    setForm(prev => ({ ...prev, [field]: file?.name || null }));
  };

  const handleSaveDraft = () => {
    updateLifting(id, form);
    showToast('Draft berhasil diperbarui');
    setTimeout(() => navigate('/operasional/submission'), 1200);
  };

  const handleSubmit = () => {
    if (!form.kindOfTransaction || !form.invoiceNumber || !form.invoiceDate || !form.dueDateInvoice) {
      showToast('Lengkapi field wajib yang bertanda bintang (*) sebelum submit', 'error'); return;
    }
    updateLifting(id, form);
    submitLifting(id);
    showToast('Data berhasil disubmit ke verifikasi L1');
    setTimeout(() => navigate('/operasional/submission'), 1200);
  };

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      deleteLifting(id);
      showToast('Data berhasil dihapus');
      navigate('/operasional/submission');
    }
  };

  const statusBadge = {
    draft: { bg: '#f1f5f9', color: 'var(--text-muted)', text: 'Draft' },
    revisi: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Butuh Perbaikan' },
    lifting_locked: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', text: 'Lifting Terkunci (Siap Penagihan)' },
    submitted: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', text: 'Sedang Diverifikasi' },
    approved: { bg: 'rgba(0, 166, 81, 0.1)', color: 'var(--success)', text: 'Approved' },
  };
  const st = statusBadge[originalStatus] || { bg: '#f1f5f9', color: 'var(--text-muted)', text: originalStatus };

  // Lifting data is read-only unless it's draft or needs revision
  const isLiftingReadOnly = originalStatus !== 'draft' && originalStatus !== 'revisi';

  // Invoice data is EDITABLE ONLY when lifting has been locked/verified
  const isInvoiceReadOnly = originalStatus !== 'lifting_locked';

  const isReadOnly = isLiftingReadOnly && isInvoiceReadOnly; // Global flag for buttons if needed

  const showLiftingOnly = originalStatus === 'draft' || originalStatus === 'revisi';
  const showInvoiceOnly = originalStatus === 'lifting_locked';
  const showBothColumns = !showLiftingOnly && !showInvoiceOnly;

  return (
    <div className="animate-fade-in">
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 100, padding: '14px 24px', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease-out' }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/operasional/submission')} className="btn btn-outline" style={{ padding: '8px 12px', borderRadius: '10px' }}>
          <ChevronLeft size={18} /> Kembali
        </button>
        <div style={{ flex: 1 }}>
          <h1>{isReadOnly ? 'Detail Invoice Submission' : 'Edit Invoice Submission'}</h1>
          <p className="text-muted mt-1" style={{ fontSize: '14px' }}>
            Internal ID: <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{id}</span>
          </p>
        </div>
        <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}` }}>{st.text}</span>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm" style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>
        <div style={{ display: showBothColumns ? 'flex' : 'block', gap: showBothColumns ? '32px' : '0' }}>
          {/* Left Column: Data Lifting Review */}
          {(!showInvoiceOnly) && (
            <div style={{ flex: 1, borderRight: showBothColumns ? '1px solid var(--border)' : 'none', paddingRight: showBothColumns ? '24px' : '0', maxWidth: showBothColumns ? 'none' : '900px', margin: showBothColumns ? '0' : '0 auto' }}>
              <h2 className="text-base font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--accent)' }}><Activity size={18} /> Rincian Data Lifting Minyak</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Periode Bulan</label>
                  <select className="input-control" disabled={isLiftingReadOnly} value={form.periodeLiftingBulan} onChange={e => handleChange('periodeLiftingBulan', e.target.value)}>
                    <option value="01">Januari</option><option value="02">Februari</option><option value="03">Maret</option>
                    <option value="04">April</option><option value="05">Mei</option><option value="06">Juni</option>
                    <option value="07">Juli</option><option value="08">Agustus</option><option value="09">September</option>
                    <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Periode Tahun</label>
                  <select className="input-control" disabled={isLiftingReadOnly} value={form.periodeLiftingTahun} onChange={e => handleChange('periodeLiftingTahun', e.target.value)}>
                    <option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option>
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Seller</label>
                  <select className="input-control" disabled={isLiftingReadOnly} value={form.seller} onChange={e => handleChange('seller', e.target.value)}>
                    <option value="">-- Pilih Seller --</option>
                    <optgroup label="KKKS (K3S)">
                      {getK3SList().map((k) => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                    </optgroup>
                    <optgroup label="Suppliers">
                      {getSupplierList().map((s) => <option key={s.id} value={s.nama}>{s.nama}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Jenis Cargo</label>
                  <select className="input-control" disabled={isLiftingReadOnly} value={form.jenisMm} onChange={e => handleChange('jenisMm', e.target.value)}>
                    <option value="">-- Pilih Crude --</option>
                    <optgroup label="Primary Crudes">
                      {getPrimaryCrudes().map(c => <option key={c.id} value={c.namaCrude || c.nama}>{c.namaCrude || c.nama}</option>)}
                    </optgroup>
                    <optgroup label="Derived Crudes">
                      {getDerivedCrudes().map(c => <option key={c.id} value={c.namaCrude || c.nama}>{c.namaCrude || c.nama}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">B/L Dated</label>
                  <input type="date" className="input-control" disabled={isLiftingReadOnly} value={form.blDate} onChange={e => handleChange('blDate', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">B/L Number</label>
                  <input type="text" className="input-control" disabled={isReadOnly} value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} placeholder="Contoh: BL-2026/01" />
                </div>
                <div className="input-group">
                  <label className="input-label">Tipe Lifting</label>
                  <select className="input-control" disabled={isReadOnly} value={form.tipeLifting} onChange={e => handleChange('tipeLifting', e.target.value)}>
                    <option value="vessel">Vessel</option>
                    <option value="pipeline">Pipeline</option>
                  </select>
                </div>
                {form.tipeLifting === 'vessel' && (
                  <div className="input-group" style={{ gridColumn: 'span 1' }}>
                    <label className="input-label">Vessel Name</label>
                    <input type="text" className="input-control" disabled={isReadOnly} value={form.vesselName} onChange={e => handleChange('vesselName', e.target.value)} />
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Loading Port</label>
                  <select className="input-control" disabled={isReadOnly} value={form.loadPort} onChange={e => handleChange('loadPort', e.target.value)}>
                    {LOAD_PORT_OPTIONS.map(lp => <option key={lp} value={lp}>{lp}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Discharge Port</label>
                  <select className="input-control" disabled={isReadOnly} value={form.dischargePort} onChange={e => handleChange('dischargePort', e.target.value)}>
                    {DISCHARGE_PORT_OPTIONS.map(dp => <option key={dp} value={dp}>{dp}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Total Volume Realisasi (bbls)</label>
                  <input type="number" className="input-control" disabled={isLiftingReadOnly} value={form.totalVolume} onChange={e => handleChange('totalVolume', e.target.value)} />
                </div>
                <div className="input-group" style={{ gridColumn: (originalStatus === 'draft' || originalStatus === 'revisi') ? 'span 1' : 'span 2' }}>
                  <label className="input-label">Tipe Transaksi</label>
                  <select className="input-control" disabled={isLiftingReadOnly} value={form.pembelian} onChange={e => handleChange('pembelian', e.target.value)}>
                    {PEMBELIAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="input-group" style={{ gridColumn: (originalStatus === 'draft' || originalStatus === 'revisi') ? 'span 1' : 'span 2' }}>
                  <label className="input-label">Skema Komersialisasi</label>
                  <select
                    className="input-control"
                    disabled={isLiftingReadOnly || form.pembelian === 'Import'}
                    value={form.skemaKomersialisasi}
                    onChange={e => handleChange('skemaKomersialisasi', e.target.value)}
                  >
                  <option value="">-- Pilih Skema --</option>
                  {SKEMA_KOMERSIALISASI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6" style={{ borderTop: '1px dashed var(--border)' }}>
                <div className="input-group mb-4">
                  <label className="input-label">Remarks (Free Text)</label>
                  <textarea className="input-control" rows="3" disabled={isLiftingReadOnly} value={form.remarks} onChange={e => handleChange('remarks', e.target.value)} placeholder="Tulis catatan tambahan..."></textarea>
                </div>
              </div>

              {showLiftingOnly && (
                <div className="mt-8 pt-6 flex justify-end gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-ghost text-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}><Trash2 size={16} /> Hapus Draft</button>
                  <button className="btn btn-outline" onClick={handleSaveDraft}><Save size={16} /> Simpan Draft</button>
                  <button className="btn btn-primary" style={{ background: 'var(--success)', border: 'none' }} onClick={(e) => {
                    e.preventDefault();
                    // Native window.confirm removed to prevent silent block failures.
                    updateLifting(id, form);
                    lockLifting(id);
                    showToast('Data Lifting berhasil dikunci. Membuka form penagihan...');
                    setOriginalStatus('lifting_locked');
                    setForm(prev => ({ ...prev, status: 'lifting_locked' }));
                  }}><CheckSquare size={16} /> Kunci Data Lifting</button>
                </div>
              )}
            </div>
          )}

          {/* Right Column: Billing Input */}
          {(!showLiftingOnly) && (
            <div style={{ flex: 1.5, maxWidth: showBothColumns ? 'none' : '1000px', margin: showBothColumns ? '0' : '0 auto' }}>
              <h2 className="text-base font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--success)' }}><DollarSign size={18} /> Detail Penagihan & Keuangan</h2>
              <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                <div className="input-group">
                  <label className="input-label">Kind of Transaction <span className="text-danger">*</span></label>
                  <select className="input-control" disabled={isInvoiceReadOnly} value={form.kindOfTransaction} onChange={e => handleChange('kindOfTransaction', e.target.value)}>
                    {KIND_OF_TRANSACTION_OPTIONS
                      .filter(opt => form.pembelian !== 'Import' || ['Provisional', 'Final'].includes(opt))
                      .map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Invoice Number <span className="text-danger">*</span></label>
                  <input type="text" className="input-control" disabled={isInvoiceReadOnly} value={form.invoiceNumber} onChange={e => handleChange('invoiceNumber', e.target.value)} placeholder="INV/2026/..." />
                </div>
                <div className="input-group">
                  <label className="input-label">Invoice Date <span className="text-danger">*</span></label>
                  <input type="date" className="input-control" disabled={isInvoiceReadOnly} value={form.invoiceDate} onChange={e => handleChange('invoiceDate', e.target.value)} />
                </div>

                <div className="input-group">
                  <label className="input-label">No. PO MySAP</label>
                  <input type="text" className="input-control" disabled={isInvoiceReadOnly} value={form.poMySap} onChange={e => handleChange('poMySap', e.target.value)} placeholder="Masukkan No. PO MySAP..." />
                </div>
                <div className="input-group">
                  <label className="input-label">No. PO Hardcopy</label>
                  <input type="text" className="input-control" disabled={isInvoiceReadOnly} value={form.poHardcopy} onChange={e => handleChange('poHardcopy', e.target.value)} placeholder="Masukkan No. PO Hardcopy..." />
                </div>

                <div className="input-group">
                  <label className="input-label">Due Date Provisional <span className="text-danger">*</span></label>
                  <input type="date" className="input-control" disabled={isInvoiceReadOnly} value={form.dueDateInvoice} onChange={e => handleChange('dueDateInvoice', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Due Date Final</label>
                  <input type="date" className="input-control" disabled={isInvoiceReadOnly} value={form.dueDateFinal} onChange={e => handleChange('dueDateFinal', e.target.value)} />
                </div>
                {form.pembelian !== 'Import' && (
                  <div className="input-group">
                    <label className="input-label">Kurs BI (IDR/USD) <span className="text-danger">*</span></label>
                    <input type="number" className="input-control" disabled={isInvoiceReadOnly} value={form.kursBeliBi} onChange={e => handleChange('kursBeliBi', e.target.value)} placeholder="15xxx" />
                    {!isInvoiceReadOnly && (
                      <div
                        style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,82,156,0.05)', transition: 'all 0.2s' }}
                        onClick={() => handleChange('kursBeliBi', getLatestKursBI()?.harga || 15725)}
                        title="Klik untuk menyontek Master Rate"
                      >
                        Master Rate: <span style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'underline' }}>
                          Rp {(getLatestKursBI()?.harga || 15725).toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontSize: '10px', fontStyle: 'italic', opacity: 0.8 }}>(Klik untuk gunakan)</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Total Price (USD/bbl)</label>
                  <div className="input-control" style={{ background: 'var(--bg-surface)', fontWeight: 700, color: 'var(--accent)' }}>
                    ${(parseFloat(form.priceUsdBbl) || 0).toFixed(2)}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Volume Check (%)</label>
                  <div className="input-control" style={{
                    background: 'var(--bg-surface)',
                    fontWeight: 800,
                    color: (Math.abs(((parseFloat(form.kkksVolume) || 0) + (parseFloat(form.skkVolume) || 0)) - (parseFloat(form.totalVolume) || 0)) < 1) ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {parseFloat(form.totalVolume) > 0
                      ? (((parseFloat(form.kkksVolume) || 0) + (parseFloat(form.skkVolume) || 0)) / parseFloat(form.totalVolume) * 100).toFixed(2) + '%'
                      : '0.00%'}
                  </div>
                </div>
              </div>

              {form.pembelian !== 'Import' && (
                <>
                  {/* Section 1: Entitlement KKKS */}
                  {(form.skemaKomersialisasi === 'Election In Kind (KKKS or SHU)' || form.skemaKomersialisasi === 'Election Not to Take In Kind (SKK Migas)') && (
                    <div className="mt-8 p-6 rounded-xl" style={{ border: '2px solid rgba(0,82,156,0.1)', background: '#fff' }}>
                    <h3 className="text-sm font-bold text-muted uppercase mb-4 flex items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                      Entitlement KKKS
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label text-xs">Prov Entitlement (%)</label>
                        <input type="number" className="input-control text-sm" disabled={isReadOnly} value={form.kkksProvEntitlement} onChange={e => handleChange('kkksProvEntitlement', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Volume (bbl)</label>
                        <input type="number" className="input-control text-sm" disabled={isReadOnly} value={form.kkksVolume} onChange={e => handleChange('kkksVolume', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">ICP (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.icpPrice} onChange={e => handleChange('icpPrice', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Alpha (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.kkksAlpha} onChange={e => handleChange('kkksAlpha', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Total Price (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.kkksPrice} onChange={e => handleChange('kkksPrice', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-6 pt-4" style={{ borderTop: '1px dashed var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-xs text-muted mb-1">Amount (USD)</div>
                        <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                          ${Number((parseFloat(form.kkksVolume) || 0) * (parseFloat(form.kkksPrice) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    </div>
                  )}

                  {/* Section 2: SKK Migas */}
                  {form.skemaKomersialisasi === 'Election In Kind (SKK Migas)' && (
                    <div className="mt-6 p-6 rounded-xl" style={{ border: '2px solid rgba(0,166,81,0.1)', background: '#fff' }}>
                    <h3 className="text-sm font-bold text-muted uppercase mb-4 flex items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                      Entitlement SKK Migas (GOI)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label text-xs">Prov Entitlement (%)</label>
                        <input type="number" className="input-control text-sm" disabled={isReadOnly} value={form.skkProvEntitlement} onChange={e => handleChange('skkProvEntitlement', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Volume (bbl)</label>
                        <input type="number" className="input-control text-sm" disabled={isReadOnly} value={form.skkVolume} onChange={e => handleChange('skkVolume', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">ICP (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.icpPrice} onChange={e => handleChange('icpPrice', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Alpha (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.skkAlpha || 0} onChange={e => handleChange('skkAlpha', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label text-xs">Total Price (USD/bbl)</label>
                        <input type="number" step="0.01" className="input-control text-sm" disabled={isReadOnly} value={form.skkPrice} onChange={e => handleChange('skkPrice', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-6 pt-4" style={{ borderTop: '1px dashed var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-xs text-muted mb-1">Amount (USD)</div>
                        <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>
                          ${Number((parseFloat(form.skkVolume) || 0) * (parseFloat(form.skkPrice) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
                </>
              )}

              {/* Documents Section */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <Upload size={16} /> Dokumen Penagihan & Pendukung
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                  <div className={`card-upload ${form.fileInvoice ? 'has-file' : ''}`} style={{ pointerEvents: isReadOnly ? 'none' : 'auto' }} onClick={() => !isReadOnly && document.getElementById('file-invoice').click()}>
                    <input type="file" id="file-invoice" hidden onChange={e => handleFileChange('fileInvoice', e.target.files[0])} />
                    <div className="card-upload-icon">{form.fileInvoice ? <CheckCircle size={22} /> : <FileText size={22} />}</div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Invoice</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.fileInvoice || (isReadOnly ? 'Tidak ada file' : 'Drop file invoice')}
                    </span>
                  </div>
                  <div className={`card-upload ${form.fileBL ? 'has-file' : ''}`} style={{ pointerEvents: isReadOnly ? 'none' : 'auto' }} onClick={() => !isReadOnly && document.getElementById('file-bl').click()}>
                    <input type="file" id="file-bl" hidden onChange={e => handleFileChange('fileBL', e.target.files[0])} />
                    <div className="card-upload-icon">{form.fileBL ? <CheckCircle size={22} /> : <FileText size={22} />}</div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>B/L</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.fileBL || (isReadOnly ? 'Tidak ada file' : 'Drop file B/L')}
                    </span>
                  </div>
                  <div className={`card-upload ${form.fileFakturPajak ? 'has-file' : ''}`} style={{ pointerEvents: isReadOnly ? 'none' : 'auto' }} onClick={() => !isReadOnly && document.getElementById('file-faktur-pajak').click()}>
                    <input type="file" id="file-faktur-pajak" hidden onChange={e => handleFileChange('fileFakturPajak', e.target.files[0])} />
                    <div className="card-upload-icon">{form.fileFakturPajak ? <CheckCircle size={22} /> : <FileText size={22} />}</div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Faktur Pajak</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.fileFakturPajak || (isReadOnly ? 'Tidak ada file' : 'Drop file faktur')}
                    </span>
                  </div>
                  <div className={`card-upload ${form.fileDocLain ? 'has-file' : ''}`} style={{ pointerEvents: isReadOnly ? 'none' : 'auto' }} onClick={() => !isReadOnly && document.getElementById('file-other').click()}>
                    <input type="file" id="file-other" hidden onChange={e => handleFileChange('fileDocLain', e.target.files[0])} />
                    <div className="card-upload-icon">{form.fileDocLain ? <CheckCircle size={22} /> : <FileText size={22} />}</div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Dokumen Lain</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.fileDocLain || (isReadOnly ? 'Tidak ada file' : 'Dokumen pendukung')}
                    </span>
                  </div>
                </div>
              </div>

              {showInvoiceOnly && (
                <div className="mt-8 pt-6 flex justify-end gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-outline" onClick={() => {
                    updateLifting(id, form);
                    showToast('Draft Penagihan disimpan.');
                    setTimeout(() => navigate('/operasional/submission'), 800);
                  }}><Save size={16} /> Simpan Draft Penagihan</button>
                  <button className="btn btn-primary" onClick={handleSubmit}><CheckCircle size={16} /> Submit Verifikasi Final</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export const VerificationPage = () => {

  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [liftings, setLiftings] = useState([]);

  useEffect(() => { setLiftings(getAllLiftings().filter(l => l.status !== 'draft')); }, []);

  const filteredData = liftings.filter(item => {
    const matchesSearch = (item.blNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) || (item.kkks || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'Semua Status') return matchesSearch;
    if (statusFilter === 'Menunggu Review') return matchesSearch && item.status === 'submitted';
    if (statusFilter === 'Butuh Perbaikan') return matchesSearch && item.status === 'revisi';
    if (statusFilter === 'Approved') return matchesSearch && item.status === 'approved';
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted': return <span className="badge badge-warning">Menunggu Review L1</span>;
      case 'revisi': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Butuh Perbaikan</span>;
      case 'approved': return <span className="badge badge-success">Approved (Tembus L2)</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getActionButton = (status, id) => {
    switch (status) {
      case 'submitted':
        return <button onClick={() => navigate(`/operasional/verifikasi/${id}`)} className="btn btn-sm btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}><CheckSquare size={14} /> Lihat Detail</button>;
      case 'revisi':
        return <button onClick={() => navigate(`/operasional/verifikasi/${id}`)} className="btn btn-sm btn-primary" style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', border: 'none' }}><Activity size={14} /> Lihat Detail</button>;
      case 'approved':
        return <button onClick={() => navigate(`/operasional/verifikasi/${id}`)} className="btn btn-sm btn-outline" style={{ padding: '6px 12px', fontSize: '12px', opacity: 0.7 }}><FileText size={14} /> Lihat Arsip</button>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1>Data Verification Inbox</h1>
        <p className="text-muted mt-2">Antrean verifikasi L1 dan pengelolaan perbaikan dokumen lifting.</p>
      </div>

      {/* Top Action Bar */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div className="flex-responsive gap-2 w-full-mobile">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Cari ID atau KKKS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px' }}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center w-full-mobile">
          <span className="text-sm font-medium text-muted">Status:</span>
          <select
            className="input-field w-full-mobile"
            style={{ padding: '8px 12px', background: 'var(--bg-surface)' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Semua Status</option>
            <option>Menunggu Review</option>
            <option>Butuh Perbaikan</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Referensi (B/L)</th>
              <th>Entitas (KKKS)</th>
              <th>Tanggal Lifting</th>
              <th>Klaim Vol (BBL)</th>
              <th>Status Perkara</th>
              <th>Catatan Terakhir</th>
              <th>Tindakan Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row.id}>
                <td className="font-medium">{row.blNumber}</td>
                <td>{row.kkks}</td>
                <td>{row.liftingDate}</td>
                <td>{row.volumeNet ? row.volumeNet.toLocaleString() : '-'}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: row.status === 'revisi' ? '#ef4444' : 'var(--text-muted)' }}>
                  {row.verifikasiCatatan || '-'}
                </td>
                <td className="flex gap-2">
                  {getActionButton(row.status, row.id)}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-muted">Tidak ada dokumen yang sesuai dengan kriteria pencarian/filter.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
          <span className="text-sm text-muted">Menampilkan {filteredData.length} baris dokumen aktif</span>
        </div>
      </div>
    </div>
  );
};

export const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('icp');

  // ICP state
  const [datedBrent, setDatedBrent] = useState(73.50);
  const [mopsNaphtha, setMopsNaphtha] = useState(620.75);
  const [icpPeriode, setIcpPeriodeState] = useState('');
  const [primaryCrudes, setPrimaryCrudes] = useState([]);
  const [derivedCrudes, setDerivedCrudes] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [derivedSearch, setDerivedSearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Other tabs state
  const [k3sList, setK3sList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [k3sSearch, setK3sSearch] = useState('');
  const [vatList, setVatList] = useState([]);
  const [kursBIList, setKursBIList] = useState([]);

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = [2024, 2025, 2026, 2027];

  useEffect(() => {
    refreshIcpData();
    refreshOtherData();
  }, []);

  const refreshOtherData = () => {
    setK3sList(getK3SList());
    setSupplierList(getSupplierList());
    setVatList(getVatList());
    setKursBIList(getKursBIList());
  };

  const refreshIcpData = () => {
    setDatedBrent(getDatedBrentRef());
    setMopsNaphtha(getMopsNaphthaRef());
    setIcpPeriodeState(getIcpPeriode());
    setPrimaryCrudes(getPrimaryCrudes());
    setDerivedCrudes(getDerivedCrudes());
    setPriceHistory(getPriceHistory());
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Compute prices — refType determines base price source
  const getPrimaryPrice = (alpha, refType) => {
    const base = refType === 'mops' ? mopsNaphtha : datedBrent;
    return parseFloat((base + alpha).toFixed(2));
  };
  const getDerivedPrice = (baseRef, alpha) => {
    const baseCrude = primaryCrudes.find(c => c.kode === baseRef);
    if (!baseCrude) return 0;
    const base = baseCrude.refType === 'mops' ? mopsNaphtha : datedBrent;
    return parseFloat((base + baseCrude.alpha + alpha).toFixed(2));
  };

  // Filtered derived crudes
  const filteredDerived = derivedSearch
    ? derivedCrudes.filter(c => c.namaCrude.toLowerCase().includes(derivedSearch.toLowerCase()))
    : derivedCrudes;

  // Save handlers
  const handleSaveRef = () => {
    const combinedPeriode = `${editingItem.bulan} ${editingItem.tahun}`;
    saveRefPrices({ periode: combinedPeriode, datedBrent: editingItem.datedBrent, mopsNaphtha: editingItem.mopsNaphtha });
    refreshIcpData();
    setEditSection(null);
    setEditingItem(null);
    showToast('Harga referensi berhasil diperbarui');
  };

  const handleSavePrimary = () => {
    const combinedPeriode = `${editingItem.bulan} ${editingItem.tahun}`;
    savePrimaryCrude({ ...editingItem, periode: combinedPeriode });
    refreshIcpData();
    setEditSection(null);
    setEditingItem(null);
    setSelectedId(null);
    showToast(editingItem.id ? 'Minyak Mentah Utama berhasil diperbarui' : 'Minyak Mentah Utama berhasil ditambahkan');
  };

  const handleSaveDerived = () => {
    const combinedPeriode = `${editingItem.bulan} ${editingItem.tahun}`;
    saveDerivedCrude({ ...editingItem, periode: combinedPeriode });
    refreshIcpData();
    setEditSection(null);
    setEditingItem(null);
    setSelectedId(null);
    showToast('Minyak Mentah Turunan berhasil disimpan');
  };

  const handleSaveOther = () => {
    if (editSection === 'k3s') {
      saveK3S(editingItem);
      showToast('Partner K3S berhasil diperbarui');
    } else if (editSection === 'supplier') {
      saveSupplier(editingItem);
      showToast('Supplier berhasil diperbarui');
    } else if (editSection === 'vat') {
      saveVat(editingItem);
      showToast('Master Data VAT berhasil diperbarui');
    } else if (editSection === 'kursBI') {
      saveKursBI(editingItem);
      showToast('Data Kurs BI berhasil diperbarui');
    }
    refreshOtherData();
    setEditSection(null);
    setEditingItem(null);
  };

  // Chart data
  const historyChartData = priceHistory.map(h => ({
    name: h.periode.replace('2025', "'25").replace('2026', "'26"),
    'Dated Brent': h.datedBrent,
    'MOPS Naphtha': parseFloat((h.mopsNaphtha / 8.33).toFixed(2)),
  }));


  // Generate periode options: current month + 6 months forward
  const periodeOptions = (() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    const options = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      options.push(`${months[d.getMonth()]} ${d.getFullYear()}`);
    }
    return options;
  })();

  // ICP Tab Content
  const renderIcpTab = () => (
    <div>
      {/* Periode & Actions Row — now above cards */}
      <div className="flex-responsive justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="badge" style={{ background: 'rgba(0,82,156,0.08)', color: 'var(--accent)', fontWeight: 700, padding: '6px 14px', fontSize: '13px' }}>Periode: {icpPeriode}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setShowHistory(!showHistory)}>
            <Calendar size={14} /> {showHistory ? 'Tutup Riwayat' : 'Riwayat Harga'}
          </button>
          <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => {
            setEditSection('ref');
            const [b, t] = icpPeriode.split(' ');
            setEditingItem({ bulan: b || months[new Date().getMonth()], tahun: t || new Date().getFullYear(), datedBrent, mopsNaphtha });
          }}><Edit2 size={14} /> Ubah Harga Referensi</button>
        </div>
      </div>

      {/* Reference Prices Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="mb-6">
        <div className="card" style={{ borderTop: '3px solid var(--accent)', padding: '20px 24px' }}>
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,82,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DollarSign size={20} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-xs text-muted font-semibold uppercase" style={{ letterSpacing: '0.5px' }}>Dated Brent</div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>${datedBrent.toFixed(2)} <span className="text-xs font-normal text-muted">/ bbl</span></div>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--warning)', padding: '20px 24px' }}>
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={20} color="var(--warning)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-xs text-muted font-semibold uppercase" style={{ letterSpacing: '0.5px' }}>MOPS Naphtha</div>
              <div className="text-xl font-bold" style={{ color: 'var(--warning)' }}>${mopsNaphtha.toFixed(2)} <span className="text-xs font-normal text-muted">/ bbl</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Price History Chart (Collapsible) */}
      {showHistory && (
        <div className="card mb-6" style={{ padding: '20px 24px' }}>
          <h3 className="text-base font-bold mb-1 flex items-center gap-2"><Calendar size={16} color="var(--accent)" /> Riwayat Harga Referensi</h3>
          <p className="text-xs text-muted mb-4">Trend harga Dated Brent & MOPS Naphtha (konversi per barrel) tiap periode</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--text-muted)" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                <Legend />
                <Line type="monotone" dataKey="Dated Brent" stroke="#00529c" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="MOPS Naphtha" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Periode</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Dated Brent (USD/bbl)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>MOPS Naphtha (USD/MT)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Tanggal Input</th>
              </tr></thead>
              <tbody>
                {[...priceHistory].reverse().map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'rgba(0,82,156,0.02)' : 'transparent' }}>
                    <td style={{ padding: '8px 12px', fontWeight: i === 0 ? 600 : 400 }}>{h.periode} {i === 0 && <span className="badge badge-success" style={{ fontSize: 10, marginLeft: 6, padding: '2px 6px' }}>Aktif</span>}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--accent)' }}>${h.datedBrent.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--warning)' }}>${h.mopsNaphtha.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(h.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 1: Primary Crudes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2"><Activity size={18} color="var(--accent)" /> Minyak Mentah Utama</h2>
            <p className="text-sm text-muted mt-1">Minyak mentah referensi berdasarkan Kepmen ESDM. Harga = Dated Brent + Alpha</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}
              onClick={() => {
                setEditSection('addPrimary');
                setEditingItem({ id: '', namaCrude: '', kode: '', refType: 'brent', alpha: 0, used: true, bulan: months[new Date().getMonth()], tahun: new Date().getFullYear() });
              }}
            ><Plus size={12} /> Tambah</button>
            <button
              className="btn btn-outline"
              style={{
                padding: '6px 14px', fontSize: '13px',
                opacity: selectedId && selectedId.startsWith('PC') ? 1 : 0.5,
                borderColor: selectedId && selectedId.startsWith('PC') ? 'var(--accent)' : 'var(--border)',
                color: selectedId && selectedId.startsWith('PC') ? 'var(--accent)' : 'inherit'
              }}
              disabled={!selectedId || !selectedId.startsWith('PC')}
              onClick={() => {
                const item = primaryCrudes.find(c => c.id === selectedId);
                const [b, t] = (item.periode || '').split(' ');
                if (item) { setEditSection('primary'); setEditingItem({ ...item, bulan: b || months[new Date().getMonth()], tahun: t || new Date().getFullYear() }); }
              }}
            ><Edit2 size={12} /> Edit</button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafafa' }}>
                <th style={{ padding: '14px 16px', width: 40 }}></th>
                <th style={{ padding: '14px 16px' }}>Kode</th>
                <th style={{ padding: '14px 16px' }}>Nama Crude</th>
                <th style={{ padding: '14px 16px' }}>Referensi</th>
                <th style={{ padding: '14px 16px' }}>Alpha (USD/bbl)</th>
                <th style={{ padding: '14px 16px' }}>ICP Price (USD/bbl)</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {primaryCrudes.map(c => {
                const price = getPrimaryPrice(c.alpha, c.refType);
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', background: selectedId === c.id ? 'rgba(0,82,156,0.04)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={selectedId === c.id} onChange={() => setSelectedId(selectedId === c.id ? null : c.id)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className="badge" style={{ background: 'rgba(0,82,156,0.08)', color: 'var(--accent)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.5px' }}>{c.kode}</span></td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.namaCrude}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge" style={{
                        background: c.refType === 'mops' ? 'rgba(245,158,11,0.08)' : 'rgba(0,82,156,0.08)',
                        color: c.refType === 'mops' ? 'var(--warning)' : 'var(--accent)',
                        fontWeight: 600, fontSize: '11px'
                      }}>
                        {c.refType === 'mops' ? 'MOPS Naphtha' : 'Dated Brent'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: c.alpha >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        {c.alpha >= 0 ? '+' : ''}{c.alpha.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent)', fontSize: '15px' }}>${price.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${c.used ? 'badge-success' : 'badge-draft'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                        {c.used ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Derived Crudes */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2"><ArrowUpDown size={18} color="var(--warning)" /> Minyak Mentah Turunan</h2>
            <p className="text-sm text-muted mt-1">Harga dihitung otomatis dari minyak mentah utama</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <Search size={14} color="var(--text-muted)" />
              <input type="text" placeholder="Cari nama crude..." value={derivedSearch} onChange={e => setDerivedSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px', width: 160 }} />
              {derivedSearch && <button onClick={() => setDerivedSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} color="var(--text-muted)" /></button>}
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}
              onClick={() => {
                setEditSection('addDerived');
                setEditingItem({ id: '', namaCrude: '', baseRef: primaryCrudes[0]?.kode || 'SLC', alpha: 0, used: true, bulan: months[new Date().getMonth()], tahun: new Date().getFullYear() });
              }}
            ><Plus size={12} /> Tambah</button>
            <button
              className="btn btn-outline"
              style={{
                padding: '6px 14px', fontSize: '13px',
                opacity: selectedId && selectedId.startsWith('DC') ? 1 : 0.5,
                borderColor: selectedId && selectedId.startsWith('DC') ? 'var(--accent)' : 'var(--border)',
                color: selectedId && selectedId.startsWith('DC') ? 'var(--accent)' : 'inherit'
              }}
              disabled={!selectedId || !selectedId.startsWith('DC')}
              onClick={() => {
                const item = derivedCrudes.find(c => c.id === selectedId);
                const [b, t] = (item.periode || '').split(' ');
                if (item) { setEditSection('derived'); setEditingItem({ ...item, bulan: b || months[new Date().getMonth()], tahun: t || new Date().getFullYear() }); }
              }}
            ><Edit2 size={12} /> Edit</button>
          </div>
        </div>
        <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafafa' }}>
                <th style={{ padding: '14px 16px', width: 40 }}></th>
                <th style={{ padding: '14px 16px' }}>Periode</th>
                <th style={{ padding: '14px 16px' }}>Nama Crude</th>
                <th style={{ padding: '14px 16px' }}>Referensi</th>
                <th style={{ padding: '14px 16px' }}>Formula</th>
                <th style={{ padding: '14px 16px' }}>Alpha (USD/bbl)</th>
                <th style={{ padding: '14px 16px' }}>ICP Price (USD/bbl)</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDerived.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {derivedSearch ? `Tidak ditemukan crude "${derivedSearch}"` : 'Belum ada data'}
                </td></tr>
              )}
              {filteredDerived.map(c => {
                const price = getDerivedPrice(c.baseRef, c.alpha);
                const refCrude = primaryCrudes.find(p => p.kode === c.baseRef);
                const refPrice = refCrude ? getPrimaryPrice(refCrude.alpha, refCrude.refType) : 0;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', background: selectedId === c.id ? 'rgba(0,82,156,0.04)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <input type="checkbox" checked={selectedId === c.id} onChange={() => setSelectedId(selectedId === c.id ? null : c.id)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className="badge" style={{ background: 'rgba(0,82,156,0.06)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>{c.periode || '-'}</span></td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.namaCrude}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--warning)', fontWeight: 600, fontSize: '11px' }}>{c.baseRef}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {c.baseRef} (${refPrice.toFixed(2)}) {c.alpha !== 0 ? (c.alpha > 0 ? `+ ${c.alpha.toFixed(2)}` : `- ${Math.abs(c.alpha).toFixed(2)}`) : '= sama'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: c.alpha >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        {c.alpha === 0 ? '0.00' : (c.alpha > 0 ? '+' : '') + c.alpha.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent)', fontSize: '15px' }}>${price.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${c.used ? 'badge-success' : 'badge-draft'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                        {c.used ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
            <span className="text-sm text-muted">{derivedSearch ? `${filteredDerived.length} dari ${derivedCrudes.length}` : `Total ${derivedCrudes.length}`} minyak mentah turunan</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVatTab = () => (
    <div>
      <div className="flex-responsive justify-between items-center mb-6">
        <div className="flex gap-2">
          <button className="btn btn-primary" style={{ padding: '8px 16px' }}
            onClick={() => {
              setEditSection('vat');
              setEditingItem({ bulan: months[new Date().getMonth()], tahun: new Date().getFullYear(), rate: 11 });
            }}
          ><Plus size={14} /> Add VAT Rate</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
              <th style={{ padding: '16px', width: '48px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', background: '#fff' }} /></th>
              <th style={{ padding: '16px' }}>Periode Bulan</th>
              <th style={{ padding: '16px' }}>Periode Tahun</th>
              <th style={{ padding: '16px' }}>VAT Rate (%)</th>
              <th style={{ padding: '16px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vatList.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db' }} /></td>
                <td style={{ padding: '16px' }}>{v.bulan}</td>
                <td style={{ padding: '16px' }}>{v.tahun}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--accent)' }}>{v.rate}%</td>
                <td style={{ padding: '16px' }}>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline" style={{ padding: '4px' }} onClick={() => { setEditSection('vat'); setEditingItem(v); }}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn btn-sm btn-outline text-danger" style={{ padding: '4px' }} onClick={() => { if (window.confirm('Hapus data VAT ini?')) { deleteVat(v.id); refreshOtherData(); showToast('VAT berhasil dihapus'); } }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vatList.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-muted">Belum ada data VAT.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderKursBITab = () => (
    <div>
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={18} color="var(--accent)" /> Kurs Bank Indonesia (JISDOR)</h2>
          <p className="text-sm text-muted mt-1">Input harian Kurs BI (USD/IDR) sebagai dasar perhitungan invoice.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" style={{ padding: '8px 16px' }}
            onClick={() => {
              setEditSection('kursBI');
              setEditingItem({ tanggal: new Date().toISOString().split('T')[0], harga: 15700, sumber: 'Bank Indonesia' });
            }}
          ><Plus size={14} /> Add Kurs BI</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
              <th style={{ padding: '16px' }}>Tanggal</th>
              <th style={{ padding: '16px' }}>Kurs (IDR/USD)</th>
              <th style={{ padding: '16px' }}>Sumber</th>
              <th style={{ padding: '16px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kursBIList.map((k) => (
              <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{new Date(k.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--accent)' }}>Rp {k.harga.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '16px' }}>{k.sumber}</td>
                <td style={{ padding: '16px' }}>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline" style={{ padding: '4px' }} onClick={() => { setEditSection('kursBI'); setEditingItem(k); }}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn btn-sm btn-outline text-danger" style={{ padding: '4px' }} onClick={() => { if (window.confirm('Hapus data Kurs BI ini?')) { deleteKursBI(k.id); refreshOtherData(); showToast('Kurs BI berhasil dihapus'); } }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {kursBIList.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-muted">Belum ada data Kurs BI.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Toast */}
      {toast && (<div style={{ position: 'fixed', top: 24, right: 32, zIndex: 1100, padding: '14px 24px', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: 'var(--success)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease-out' }}><CheckCircle size={18} /> {toast}</div>)}

      <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: 'rgba(0,82,156,0.05)', alignSelf: 'flex-start' }}>
        <button className={`btn ${activeTab === 'icp' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('icp')} style={{ padding: '10px 24px', borderRadius: '10px' }}>ICP & Harga Referensi</button>
        <button className={`btn ${activeTab === 'kursBI' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('kursBI')} style={{ padding: '10px 24px', borderRadius: '10px' }}>Kurs BI (IDR/USD)</button>
        <button className={`btn ${activeTab === 'k3s' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('k3s')} style={{ padding: '10px 24px', borderRadius: '10px' }}>Partner K3S & Supplier</button>
        <button className={`btn ${activeTab === 'vat' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('vat')} style={{ padding: '10px 24px', borderRadius: '10px' }}>Master Data VAT</button>
      </div>

      {/* ICP Tab */}
      {activeTab === 'icp' && renderIcpTab()}

      {/* Kurs BI Tab */}
      {activeTab === 'kursBI' && renderKursBITab()}

      {/* K3S Tab */}
      {activeTab === 'k3s' && (
        <div>
          <div className="flex-responsive justify-between items-center mb-6">
            <div className="flex gap-2">
              <button className="btn btn-primary" style={{ padding: '8px 16px' }}
                onClick={() => {
                  setEditSection('k3s');
                  setEditingItem({ nama: '', wilayahKerja: '', negara: 'Indonesia', kontakPIC: '', email: '', status: 'Aktif' });
                }}
              ><Plus size={14} /> Add Partner (K3S)</button>
              <button className="btn btn-outline" style={{ padding: '8px 16px', border: '1px solid var(--warning)', color: 'var(--warning)' }}
                onClick={() => {
                  setEditSection('supplier');
                  setEditingItem({ nama: '', negara: '', komoditas: '', kontakPIC: '', email: '', status: 'Aktif' });
                }}
              ><Plus size={14} /> Add Supplier (Import)</button>
            </div>
            <div className="flex-responsive gap-3 w-full-mobile">
              <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <input
                  type="text"
                  placeholder="Cari partner..."
                  value={k3sSearch}
                  onChange={(e) => setK3sSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px' }}
                />
                <Search size={16} color="var(--text-muted)" />
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
                  <th style={{ padding: '16px', width: '48px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', background: '#fff' }} /></th>
                  <th style={{ padding: '16px' }}>ID Partner</th>
                  <th style={{ padding: '16px' }}>Nama Perusahaan</th>
                  <th style={{ padding: '16px' }}>Tipe Entitas</th>
                  <th style={{ padding: '16px' }}>Kontak PIC</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {k3sList.filter(k => k.nama.toLowerCase().includes(k3sSearch.toLowerCase())).map((k) => (
                  <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db' }} /></td>
                    <td style={{ padding: '16px' }}>{k.id}</td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{k.nama} <br /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.email}</span></td>
                    <td style={{ padding: '16px' }}><span className="badge" style={{ background: 'rgba(0,82,156,0.1)', color: 'var(--accent)' }}>K3S Domestik</span></td>
                    <td style={{ padding: '16px' }}>{k.kontakPIC}</td>
                    <td style={{ padding: '16px' }}><span className={`badge ${k.status === 'Aktif' ? 'badge-success' : 'badge-draft'}`}>{k.status}</span></td>
                    <td style={{ padding: '16px' }}>
                      <button className="btn btn-sm btn-outline" style={{ padding: '4px' }} onClick={() => { setEditSection('k3s'); setEditingItem(k); }}>
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {supplierList.filter(s => s.nama.toLowerCase().includes(k3sSearch.toLowerCase())).map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db' }} /></td>
                    <td style={{ padding: '16px' }}>{s.id}</td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{s.nama} <br /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.email}</span></td>
                    <td style={{ padding: '16px' }}><span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>Supplier Import</span></td>
                    <td style={{ padding: '16px' }}>{s.kontakPIC}</td>
                    <td style={{ padding: '16px' }}><span className={`badge ${s.status === 'Aktif' ? 'badge-success' : 'badge-draft'}`}>{s.status}</span></td>
                    <td style={{ padding: '16px' }}>
                      <button className="btn btn-sm btn-outline" style={{ padding: '4px' }} onClick={() => { setEditSection('supplier'); setEditingItem(s); }}>
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VAT Tab */}
      {activeTab === 'vat' && renderVatTab()}

      {/* ===== MODALS ===== */}
      {/* Modal: VAT Rate */}
      {editSection === 'vat' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} color="var(--accent)" /> {editingItem.id ? 'Edit VAT Rate' : 'Tambah VAT Rate'}</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Periode Bulan</label>
                  <select className="input-control" value={editingItem.bulan} onChange={e => setEditingItem({ ...editingItem, bulan: e.target.value })}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Periode Tahun</label>
                  <select className="input-control" value={editingItem.tahun} onChange={e => setEditingItem({ ...editingItem, tahun: e.target.value })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">VAT Rate (%)</label>
                <input type="number" step="0.1" className="input-control" placeholder="11.0" value={editingItem.rate} onChange={e => setEditingItem({ ...editingItem, rate: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveOther}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Kurs BI */}
      {editSection === 'kursBI' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} color="var(--accent)" /> {editingItem.id ? 'Edit Kurs BI' : 'Tambah Kurs BI'}</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Tanggal</label>
                <input type="date" className="input-control" value={editingItem.tanggal} onChange={e => setEditingItem({ ...editingItem, tanggal: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Kurs (IDR/USD)</label>
                <input type="number" step="0.01" className="input-control" placeholder="15700.00" value={editingItem.harga} onChange={e => setEditingItem({ ...editingItem, harga: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="input-group">
                <label className="input-label">Sumber</label>
                <input type="text" className="input-control" placeholder="Bank Indonesia" value={editingItem.sumber} onChange={e => setEditingItem({ ...editingItem, sumber: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveOther}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Reference Prices (Dated Brent + MOPS Naphtha + Periode) */}
      {editSection === 'ref' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} color="var(--accent)" /> Ubah Harga Referensi</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Bulan</label>
                  <select className="input-control" value={editingItem.bulan} onChange={e => setEditingItem({ ...editingItem, bulan: e.target.value })}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Tahun</label>
                  <select className="input-control" value={editingItem.tahun} onChange={e => setEditingItem({ ...editingItem, tahun: e.target.value })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Dated Brent (USD/bbl)</label>
                <input type="number" step="0.01" className="input-control" value={editingItem.datedBrent} onChange={e => setEditingItem({ ...editingItem, datedBrent: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="input-group">
                <label className="input-label">MOPS Naphtha (USD/MT)</label>
                <input type="number" step="0.01" className="input-control" value={editingItem.mopsNaphtha} onChange={e => setEditingItem({ ...editingItem, mopsNaphtha: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,82,156,0.04)', border: '1px solid rgba(0,82,156,0.1)', fontSize: 12, color: 'var(--text-muted)' }}>
                <CheckCircle size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: 'var(--success)' }} />
                Data akan tersimpan di riwayat harga untuk tracking historis
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveRef}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}


      {/* Modal: Edit / Add Primary Crude */}
      {(editSection === 'primary' || editSection === 'addPrimary') && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {editSection === 'addPrimary' ? <Plus size={20} color="var(--accent)" /> : <Edit2 size={20} color="var(--accent)" />}
                {editSection === 'addPrimary' ? 'Tambah Minyak Mentah Utama' : 'Edit Minyak Mentah Utama'}
              </h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Kode (huruf kapital, unik)</label>
                <input type="text" className="input-control" placeholder="contoh: MAHAKAM" value={editingItem.kode}
                  onChange={e => setEditingItem({ ...editingItem, kode: e.target.value.toUpperCase() })}
                  readOnly={editSection === 'primary'}
                  style={editSection === 'primary' ? { background: '#f9fafb', cursor: 'not-allowed' } : {}} />
              </div>
              <div className="input-group">
                <label className="input-label">Nama Crude</label>
                <input type="text" className="input-control" placeholder="contoh: Mahakam Block" value={editingItem.namaCrude} onChange={e => setEditingItem({ ...editingItem, namaCrude: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Bulan</label>
                  <select className="input-control" value={editingItem.bulan} onChange={e => setEditingItem({ ...editingItem, bulan: e.target.value })}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Tahun</label>
                  <select className="input-control" value={editingItem.tahun} onChange={e => setEditingItem({ ...editingItem, tahun: e.target.value })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Harga Referensi</label>
                <select className="input-control" value={editingItem.refType || 'brent'} onChange={e => setEditingItem({ ...editingItem, refType: e.target.value })}>
                  <option value="brent">Dated Brent — ${datedBrent.toFixed(2)}/bbl</option>
                  <option value="mops">MOPS Naphtha — ${mopsNaphtha.toFixed(2)}/MT</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Alpha (USD/bbl) — bisa negatif</label>
                <input type="number" step="0.01" className="input-control" value={editingItem.alpha} onChange={e => setEditingItem({ ...editingItem, alpha: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,82,156,0.04)', border: '1px solid rgba(0,82,156,0.1)' }}>
                <div className="text-xs text-muted mb-1">Preview ICP Price</div>
                {(() => {
                  const basePrice = (editingItem.refType || 'brent') === 'mops' ? mopsNaphtha : datedBrent;
                  const preview = basePrice + (editingItem.alpha || 0);
                  const refLabel = (editingItem.refType || 'brent') === 'mops' ? 'MOPS' : 'Brent';
                  return <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>${preview.toFixed(2)} <span className="text-xs font-normal text-muted">= {refLabel} (${basePrice.toFixed(2)}) {editingItem.alpha >= 0 ? '+' : ''} {(editingItem.alpha || 0).toFixed(2)}</span></div>;
                })()}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,166,81,0.05)', border: '1px solid rgba(0,166,81,0.1)' }}>
                <input type="checkbox" id="primary-used" checked={editingItem.used} onChange={e => setEditingItem({ ...editingItem, used: e.target.checked })} style={{ width: 18, height: 18 }} />
                <label htmlFor="primary-used" className="text-sm font-medium cursor-pointer">Aktif (Used)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSavePrimary}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit / Add Derived Crude */}
      {(editSection === 'derived' || editSection === 'addDerived') && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {editSection === 'addDerived' ? <Plus size={20} color="var(--accent)" /> : <Edit2 size={20} color="var(--accent)" />}
                {editSection === 'addDerived' ? 'Tambah Minyak Mentah Turunan' : 'Edit Minyak Mentah Turunan'}
              </h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Id</label>
                <input type="text" className="input-control" value={editingItem.id || 'Auto-generated'} readOnly style={{ background: '#f9fafb', cursor: 'not-allowed', color: editingItem.id ? 'inherit' : 'var(--text-muted)' }} />
              </div>
              <div className="input-group">
                <label className="input-label">Nama Crude</label>
                <input type="text" className="input-control" value={editingItem.namaCrude} onChange={e => setEditingItem({ ...editingItem, namaCrude: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Periode Bulan</label>
                  <select className="input-control" value={editingItem.bulan} onChange={e => setEditingItem({ ...editingItem, bulan: e.target.value })}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Periode Tahun</label>
                  <select className="input-control" value={editingItem.tahun} onChange={e => setEditingItem({ ...editingItem, tahun: parseInt(e.target.value) })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Referensi Minyak Mentah Utama</label>
                <select className="input-control" value={editingItem.baseRef} onChange={e => setEditingItem({ ...editingItem, baseRef: e.target.value })}>
                  {primaryCrudes.map(p => (
                    <option key={p.kode} value={p.kode}>{p.namaCrude} ({p.kode}) — ${getPrimaryPrice(p.alpha, p.refType).toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Alpha (USD/bbl) — 0 = sama dengan harga referensi</label>
                <input type="number" step="0.01" className="input-control" value={editingItem.alpha} onChange={e => setEditingItem({ ...editingItem, alpha: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,82,156,0.04)', border: '1px solid rgba(0,82,156,0.1)' }}>
                <div className="text-xs text-muted mb-1">Preview ICP Price</div>
                {(() => {
                  const price = getDerivedPrice(editingItem.baseRef, editingItem.alpha || 0);
                  const refCrude = primaryCrudes.find(p => p.kode === editingItem.baseRef);
                  const refPrice = refCrude ? getPrimaryPrice(refCrude.alpha, refCrude.refType) : 0;
                  return <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>${price.toFixed(2)} <span className="text-xs font-normal text-muted">= {editingItem.baseRef} (${refPrice.toFixed(2)}) {editingItem.alpha >= 0 ? '+' : ''} {(editingItem.alpha || 0).toFixed(2)}</span></div>;
                })()}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,166,81,0.05)', border: '1px solid rgba(0,166,81,0.1)' }}>
                <input type="checkbox" id="derived-used" checked={editingItem.used} onChange={e => setEditingItem({ ...editingItem, used: e.target.checked })} style={{ width: 18, height: 18 }} />
                <label htmlFor="derived-used" className="text-sm font-medium cursor-pointer">Aktif (Used)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveDerived}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Kurs BI */}
      {editSection === 'kurs' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '400px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} color="var(--accent)" /> {editingItem.id ? 'Edit Kurs BI' : 'Tambah Kurs BI'}</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Tanggal</label>
                <input type="date" className="input-control" value={editingItem.tanggal} onChange={e => setEditingItem({ ...editingItem, tanggal: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Nilai Kurs JISDOR (IDR)</label>
                <input type="number" step="0.01" className="input-control" value={editingItem.harga} onChange={e => setEditingItem({ ...editingItem, harga: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="input-group">
                <label className="input-label">Sumber Data</label>
                <input type="text" className="input-control" value={editingItem.sumber} onChange={e => setEditingItem({ ...editingItem, sumber: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveOther}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit K3S */}
      {editSection === 'k3s' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><MapPin size={20} color="var(--accent)" /> {editingItem.id ? 'Edit Partner K3S' : 'Tambah Partner K3S'}</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Nama Perusahaan</label>
                <input type="text" className="input-control" placeholder="PT KKKS..." value={editingItem.nama} onChange={e => setEditingItem({ ...editingItem, nama: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Wilayah Kerja / Blok</label>
                <input type="text" className="input-control" placeholder="Blok..." value={editingItem.wilayahKerja} onChange={e => setEditingItem({ ...editingItem, wilayahKerja: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Kontak PIC</label>
                  <input type="text" className="input-control" value={editingItem.kontakPIC} onChange={e => setEditingItem({ ...editingItem, kontakPIC: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="input-control" value={editingItem.status} onChange={e => setEditingItem({ ...editingItem, status: e.target.value })}>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Email Operasional</label>
                <input type="email" className="input-control" placeholder="email@company.com" value={editingItem.email} onChange={e => setEditingItem({ ...editingItem, email: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveOther}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Supplier */}
      {editSection === 'supplier' && editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div className="card shadow-lg animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} color="var(--warning)" /> {editingItem.id ? 'Edit Supplier Import' : 'Tambah Supplier Import'}</h2>
              <button onClick={() => setEditSection(null)} className="btn btn-sm" style={{ border: 'none', padding: '6px' }}><X size={20} /></button>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="input-group">
                <label className="input-label">Nama Supplier</label>
                <input type="text" className="input-control" placeholder="Company Ltd..." value={editingItem.nama} onChange={e => setEditingItem({ ...editingItem, nama: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Negara</label>
                  <input type="text" className="input-control" value={editingItem.negara} onChange={e => setEditingItem({ ...editingItem, negara: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="input-control" value={editingItem.status} onChange={e => setEditingItem({ ...editingItem, status: e.target.value })}>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Kontak PIC / Dept</label>
                <input type="text" className="input-control" value={editingItem.kontakPIC} onChange={e => setEditingItem({ ...editingItem, kontakPIC: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Email Komersial</label>
                <input type="email" className="input-control" placeholder="trading@supplier.com" value={editingItem.email} onChange={e => setEditingItem({ ...editingItem, email: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={() => setEditSection(null)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveOther}><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};


export const ExceptionSignal = () => {
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const signals = [
    { id: 'INV/26/BL-8799', kkks: 'PT KKKS Foxtrot Energy', liftingDate: '20 Jan 2026', dueDateLabel: '22 Mar 2026', volume: 135000, totalUsd: 11130750, paymentStatus: 'Overdue', daysLeft: -2, level: 'overdue' },
    { id: 'INV/26/BL-8801', kkks: 'PT KKKS Delta Resources', liftingDate: '28 Jan 2026', dueDateLabel: '25 Mar 2026', volume: 312000, totalUsd: 25724400, paymentStatus: 'Unpaid', daysLeft: 1, level: 'critical' },
    { id: 'INV/26/BL-8805', kkks: 'PT KKKS Alpha Energi', liftingDate: '01 Feb 2026', dueDateLabel: '27 Mar 2026', volume: 185000, totalUsd: 15253250, paymentStatus: 'Unpaid', daysLeft: 3, level: 'critical' },
    { id: 'INV/26/BL-8809', kkks: 'Pertamina EP', liftingDate: '05 Feb 2026', dueDateLabel: '31 Mar 2026', volume: 420000, totalUsd: 34629000, paymentStatus: 'Unpaid', daysLeft: 7, level: 'warning' },
    { id: 'INV/26/BL-8814', kkks: 'PT KKKS Bravo Petroleum', liftingDate: '10 Feb 2026', dueDateLabel: '03 Apr 2026', volume: 98500, totalUsd: 8122575, paymentStatus: 'Unpaid', daysLeft: 10, level: 'warning' },
    { id: 'INV/26/BL-8820', kkks: 'PT KKKS Charlie Minyak', liftingDate: '14 Feb 2026', dueDateLabel: '09 Apr 2026', volume: 250000, totalUsd: 20612500, paymentStatus: 'Unpaid', daysLeft: 16, level: 'watch' },
    { id: 'INV/26/BL-8824', kkks: 'PT KKKS Echo Offshore', liftingDate: '18 Feb 2026', dueDateLabel: '14 Apr 2026', volume: 175000, totalUsd: 14428750, paymentStatus: 'Unpaid', daysLeft: 21, level: 'watch' },
  ];

  const levelConfig = {
    overdue: { label: 'Overdue', bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.3)', dot: '#ef4444' },
    critical: { label: 'Critical', bg: 'rgba(239,68,68,0.07)', color: 'var(--danger)', border: 'rgba(239,68,68,0.2)', dot: '#ee312a' },
    warning: { label: 'Warning', bg: 'rgba(245,158,11,0.08)', color: 'var(--warning)', border: 'rgba(245,158,11,0.22)', dot: '#f59e0b' },
    watch: { label: 'Watch', bg: 'rgba(59,130,246,0.07)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)', dot: '#3b82f6' },
  };

  const filtered = signals.filter(s => {
    const matchLevel = filterLevel === 'all' || s.level === filterLevel;
    const matchSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kkks.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  const totalExposureUsd = signals.reduce((a, s) => a + s.totalUsd, 0);
  const criticalCount = signals.filter(s => s.level === 'critical' || s.level === 'overdue').length;
  const warningCount = signals.filter(s => s.level === 'warning').length;

  const getDaysLabel = (days) => {
    if (days < 0) return { text: `${Math.abs(days)} hari lewat`, color: '#ef4444' };
    if (days === 0) return { text: 'Hari ini!', color: '#ef4444' };
    if (days === 1) return { text: 'Besok', color: '#ee312a' };
    return { text: `${days} hari lagi`, color: days <= 7 ? 'var(--danger)' : days <= 14 ? 'var(--warning)' : '#3b82f6' };
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.25)', animation: 'exPulse 1.6s ease-in-out infinite' }} />
          <h1>Exception Signal</h1>
        </div>
        <p className="text-muted" style={{ marginLeft: 22 }}>
          Daftar settlement yang mendekati atau melampaui jatuh tempo pembayaran namun belum dibayar.
        </p>
      </div>

      <div className="summary-row" style={{ marginBottom: 20 }}>
        <div className="summary-card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div className="summary-card-body">
            <div className="summary-card-label">Overdue / Critical</div>
            <div className="summary-card-value" style={{ color: '#ef4444' }}>{criticalCount}</div>
            <div className="summary-card-sub">Jatuh tempo ≤ 3 hari</div>
          </div>
          <div className="summary-card-icon red"><AlertCircle size={22} color="#ef4444" /></div>
        </div>
        <div className="summary-card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <div className="summary-card-body">
            <div className="summary-card-label">Warning</div>
            <div className="summary-card-value" style={{ color: 'var(--warning)' }}>{warningCount}</div>
            <div className="summary-card-sub">Jatuh tempo 4–14 hari</div>
          </div>
          <div className="summary-card-icon yellow"><AlertCircle size={22} color="var(--warning)" /></div>
        </div>
        <div className="summary-card" style={{ borderLeft: '3px solid #3b82f6' }}>
          <div className="summary-card-body">
            <div className="summary-card-label">Total Eksposur (USD)</div>
            <div className="summary-card-value" style={{ fontSize: 22, color: 'var(--accent)' }}>${(totalExposureUsd / 1e6).toFixed(1)}M</div>
            <div className="summary-card-sub">{signals.length} invoice belum dibayar</div>
          </div>
          <div className="summary-card-icon" style={{ background: 'rgba(0,82,156,0.08)' }}><DollarSign size={22} color="var(--accent)" /></div>
        </div>
      </div>

      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div className="action-bar" style={{ marginBottom: 0 }}>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            {['all', 'overdue', 'critical', 'warning', 'watch'].map(lvl => {
              const lbl = lvl === 'all' ? 'Semua' : levelConfig[lvl]?.label ?? lvl;
              const isActive = filterLevel === lvl;
              return (
                <button key={lvl} onClick={() => setFilterLevel(lvl)} className="btn btn-sm" style={{
                  background: isActive ? (lvl === 'all' ? 'var(--accent)' : levelConfig[lvl]?.bg) : 'transparent',
                  color: isActive ? (lvl === 'all' ? 'white' : levelConfig[lvl]?.color) : 'var(--text-muted)',
                  border: `1px solid ${isActive ? (lvl === 'all' ? 'var(--accent)' : levelConfig[lvl]?.border) : 'var(--border)'}`,
                  fontWeight: isActive ? 700 : 500,
                }}>
                  {lbl}
                </button>
              );
            })}
          </div>
          <div className="action-bar-right">
            <div className="search-input-wrap">
              <Search size={13} color="var(--text-faint)" />
              <input type="text" placeholder="Cari ID / KKKS..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th><span className="th-sort">ID Invoice <ArrowUpDown size={10} /></span></th>
                <th><span className="th-sort">KKKS <ArrowUpDown size={10} /></span></th>
                <th><span className="th-sort">Tgl Lifting <ArrowUpDown size={10} /></span></th>
                <th><span className="th-sort">Jatuh Tempo <ArrowUpDown size={10} /></span></th>
                <th style={{ textAlign: 'center' }}>Sisa Hari</th>
                <th><span className="th-sort">Volume (BBLS) <ArrowUpDown size={10} /></span></th>
                <th><span className="th-sort">Total (USD) <ArrowUpDown size={10} /></span></th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const cfg = levelConfig[s.level];
                const daysInfo = getDaysLabel(s.daysLeft);
                return (
                  <tr key={s.id} style={{ background: s.level === 'overdue' ? 'rgba(239,68,68,0.025)' : undefined }}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="font-medium" style={{ color: 'var(--accent)' }}>{s.id}</td>
                    <td>{s.kkks}</td>
                    <td>{s.liftingDate}</td>
                    <td className="font-medium">{s.dueDateLabel}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: s.daysLeft < 0 ? 'rgba(239,68,68,0.1)' : s.daysLeft <= 3 ? 'rgba(238,49,42,0.08)' : s.daysLeft <= 7 ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.08)', color: daysInfo.color }}>
                        {daysInfo.text}
                      </span>
                    </td>
                    <td>{s.volume.toLocaleString()}</td>
                    <td className="font-medium">${s.totalUsd.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${s.paymentStatus === 'Overdue' ? 'badge-danger' : 'badge-warning'}`}>
                        ● {s.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" style={{ padding: '4px 10px', fontSize: 11 }}><Eye size={12} /> Detail</button>
                        <button className="btn btn-sm btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}><Bell size={12} /> Eskalasi</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="10" className="text-center" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>Tidak ada exception signal untuk filter ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Total <strong>{filtered.length}</strong> exception signal aktif</span>
          <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>Diperbarui otomatis setiap hari</span>
        </div>
      </div>

      <style>{`
        @keyframes exPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.25); }
          50%       { box-shadow: 0 0 0 7px rgba(239,68,68,0.06); }
        }
      `}</style>
    </div>
  );
};

export const SettlementArchive = () => {
  const [activeTab, setActiveTab] = useState('output');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [allLiftings, setAllLiftings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAllLiftings(getAllLiftings());
  }, []);

  const approvedLiftings = allLiftings.filter(l => l.status === 'approved' || l.status === 'selesai' || l.status === 'Selesai');

  const filteredOutput = approvedLiftings.filter(item => {
    return (item.invoiceId || item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kkks || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredRaw = allLiftings.filter(item => {
    return (item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kkks || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vesselName || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportToExcel = () => {
    const headers = [
      'ID', 'Status', 'Invoice No', 'No. PO MySAP', 'No. PO Hardcopy', 'B/L Number', 'B/L Date', 'Vessel/Pipeline', 'Load Port', 'Discharge Port',
      'Seller', 'KKKS', 'Jenis Cargo', 'Transaction', 'Nominal Volume', 'Real Volume', 'Volume KKKS', 'Volume SKK', 'Vol Check (%)', 'Price USD', 'ICP',
      'Alpha', 'Kurs BI', 'Total Amount USD', 'VAT (11%) USD', 'Total Amount IDR', 'Created By', 'Created At'
    ].join(',');

    const rows = allLiftings.map(l => {
      const totalUsd = (parseFloat(l.kkksVolume || 0) * parseFloat(l.kkksPrice || 0)) + (parseFloat(l.skkVolume || 0) * parseFloat(l.skkPrice || 0));
      const vatUsd = totalUsd * 0.11;
      const volCheck = l.totalVolume > 0 ? (((parseFloat(l.kkksVolume || 0) + parseFloat(l.skkVolume || 0)) / parseFloat(l.totalVolume)) * 100).toFixed(2) + '%' : '0.00%';
      return [
        l.id, l.status, l.invoiceId || '-', l.poMySap || '-', l.poHardcopy || '-', l.blNumber || '-', l.blDate || '-', l.vesselName || 'Pipeline', l.loadPort || '-', l.dischargePort || '-',
        l.seller || '-', l.kkks || '-', l.jenisMm || '-', l.kindOfTransaction || '-', l.volumeNominasi || 0, l.totalVolume || 0, l.kkksVolume || 0, l.skkVolume || 0, volCheck, l.priceUsdBbl || 0,
        l.icpPrice || 0, l.alpha || 0, l.kursBeliBi || 0, totalUsd.toFixed(2), vatUsd.toFixed(2), (totalUsd * (l.kursBeliBi || 15700)).toFixed(2), l.createdBy || '-', l.createdAt || '-'
      ].join(',');
    }).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FAST_Reporting_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedInvoice) {
    return <SettlementSheet invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  const formatVol = (v) => Number(v || 0).toLocaleString();
  const formatIdr = (v) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');
  const formatUsd = (v) => '$' + Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="animate-fade-in" style={{ width: 'calc(100% + 48px)', maxWidth: 'none', margin: '-20px -24px', padding: '24px' }}>
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h1>Arsip & Reporting System</h1>
          <p className="text-muted mt-2">Manajemen hasil settlement PDF dan rekapitulasi seluruh data input sistem.</p>
        </div>
        <div className="flex gap-4 w-full-mobile">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px', width: '200px' }}
            />
          </div>
          {activeTab === 'raw' && (
            <button className="btn btn-success" onClick={exportToExcel} style={{ padding: '8px 20px', borderRadius: '20px' }}>
              <Download size={16} /> Export to Excel (.csv)
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: 'rgba(0,82,156,0.05)', alignSelf: 'flex-start', width: 'fit-content' }}>
        <button className={`btn ${activeTab === 'output' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('output')} style={{ padding: '10px 24px', borderRadius: '10px' }}>Arsip Output Settlement</button>
        <button className={`btn ${activeTab === 'raw' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('raw')} style={{ padding: '10px 24px', borderRadius: '10px' }}>Reporting Raw Data Submission</button>
      </div>

      {activeTab === 'output' ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nomor Tagihan (ID Invoice)</th>
                <th style={{ textAlign: 'center' }}>Kalkulasi</th>
                <th>Entitas Tertaut</th>
                <th>Tanggal Settlement</th>
                <th>Volume Realisasi (BBL)</th>
                <th>Nominal Settlement Akhir (USD)</th>
                <th>Nominal Settlement Akhir (IDR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutput.map((row) => {
                const latestKurs = getLatestKursBI();
                const totalUsd = (parseFloat(row.kkksVolume || 0) * parseFloat(row.kkksPrice || 0)) + (parseFloat(row.skkVolume || 0) * parseFloat(row.skkPrice || 0));
                const totalIdr = totalUsd * (parseFloat(row.kursBeliBi || (latestKurs ? latestKurs.harga : 15700)));
                return (
                  <tr key={row.id}>
                    <td className="font-medium" style={{ color: 'var(--accent-light)' }}>{row.invoiceId || row.id}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => setSelectedInvoice(row)} className="btn btn-sm btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>Buka Kalkulasi PDF</button>
                    </td>
                    <td>{row.kkks}</td>
                    <td>{row.submittedAt ? row.submittedAt.split(',')[0] : 'N/A'}</td>
                    <td>{formatVol(row.totalVolume)}</td>
                    <td className="font-medium" style={{ color: 'var(--accent)' }}>{formatUsd(totalUsd)}</td>
                    <td className="font-medium" style={{ color: 'var(--success)' }}>{formatIdr(totalIdr)}</td>
                  </tr>
                );
              })}
              {filteredOutput.length === 0 && (
                <tr><td colSpan="7" className="text-center py-12 text-muted">Tidak ada data settlement yang ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '2200px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ position: 'sticky', left: 0, background: '#f8fafc', zIndex: 10 }}>ID Transaksi</th>
                <th>Status</th>
                <th>Invoice Number</th>
                <th>No. PO MySAP</th>
                <th>No. PO Hardcopy</th>
                <th>B/L Date</th>
                <th>Kapal / Pipeline</th>
                <th>Loading Port</th>
                <th>Discharge Port</th>
                <th>Seller</th>
                <th>KKKS</th>
                <th>Jenis Cargo</th>
                <th>Transaction</th>
                <th>Volume Nominasi</th>
                <th>Volume Realisasi</th>
                <th>Volume KKKS</th>
                <th>Volume SKK</th>
                <th>Vol Check (%)</th>
                <th>Price (USD/bbl)</th>
                <th>ICP</th>
                <th>Alpha</th>
                <th>Kurs BI</th>
                <th>Total Price (USD)</th>
                <th>VAT (11%)</th>
                <th>Total Final (USD)</th>
                <th>Total Final (IDR)</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {filteredRaw.map((row) => {
                const totalUsd = (parseFloat(row.kkksVolume || 0) * parseFloat(row.kkksPrice || 0)) + (parseFloat(row.skkVolume || 0) * parseFloat(row.skkPrice || 0));
                return (
                  <tr key={row.id}>
                    <td style={{ position: 'sticky', left: 0, background: 'white', zIndex: 10, fontWeight: 700, color: 'var(--accent)' }}>{row.id}</td>
                    <td><span className="badge" style={{
                      background: row.status === 'approved' ? 'rgba(0,166,81,0.1)' : row.status === 'revisi' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                      color: row.status === 'approved' ? 'var(--success)' : row.status === 'revisi' ? 'var(--warning)' : 'var(--text-muted)'
                    }}>{row.status?.toUpperCase()}</span></td>
                    <td>{row.invoiceId || '-'}</td>
                    <td><span className="badge-outline" style={{ border: '1px solid var(--border)', fontSize: '11px', fontWeight: 600 }}>{row.poMySap || '-'}</span></td>
                    <td><span className="badge-outline" style={{ border: '1px solid var(--border)', fontSize: '11px', fontWeight: 600 }}>{row.poHardcopy || '-'}</span></td>
                    <td>{row.blDate || '-'}</td>
                    <td>{row.vesselName || 'Pipeline'}</td>
                    <td>{row.loadPort || '-'}</td>
                    <td>{row.dischargePort || '-'}</td>
                    <td>{row.seller || '-'}</td>
                    <td>{row.kkks || '-'}</td>
                    <td>{row.jenisMm || '-'}</td>
                    <td>{row.kindOfTransaction || '-'}</td>
                    <td style={{ textAlign: 'right' }}>{formatVol(row.volumeNominasi)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVol(row.totalVolume)}</td>
                    <td style={{ textAlign: 'right' }}>{formatVol(row.kkksVolume)}</td>
                    <td style={{ textAlign: 'right' }}>{formatVol(row.skkVolume)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: (Math.abs(((parseFloat(row.kkksVolume) || 0) + (parseFloat(row.skkVolume) || 0)) - (parseFloat(row.totalVolume) || 0)) < 1) ? 'var(--success)' : 'var(--danger)' }}>
                      {parseFloat(row.totalVolume) > 0 ? (((parseFloat(row.kkksVolume || 0) + parseFloat(row.skkVolume || 0)) / parseFloat(row.totalVolume)) * 100).toFixed(2) + '%' : '0.00%'}
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatUsd(row.priceUsdBbl || 0)}</td>
                    <td style={{ textAlign: 'right' }}>{formatUsd(row.icpPrice || 0)}</td>
                    <td style={{ textAlign: 'right' }}>{row.alpha || 0}</td>
                    <td style={{ textAlign: 'right' }}>{formatIdr(row.kursBeliBi || 0)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>{formatUsd(totalUsd)}</td>
                    <td style={{ textAlign: 'right' }}>{formatUsd(totalUsd * 0.11)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatUsd(totalUsd * 1.11)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                      {formatIdr(totalUsd * 1.11 * parseFloat(row.kursBeliBi || (getLatestKursBI()?.harga || 15700)))}
                    </td>
                    <td>{row.createdBy || '-'}</td>
                    <td>{row.createdAt || '-'}</td>
                    <td>{row.updatedBy || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export const SettlementSheet = ({ invoice, onBack }) => {
  const formatVol = (v) => Number(v || 0).toLocaleString();
  const formatCur = (v) => Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatIdr = (v) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');

  const kkksPrice = parseFloat(invoice.kkksPrice || 0);
  const skkPrice = parseFloat(invoice.skkPrice || 0);
  const totalQuantity = parseFloat(invoice.totalVolume || 0);
  const kkksQuantity = parseFloat(invoice.kkksVolume || 0);
  const skkQuantity = parseFloat(invoice.skkVolume || 0);

  const kkksAmountUsd = (kkksQuantity * kkksPrice);
  const skkAmountUsd = (skkQuantity * skkPrice);
  const subTotalUsd = kkksAmountUsd + skkAmountUsd;
  const vatAmountUsd = subTotalUsd * 0.11; // VAT 11%
  const totalUsdWithVat = subTotalUsd + vatAmountUsd;

  const latestKurs = getLatestKursBI();
  const kurs = parseFloat(invoice.kursBeliBi || (latestKurs ? latestKurs.harga : 15700));
  const alpha = 2.50; // Mock Alpha if not found, usually Price - ICP

  return (
    <div className="animate-fade-in" style={{ width: 'calc(100% + 48px)', maxWidth: 'none', margin: '-20px -24px', padding: '24px' }}>
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="btn btn-outline" style={{ border: 'none', padding: 0 }}><ChevronLeft size={20} /> Kembali ke Daftar Arsip</button>
        <div className="flex gap-3">
          <button className="btn btn-primary"><Download size={16} /> Unduh Format Cetak (PDF)</button>
        </div>
      </div>

      <div className="card calculation-sheet-card" style={{ background: 'white', color: '#111827', width: '100%', maxWidth: 'none', padding: '64px', boxShadow: 'none', border: 'none', borderRadius: 0 }}>
        {/* PO Display Info - Moved from inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>No. PO MySAP</label>
            <div style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              {invoice.poMySap || '-'}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>No. PO Hardcopy</label>
            <div style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              {invoice.poHardcopy || '-'}
            </div>
          </div>
        </div>

        {/* Centered Main Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Perhitungan Nilai Pembayaran</h1>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>Nomor Invoice: {invoice.id || invoice.invoiceId}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Diterbitkan pada: {invoice.submittedAt || getTimestamp()}</div>
        </div>

        {/* Logistics & Reference Info */}
        <div className="grid grid-cols-2 mb-12" style={{ fontSize: '13px', gap: '64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Jenis Transaksi:</span>
              <span style={{ fontWeight: 800 }}>{invoice.kindOfTransaction || 'Final'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Seller / Consignor:</span>
              <span style={{ fontWeight: 800 }}>{invoice.kkks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Entity:</span>
              <span style={{ fontWeight: 800 }}>{invoice.kkks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Kapal / Pipeline:</span>
              <span style={{ fontWeight: 800 }}>{invoice.vesselName || 'MT Agung Samudra'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Dischport:</span>
              <span style={{ fontWeight: 800 }}>{invoice.dischargePort || 'Balongan'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>BL Date:</span>
              <span style={{ fontWeight: 800 }}>{invoice.blDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Tanggal Invoice:</span>
              <span style={{ fontWeight: 800 }}>{invoice.invoiceDate || '01 Mar 2026'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Due Date:</span>
              <span style={{ fontWeight: 800 }}>{invoice.dueDateInvoice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>PO MySAP:</span>
              <span style={{ fontWeight: 800 }}>{invoice.poMySap || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Acuan Harga:</span>
              <span style={{ fontWeight: 800 }}>{invoice.acuanHarga || 'ICP SLC + Alpha'}</span>
            </div>
          </div>
        </div>

        {/* Supporting PO Info */}
        <div style={{ marginBottom: '32px', fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
          Perhitungan didasarkan pada PO nomor: <strong style={{ color: '#111827' }}>{invoice.poHardcopy || '-'}</strong>
        </div>

        {/* Calculation Table */}
        <div style={{ width: '100%', border: '2px solid #f1f5f9', borderRadius: '8px', overflow: 'hidden', marginBottom: '48px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Rincian Entitlement</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Total Quantity (BBL)</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Quantity Seller (KKKS)</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Alpha (USD/BBL)</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Total Price (USD/BBL)</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 900, color: '#475569', textTransform: 'uppercase' }}>Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>1. Entitlement KKKS Saja</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{formatVol(totalQuantity)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{formatVol(kkksQuantity)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>${formatCur(alpha)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>${formatCur(kkksPrice)}</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>${formatCur(kkksAmountUsd)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>2. Entitlement SKK Migas (GOI)</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{formatVol(totalQuantity)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{formatVol(skkQuantity)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>$0.00</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>${formatCur(skkPrice)}</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>${formatCur(skkAmountUsd)}</td>
              </tr>
              {/* VAT Row */}
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fdfdfd' }}>
                <td colSpan="5" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>Subtotal (USD)</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>${formatCur(subTotalUsd)}</td>
              </tr>
              <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#fdfdfd' }}>
                <td colSpan="5" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>VAT (11%)</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>${formatCur(vatAmountUsd)}</td>
              </tr>
              {/* Summary Rows */}
              <tr style={{ background: '#f8fafc' }}>
                <td colSpan="5" style={{ padding: '20px 16px', textAlign: 'right', fontWeight: 900, color: '#00529c', fontSize: '13px' }}>TOTAL KEWAJIBAN PEMBAYARAN (USD)</td>
                <td style={{ padding: '20px 16px', textAlign: 'right', fontWeight: 900, color: '#00529c', fontSize: '14px' }}>${formatCur(totalUsdWithVat)}</td>
              </tr>
              <tr style={{ background: '#eff6ff' }}>
                <td colSpan="5" style={{ padding: '20px 16px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '13px' }}>TOTAL KEWAJIBAN PEMBAYARAN (IDR)</td>
                <td style={{ padding: '20px 16px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '16px' }}>{formatIdr(totalUsdWithVat * kurs)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-16 mt-24 mb-12">
          <div className="text-center" style={{ width: '280px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '80px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PIC Akhir (P-Sign)</div>
            <div style={{ fontWeight: 900, fontSize: '15px', borderBottom: '1px solid #111827', display: 'inline-block', paddingBottom: '4px' }}>VP Feedstock Pertamina</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Authorized Digital Signature</div>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
          Generated by Pertamina FAST • Dokumen ini diproses secara otomatis dan sah tanpa tanda tangan basah.
        </div>
      </div>
    </div>
  );
};
export const VerificationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lifting, setLifting] = useState(null);
  const [decision, setDecision] = useState(null); // 'approve', 'revise', 'reject'
  const [catatan, setCatatan] = useState('');
  const [acuanHarga, setAcuanHarga] = useState('');
  const [toast, setToast] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleChange = (field, val) => {
    setLifting(prev => ({ ...prev, [field]: val }));
  };

  useEffect(() => {
    const data = getLiftingById(id);
    if (data) {
      setLifting(data);
      setAcuanHarga(data.acuanHarga || '');
    }
  }, [id]);

  const primaries = getPrimaryCrudes();
  const deriveds = getDerivedCrudes();
  const crudeMaster = lifting ? (primaries.find(c => (c.namaCrude || c.nama) === lifting.jenisMm) || deriveds.find(c => (c.namaCrude || c.nama) === lifting.jenisMm)) : null;
  const refBasePrice = crudeMaster ? getPrimaryCrudePrice(crudeMaster.kode || crudeMaster.baseRef) : 0;
  const refAlpha = crudeMaster ? (crudeMaster.alpha || 0) : 0;
  const refPrice = refBasePrice + refAlpha;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleConfirm = () => {
    if (!decision) { showToast('Pilih keputusan: Approve, Revise, atau Reject'); return; }

    if (decision === 'approve') {
      // Save updated volume nominasi and other fields before techically approving
      updateLifting(id, { volumeNominasi: lifting.volumeNominasi, acuanHarga: acuanHarga });
      approveLifting(id, catatan);
      showToast('Lifting Berhasil Disetujui (Approved)');
    } else if (decision === 'revise') {
      if (!catatan.trim()) { showToast('Catatan wajib diisi untuk permintaan revisi'); return; }
      rejectLifting(id, catatan, false); // False = status 'revisi'
      showToast('Permintaan Revisi Dikirim ke Submitter');
    } else if (decision === 'reject') {
      if (!catatan.trim()) { showToast('Catatan wajib diisi untuk penolakan'); return; }
      rejectLifting(id, catatan, true); // True = status 'rejected'
      showToast('Lifting Ditolak (Rejected)');
    }

    setTimeout(() => navigate('/operasional/verifikasi'), 1500);
  };

  if (!lifting) return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 0' }}>
      <AlertCircle size={48} color="var(--warning)" /><h2 className="mt-4">Data Tidak Ditemukan</h2>
      <p className="text-muted mt-2">ID "{id}" tidak ditemukan.</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}><ChevronLeft size={16} /> Kembali</button>
    </div>
  );

  const statusBadge = {
    submitted: <span className="badge badge-warning" style={{ fontSize: '10px', padding: '4px 12px' }}>Menunggu Review L1</span>,
    approved: <span className="badge badge-success" style={{ fontSize: '10px', padding: '4px 12px' }}>Approved</span>,
    revisi: <span className="badge badge-danger" style={{ fontSize: '10px', padding: '4px 12px' }}>Butuh Perbaikan</span>,
    rejected: <span className="badge badge-danger" style={{ background: '#000', fontSize: '10px', padding: '4px 12px' }}>Rejected</span>,
    draft: <span className="badge badge-draft" style={{ fontSize: '10px', padding: '4px 12px' }}>Draft</span>
  };

  const tol = lifting.volumeNominasi ? Math.abs((lifting.totalVolume - lifting.volumeNominasi) / lifting.volumeNominasi * 100) : 0;
  const isOk = tol <= 5;

  // Formatting helpers
  const formatVol = (v) => Number(v || 0).toLocaleString();
  const formatCur = (v) => Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatIdr = (v) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');

  const LabelVal = ({ label, val, subVal, color }) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: color || '#1e293b' }}>
        {val || '-'}
        {subVal && <span style={{ marginLeft: '8px', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', ...subVal.style }}>{subVal.text}</span>}
      </div>
    </div>
  );

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    padding: '40px',
    marginBottom: '32px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f1f5f9'
  };

  const grid3Col = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px'
  };

  const entCardStyle = (color) => ({
    background: `linear-gradient(to bottom right, #ffffff, #fcfdfe)`,
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    marginTop: '24px'
  });

  return (
    <div className="animate-fade-in" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 2000, padding: '16px 24px', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', background: decision === 'reject' ? '#ef4444' : decision === 'revise' ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={20} /> {toast}
        </div>
      )}

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <button onClick={() => navigate('/operasional/verifikasi')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Detail Verifikasi Lifting</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginTop: '4px' }}>
              <span>B/L: {lifting.blNumber}</span>
              <span style={{ opacity: 0.3 }}>•</span>
              <span style={{ color: '#00529c' }}>ID: {lifting.id}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ flex: 1 }}>
            {/* Section 1: Rincian Data Lifting Minyak */}
            <div style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#00529c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={18} /> Review Data Lifting Minyak
                </h2>
                {statusBadge[lifting.status]}
              </div>

              <div style={grid3Col}>
                <div>
                  <LabelVal label="Periode Bulan / Tahun" val={lifting.periodeLiftingBulan ? (['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][parseInt(lifting.periodeLiftingBulan) - 1] + ' ' + lifting.periodeLiftingTahun) : '-'} />
                  <LabelVal label="Seller" val={lifting.seller || lifting.kkks} />
                  <LabelVal label="Jenis Cargo" val={lifting.jenisMm} />
                  <LabelVal label="B/L Dated" val={lifting.blDate} />
                  <LabelVal label="B/L Number" val={lifting.blNumber} />
                  <LabelVal label="Tipe Lifting" val={lifting.tipeLifting === 'pipeline' ? 'Pipeline' : 'Vessel'} />
                </div>
                <div>
                  {lifting.tipeLifting === 'vessel' && <LabelVal label="Vessel Name" val={lifting.vesselName} />}
                  <LabelVal label="Loading Port" val={lifting.loadPort} />
                  <LabelVal label="Discharge Port" val={lifting.dischargePort} />
                  <LabelVal label="Total Volume Realisasi (bbls)" val={formatVol(lifting.totalVolume)} />

                  {/* Volume Nominasi Input as requested */}
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Total Volume Nominasi (Input Verifikator)</div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        className="input-control"
                        value={lifting.volumeNominasi || ''}
                        onChange={e => handleChange('volumeNominasi', e.target.value)}
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '14px',
                          fontWeight: 800,
                          color: '#00529c',
                          background: '#f8fafc',
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                      />
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>BBLS</div>
                    </div>
                  </div>

                  <LabelVal label="Operation Tolerance (%)" val={tol.toFixed(2) + '%'} subVal={isOk ? { text: 'OKE', style: { background: '#ecfdf5', color: '#10b981' } } : { text: 'WARNING', style: { background: '#fef2f2', color: '#ef4444' } }} color={isOk ? "#10b981" : "#ef4444"} />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Remarks (Free Text)</div>
                  <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#475569', lineHeight: '1.6', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{lifting.remarks || lifting.catatan || '-'}</div>
                </div>
              </div>
            </div>

            {/* Section 2: Review Detail Penagihan & Keuangan */}
            <div style={cardStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DollarSign size={18} /> Review Detail Penagihan & Keuangan
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '48px' }}>
                <div>
                  <LabelVal label="Kind of Transaction" val={lifting.kindOfTransaction} />
                  <LabelVal label="Invoice Number" val={lifting.invoiceNumber} color="#00529c" />
                </div>
                <div>
                  <LabelVal
                    label="Kurs BI (IDR/USD)"
                    val={formatIdr(lifting.kursBeliBi)}
                    subVal={lifting.kursBeliBi !== getLatestKursBI()?.harga ? { text: `Master: ${formatIdr(getLatestKursBI()?.harga)}`, style: { background: 'rgba(245,158,11,0.1)', color: '#f59e0b' } } : null}
                  />
                </div>
                <div>
                  <LabelVal label="Tgl Invoice / Jatuh Tempo Provisional" val={`${lifting.invoiceDate || '-'} / ${lifting.dueDateInvoice || '-'}`} />
                  <LabelVal label="Jatuh Tempo Final" val={lifting.dueDateFinal || '-'} />
                </div>
              </div>

              {/* Financial Comparisons */}
              {[
                {
                  label: 'Entitlement KKKS',
                  vol: lifting.kkksVolume,
                  price: lifting.kkksPrice,
                  alpha: lifting.kkksAlpha,
                  color: '#00529c'
                },
                {
                  label: 'Entitlement SKK Migas (GOI)',
                  vol: lifting.skkVolume,
                  price: lifting.skkPrice,
                  alpha: lifting.skkAlpha,
                  color: '#10b981'
                }
              ].map((ent, i) => (
                <div key={i} style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ent.color }}></div>
                    <h3 style={{ fontSize: '12px', fontWeight: 900, color: ent.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ent.label}</h3>
                  </div>

                  <div style={entCardStyle(ent.color)}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                      {/* Submited */}
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0', marginBottom: '24px' }}>Data Submitted (Actual)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>ICP (USD/bbl)</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>${formatCur(lifting.icpPrice)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Alpha (USD/bbl)</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>${formatCur(ent.alpha)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Total Price (USD/bbl)</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>${formatCur(ent.price)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Volume (BBL)</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>{formatVol(ent.vol)}</div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Amount USD</div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: ent.color }}>${formatCur(parseFloat(ent.vol) * parseFloat(ent.price))}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Amount IDR</div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>{formatIdr(parseFloat(ent.vol) * parseFloat(ent.price) * parseFloat(lifting.kursBeliBi))}</div>
                          </div>
                        </div>
                      </div>

                      {/* Recalculated */}
                      <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '64px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0', marginBottom: '24px' }}>System Recalculated (Master Ref)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Ref. Base Price</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#f59e0b' }}>${formatCur(refBasePrice)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Ref. Alpha</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#00529c' }}>${formatCur(refAlpha)}</div>
                          </div>
                        </div>
                        <div style={{ mt: '32px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Total Ref. Price</div>
                          <div style={{ fontSize: '20px', fontWeight: 900, color: '#cbd5e1' }}>${formatCur(refPrice)}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Amount USD (REF)</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#cbd5e1' }}>${formatCur(parseFloat(ent.vol) * refPrice)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Amount IDR (REF)</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#cbd5e1' }}>{formatIdr(parseFloat(ent.vol) * refPrice * parseFloat(lifting.kursBeliBi))}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Documents */}
              <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px' }}>Dokumen Pendukung</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {[
                    { label: 'Invoice', file: lifting.fileInvoice, icon: <FileText size={18} /> },
                    { label: 'B/L', file: lifting.fileBL, icon: <Activity size={18} /> },
                    { label: 'Faktur Pajak', file: lifting.fileFakturPajak, icon: <DollarSign size={18} /> },
                    { label: 'Dokumen Lain', file: lifting.fileDocLain, icon: <Info size={18} /> }
                  ].map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: doc.file ? '#fff' : '#f8fafc', opacity: doc.file ? 1 : 0.4, transition: 'all 0.2s', cursor: doc.file ? 'pointer' : 'default' }}>
                      <div style={{ color: doc.file ? '#00529c' : '#94a3b8' }}>{doc.icon}</div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase' }}>{doc.label}</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '120px' }}>{doc.file || 'Tidak ada file'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: '380px', position: 'sticky', top: '40px' }}>
            <div style={{ ...cardStyle, borderTop: '6px solid #00529c', padding: '0' }}>
              <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={22} color="#00529c" fill="#00529c" />
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tindakan Lanjutan</h2>
              </div>

              <div style={{ padding: '32px' }}>
                <div style={{ marginBottom: '40px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '20px' }}>Keputusan L1</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setDecision('approve')} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid', fontWeight: 900, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: decision === 'approve' ? '#10b981' : '#f1f5f9', background: decision === 'approve' ? '#ecfdf5' : '#ffffff', color: decision === 'approve' ? '#10b981' : '#64748b' }}>Approve</button>
                    <button onClick={() => setDecision('reject')} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid', fontWeight: 900, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: decision === 'reject' ? '#ef4444' : '#f1f5f9', background: decision === 'reject' ? '#fef2f2' : '#ffffff', color: decision === 'reject' ? '#ef4444' : '#64748b' }}>Reject</button>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Acuan Harga (Free Text)</label>
                  <input value={acuanHarga} onChange={e => setAcuanHarga(e.target.value)} placeholder="Ex: ICP Kalimantan + Alpha..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', fontWeight: 600, outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Catatan Verifikasi</label>
                  <textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Tambahkan alasan atau catatan pemeriksaan..." style={{ width: '100%', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', fontWeight: 600, minHeight: '160px', outline: 'none', resize: 'none' }} />
                </div>

                <button disabled={!decision} onClick={handleConfirm} style={{ width: '100%', padding: '20px', borderRadius: '12px', background: decision ? '#1a3a5f' : '#cbd5e1', color: '#ffffff', fontWeight: 900, fontSize: '16px', border: 'none', cursor: decision ? 'pointer' : 'not-allowed', boxShadow: decision ? '0 10px 25px rgba(26,58,95,0.2)' : 'none' }}>Simpan & Kirim</button>

                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Audit Informasi</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>Status:</span>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase' }}>{lifting.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>Terakhir Update:</span>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b' }}>{lifting.updatedAt || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
