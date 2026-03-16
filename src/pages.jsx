import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Activity, DollarSign, AlertCircle, CheckCircle, Upload, Save, FileText, Download, ChevronLeft, Search, Plus, Edit2, Trash2, Filter, MoreHorizontal, ArrowUpDown, CheckSquare } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Dashboard Realisasi & Estimasi</h1>
          <p className="text-muted mt-2">Gambaran umum penyelesaian transaksi Feedstock & KKKS</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-outline"><Calendar size={16} /> Filter Periode</button>
          <button className="btn btn-primary"><Activity size={16} /> Unduh Ringkasan Eksekutif</button>
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
        <div className="flex justify-between items-center mb-6">
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
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1>Input Data Lifting (KKKS)</h1>
        <p className="text-muted mt-2">Lengkapi detail spesifikasi komersial minyak mentah untuk dilaporkan kepada Feedstock Pertamina.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button className={`btn ${tab === 'manual' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('manual')}>Input Form Manual</button>
        <button className={`btn ${tab === 'bulk' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('bulk')}>Bulk Upload (Excel)</button>
      </div>

      {tab === 'manual' ? (
        <div className="card">
          <h2 className="mb-6">Laporan Detail Lifting</h2>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Nomor Referensi Bill of Lading (B/L)</label>
              <input type="text" className="input-control" defaultValue="CT-2026/03-1123" />
            </div>
            <div className="input-group">
              <label className="input-label">Tanggal Lifting</label>
              <input type="date" className="input-control" defaultValue="2026-03-09" />
            </div>
            <div className="input-group">
              <label className="input-label">Volume (Gross Bbls)</label>
              <input type="number" className="input-control" placeholder="Contoh: 150000" />
            </div>
            <div className="input-group">
              <label className="input-label">Volume (Net Bbls)</label>
              <input type="number" className="input-control" placeholder="Isi volume net yang akurat" />
            </div>
            <div className="input-group">
              <label className="input-label">Water Content / Sedimen (%)</label>
              <input type="text" className="input-control" placeholder="Contoh: 0.05" />
            </div>
            <div className="input-group">
              <label className="input-label">API Gravity</label>
              <input type="text" className="input-control" placeholder="Contoh: 33.2" />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-outline">Simpan Draft</button>
            <button className="btn btn-primary"><Save size={16} /> Submit Dokumen</button>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="mx-auto flex items-center justify-center mb-4" style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-light)' }}>
            <Upload size={32} />
          </div>
          <h2 className="mb-2">Upload Format Template (Excel)</h2>
          <p className="text-muted max-w-md mx-auto mb-8">Unggah data massal lifting untuk efisiensi. Hanya mendukung format struktur template .xlsx standar Pertamina FAST.</p>
          <button className="btn btn-primary btn-lg"><Upload size={18} /> Pilih File Excel</button>
          <div className="mt-8 pt-6 mx-auto max-w-lg text-left" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><FileText size={16} /> Informasi Kolom Required:</div>
            <ul className="text-xs text-muted" style={{ marginLeft: '24px', listStyleType: 'decimal' }}>
              <li>Bill of Lading ID</li>
              <li>Net Volume BBLS</li>
              <li>Density / Gravity</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-16 pt-8" style={{ borderTop: '2px solid var(--border)' }}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-semibold">Riwayat Input Data Lifting</h2>
            <p className="text-sm text-muted mt-1">Pantau status integrasi data submission Anda sebelumnya.</p>
          </div>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px', height: 'fit-content' }}><Activity size={14} /> Segarkan Data</button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 p-4 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Periode Tanggal</label>
            <input type="month" className="input-control" style={{ padding: '8px 12px', fontSize: '14px' }} defaultValue="2026-03" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Entitas KKKS</label>
            <select className="input-control" style={{ padding: '8px 12px', fontSize: '14px' }}>
              <option>Semua KKKS</option>
              <option>PT KKKS Alpha Energi</option>
              <option>PT Bravo Petroleum</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Status Integrasi</label>
            <select className="input-control" style={{ padding: '8px 12px', fontSize: '14px' }}>
              <option>Semua Status</option>
              <option>Terkirim ke Feedstock</option>
              <option>Draft Tersimpan</option>
              <option>Butuh Revisi</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Referensi (B/L)</th>
                <th>Tanggal Submission</th>
                <th>Volume (BBLS)</th>
                <th>API Gravity</th>
                <th>Status Integrasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium" style={{ color: 'var(--accent)' }}>CT-2026/03-1120</td>
                <td>08 Mar 2026, 14:30</td>
                <td>150,000</td>
                <td>32.5</td>
                <td><span className="badge" style={{ background: 'rgba(0, 166, 81, 0.1)', color: 'var(--success)' }}>Terkirim ke Feedstock</span></td>
                <td><button onClick={() => navigate('/operasional/verifikasi/CT-2026%2F03-1120')} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}><FileText size={14} /></button></td>
              </tr>
              <tr>
                <td className="font-medium" style={{ color: 'var(--accent)' }}>CT-2026/03-1115</td>
                <td>01 Mar 2026, 09:15</td>
                <td>120,500</td>
                <td>33.1</td>
                <td><span className="badge" style={{ background: 'rgba(0, 166, 81, 0.1)', color: 'var(--success)' }}>Terkirim ke Feedstock</span></td>
                <td><button onClick={() => navigate('/operasional/verifikasi/CT-2026%2F03-1115')} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}><FileText size={14} /></button></td>
              </tr>
              <tr>
                <td className="font-medium" style={{ color: 'var(--text-muted)' }}>CT-2026/03-1122</td>
                <td>09 Mar 2026, 10:00</td>
                <td>-</td>
                <td>-</td>
                <td><span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>Draft Tersimpan</span></td>
                <td><button className="btn btn-sm btn-primary" style={{ padding: '4px 8px' }}><Save size={14} /> Lanjutkan</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const VerificationPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [searchTerm, setSearchTerm] = useState('');

  const inboxData = [
    { id: 'BL-2026-8812', entitas: 'PT KKKS Alpha Energi', tanggal: '09 Mar 2026', volume: 250000, statusType: 'menunggu_l1', statusText: 'Menunggu Review L1', notes: '-' },
    { id: 'CT-2026/03-1002', entitas: 'PT Bravo Petroleum', tanggal: '08 Mar 2026', volume: 125500, statusType: 'approved', statusText: 'Approved (Tembus L2)', notes: '-' },
    { id: 'CT-2026/03-0092', entitas: 'PT KKKS Charlie', tanggal: '03 Mar 2026', volume: 150000, statusType: 'revisi', statusText: 'Butuh Perbaikan', notes: 'Angka Net Volume keliru. Mohon cek water content.' },
    { id: 'BL-2026-8815', entitas: 'Pertamina EP', tanggal: '10 Mar 2026', volume: 300000, statusType: 'menunggu_l1', statusText: 'Menunggu Review L1', notes: '-' },
    { id: 'CT-2026/03-0105', entitas: 'PT Delta Energy', tanggal: '05 Mar 2026', volume: 85000, statusType: 'revisi', statusText: 'Butuh Perbaikan', notes: 'Lampiran manifest buram, mohon unggah ulang.' },
  ];

  const filteredData = inboxData.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.entitas.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'Semua Status') return matchesSearch;
    if (statusFilter === 'Menunggu Review') return matchesSearch && item.statusType === 'menunggu_l1';
    if (statusFilter === 'Butuh Perbaikan') return matchesSearch && item.statusType === 'revisi';
    if (statusFilter === 'Approved') return matchesSearch && item.statusType === 'approved';
    return matchesSearch;
  });

  const getStatusBadge = (type, text) => {
    switch(type) {
      case 'menunggu_l1': return <span className="badge badge-warning">{text}</span>;
      case 'revisi': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{text}</span>;
      case 'approved': return <span className="badge badge-success">{text}</span>;
      default: return <span className="badge">{text}</span>;
    }
  };

  const getActionButton = (type, id) => {
    switch(type) {
      case 'menunggu_l1': 
        return <button onClick={() => navigate(`/operasional/verifikasi/${id}`)} className="btn btn-sm btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}><CheckSquare size={14} /> Verifikasi Form</button>;
      case 'revisi': 
        return <button className="btn btn-sm btn-primary" style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', border: 'none' }}><Activity size={14} /> Perbaiki Data</button>;
      case 'approved': 
        return <button className="btn btn-sm btn-outline" style={{ padding: '6px 12px', fontSize: '12px', opacity: 0.5 }} disabled><FileText size={14} /> Lihat Arsip</button>;
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
           <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Cari ID atau KKKS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px', width: '250px' }} 
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium text-muted">Filter Status:</span>
          <select 
            className="input-field" 
            style={{ width: '200px', padding: '8px 12px', background: 'var(--bg-surface)' }}
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
              <tr key={index}>
                <td className="font-medium">{row.id}</td>
                <td>{row.entitas}</td>
                <td>{row.tanggal}</td>
                <td>{row.volume.toLocaleString()}</td>
                <td>{getStatusBadge(row.statusType, row.statusText)}</td>
                <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: row.statusType === 'revisi' ? '#ef4444' : 'var(--text-muted)' }}>
                  {row.notes}
                </td>
                <td className="flex gap-2">
                  {getActionButton(row.statusType, row.id)}
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button className="btn btn-outline" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Plus size={16} /> Add
          </button>
          <button className="btn btn-outline" style={{ padding: '8px 16px', color: 'var(--text-muted)', border: 'none', background: 'transparent' }}>
            <Edit2 size={16} /> Edit
          </button>
          <button className="btn btn-outline" style={{ padding: '8px 16px', color: 'var(--text-muted)', border: 'none', background: 'transparent' }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
        <div className="flex gap-3">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <input type="text" placeholder="Search by column" style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '14px', width: '200px' }} />
            <Search size={16} color="var(--text-muted)" />
          </div>
          <button className="btn btn-outline" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
            <Filter size={16} /> Filter
          </button>
          <button className="btn btn-outline" style={{ padding: '8px', background: 'var(--bg-surface)' }}>
            <MoreHorizontal size={16} />
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

