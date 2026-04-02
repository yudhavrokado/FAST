import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Activity, DollarSign, AlertCircle, CheckCircle, Upload, Save, FileText, Download, ChevronLeft, Search, Plus, Edit2, Trash2, Filter, MoreHorizontal, ArrowUpDown, CheckSquare, X, Eye, Bell, MapPin } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  getAllLiftings, getLiftingById, createDraft, updateLifting, submitLifting, createAndSubmit, 
  approveLifting, rejectLifting, deleteLifting, getKKKSList, getStats, getK3SList, 
  getSupplierList, getDatedBrentPrices, getPriceFormulas, JENIS_MM_OPTIONS, 
  KATEGORI_INVOICE_OPTIONS, LOAD_PORT_OPTIONS, DISCHARGE_PORT_OPTIONS, KIND_OF_TRANSACTION_OPTIONS, 
  PEMBELIAN_OPTIONS, generateAndAssignInvoiceId 
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
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>3 invoice sudah <strong style={{color:'#ef4444'}}>Overdue</strong>, 2 invoice jatuh tempo dalam <strong style={{color:'#f59e0b'}}>≤ 3 hari</strong> — total eksposur <strong>$129.5M</strong> belum dibayar.</span>
        <button onClick={() => window.location.href='/settlement'} style={{ background: 'transparent', border: 'none', marginLeft: 'auto', fontSize: 12, color: '#ef4444', textDecoration: 'underline', fontWeight: 600, whiteSpace:'nowrap', cursor: 'pointer' }}>Lihat Exception Signal →</button>
      </div>

      {/* ── Header ── */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h1>Dashboard Realisasi & Estimasi</h1>
          <p className="text-muted mt-2">Gambaran umum penyelesaian transaksi Feedstock & KKKS</p>
        </div>
        <div className="flex gap-4 w-full-mobile">
          <button className="btn btn-outline w-full-mobile"><Calendar size={16} /> Filter Periode</button>
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
            ICP Mar: <strong style={{color:'var(--accent)'}}>$82.45/bbl</strong> &nbsp;|&nbsp; Brent: <strong style={{color:'#f59e0b'}}>$74.85/bbl</strong>
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
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}M`} />
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
              {['gabungan','estimasi','realisasi'].map(m => (
                <button key={m} className={`tab-btn ${viewMode===m?'active':''}`} onClick={()=>setViewMode(m)} style={{textTransform:'capitalize'}}>{m}</button>
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
                  <td><span className="badge" style={{ background: inv.tipe==='Realisasi'?'rgba(0,82,156,0.1)':'rgba(0,166,81,0.1)', color: inv.tipe==='Realisasi'?'var(--accent)':'var(--success)' }}>{inv.tipe}</span></td>
                  <td>{inv.volume.toLocaleString()}</td>
                  <td className="font-medium">${inv.totalUsd.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                  <td><span className="badge" style={{ background: inv.status==='Selesai'?'#f1f5f9':'rgba(245,158,11,0.1)', color: inv.status==='Selesai'?'var(--text-muted)':'var(--warning)', border: inv.status==='Selesai'?'1px solid var(--border)':'1px solid rgba(245,158,11,0.2)' }}>{inv.status}</span></td>
                </tr>
              ))}
              {filteredInvoices.length===0 && <tr><td colSpan="7" className="text-center py-8 text-muted">Tidak ada data.</td></tr>}
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

  const emptyForm = {
    invoiceNumber: '',
    invoiceDate: '',
    dueDateInvoice: '',
    blNumber: '',
    blDate: '',
    kkks: MAPPED_K3S,
    vesselName: '',
    isPipeline: false,
    loadPort: '',
    dischargePort: '',
    kindOfTransaction: 'Provisional',
    jenisMm: 'Crude Oil',
    pembelian: 'Domestik',
    bagianPembelian: '',
    kategoriInvoice: 'Provisional Invoice',
    totalVolume: '',
    volumeK3s: '',
    volumeGoi: 0,
    priceUsdBbl: '',
    volumeGross: '',
    volumeNet: '',
    apiGravity: '',
    waterContent: '',
    catatan: '',
    fileInvoice: null,
    fileBL: null,
    fileDocLain: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [liftings, setLiftings] = useState([]);
  const [tableTab, setTableTab] = useState('submitted');

  const refreshData = useCallback(() => setLiftings(getAllLiftings()), []);
  useEffect(() => { refreshData(); }, [refreshData]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (field, value) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      // Auto-calculate Volume Goi if Total Volume or Volume K3s changes
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

  const generateInternalInvoiceId = () => {
    const rdm = Math.floor(1000 + Math.random() * 9000);
    return `INV/26/BL-${rdm}`;
  };

  const handleSaveDraft = () => {
    if (!form.invoiceNumber) { showToast('Masukkan Nomor Invoice terlebih dahulu', 'error'); return; }
    createDraft(form);
    showToast('Draft berhasil disimpan');
    setForm(emptyForm);
    refreshData();
  };

  const handleSubmit = () => {
    if (!form.invoiceNumber || !form.totalVolume || !form.priceUsdBbl) {
      showToast('Lengkapi field wajib (Nomor Invoice, Volume, Price) sebelum submit', 'error'); return;
    }
    const internalId = generateInternalInvoiceId();
    createAndSubmit({ ...form, invoiceId: internalId });
    showToast(`Invoice berhasil disubmit. Ref ID: ${internalId}`);
    setForm(emptyForm);
    refreshData();
  };


  return (
    <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>
      {toast && (
        <div className={`toast flex items-center gap-2 ${toast.type === 'error' ? 'toast-error' : toast.type === 'warning' ? 'toast-warning' : 'toast-success'}`} style={{ position: 'fixed', top: 20, right: 20, zIndex: 999 }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : toast.type === 'warning' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div>
          <h1>Invoice Submission</h1>
          <p className="text-muted mt-2">Daftarkan invoice lifting baru atau upload melalui file Excel.</p>
        </div>
      </div>

      {/* ── Input Section ── */}
      <div className="card mb-8">
        <div className="mb-6 flex gap-3 tab-strip">
          <button className={`tab-pill ${tab === 'manual' ? 'active' : ''}`} onClick={() => setTab('manual')}>Input Manual</button>
          <button className={`tab-pill ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>Bulk Upload</button>
        </div>

        {tab === 'manual' ? (
          <>
            <div className="grid-cols-3" style={{ gap: '20px' }}>
              {/* Section 1: Basic Info */}
              <div className="input-group">
                <label className="input-label">Nomor Invoice <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="input-control" placeholder="Contoh: INV/2026/001" value={form.invoiceNumber} onChange={e => handleChange('invoiceNumber', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Invoice Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="input-control" value={form.invoiceDate} onChange={e => handleChange('invoiceDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Due Date Invoice <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="input-control" value={form.dueDateInvoice} onChange={e => handleChange('dueDateInvoice', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Nomor B/L</label>
                <input type="text" className="input-control" placeholder="Contoh: BL-88204" value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">BL Date</label>
                <input type="date" className="input-control" value={form.blDate} onChange={e => handleChange('blDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">K3S / Partner (Otomatis)</label>
                <input type="text" className="input-control" value={form.kkks} readOnly style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
              </div>

              {/* Section 2: Vessel & Ports */}
              <div className="input-group">
                <label className="input-label flex justify-between">
                  <span>Nama Kapal</span>
                  <label className="flex items-center gap-2 cursor-pointer" style={{fontSize: '11px', fontWeight: 'normal'}}>
                    <input type="checkbox" checked={form.isPipeline} onChange={e => handleChange('isPipeline', e.target.checked)} />
                    Pipeline
                  </label>
                </label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder={form.isPipeline ? "Pipeline Mode Aktif" : "Contoh: MT Pertamina Prime"} 
                  disabled={form.isPipeline}
                  value={form.isPipeline ? '' : form.vesselName} 
                  onChange={e => handleChange('vesselName', e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Load Port</label>
                <select className="input-control" value={form.loadPort} onChange={e => handleChange('loadPort', e.target.value)}>
                  <option value="">-- Pilih Load Port --</option>
                  {LOAD_PORT_OPTIONS.map(lp => <option key={lp} value={lp}>{lp}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Discharge Port</label>
                <select className="input-control" value={form.dischargePort} onChange={e => handleChange('dischargePort', e.target.value)}>
                  <option value="">-- Pilih Discharge Port --</option>
                  {DISCHARGE_PORT_OPTIONS.map(dp => <option key={dp} value={dp}>{dp}</option>)}
                </select>
              </div>

              {/* Section 3: Transaction Details */}
              <div className="input-group">
                <label className="input-label">Kind of Transaction</label>
                <select className="input-control" value={form.kindOfTransaction} onChange={e => handleChange('kindOfTransaction', e.target.value)}>
                  {KIND_OF_TRANSACTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Jenis MM</label>
                <select className="input-control" value={form.jenisMm} onChange={e => handleChange('jenisMm', e.target.value)}>
                  {JENIS_MM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Pembelian (Opsional)</label>
                <select className="input-control" value={form.pembelian} onChange={e => handleChange('pembelian', e.target.value)}>
                  <option value="">-- Pilih --</option>
                  {PEMBELIAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Section 4: Volumes & Price */}
              <div className="input-group">
                <label className="input-label">Total Volume (BBLS) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="number" className="input-control" placeholder="0" value={form.totalVolume} onChange={e => handleChange('totalVolume', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Volume Bagian KKKS (BBLS)</label>
                <input type="number" className="input-control" placeholder="0" value={form.volumeK3s} onChange={e => handleChange('volumeK3s', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Volume GOI (Auto)</label>
                <input type="number" className="input-control" value={form.volumeGoi} readOnly style={{ background: '#f9fafb' }} />
              </div>

              <div className="input-group">
                <label className="input-label">Price (USD/bbl) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="number" step="0.01" className="input-control" placeholder="0.00" value={form.priceUsdBbl} onChange={e => handleChange('priceUsdBbl', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">API Gravity</label>
                <input type="text" className="input-control" placeholder="Contoh: 33.2" value={form.apiGravity} onChange={e => handleChange('apiGravity', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Kategori Invoice</label>
                <select className="input-control" value={form.kategoriInvoice} onChange={e => handleChange('kategoriInvoice', e.target.value)}>
                  {KATEGORI_INVOICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Section 5: Uploads */}
            <div className="mt-8 mb-4">
              <h3 className="text-sm font-semibold mb-4 text-muted uppercase tracking-wider">Dokumen Pendukung</h3>
              <div className="grid-cols-3 gap-4">
                <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                  <Upload size={20} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-sm font-semibold mb-1">Invoice</div>
                  <div className="text-xs text-muted mb-3">{form.fileInvoice || 'Format: PDF (Max 5MB)'}</div>
                  <input type="file" id="file-invoice" hidden onChange={e => handleFileChange('fileInvoice', e.target.files[0])} />
                  <button className="btn btn-sm w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('file-invoice').click()}>Pilih File</button>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                  <Upload size={20} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-sm font-semibold mb-1">B/L Document</div>
                  <div className="text-xs text-muted mb-3">{form.fileBL || 'Format: PDF (Max 5MB)'}</div>
                  <input type="file" id="file-bl" hidden onChange={e => handleFileChange('fileBL', e.target.files[0])} />
                  <button className="btn btn-sm w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('file-bl').click()}>Pilih File</button>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                  <Upload size={20} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-sm font-semibold mb-1">Doc Lainnya</div>
                  <div className="text-xs text-muted mb-3">{form.fileDocLain || 'Format: PDF / ZIP (Max 15MB)'}</div>
                  <input type="file" id="file-doc" hidden onChange={e => handleFileChange('fileDocLain', e.target.files[0])} />
                  <button className="btn btn-sm w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('file-doc').click()}>Pilih File</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={handleSaveDraft}><Save size={16} /> Simpan Draft</button>
              <button className="btn btn-primary" onClick={handleSubmit}><CheckCircle size={16} /> Submit untuk Review</button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center mb-4" style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,82,156,0.08)', color: 'var(--accent)' }}>
              <Upload size={28} />
            </div>
            <h2 className="mb-2">Bulk Upload (Excel/CSV)</h2>
            <p className="max-w-md mx-auto mb-6 text-muted text-sm">Upload form Excel Lifting secara massal. Lengkapi juga B/L dan Invoice per baris.</p>
            <div className="flex justify-center gap-3 mb-8">
              <button className="btn btn-outline" style={{ background: 'var(--bg-surface)' }}><Download size={16} /> Unduh Template</button>
              <button className="btn btn-primary"><Upload size={16} /> Upload Form Data</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Draft Data Table ── */}
      <div className="card">
        <h2 className="mb-4 text-base font-semibold" style={{ paddingLeft: '8px' }}>Drafts Tersimpan (Belum Disubmit)</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                <th>Invoice No & ID</th>
                <th>Vessel / Pipeline</th>
                <th>Transaction & MM</th>
                <th>Dates</th>
                <th>Total Vol (Bbls)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {liftings.filter(l => l.status === 'draft').map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.invoiceNumber || 'No Invoice'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {l.id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '2px', display: 'flex', alignItems: 'center' }}>
                      {l.invoiceId || (
                        l.status === 'draft' ? 
                          <button 
                            className="btn btn-sm btn-outline" 
                            style={{ padding: '2px 6px', fontSize: '10px' }}
                            onClick={() => {
                              const newId = generateAndAssignInvoiceId(l.id);
                              if (newId) {
                                showToast(`Berhasil generate Ref ID: ${newId}`);
                                refreshData();
                              }
                            }}
                          >
                            + Generate Ref ID
                          </button>
                        : <span style={{ color: 'var(--text-faint)' }}>ID Belum di-generate</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>{l.isPipeline ? <span className="badge" style={{background:'rgba(139,92,246,0.1)', color:'#8b5cf6'}}>Pipeline</span> : (l.vesselName || 'MT Unassigned')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.loadPort || 'Unknown'} → {l.dischargePort || 'Unknown'}</div>
                  </td>
                  <td>
                    <div>{l.kindOfTransaction || 'Regular'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.jenisMm || 'Crude Oil'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>Inv: {l.invoiceDate || '-'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due: {l.dueDateInvoice || '-'}</div>
                  </td>
                  <td>{l.totalVolume ? parseFloat(l.totalVolume).toLocaleString() : '-'}</td>
                  <td>
                    <span className={`badge badge-${l.status}`}>{l.status || 'Draft'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => navigate(`/operasional/submission/edit/${l.id}`)}>
                        <Edit2 size={14} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {liftings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-muted">Belum ada data rekaman Lifting.</td>
                </tr>
              )}
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
    dueDateInvoice: '',
    blNumber: '',
    blDate: '',
    kkks: '',
    vesselName: '',
    isPipeline: false,
    loadPort: '',
    dischargePort: '',
    kindOfTransaction: '',
    jenisMm: '',
    pembelian: '',
    bagianPembelian: '',
    kategoriInvoice: '',
    totalVolume: '',
    volumeK3s: '',
    volumeGoi: 0,
    priceUsdBbl: '',
    volumeGross: '',
    volumeNet: '',
    apiGravity: '',
    waterContent: '',
    catatan: '',
    fileInvoice: null,
    fileBL: null,
    fileDocLain: null,
  };
  
  const [form, setForm] = useState(emptyForm);
  const [originalStatus, setOriginalStatus] = useState('draft');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const data = getLiftingById(id);
    if (data) {
      setForm({
        invoiceNumber: data.invoiceNumber || '',
        invoiceDate: data.invoiceDate || '',
        dueDateInvoice: data.dueDateInvoice || '',
        blNumber: data.blNumber || '',
        blDate: data.blDate || '',
        kkks: data.kkks || '',
        vesselName: data.vesselName || '',
        isPipeline: data.isPipeline || false,
        loadPort: data.loadPort || '',
        dischargePort: data.dischargePort || '',
        kindOfTransaction: data.kindOfTransaction || 'Provisional',
        jenisMm: data.jenisMm || 'Crude Oil',
        pembelian: data.pembelian || 'Domestik',
        bagianPembelian: data.bagianPembelian || '',
        kategoriInvoice: data.kategoriInvoice || 'Provisional Invoice',
        totalVolume: data.totalVolume ?? '',
        volumeK3s: data.volumeK3s ?? '',
        volumeGoi: data.volumeGoi ?? 0,
        priceUsdBbl: data.priceUsdBbl ?? '',
        volumeGross: data.volumeGross ?? '', 
        volumeNet: data.volumeNet ?? '', 
        waterContent: data.waterContent ?? '',
        apiGravity: data.apiGravity ?? '', 
        catatan: data.catatan || '',
        fileInvoice: data.files?.invoice || null,
        fileBL: data.files?.bl || null,
        fileDocLain: data.files?.docLain || null,
      });
      setOriginalStatus(data.status);
    }
  }, [id]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  
  const handleChange = (field, value) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
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
    if (!form.invoiceNumber) { showToast('Nomor Invoice wajib diisi', 'error'); return; }
    updateLifting(id, form);
    showToast('Draft berhasil diperbarui');
    setTimeout(() => navigate('/operasional/submission'), 1200);
  };

  const handleSubmit = () => {
    if (!form.invoiceNumber || !form.totalVolume || !form.priceUsdBbl) {
      showToast('Lengkapi field wajib (Nomor Invoice, Volume, Price) sebelum submit', 'error'); return;
    }
    updateLifting(id, form);
    submitLifting(id);
    showToast('Data berhasil disubmit ke verifikasi L1');
    setTimeout(() => navigate('/operasional/submission'), 1200);
  };

  const statusBadge = {
    draft: { bg: '#f1f5f9', color: 'var(--text-muted)', text: 'Draft' },
    revisi: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Butuh Perbaikan' },
  };
  const st = statusBadge[originalStatus] || statusBadge.draft;

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
          <h1>Edit Invoice Submission</h1>
          <p className="text-muted mt-1" style={{ fontSize: '14px' }}>
            Internal ID: <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{id}</span>
          </p>
        </div>
        <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}22`, padding: '8px 16px', fontSize: '13px' }}>{st.text}</span>
      </div>

      {/* Form Card */}
      <div className="card">
        <h2 className="mb-6">Detail Invoice & Lifting</h2>
        <div className="grid-cols-3" style={{ gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Nomor Invoice <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="input-control" placeholder="Contoh: INV/2026/001" value={form.invoiceNumber} onChange={e => handleChange('invoiceNumber', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Invoice Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="input-control" value={form.invoiceDate} onChange={e => handleChange('invoiceDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Due Date Invoice <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" className="input-control" value={form.dueDateInvoice} onChange={e => handleChange('dueDateInvoice', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Nomor B/L</label>
                <input type="text" className="input-control" placeholder="Contoh: BL-88204" value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">BL Date</label>
                <input type="date" className="input-control" value={form.blDate} onChange={e => handleChange('blDate', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">K3S / Partner</label>
                <input type="text" className="input-control" value={form.kkks} readOnly style={{ background: '#f9fafb' }} />
              </div>

              <div className="input-group">
                <label className="input-label flex justify-between">
                  <span>Nama Kapal</span>
                  <label className="flex items-center gap-2 cursor-pointer" style={{fontSize: '11px', fontWeight: 'normal'}}>
                    <input type="checkbox" checked={form.isPipeline} onChange={e => handleChange('isPipeline', e.target.checked)} />
                    Pipeline
                  </label>
                </label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder={form.isPipeline ? "Pipeline Mode Aktif" : "Contoh: MT Pertamina Prime"} 
                  disabled={form.isPipeline}
                  value={form.isPipeline ? '' : form.vesselName} 
                  onChange={e => handleChange('vesselName', e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Load Port</label>
                <select className="input-control" value={form.loadPort} onChange={e => handleChange('loadPort', e.target.value)}>
                  <option value="">-- Pilih Load Port --</option>
                  {LOAD_PORT_OPTIONS.map(lp => <option key={lp} value={lp}>{lp}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Discharge Port</label>
                <select className="input-control" value={form.dischargePort} onChange={e => handleChange('dischargePort', e.target.value)}>
                  <option value="">-- Pilih Discharge Port --</option>
                  {DISCHARGE_PORT_OPTIONS.map(dp => <option key={dp} value={dp}>{dp}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Kind of Transaction</label>
                <select className="input-control" value={form.kindOfTransaction} onChange={e => handleChange('kindOfTransaction', e.target.value)}>
                  {KIND_OF_TRANSACTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Jenis MM</label>
                <select className="input-control" value={form.jenisMm} onChange={e => handleChange('jenisMm', e.target.value)}>
                  {JENIS_MM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Pembelian (Opsional)</label>
                <select className="input-control" value={form.pembelian} onChange={e => handleChange('pembelian', e.target.value)}>
                  <option value="">-- Pilih --</option>
                  {PEMBELIAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Total Volume (BBLS) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="number" className="input-control" placeholder="0" value={form.totalVolume} onChange={e => handleChange('totalVolume', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Volume Bagian KKKS (BBLS)</label>
                <input type="number" className="input-control" placeholder="0" value={form.volumeK3s} onChange={e => handleChange('volumeK3s', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Volume GOI (Auto)</label>
                <input type="number" className="input-control" value={form.volumeGoi} readOnly style={{ background: '#f9fafb' }} />
              </div>

              <div className="input-group">
                <label className="input-label">Price (USD/bbl) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="number" step="0.01" className="input-control" placeholder="0.00" value={form.priceUsdBbl} onChange={e => handleChange('priceUsdBbl', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">API Gravity</label>
                <input type="text" className="input-control" placeholder="Contoh: 33.2" value={form.apiGravity} onChange={e => handleChange('apiGravity', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Kategori Invoice</label>
                <select className="input-control" value={form.kategoriInvoice} onChange={e => handleChange('kategoriInvoice', e.target.value)}>
                  {KATEGORI_INVOICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
        </div>

        <div className="mt-8 mb-8" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <h3 className="font-semibold mb-4">Lampiran Dokumen Tambahan</h3>
          <div className="grid-cols-3 gap-4">
            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
              <Upload size={20} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
              <div className="text-sm font-semibold mb-1">Upload Invoice Fisik</div>
              <div className="text-xs text-muted mb-3">{form.fileInvoice || 'Format: PDF (Max 5MB)'}</div>
              <input type="file" id="edit-file-invoice" hidden onChange={e => handleFileChange('fileInvoice', e.target.files[0])} />
              <button className="btn w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('edit-file-invoice').click()}>Pilih File</button>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
              <Upload size={20} color="var(--success)" style={{ margin: '0 auto 8px' }} />
              <div className="text-sm font-semibold mb-1">Upload B/L Dokumen</div>
              <div className="text-xs text-muted mb-3">{form.fileBL || 'Format: PDF (Max 5MB)'}</div>
              <input type="file" id="edit-file-bl" hidden onChange={e => handleFileChange('fileBL', e.target.files[0])} />
              <button className="btn w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('edit-file-bl').click()}>Pilih File</button>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
              <Upload size={20} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
              <div className="text-sm font-semibold mb-1">Dokumen Pendukung Lain</div>
              <div className="text-xs text-muted mb-3">{form.fileDocLain || 'Format: PDF / ZIP (Max 15MB)'}</div>
              <input type="file" id="edit-file-doc" hidden onChange={e => handleFileChange('fileDocLain', e.target.files[0])} />
              <button className="btn w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => document.getElementById('edit-file-doc').click()}>Pilih Lainnya</button>
            </div>
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '8px' }}>
          <label className="input-label">Catatan Tambahan (Opsional)</label>
          <textarea className="input-control" placeholder="Catatan untuk reviewer..." style={{ resize: 'vertical', minHeight: '80px' }} value={form.catatan} onChange={e => handleChange('catatan', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-outline" onClick={handleSaveDraft}><Save size={16} /> Simpan Draft</button>
          <button className="btn btn-primary" onClick={handleSubmit}><CheckCircle size={16} /> Submit untuk Review</button>
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
    switch(status) {
      case 'submitted': return <span className="badge badge-warning">Menunggu Review L1</span>;
      case 'revisi': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Butuh Perbaikan</span>;
      case 'approved': return <span className="badge badge-success">Approved (Tembus L2)</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getActionButton = (status, id) => {
    switch(status) {
      case 'submitted': 
        return <button onClick={() => navigate(`/operasional/verifikasi/${id}`)} className="btn btn-sm btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}><CheckSquare size={14} /> Verifikasi Form</button>;
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
        <h1>Inbox Operasional Terpadu</h1>
        <p className="text-muted mt-2">Pusat pengelolaan seluruh antrean verifikasi L1 dan perbaikan dokumen lifting (Comprehensive View).</p>
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
  
  const brentPrices = getDatedBrentPrices();
  const k3sList = getK3SList();
  const supplierList = getSupplierList();
  const formulas = getPriceFormulas();

  return (
    <div className="animate-fade-in">
      <div className="tabs-container flex-wrap" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button className={`tab-btn ${activeTab === 'icp' ? 'active' : ''}`} onClick={() => setActiveTab('icp')}>ICP</button>
        <button className={`tab-btn ${activeTab === 'kurs' ? 'active' : ''}`} onClick={() => setActiveTab('kurs')}>Kurs (BI)</button>
        <button className={`tab-btn ${activeTab === 'brent' ? 'active' : ''}`} onClick={() => setActiveTab('brent')}>Dated Brent (Daily)</button>
        <button className={`tab-btn ${activeTab === 'k3s' ? 'active' : ''}`} onClick={() => setActiveTab('k3s')}>K3S & Supplier</button>
        <button className={`tab-btn ${activeTab === 'formula' ? 'active' : ''}`} onClick={() => setActiveTab('formula')}>Price Formula Domestik</button>
      </div>

      <div className="flex-responsive justify-between items-center mb-6">
        <div className="flex gap-2 w-full-mobile">
          <button className="btn btn-primary flex-1" style={{ padding: '8px 16px' }}><Plus size={14} /> Add Data</button>
          <button className="btn btn-outline flex-1" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}><Edit2 size={14} /> Edit</button>
          <button className="btn btn-outline flex-1" style={{ padding: '8px 16px', background: 'var(--bg-surface)', color: 'var(--danger)' }}><Trash2 size={14} /> Delete</button>
        </div>
        <div className="flex-responsive gap-3 w-full-mobile">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px' }} />
            <Search size={16} color="var(--text-muted)" />
          </div>
          <button className="btn btn-outline w-full-mobile" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}><Filter size={16} /> Filter</button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
              <th style={{ padding: '16px', width: '48px' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', background: '#fff' }}/></th>
              
              {activeTab === 'icp' && (<><th style={{ padding: '16px' }}>Id</th><th style={{ padding: '16px' }}>Periode</th><th style={{ padding: '16px' }}>Harga (USD/BBL)</th><th style={{ padding: '16px' }}>Sumber</th></>)}
              {activeTab === 'kurs' && (<><th style={{ padding: '16px' }}>Id</th><th style={{ padding: '16px' }}>Tanggal</th><th style={{ padding: '16px' }}>JISDOR (IDR)</th><th style={{ padding: '16px' }}>Sumber</th></>)}
              {activeTab === 'brent' && (<><th style={{ padding: '16px' }}>Id</th><th style={{ padding: '16px' }}>Tanggal</th><th style={{ padding: '16px' }}>Harga (USD/BBL)</th><th style={{ padding: '16px' }}>Sumber</th></>)}
              {activeTab === 'k3s' && (<><th style={{ padding: '16px' }}>ID Partner</th><th style={{ padding: '16px' }}>Nama Perusahaan</th><th style={{ padding: '16px' }}>Tipe Entitas</th><th style={{ padding: '16px' }}>Negara</th><th style={{ padding: '16px' }}>Kontak PIC</th><th style={{ padding: '16px' }}>Status</th></>)}
              {activeTab === 'formula' && (<><th style={{ padding: '16px' }}>Deskripsi</th><th style={{ padding: '16px' }}>Base Price</th><th style={{ padding: '16px' }}>Konstanta (USD/bbl)</th><th style={{ padding: '16px' }}>Persentase (%)</th><th style={{ padding: '16px' }}>Berlaku Sejak</th></>)}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'icp' && (
              <>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td><td style={{ padding:'16px' }}>ICP-2603</td><td style={{ padding:'16px' }}>Maret 2026</td><td style={{ padding:'16px',color:'var(--accent)',fontWeight:600 }}>$82.45</td><td style={{ padding:'16px' }}>Ketetapan Menteri ESDM</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td><td style={{ padding:'16px' }}>ICP-2602</td><td style={{ padding:'16px' }}>Februari 2026</td><td style={{ padding:'16px',color:'var(--accent)',fontWeight:600 }}>$80.12</td><td style={{ padding:'16px' }}>Ketetapan Menteri ESDM</td></tr>
              </>
            )}
            
            {activeTab === 'kurs' && (
              <>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td><td style={{ padding:'16px' }}>KRS-260309</td><td style={{ padding:'16px' }}>09 Mar 2026</td><td style={{ padding:'16px',color:'var(--success)',fontWeight:600 }}>Rp 15,450.00</td><td style={{ padding:'16px' }}>Bank Indonesia</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td><td style={{ padding:'16px' }}>KRS-260308</td><td style={{ padding:'16px' }}>08 Mar 2026</td><td style={{ padding:'16px',color:'var(--success)',fontWeight:600 }}>Rp 15,480.00</td><td style={{ padding:'16px' }}>Bank Indonesia</td></tr>
              </>
            )}

            {activeTab === 'brent' && brentPrices.map((b) => (
               <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                 <td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td>
                 <td style={{ padding:'16px' }}>{b.id}</td>
                 <td style={{ padding:'16px' }}>{b.tanggal}</td>
                 <td style={{ padding:'16px', fontWeight:600, color:'var(--accent)' }}>${b.harga.toFixed(2)}</td>
                 <td style={{ padding:'16px' }}>{b.sumber}</td>
               </tr>
            ))}

            {activeTab === 'k3s' && (
               <>
                 {k3sList.map((k) => (
                   <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                     <td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td>
                     <td style={{ padding:'16px' }}>{k.id}</td>
                     <td style={{ padding:'16px', fontWeight: 500 }}>{k.nama} <br/><span style={{fontSize:12, color:'var(--text-muted)'}}>{k.email}</span></td>
                     <td style={{ padding:'16px' }}><span className="badge" style={{background:'rgba(0,82,156,0.1)',color:'var(--accent)'}}>K3S Domestik</span></td>
                     <td style={{ padding:'16px' }}>{k.negara}</td>
                     <td style={{ padding:'16px' }}>{k.kontakPIC}</td>
                     <td style={{ padding:'16px' }}><span className={`badge ${k.status === 'Aktif' ? 'badge-success' : 'badge-draft'}`}>{k.status}</span></td>
                   </tr>
                 ))}
                 {supplierList.map((s) => (
                   <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                     <td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td>
                     <td style={{ padding:'16px' }}>{s.id}</td>
                     <td style={{ padding:'16px', fontWeight: 500 }}>{s.nama} <br/><span style={{fontSize:12, color:'var(--text-muted)'}}>{s.email}</span></td>
                     <td style={{ padding:'16px' }}><span className="badge" style={{background:'rgba(245,158,11,0.1)',color:'var(--warning)'}}>Supplier Import</span></td>
                     <td style={{ padding:'16px' }}>{s.negara}</td>
                     <td style={{ padding:'16px' }}>{s.kontakPIC}</td>
                     <td style={{ padding:'16px' }}><span className={`badge ${s.status === 'Aktif' ? 'badge-success' : 'badge-draft'}`}>{s.status}</span></td>
                   </tr>
                 ))}
               </>
            )}

            {activeTab === 'formula' && formulas.map((f, i) => (
               <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                 <td style={{ padding:'16px' }}><div style={{ width:16,height:16,borderRadius:4,border:'1px solid #d1d5db' }}/></td>
                 <td style={{ padding:'16px', fontWeight: 500 }}>{f.namaFormula}</td>
                 <td style={{ padding:'16px' }}><span className="badge badge-draft">{f.dasarHarga}</span></td>
                 <td style={{ padding:'16px' }}>{f.penyesuaian > 0 ? `+ $${f.penyesuaian}` : `- $${Math.abs(f.penyesuaian)}`} / bbl</td>
                 <td style={{ padding:'16px' }}>100%</td>
                 <td style={{ padding:'16px' }}>{f.berlakuDari}</td>
               </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
          <span className="text-sm text-muted">Menampilkan data aktif</span>
          <div className="pagination">
             <button className="page-btn active">1</button>
             <button className="page-btn">2</button>
             <button className="page-btn">3</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExceptionSignal = () => {
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const signals = [
    { id: 'INV/26/BL-8799', kkks: 'PT KKKS Foxtrot Energy',  liftingDate: '20 Jan 2026', dueDateLabel: '22 Mar 2026', volume: 135000,  totalUsd: 11130750, paymentStatus: 'Overdue', daysLeft: -2, level: 'overdue' },
    { id: 'INV/26/BL-8801', kkks: 'PT KKKS Delta Resources', liftingDate: '28 Jan 2026', dueDateLabel: '25 Mar 2026', volume: 312000,  totalUsd: 25724400, paymentStatus: 'Unpaid',  daysLeft: 1,  level: 'critical' },
    { id: 'INV/26/BL-8805', kkks: 'PT KKKS Alpha Energi',    liftingDate: '01 Feb 2026', dueDateLabel: '27 Mar 2026', volume: 185000,  totalUsd: 15253250, paymentStatus: 'Unpaid',  daysLeft: 3,  level: 'critical' },
    { id: 'INV/26/BL-8809', kkks: 'Pertamina EP',            liftingDate: '05 Feb 2026', dueDateLabel: '31 Mar 2026', volume: 420000,  totalUsd: 34629000, paymentStatus: 'Unpaid',  daysLeft: 7,  level: 'warning' },
    { id: 'INV/26/BL-8814', kkks: 'PT KKKS Bravo Petroleum', liftingDate: '10 Feb 2026', dueDateLabel: '03 Apr 2026', volume: 98500,   totalUsd: 8122575,  paymentStatus: 'Unpaid',  daysLeft: 10, level: 'warning' },
    { id: 'INV/26/BL-8820', kkks: 'PT KKKS Charlie Minyak',  liftingDate: '14 Feb 2026', dueDateLabel: '09 Apr 2026', volume: 250000,  totalUsd: 20612500, paymentStatus: 'Unpaid',  daysLeft: 16, level: 'watch' },
    { id: 'INV/26/BL-8824', kkks: 'PT KKKS Echo Offshore',   liftingDate: '18 Feb 2026', dueDateLabel: '14 Apr 2026', volume: 175000,  totalUsd: 14428750, paymentStatus: 'Unpaid',  daysLeft: 21, level: 'watch' },
  ];

  const levelConfig = {
    overdue:  { label: 'Overdue',  bg: 'rgba(239,68,68,0.12)',  color: '#ef4444',        border: 'rgba(239,68,68,0.3)',   dot: '#ef4444' },
    critical: { label: 'Critical', bg: 'rgba(239,68,68,0.07)',  color: 'var(--danger)',  border: 'rgba(239,68,68,0.2)',   dot: '#ee312a' },
    warning:  { label: 'Warning',  bg: 'rgba(245,158,11,0.08)', color: 'var(--warning)', border: 'rgba(245,158,11,0.22)', dot: '#f59e0b' },
    watch:    { label: 'Watch',    bg: 'rgba(59,130,246,0.07)', color: '#3b82f6',        border: 'rgba(59,130,246,0.2)',  dot: '#3b82f6' },
  };

  const filtered = signals.filter(s => {
    const matchLevel = filterLevel === 'all' || s.level === filterLevel;
    const matchSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.kkks.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  const totalExposureUsd = signals.reduce((a, s) => a + s.totalUsd, 0);
  const criticalCount = signals.filter(s => s.level === 'critical' || s.level === 'overdue').length;
  const warningCount  = signals.filter(s => s.level === 'warning').length;

  const getDaysLabel = (days) => {
    if (days < 0)   return { text: `${Math.abs(days)} hari lewat`, color: '#ef4444' };
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  if (selectedInvoice) {
    return <SettlementSheet invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }
  return (
    <div className="animate-fade-in">
      <div className="flex-responsive justify-between items-center mb-8">
        <div>
          <h1>Arsip Output Settlement</h1>
          <p className="text-muted mt-2">Daftar masing-masing transaksi (per baris) yang telah menjadi *Calculation Sheet* PDF.</p>
        </div>
        <div className="flex w-full-mobile">
          <div className="search-bar flex items-center gap-2 w-full-mobile" style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Temukan Invoice..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px' }} />
          </div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nomor Tagihan (ID Invoice)</th>
              <th>Entitas Tertaut</th>
              <th>Tanggal Settlement</th>
              <th>Volume Akhir (BBL)</th>
              <th>Nominal Setelmen Akhir (IDR)</th>
              <th>Detail Dokumen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium" style={{ color: 'var(--accent-light)' }}>INV/26/BL-8812</td>
              <td>PT KKKS Alpha Energi</td><td>09 Mar 2026</td><td>250,000</td>
              <td className="font-medium" style={{ color: 'var(--success)' }}>Rp 318,463,125,000</td>
              <td><button onClick={() => setSelectedInvoice({ id: 'INV/26/BL-8812', bl: 'BL-2026-8812', kkks: 'PT KKKS Alpha Energi', volume: 250000, rp: '318,463,125,000', usd: '20,612,500.00' })} className="btn btn-sm btn-primary" style={{ padding: '6px 12px' }}>Buka Kalkulasi PDF</button></td>
            </tr>
            <tr>
              <td className="font-medium" style={{ color: 'var(--accent-light)' }}>INV/26/BL-8813</td>
              <td>PT KKKS Bravo Petroleum</td><td>08 Mar 2026</td><td>125,500</td>
              <td className="font-medium" style={{ color: 'var(--success)' }}>Rp 159,864,832,100</td>
              <td><button onClick={() => setSelectedInvoice({ id: 'INV/26/BL-8813', bl: 'BL-2026-8813', kkks: 'PT KKKS Bravo Petroleum', volume: 125500, rp: '159,864,832,100', usd: '10,347,238.12' })} className="btn btn-sm btn-primary" style={{ padding: '6px 12px' }}>Buka Kalkulasi PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


export const SettlementSheet = ({ invoice, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="btn btn-outline" style={{ border: 'none', padding: 0 }}><ChevronLeft size={20} /> Kembali ke Daftar Arsip</button>
        <button className="btn btn-primary"><Download size={16} /> Unduh Format Cetak (PDF)</button>
      </div>

      <div className="card mx-auto calculation-sheet-card" style={{ background: 'white', color: '#111827', maxWidth: '800px', padding: '48px' }}>
        <div className="flex justify-between items-start mb-8 pb-8 calculation-sheet-header" style={{ borderBottom: '2px solid #e5e7eb' }}>
          <div>
            <h2 style={{ color: '#1e3a8a', fontWeight: 'bold', fontSize: '24px', letterSpacing: '-1px' }}>PERTAMINA FAST</h2>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Feedstock Automation Settlement Tracking</div>
          </div>
          <div className="text-right">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>CALCULATION SHEET (INVOICE)</h3>
            <div style={{ fontSize: '15px', color: '#374151', marginTop: '4px', fontWeight: 600 }}>NO: {invoice.id}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Diterbitkan secara elektronik pada: 09 Mar 2026</div>
          </div>
        </div>

        <div className="grid-cols-2 mb-8" style={{ fontSize: '14px', gap: '40px' }}>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', color: '#374151' }}>PIHAK PENYERAH (KKKS)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#6b7280' }}>Nama Institusi:</span> <strong>{invoice.kkks}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#6b7280' }}>Kode Referensi Lifting:</span> <strong>{invoice.bl}</strong></div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', color: '#374151' }}>DATA REFERENSI (FEEDSTOCK)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#6b7280' }}>Indonesian Crude Price (ICP):</span> <strong>$82.45 / BBL</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#6b7280' }}>Kurs Tengah Jisdor BI:</span> <strong>Rp 15,450.00</strong></div>
          </div>
        </div>

        <div style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>URAIAN TRANSAKSI (PER ITEM)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>KLAIM BERSIH (BBL)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>TARIF ($)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>NILAI TOTAL (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', color: '#111827' }}>Penyerahan Minyak Mentah (SLC) - Lifting ID {invoice.bl}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#111827' }}>{invoice.volume.toLocaleString()} BBL</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#111827' }}>$82.45</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#111827' }}>${invoice.usd}</td>
              </tr>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <td colSpan="3" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>Sub Total Transaksi USD:</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>${invoice.usd}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
            <div>TOTAL KEWAJIBAN PEMBAYARAN</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#6b7280', marginTop: '4px' }}>Ekuivalen Rupiah (Konversi Kurs Live)</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#047857' }}>Rp {invoice.rp}</div>
        </div>

        <div className="flex gap-16 mt-16 pb-4" style={{ borderBottom: '1px solid #e5e7eb', color: '#111827' }}>
          <div className="text-center">
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '50px' }}>Direview Oleh KKKS</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Representative {invoice.kkks}</div>
            <div style={{ fontSize: '12px' }}>Lead Commercial Operation</div>
          </div>
          <div className="text-center" style={{ marginLeft: 'auto', marginRight: '32px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '50px' }}>Disahkan Secara Elektronik</div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>VP Feedstock Pertamina</div>
            <div style={{ fontSize: '12px' }}>Authorized E-Signature - Valid</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerificationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lifting, setLifting] = useState(null);
  const [decision, setDecision] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [toast, setToast] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => { const data = getLiftingById(id); if (data) setLifting(data); }, [id]);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleConfirm = () => {
    if (!decision) { showToast('Pilih keputusan Approve atau Reject'); return; }
    if (decision === 'approve') { approveLifting(id, catatan); showToast('APPROVED!'); }
    else { if (!catatan.trim()) { showToast('Catatan wajib saat Reject'); return; } rejectLifting(id, catatan); showToast('DITOLAK'); }
    setTimeout(() => navigate('/operasional/verifikasi'), 1500);
  };

  if (!lifting) return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 0' }}>
      <AlertCircle size={48} color="var(--warning)" /><h2 className="mt-4">Data Tidak Ditemukan</h2>
      <p className="text-muted mt-2">ID "{id}" tidak ditemukan.</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}><ChevronLeft size={16} /> Kembali</button>
    </div>
  );

  const isEditable = lifting.status === 'submitted';
  const statusBadge = { submitted: <span className="badge badge-warning">Menunggu Review L1</span>, approved: <span className="badge badge-success">Approved</span>, revisi: <span className="badge badge-danger">Butuh Perbaikan</span> };

  return (
    <div className="animate-fade-in">
      {toast && (<div style={{ position: 'fixed', top: 24, right: 32, zIndex: 100, padding: '14px 24px', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: decision === 'reject' ? 'var(--danger)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease-out' }}><CheckCircle size={18} /> {toast}</div>)}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px', border: 'none' }}><ChevronLeft size={20} /></button>
        <div><h1>Detail Verifikasi Lifting</h1><p className="text-muted mt-2">B/L: <span className="font-semibold text-main">{lifting.blNumber}</span> • ID: <span style={{ color: 'var(--accent)' }}>{lifting.id}</span></p></div>
      </div>
      <div className="grid-cols-3 mb-8">
        <div className="card verification-main-card">
          <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}><h2 className="text-lg font-semibold">Data Parameter Komersial</h2>{statusBadge[lifting.status]}</div>
          <div className="grid-cols-2 mb-6 text-sm">
            <div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Entitas KKKS</div><div className="font-medium mb-4">{lifting.kkks}</div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Tanggal Lifting</div><div className="font-medium mb-4">{lifting.liftingDate}</div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Volume Gross (BBLS)</div><div className="font-medium mb-4">{lifting.volumeGross ? lifting.volumeGross.toLocaleString() : '-'}</div>
            </div>
            <div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Water Content (%)</div><div className="font-medium mb-4">{lifting.waterContent ?? '-'}</div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Volume Net Klaim (BBLS)</div><div className="font-medium mb-4 text-accent">{lifting.volumeNet ? lifting.volumeNet.toLocaleString() : '-'}</div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">API Gravity</div><div className="font-medium mb-4">{lifting.apiGravity ?? '-'}</div>
            </div>
          </div>
          {lifting.verifikasiCatatan && (<div className="mb-4 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}><div className="text-xs font-semibold uppercase mb-1" style={{ color: '#ef4444' }}>Catatan Verifikasi</div><div className="text-sm">{lifting.verifikasiCatatan}</div></div>)}
          <div className="mb-2"><h3 className="text-sm font-semibold mb-3">Dokumen Pendukung</h3><div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}><div className="flex items-center gap-3"><FileText size={18} color="var(--accent)" /><span className="text-sm font-medium">Bill_of_Lading_Signed.pdf</span></div><button className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}><Download size={14} /></button></div></div>
        </div>
        <div className="card pt-8" style={{ borderTop: `4px solid ${lifting.status === 'revisi' ? 'var(--danger)' : lifting.status === 'approved' ? 'var(--success)' : 'var(--accent)'}`, display: 'block' }}>
          <h2 className="text-lg font-semibold mb-6 pb-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <Activity size={20} color={lifting.status === 'revisi' ? 'var(--danger)' : lifting.status === 'approved' ? 'var(--success)' : 'var(--accent)'} /> 
            {lifting.status === 'submitted' ? 'Aksi Verifikasi' : lifting.status === 'revisi' ? 'Butuh Perbaikan' : 'Tindakan Lanjutan'}
          </h2>
          {lifting.status === 'submitted' && (<>
            <div className="mb-6">
              <label className="text-sm font-semibold text-muted mb-3 block">Keputusan <span style={{ color: 'var(--danger)' }}>*</span></label>
              <div className="flex justify-between gap-4">
                <button onClick={() => setDecision('approve')} className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: decision === 'approve' ? 'var(--success)' : 'var(--border)', color: decision === 'approve' ? '#fff' : 'var(--success)', background: decision === 'approve' ? 'var(--success)' : 'rgba(0,166,81,0.05)', padding: '12px' }}><CheckCircle size={18} /> Approve</button>
                <button onClick={() => setDecision('reject')} className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: decision === 'reject' ? 'var(--danger)' : 'var(--border)', color: decision === 'reject' ? '#fff' : 'var(--danger)', background: decision === 'reject' ? 'var(--danger)' : 'rgba(238,49,42,0.05)', padding: '12px' }}><AlertCircle size={18} /> Reject</button>
              </div>
            </div>
            <div className="mb-6"><label className="text-sm font-semibold text-muted mb-3 block">Catatan {decision === 'reject' ? <span style={{ color: 'var(--danger)' }}>* (Wajib)</span> : '(Opsional)'}</label><textarea className="input-control" placeholder="Tuliskan catatan..." style={{ resize: 'vertical', minHeight: '140px', width: '100%', display: 'block' }} value={catatan} onChange={e => setCatatan(e.target.value)} /></div>
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}><button onClick={handleConfirm} className="btn btn-primary w-full shadow" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>Konfirmasi & Kirim Keputusan</button></div>
          </>)}
          {lifting.status === 'revisi' && (<>
            <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#ef4444' }}>✗ Butuh Perbaikan</div>
              <div className="text-sm text-muted">{lifting.verifikasiCatatan || 'Mohon perbarui data dokumen / form yang tidak valid sebelum disubmit ulang.'}</div>
            </div>
            <div className="mt-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <button 
                className="btn w-full shadow" 
                style={{ justifyContent: 'center', padding: '14px', fontSize: '15px', background: '#ef4444', color: '#fff', border: 'none' }} 
                onClick={() => navigate(`/operasional/submission/edit/${lifting.id}`)}
              >
                <Edit2 size={18} /> Edit Data & Lampiran
              </button>
            </div>
          </>)}
          {lifting.status === 'approved' && (<>
            <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(0,166,81,0.05)', border: '1px solid rgba(0,166,81,0.2)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--success)' }}>✓ Dokumen Disetujui</div>
              <div className="text-sm text-muted">{lifting.verifikasiCatatan || 'Dokumen telah sah dan komplit. Tidak ada catatan L1.'}</div>
            </div>
            <div className="mt-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary w-full shadow" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px', background: 'var(--success)', border: 'none' }} onClick={() => setShowPaymentModal(true)}>
                <Activity size={18} /> Verifikasi Status Pembayaran (L2)
              </button>
            </div>
          </>)}
          <div className="text-xs text-muted mt-6 text-center">Rekam Jejak Diperbarui: {lifting.updatedAt}</div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="card mt-4 animate-fade-in" style={{ borderTop: '4px solid var(--success)' }}>
          <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold flex items-center gap-2"><DollarSign size={22} color="var(--success)" /> Verifikasi Pembayaran & Penerimaan Dana (L2)</h2>
            <button onClick={() => setShowPaymentModal(false)} className="btn btn-outline" style={{ padding: '6px 16px' }}>Batalkan</button>
          </div>
          
          <div className="grid-cols-2 mb-6" style={{ gap: '32px' }}>
            <div>
              <div className="mb-4">
                <label className="input-label">Tanggal Pembayaran Diterima <span style={{color:'var(--danger)'}}>*</span></label>
                <input type="date" className="input-control w-full" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="mb-4">
                <label className="input-label">Bank Penerima (Rekening Penampung) <span style={{color:'var(--danger)'}}>*</span></label>
                <select className="input-control w-full">
                  <option>Bank Mandiri - USD Rek. 123456</option>
                  <option>Bank BRI - USD Rek. 654321</option>
                  <option>Bank BNI - USD Rek. 987654</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="input-label">Nominal Diterima (USD) <span style={{color:'var(--danger)'}}>*</span></label>
                <input type="text" className="input-control w-full font-medium text-success" defaultValue={`$${lifting?.volumeNet ? (lifting.volumeNet * 82.45).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}`} />
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="input-label">Upload Bukti Rekening Koran / MT103</label>
                <div style={{ padding: '24px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-surface)' }}>
                  <Upload size={24} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
                  <div className="text-sm font-semibold mb-1">Unggah Bukti Transaksi</div>
                  <div className="text-xs text-muted">Maksimal ukuran file 2MB (PDF/JPG)</div>
                </div>
              </div>
              <div className="mb-6">
                <label className="input-label">Catatan Tambahan (Opsional)</label>
                <textarea className="input-control w-full" rows="3" placeholder="Contoh: Dana masuk utuh sesuai tagihan..."></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-primary px-8 shadow" style={{ background: 'var(--success)', border: 'none', fontSize: '15px' }} onClick={() => {
              setShowPaymentModal(false);
              showToast('Setelmen Pembayaran Berhasil Diselesaikan!');
              setTimeout(() => navigate('/operasional/verifikasi'), 1500);
            }}><CheckCircle size={18} /> Konfirmasi Selesai & Tutup Siklus Dokumen</button>
          </div>
        </div>
      )}

    </div>
  );
};
