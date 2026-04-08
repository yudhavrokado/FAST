import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileUp, CheckSquare, Database, FileText, User, Bell,
  Menu, X, ChevronDown, BarChart2, Radio, Wifi, Archive
} from 'lucide-react';
import { Dashboard, DataSubmission, EditLifting, VerificationPage, MasterDataPage, SettlementArchive, ExceptionSignal, VerificationDetail } from './pages';
import './index.css';

const PertaminaLogo = () => (
  <div className="sidebar-logo">
    <div className="logo-icon">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <rect width="40" height="40" rx="8" fill="#00529c"/>
        <path d="M8 28 L14 12 L20 22 L26 14 L32 28 Z" fill="white" opacity="0.9"/>
        <circle cx="26" cy="12" r="3" fill="#e8402a"/>
      </svg>
    </div>
    <div className="logo-text">
      <div className="logo-title">PERTAMINA</div>
      <div className="logo-subtitle">FAST · SYSTEM SETTLEMENT</div>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <PertaminaLogo />
          <button className="mobile-menu-btn sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard" onClick={onClose}>
            <BarChart2 size={16} />
            <span>Executive Summary</span>
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/submission" onClick={onClose}>
            <FileUp size={16} />
            <span>Data Submission</span>
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/verifikasi" onClick={onClose}>
            <CheckSquare size={16} />
            <span>Data Verification</span>
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/operasional/master-data" onClick={onClose}>
            <Database size={16} />
            <span>Master Data</span>
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/settlement/arsip" onClick={onClose}>
            <Archive size={16} />
            <span>Arsip Invoice &amp; Settlement</span>
          </NavLink>
          <NavLink end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/settlement" onClick={onClose}>
            <Radio size={16} />
            <span>Exception Signal</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">

          <div className="sidebar-footer-icon"><Wifi size={14} /></div>
          <div className="sidebar-footer-text">
            <div className="sidebar-footer-label">Last Updated</div>
            <div className="sidebar-footer-time">11/06/2026 14:07</div>
          </div>
          <div className="sidebar-footer-brand">Pertamina Digital Hub©2026</div>
        </div>
      </div>
    </>
  );
};

const TopNav = ({ onMenuClick }) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes('dashboard')) return { parent: 'Dashboard', current: 'Executive Summary' };
    if (p.includes('operasional/submission/edit')) return { parent: 'Data Submission', current: 'Edit Data' };
    if (p.includes('operasional/submission')) return { parent: 'FAST – System Settlement', current: 'Data Submission' };
    if (p.includes('operasional/verifikasi')) return { parent: 'FAST – System Settlement', current: 'Data Verification' };
    if (p.includes('operasional/master-data')) return { parent: 'FAST – System Settlement', current: 'Master Data' };
    if (p.includes('settlement/arsip')) return { parent: 'FAST – System Settlement', current: 'Arsip Invoice & Settlement' };
    if (p.includes('settlement')) return { parent: 'FAST – System Settlement', current: 'Exception Signal' };
    return { parent: 'FAST', current: 'Dashboard' };
  };

  const { parent, current } = getBreadcrumb();

  return (
    <div className="top-nav">
      <div className="top-nav-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-parent">{parent}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{current}</span>
        </div>
        <div className="page-title">{current}</div>
      </div>

      <div className="top-nav-right">


        <div className="user-profile">
          <div className="user-avatar"><User size={16} /></div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-email">johndoe@mail.com</div>
          </div>
          <ChevronDown size={12} className="user-chevron" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <div className="page-container" style={{ width: '100%', maxWidth: 'none' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/operasional/submission" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/operasional/submission" element={<DataSubmission />} />
              <Route path="/operasional/submission/edit/:id" element={<EditLifting />} />
              <Route path="/operasional/verifikasi" element={<VerificationPage />} />
              <Route path="/operasional/verifikasi/:id" element={<VerificationDetail />} />
              <Route path="/operasional/master-data" element={<MasterDataPage />} />
              <Route path="/settlement" element={<ExceptionSignal />} />
              <Route path="/settlement/arsip" element={<SettlementArchive />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