export const SettlementArchive = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  if (selectedInvoice) {
    return <SettlementSheet invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Arsip Output Settlement</h1>
          <p className="text-muted mt-2">Daftar masing-masing transaksi (per baris/invoice) yang telah menjadi *Calculation Sheet* PDF usai persetujuan penuh.</p>
        </div>
        <div className="flex gap-2">
          <div className="search-bar flex items-center gap-2" style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
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
              <td>PT KKKS Alpha Energi</td>
              <td>09 Mar 2026</td>
              <td>250,000</td>
              <td className="font-medium" style={{ color: 'var(--success)' }}>Rp 318,463,125,000</td>
              <td>
                <button onClick={() => setSelectedInvoice({ id: 'INV/26/BL-8812', bl: 'BL-2026-8812', kkks: 'PT KKKS Alpha Energi', volume: 250000, rp: '318,463,125,000', usd: '20,612,500.00' })} className="btn btn-sm btn-primary" style={{ padding: '6px 12px' }}>Buka Kalkulasi PDF</button>
              </td>
            </tr>
            <tr>
              <td className="font-medium" style={{ color: 'var(--accent-light)' }}>INV/26/BL-8813</td>
              <td>PT KKKS Bravo Petroleum</td>
              <td>08 Mar 2026</td>
              <td>125,500</td>
              <td className="font-medium" style={{ color: 'var(--success)' }}>Rp 159,864,832,100</td>
              <td>
                <button onClick={() => setSelectedInvoice({ id: 'INV/26/BL-8813', bl: 'BL-2026-8813', kkks: 'PT KKKS Bravo Petroleum', volume: 125500, rp: '159,864,832,100', usd: '10,347,238.12' })} className="btn btn-sm btn-primary" style={{ padding: '6px 12px' }}>Buka Kalkulasi PDF</button>
              </td>
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

      <div className="card mx-auto" style={{ background: 'white', color: '#111827', maxWidth: '800px', padding: '48px' }}>
        <div className="flex justify-between items-start mb-8 pb-8" style={{ borderBottom: '2px solid #e5e7eb' }}>
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
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px', border: 'none' }}><ChevronLeft size={20} /></button>
        <div>
          <h1>Detail Verifikasi Lifting</h1>
          <p className="text-muted mt-2">No. Referensi (B/L): <span className="font-semibold text-main">CT-2026/03-1120</span></p>
        </div>
      </div>

      <div className="grid-cols-3 mb-8">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold">Data Parameter Komersial</h2>
            <span className="badge badge-warning">Menunggu Feedback Anda</span>
          </div>

          <div className="grid-cols-2 mb-6 text-sm">
            <div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Entitas KKKS</div>
              <div className="font-medium mb-4">PT KKKS Alpha Energi</div>

              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Tanggal Lifting</div>
              <div className="font-medium mb-4">08 Mar 2026</div>

              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Volume Gross (BBLS)</div>
              <div className="font-medium mb-4">152,000</div>
            </div>
            <div>
              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Tujuan Pengiriman</div>
              <div className="font-medium mb-4">Kilang Pertamina RU IV</div>

              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Volume Net Klaim (BBLS)</div>
              <div className="font-medium mb-4 text-accent">150,000</div>

              <div className="text-muted mb-1 text-xs uppercase tracking-wider font-semibold">Kualitas (API & BS&W)</div>
              <div className="font-medium mb-4">API 32.5 | BS&W 0.5%</div>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-semibold mb-3">Dokumen Pendukung Tersubmit</h3>
            <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <FileText size={18} color="var(--accent)" />
                <span className="text-sm font-medium">Bill_of_Lading_Signed.pdf</span>
              </div>
              <button className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}><Download size={14} /></button>
            </div>
          </div>
        </div>

        <div className="card pt-8" style={{ borderTop: '4px solid var(--accent)', display: 'block' }}>
          <h2 className="text-lg font-semibold mb-6 pb-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <Activity size={20} color="var(--accent)" /> Aksi & Catatan Verifikasi
          </h2>

          <div className="mb-6">
            <label className="text-sm font-semibold text-muted mb-3 block">Keputusan Verifikasi <span className="text-danger">*</span></label>
            <div className="flex justify-between gap-4">
              <button className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: 'var(--success)', color: 'var(--success)', background: 'rgba(0, 166, 81, 0.05)', padding: '12px' }}>
                <CheckCircle size={18} /> Approve Form
              </button>
              <button className="btn btn-outline flex-1" style={{ justifyContent: 'center', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'rgba(238, 49, 42, 0.05)', padding: '12px' }}>
                <AlertCircle size={18} /> Reject Form
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-muted mb-3 block flex items-center justify-between">
              <span>Tambahkan Catatan Khusus</span>
              <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>(Opsional)</span>
            </label>
            <textarea
              className="input-control"
              placeholder="Tuliskan catatan internal atau alasan kepada KKKS di sini..."
              style={{ resize: 'vertical', minHeight: '160px', width: '100%', display: 'block' }}
            ></textarea>
          </div>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-primary w-full shadow" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
              Konfirmasi & Kirim Keputusan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
