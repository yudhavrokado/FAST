import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileUp, CheckSquare, Database, FileText, User, Bell, Hexagon, MessageSquareWarning } from 'lucide-react';
import { Dashboard, DataSubmission, VerificationPage, MasterDataPage, SettlementArchive, VerificationDetail } from './pages';
import './index.css';

const Sidebar = () => {
  return (
    <div className="sidebar" style={{ overflowY: 'auto' }}>
      <div className="flex items-center gap-3 mb-8 px-6 pt-4">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'white', borderRadius: '10px' }}>
          <Hexagon size={24} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>FAST</div>
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>SETTLEMENT SYSTEM</div>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '12px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>DASHBOARD BERSAMA</div>
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard"><LayoutDashboard size={18} /> Ringkasan Pembayaran</NavLink>

      <div style={{ padding: '0 24px', marginTop: '24px', marginBottom: '12px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>MANAJEMEN LIFTING</div>
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/submission"><FileUp size={18} /> Input Data Lifting</NavLink>
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/verifikasi"><CheckSquare size={18} /> Inbox Terpadu</NavLink>
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/master-data"><Database size={18} /> Master Data Referensi</NavLink>

      <div style={{ padding: '0 24px', marginTop: '24px', marginBottom: '12px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>OUTPUT DOKUMEN</div>
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/settlement"><FileText size={18} /> Daftar Invoice / Settlement</NavLink>

      <div style={{ marginTop: 'auto', padding: '24px' }}>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Menu ini menyajikan navigasi <em>All-in-One</em> untuk memudahkan ulasan prototipe.
        </div>
      </div>
    </div>
  );
};

const TopNav = () => {
  const location = useLocation();
  const getTitle = () => {
    const p = location.pathname;
    if (p.includes('dashboard')) return 'Dashboard Eksekutif (View: Semua)';
    if (p.includes('operasional/submission')) return 'Input Form Lifting';
    if (p.includes('operasional/verifikasi')) return 'Inbox Operasional Terpadu';
    if (p.includes('operasional/master-data')) return 'Pengaturan Master Data';
    if (p.includes('settlement')) return 'Arsip Dokumen Settlement';
    return '';
  };

  return (
    <div className="top-nav">
      <div className="font-semibold text-lg" style={{ color: 'var(--text-main)' }}>{getTitle()}</div>
      <div className="flex items-center gap-6">
        <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '8px', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3 cursor-pointer ml-2">
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <User size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Guest Reviewer</div>
            <div className="text-xs text-muted" style={{ color: 'var(--success)' }}>● Prototype Session</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/operasional/submission" element={<DataSubmission />} />
              <Route path="/operasional/verifikasi" element={<VerificationPage />} />
              <Route path="/operasional/verifikasi/:id" element={<VerificationDetail />} />
              <Route path="/operasional/master-data" element={<MasterDataPage />} />
              <Route path="/settlement" element={<SettlementArchive />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
