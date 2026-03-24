import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Activity, DollarSign, AlertCircle, CheckCircle, Upload, Save, FileText, Download, ChevronLeft, Search, Plus, Edit2, Trash2, Filter, MoreHorizontal, ArrowUpDown, CheckSquare, X, Eye, Bell } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAllLiftings, getLiftingById, createDraft, updateLifting, submitLifting, createAndSubmit, approveLifting, rejectLifting, deleteLifting, getKKKSList, getStats } from './dataStore';

export const Dashboard = () => {
  const [viewMode, setViewMode] = useState('gabungan'); // 'gabungan', 'estimasi', 'realisasi'

  const chartData = [
    { name: 'Jan', realisasi: 4000, estimasi: 4400 },
    { name: 'Feb', realisasi: 3000, estimasi: 3200 },
    { name: 'Mar', realisasi: 2000, estimasi: 2400 },
    { name: 'Apr', realisasi: 2780, estimasi: 2900 },
    { name: 'May', realisasi: 1890, estimasi: 2000 },
    { name: 'Jun', realisasi: 2390, estimasi: 2500 },
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
      <div className="flex-responsive justify-between items-center mb-8">
        <div>
          <h1>Dashboard Realisasi & Estimasi</h1>
          <p className="text-muted mt-2">Gambaran umum penyelesaian transaksi Feedstock & KKKS</p>
        </div>
        <div className="flex gap-4 w-full-mobile">
          <button className="btn btn-outline w-full-mobile"><Calendar size={16} /> Filter Periode</button>
          <button className="btn btn-primary w-full-mobile"><Activity size={16} /> Unduh Ringkasan</button>
        </div>
      </div>

      <div className="grid-cols-3 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider">Total Pembayaran Bulan Ini</h3>
            <div className="icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-light)', padding: '8px', borderRadius: '8px' }}><DollarSign size={20} /></div>
          </div>
          <div className="text-3xl font-bold mb-2">$12.4M</div>
          <div className="text-sm" style={{ color: 'var(--success)' }}>+14% dibandingkan estimasi awal</div>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider">Dokumen Menunggu Aksi</h3>
            <div className="icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '8px', borderRadius: '8px' }}><AlertCircle size={20} /></div>
          </div>
          <div className="text-3xl font-bold mb-2">24</div>
          <div className="text-sm text-muted">Aksi required di antrean verifikasi</div>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-muted text-sm font-semibold uppercase tracking-wider">Tingkat Capaian SLA</h3>
            <div className="icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '8px', borderRadius: '8px' }}><CheckCircle size={20} /></div>
          </div>
          <div className="text-3xl font-bold mb-2">94%</div>
          <div className="text-sm text-muted">Disetujui dalam standar batas 3x24 Jam</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="tabs-container" style={{ marginBottom: 0 }}>
          <button 
            className={`tab-btn ${viewMode === 'gabungan' ? 'active' : ''}`}
            onClick={() => setViewMode('gabungan')}
          >
            Gabungan
          </button>
          <button 
            className={`tab-btn ${viewMode === 'estimasi' ? 'active' : ''}`}
            onClick={() => setViewMode('estimasi')}
          >
            Estimasi
          </button>
          <button 
            className={`tab-btn ${viewMode === 'realisasi' ? 'active' : ''}`}
            onClick={() => setViewMode('realisasi')}
          >
            Realisasi
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="card" style={{ height: '400px' }}>
          <h3 className="mb-6 font-semibold">Tren Realisasi vs Estimasi Lifting</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}M`} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={36} />
              {(viewMode === 'gabungan' || viewMode === 'realisasi') && (
                <Area type="monotone" dataKey="realisasi" stroke="#00529c" strokeWidth={2} fillOpacity={1} fill="url(#colorRealisasi)" />
              )}
              {(viewMode === 'gabungan' || viewMode === 'estimasi') && (
                <Area type="monotone" dataKey="estimasi" stroke="#00a651" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorEstimasi)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ height: '400px' }}>
          <h3 className="mb-6 font-semibold">Volume Submisi per KKKS Teratas</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={[
              { name: 'KKKS Alpha', volume: 4000 }, { name: 'KKKS Bravo', volume: 3000 }, { name: 'KKKS Charlie', volume: 2000 }, { name: 'Pertamina EP', volume: 2780 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
              <Bar dataKey="volume" fill="var(--accent-light)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex-responsive justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Rincian Transaksi Lifting</h2>
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Temukan Invoice..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px' }} />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Referensi</th>
                <th>Tanggal</th>
                <th>KKKS Tertaut</th>
                <th>Tipe Data</th>
                <th>Volume (BBL)</th>
                <th>Total Nilai (USD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv, idx) => (
                <tr key={idx}>
                  <td className="font-medium" style={{ color: 'var(--accent-light)' }}>{inv.id}</td>
                  <td>{inv.tanggal}</td>
                  <td>{inv.kkks}</td>
                  <td>
                    <span className="badge" style={{ 
                      background: inv.tipe === 'Realisasi' ? 'rgba(0, 82, 156, 0.1)' : 'rgba(0, 166, 81, 0.1)', 
                      color: inv.tipe === 'Realisasi' ? 'var(--accent)' : 'var(--success)' 
                    }}>
                      {inv.tipe}
                    </span>
                  </td>
                  <td>{inv.volume.toLocaleString()}</td>
                  <td className="font-medium">${inv.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>
                    <span className="badge" style={{ 
                      background: inv.status === 'Selesai' ? '#f1f5f9' : 'rgba(245, 158, 11, 0.1)', 
                      color: inv.status === 'Selesai' ? 'var(--text-muted)' : 'var(--warning)',
                      border: inv.status === 'Selesai' ? '1px solid var(--border)' : '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-muted">Tidak ada data transaksi untuk tampilan ini.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
            <span className="text-sm text-muted">Menampilkan {filteredInvoices.length} baris data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DataSubmission = () => {
  const [tab, setTab] = useState('manual');
  const navigate = useNavigate();
  const kkksList = getKKKSList();

  // Form state — mapping to the new field semantics shown in the image
  const emptyForm = {
    blNumber: '',       // Reference Number B/L
    kkks: '',           // KKS Linked
    purchaseType: '',   // Type of Purchase
    tanggalLifting: '', // Lifting Date
    volumeGross: '',    // Volume Cargo (BBLS)
    volumeNet: '',      // Total Payment (USD)
    apiGravity: '',     // Price per BBLS
    waterContent: '',   // Payment Due Date
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

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSaveDraft = () => {
    if (!form.kkks) { showToast('Pilih KKS terlebih dahulu', 'error'); return; }
    createDraft({ ...form, catatan: form.purchaseType });
    showToast('Draft berhasil disimpan');
    setForm(emptyForm);
    refreshData();
  };

  const handleSubmit = () => {
    if (!form.kkks || !form.tanggalLifting || !form.volumeGross || !form.volumeNet || !form.apiGravity) {
      showToast('Lengkapi semua field wajib sebelum submit', 'error'); return;
    }
    createAndSubmit({ ...form, catatan: form.purchaseType });
    showToast('Data berhasil disubmit');
    setForm(emptyForm);
    refreshData();
  };

  const handleDeleteDraft = (id) => {
    if (deleteLifting(id)) { showToast('Draft berhasil dihapus'); refreshData(); }
  };

  const filteredLiftings = liftings.filter(l => {
    if (tableTab === 'submitted') return l.status !== 'revisi';
    if (tableTab === 'revision') return l.status === 'revisi';
    return true;
  });

  const getStatusBadge = (status) => {
    const map = {
      draft:     { cls: 'badge badge-draft', text: '● Draft' },
      submitted: { cls: 'badge badge-submitted', text: '● Submitted' },
      revisi:    { cls: 'badge badge-danger', text: '● Revisi' },
      approved:  { cls: 'badge badge-success', text: '● Approved' },
    };
    const s = map[status] || map.draft;
    return <span className={s.cls}>{s.text}</span>;
  };

  // Stats
  const verified = liftings.filter(l => l.status === 'approved').length;
  const waiting  = liftings.filter(l => l.status === 'submitted').length;
  const returned = liftings.filter(l => l.status === 'revisi').length;

  return (
    <div className="animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="toast" style={{ background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />} {toast.msg}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-card-body">
            <div className="summary-card-label">Verified Data Lifting</div>
            <div className="summary-card-value">{verified > 0 ? verified : 'XX'}</div>
            <div className="summary-card-sub">Verified Value: <span style={{ color: 'var(--success)' }}>$XX,XXM</span></div>
          </div>
          <div className="summary-card-icon green">
            <CheckCircle size={22} color="var(--success)" />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-body">
            <div className="summary-card-label">Waiting For Review</div>
            <div className="summary-card-value">{waiting > 0 ? waiting : 'XX'}</div>
            <div className="summary-card-sub">Pending Value: <span style={{ color: 'var(--warning)' }}>$XX,XXM</span></div>
          </div>
          <div className="summary-card-icon yellow">
            <AlertCircle size={22} color="var(--warning)" />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-body">
            <div className="summary-card-label">Returned Data Lifting</div>
            <div className="summary-card-value">{returned > 0 ? returned : 'XX'}</div>
            <div className="summary-card-sub">Returned Value: <span style={{ color: 'var(--danger)' }}>$XX,XXM</span></div>
          </div>
          <div className="summary-card-icon red">
            <AlertCircle size={22} color="var(--danger)" />
          </div>
        </div>
      </div>

      {/* ── Input Form Card ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="tab-strip">
          <button className={`tab-pill ${tab === 'manual' ? 'active' : ''}`} onClick={() => setTab('manual')}>
            Input Form Manual
          </button>
          <button className={`tab-pill ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>
            Bulk Upload
          </button>
        </div>

        {tab === 'manual' ? (
          <>
            <div className="form-section-title">Input Form Manual</div>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Reference Number Bill of Lading (B/L)</label>
                <input type="text" className="input-control" placeholder="Input reference number"
                  value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">KKS Linked</label>
                <input type="text" className="input-control" placeholder="Input KKS Linked"
                  value={form.kkks} onChange={e => handleChange('kkks', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Type of Purchase</label>
                <select className="input-control" value={form.purchaseType} onChange={e => handleChange('purchaseType', e.target.value)}>
                  <option value="">Select type of purchase</option>
                  <option>Import</option>
                  <option>Domestic</option>
                  <option>Export</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Lifting Date</label>
                <div className="input-date-wrap">
                  <input type="date" className="input-control" value={form.tanggalLifting}
                    onChange={e => handleChange('tanggalLifting', e.target.value)} />
                  <span className="input-date-icon"><Calendar size={14} /></span>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Volume Cargo (BBLS)</label>
                <input type="number" className="input-control" placeholder="Input volume gross"
                  value={form.volumeGross} onChange={e => handleChange('volumeGross', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Total Payment (USD)</label>
                <input type="number" className="input-control" placeholder="Input price"
                  value={form.volumeNet} onChange={e => handleChange('volumeNet', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Price (per BBLS)</label>
                <input type="text" className="input-control" placeholder="Input API gravity"
                  value={form.apiGravity} onChange={e => handleChange('apiGravity', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Payment Due Date</label>
                <div className="input-date-wrap">
                  <input type="date" className="input-control" value={form.waterContent}
                    onChange={e => handleChange('waterContent', e.target.value)} />
                  <span className="input-date-icon"><Calendar size={14} /></span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2" style={{ paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
              <button className="btn btn-outline" onClick={handleSaveDraft}>Save as Draft</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <FileText size={15} /> Submit Data
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center mb-4"
              style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,82,156,0.08)', color: 'var(--accent)' }}>
              <Upload size={28} />
            </div>
            <h2 className="mb-2">Bulk Upload (Excel/CSV)</h2>
            <p className="max-w-md mx-auto mb-6">Upload data lifting secara massal. Hanya mendukung format .xlsx standar Pertamina FAST.</p>
            <button className="btn btn-primary"><Upload size={16} /> Pilih File</button>
          </div>
        )}
      </div>

      {/* ── Submitted Data Table ── */}
      <div className="card">
        <div className="tab-strip">
          <button className={`tab-pill ${tableTab === 'submitted' ? 'active' : ''}`} onClick={() => setTableTab('submitted')}>
            Submitted Data
          </button>
          <button className={`tab-pill ${tableTab === 'revision' ? 'active' : ''}`} onClick={() => setTableTab('revision')}>
            Revision Required
          </button>
        </div>

        <div className="action-bar">
          <div className="action-bar-left">Submitted Data</div>
          <div className="action-bar-right">
            <button className="btn btn-primary btn-sm"><Download size={13} /> Download</button>
            <div className="search-input-wrap">
              <Search size={13} color="var(--text-faint)" />
              <input type="text" placeholder="Search by Reference Numbers" />
            </div>
            <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th><span className="th-sort">Type Of Purchase <ArrowUpDown size={10} /></span></th>
                  <th><span className="th-sort">Lifting Date <ArrowUpDown size={10} /></span></th>
                  <th><span className="th-sort">Payment Due Date <ArrowUpDown size={10} /></span></th>
                  <th><span className="th-sort">Volume Cargo (BBLS) <ArrowUpDown size={10} /></span></th>
                  <th><span className="th-sort">Total Payment (USD) <ArrowUpDown size={10} /></span></th>
                  <th><span className="th-sort">Price (Per BBLS) <ArrowUpDown size={10} /></span></th>
                  <th>Integrity Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLiftings.length === 0 ? (
                  [1,2,3,4,5,6].map(i => (
                    <tr key={i}>
                      <td>Import</td>
                      <td>10 Mar 2026</td>
                      <td>29 Mar 2026</td>
                      <td>XXX,XXX</td>
                      <td>$XX,XXM</td>
                      <td>$XX.XX</td>
                      <td>
                        <span className={i === 1 ? 'badge badge-draft' : 'badge badge-submitted'}>
                          ● {i === 1 ? 'Draft' : 'Submitted'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '3px 6px' }}>
                          <Edit2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredLiftings.map(l => (
                    <tr key={l.id}>
                      <td>{l.catatan || 'Import'}</td>
                      <td>{l.tanggalLifting || '—'}</td>
                      <td>{l.waterContent || '—'}</td>
                      <td>{l.volumeGross ? Number(l.volumeGross).toLocaleString() : '—'}</td>
                      <td>{l.volumeNet ? `$${Number(l.volumeNet).toLocaleString()}` : '—'}</td>
                      <td>{l.apiGravity || '—'}</td>
                      <td>{getStatusBadge(l.status)}</td>
                      <td>
                        <div className="flex gap-2">
                          {(l.status === 'draft' || l.status === 'revisi') && (
                            <button className="btn btn-ghost btn-sm" style={{ padding: '3px 6px' }}
                              onClick={() => navigate(`/operasional/submission/edit/${l.id}`)}>
                              <Edit2 size={13} />
                            </button>
                          )}
                          {l.status === 'draft' && (
                            <button className="btn btn-ghost btn-sm" style={{ padding: '3px 6px', color: 'var(--danger)' }}
                              onClick={() => handleDeleteDraft(l.id)}>
                              <Trash2 size={13} />
                            </button>
                          )}
                          {(l.status === 'submitted' || l.status === 'approved') && (
                            <button className="btn btn-ghost btn-sm" style={{ padding: '3px 6px' }}
                              onClick={() => navigate(`/operasional/verifikasi/${l.id}`)}>
                              <Eye size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Total 210</span>
            <div className="flex items-center gap-3">
              <span>Lines per page: 25</span>
              <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span style={{ color: 'var(--text-faint)', padding: '0 4px' }}>...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export const EditLifting = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const kkksList = getKKKSList();

  const emptyForm = { blNumber: '', tanggalLifting: '', kkks: '', volumeGross: '', volumeNet: '', waterContent: '', apiGravity: '', catatan: '' };
  const [form, setForm] = useState(emptyForm);
  const [originalStatus, setOriginalStatus] = useState('draft');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const data = getLiftingById(id);
    if (data) {
      setForm({
        blNumber: data.blNumber || '', tanggalLifting: data.tanggalLifting || '', kkks: data.kkks || '',
        volumeGross: data.volumeGross ?? '', volumeNet: data.volumeNet ?? '', waterContent: data.waterContent ?? '',
        apiGravity: data.apiGravity ?? '', catatan: data.catatan || '',
      });
      setOriginalStatus(data.status);
    }
  }, [id]);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSaveDraft = () => {
    if (!form.kkks) { showToast('Pilih KKKS terlebih dahulu', 'error'); return; }
    updateLifting(id, form);
    showToast('Draft berhasil diperbarui');
    setTimeout(() => navigate('/operasional/submission'), 1200);
  };

  const handleSubmit = () => {
    if (!form.kkks || !form.tanggalLifting || !form.volumeGross || !form.volumeNet || !form.apiGravity) {
      showToast('Lengkapi semua field wajib sebelum submit', 'error'); return;
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
          <h1>Edit Data Lifting</h1>
          <p className="text-muted mt-1" style={{ fontSize: '14px' }}>
            ID: <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{id}</span>
          </p>
        </div>
        <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}22`, padding: '8px 16px', fontSize: '13px' }}>{st.text}</span>
      </div>

      {/* Form Card */}
      <div className="card">
        <h2 className="mb-6">Detail Laporan Lifting</h2>
        <div className="grid-cols-2">
          <div className="input-group">
            <label className="input-label">Nomor Referensi Bill of Lading (B/L)</label>
            <input type="text" className="input-control" placeholder="Otomatis jika kosong" value={form.blNumber} onChange={e => handleChange('blNumber', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Tanggal Lifting <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="date" className="input-control" value={form.tanggalLifting} onChange={e => handleChange('tanggalLifting', e.target.value)} />
          </div>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Entitas KKKS <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select className="input-control" value={form.kkks} onChange={e => handleChange('kkks', e.target.value)}>
              <option value="">— Pilih KKKS —</option>
              {kkksList.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Volume (Gross Bbls) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="number" className="input-control" placeholder="Contoh: 150000" value={form.volumeGross} onChange={e => handleChange('volumeGross', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Volume (Net Bbls) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="number" className="input-control" placeholder="Isi volume net yang akurat" value={form.volumeNet} onChange={e => handleChange('volumeNet', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Water Content / Sedimen (%)</label>
            <input type="text" className="input-control" placeholder="Contoh: 0.05" value={form.waterContent} onChange={e => handleChange('waterContent', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">API Gravity <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" className="input-control" placeholder="Contoh: 33.2" value={form.apiGravity} onChange={e => handleChange('apiGravity', e.target.value)} />
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
                <td>{row.tanggalLifting}</td>
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

  return (
    <div className="animate-fade-in">
      {/* Tab Navigation */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'icp' ? 'active' : ''}`}
          onClick={() => setActiveTab('icp')}
        >
          Indonesian Crude Price (ICP)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'kurs' ? 'active' : ''}`}
          onClick={() => setActiveTab('kurs')}
        >
          Nilai Tukar Kurs (BI)
        </button>
      </div>

      {/* Top Action Bar */}
      <div className="flex-responsive justify-between items-center mb-6">
        <div className="flex gap-2 w-full-mobile">
          <button className="btn btn-outline flex-1" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Plus size={16} /> Add
          </button>
          <button className="btn btn-outline flex-1" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Edit2 size={16} /> Edit
          </button>
          <button className="btn btn-outline flex-1" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
        <div className="flex-responsive gap-3 w-full-mobile">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px' }} />
            <Search size={16} color="var(--text-muted)" />
          </div>
          <button className="btn btn-outline w-full-mobile" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', width: '48px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
              </th>
              {activeTab === 'icp' ? (
                <>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Id <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Periode <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Harga Ketetapan (USD/BBL) <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Keterangan <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                </>
              ) : (
                <>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Id <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Tanggal Berlaku <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Nilai Jisdor (IDR) <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                  <th style={{ padding: '16px' }} className="font-semibold text-main">
                    <div className="flex items-center gap-1 cursor-pointer">Sumber <ArrowUpDown size={14} color="var(--text-muted)" /></div>
                  </th>
                </>
              )}
              <th style={{ padding: '16px', textAlign: 'right' }} className="font-semibold text-main">
                <div className="flex items-center justify-end gap-1 cursor-pointer">Last Modified <ArrowUpDown size={14} color="var(--text-muted)" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'icp' ? (
              <>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>ICP-2603</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>Maret 2026</td>
                  <td style={{ padding: '16px', color: 'var(--accent)' }}>$82.45</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Ketetapan Menteri ESDM</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>15/03/2026 10:30 WIB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>ICP-2602</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>Februari 2026</td>
                  <td style={{ padding: '16px', color: 'var(--accent)' }}>$80.12</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Ketetapan Menteri ESDM</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>12/02/2026 09:15 WIB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>ICP-2601</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>Januari 2026</td>
                  <td style={{ padding: '16px', color: 'var(--accent)' }}>$78.90</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Ketetapan Menteri ESDM</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>14/01/2026 14:00 WIB</td>
                </tr>
              </>
            ) : (
              <>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>KRS-260309</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>09 Mar 2026</td>
                  <td style={{ padding: '16px', color: 'var(--success)' }}>Rp 15,450.00</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>API Bank Indonesia (JISDOR)</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>09/03/2026 15:05 WIB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>KRS-260308</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>08 Mar 2026</td>
                  <td style={{ padding: '16px', color: 'var(--success)' }}>Rp 15,480.00</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>API Bank Indonesia (JISDOR)</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>08/03/2026 15:10 WIB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}></div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>KRS-260307</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>07 Mar 2026</td>
                  <td style={{ padding: '16px', color: 'var(--success)' }}>Rp 15,510.00</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>API Bank Indonesia (JISDOR)</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'right' }}>07/03/2026 15:00 WIB</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)', background: '#f9fafb' }}>
          <div className="flex items-center gap-4">
            <select className="input-control" style={{ padding: '6px 32px 6px 12px', fontSize: '13px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-muted">Page 1 of 1, Total 3</span>
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
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Tanggal Lifting</div><div className="font-medium mb-4">{lifting.tanggalLifting}</div>
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
        <div className="card pt-8" style={{ borderTop: `4px solid ${isEditable ? 'var(--accent)' : 'var(--success)'}`, display: 'block' }}>
          <h2 className="text-lg font-semibold mb-6 pb-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}><Activity size={20} color="var(--accent)" /> {isEditable ? 'Aksi Verifikasi' : 'Riwayat Keputusan'}</h2>
          {isEditable ? (<>
            <div className="mb-6">
              <label className="text-sm font-semibold text-muted mb-3 block">Keputusan <span style={{ color: 'var(--danger)' }}>*</span></label>
              <div className="flex justify-between gap-4">
                <button onClick={() => setDecision('approve')} className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: decision === 'approve' ? 'var(--success)' : 'var(--border)', color: decision === 'approve' ? '#fff' : 'var(--success)', background: decision === 'approve' ? 'var(--success)' : 'rgba(0,166,81,0.05)', padding: '12px' }}><CheckCircle size={18} /> Approve</button>
                <button onClick={() => setDecision('reject')} className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: decision === 'reject' ? 'var(--danger)' : 'var(--border)', color: decision === 'reject' ? '#fff' : 'var(--danger)', background: decision === 'reject' ? 'var(--danger)' : 'rgba(238,49,42,0.05)', padding: '12px' }}><AlertCircle size={18} /> Reject</button>
              </div>
            </div>
            <div className="mb-6"><label className="text-sm font-semibold text-muted mb-3 block">Catatan {decision === 'reject' ? <span style={{ color: 'var(--danger)' }}>* (Wajib)</span> : '(Opsional)'}</label><textarea className="input-control" placeholder="Tuliskan catatan..." style={{ resize: 'vertical', minHeight: '140px', width: '100%', display: 'block' }} value={catatan} onChange={e => setCatatan(e.target.value)} /></div>
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}><button onClick={handleConfirm} className="btn btn-primary w-full shadow" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>Konfirmasi & Kirim Keputusan</button></div>
          </>) : (
            <div><div className="p-4 rounded-lg mb-4" style={{ background: lifting.status === 'approved' ? 'rgba(0,166,81,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${lifting.status === 'approved' ? 'rgba(0,166,81,0.2)' : 'rgba(239,68,68,0.2)'}` }}><div className="text-sm font-semibold mb-1" style={{ color: lifting.status === 'approved' ? 'var(--success)' : '#ef4444' }}>{lifting.status === 'approved' ? '✓ Disetujui' : '✗ Ditolak'}</div><div className="text-sm text-muted">{lifting.verifikasiCatatan || 'Tidak ada catatan'}</div></div><div className="text-xs text-muted">Diperbarui: {lifting.updatedAt}</div></div>
          )}
        </div>
      </div>
    </div>
  );
};
