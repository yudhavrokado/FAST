/**
 * FAST V2 — Shared Layout Components
 * Renders sidebar + topnav into each page.
 * Each page calls initLayout('pageName') on DOMContentLoaded.
 */

function initLayout(activePage) {
  renderSidebar(activePage);
  renderTopNav(activePage);
  initSidebarToggle();
}

function renderSidebar(activePage) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Summary', icon: 'bi-bar-chart-line', href: 'dashboard' },
    { id: 'submission', label: 'Data Submission', icon: 'bi-upload', href: 'submission' },
    { id: 'verification', label: 'Data Verification', icon: 'bi-check2-square', href: 'verification' },
    { id: 'master-data', label: 'Master Data', icon: 'bi-database', href: 'master-data' },
    { id: 'archive', label: 'Arsip Invoice & Settlement', icon: 'bi-archive', href: 'archive' },
    { id: 'exception', label: 'Exception Signal', icon: 'bi-broadcast-pin', href: 'exception-signal' },
  ];

  const navHtml = navItems.map(item => `
    <a class="nav-link ${activePage === item.id ? 'active' : ''}" href="${item.href}">
      <i class="bi ${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  document.getElementById('sidebar-root').innerHTML = `
    <div class="fast-sidebar" id="sidebarEl">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <rect width="40" height="40" rx="8" fill="#00529c"/>
              <path d="M8 28 L14 12 L20 22 L26 14 L32 28 Z" fill="white" opacity="0.9"/>
              <circle cx="26" cy="12" r="3" fill="#e8402a"/>
            </svg>
          </div>
          <div>
            <div class="logo-title">PERTAMINA</div>
            <div class="logo-subtitle">FAST · SYSTEM SETTLEMENT</div>
          </div>
        </div>
        <button class="btn btn-sm sidebar-close-btn d-lg-none" onclick="closeSidebar()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        ${navHtml}
      </nav>
      <div class="sidebar-footer">
        <div style="color:var(--fast-accent);margin-bottom:2px"><i class="bi bi-wifi"></i></div>
        <div class="sidebar-footer-label">Last Updated</div>
        <div class="sidebar-footer-time">07/05/2026 21:45</div>
        <div class="sidebar-footer-brand">Pertamina Digital Hub©2026</div>
      </div>
    </div>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;
}

function renderTopNav(activePage) {
  const titles = {
    'dashboard': { parent: 'Dashboard', current: 'Executive Summary' },
    'submission': { parent: 'FAST – System Settlement', current: 'Data Submission' },
    'edit-lifting': { parent: 'Data Submission', current: 'Edit Data' },
    'verification': { parent: 'FAST – System Settlement', current: 'Data Verification' },
    'verification-detail': { parent: 'Data Verification', current: 'Detail Verifikasi' },
    'master-data': { parent: 'FAST – System Settlement', current: 'Master Data' },
    'archive': { parent: 'FAST – System Settlement', current: 'Arsip Invoice & Settlement' },
    'exception': { parent: 'FAST – System Settlement', current: 'Exception Signal' },
  };

  const t = titles[activePage] || { parent: 'FAST', current: 'Dashboard' };

  document.getElementById('topnav-root').innerHTML = `
    <div class="top-nav">
      <div class="top-nav-left">
        <button class="mobile-menu-btn d-lg-none me-2" onclick="openSidebar()">
          <i class="bi bi-list" style="font-size:20px"></i>
        </button>
        <div class="breadcrumb-fast hide-mobile">
          <span>${t.parent}</span>
          <span style="color:var(--fast-text-faint)">/</span>
          <span class="bc-current">${t.current}</span>
        </div>
        <div class="page-title-nav">${t.current}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="user-profile-chip">
          <div class="user-avatar"><i class="bi bi-person"></i></div>
          <div class="user-info-text">
            <div class="user-name">John Doe</div>
            <div class="user-email">johndoe@mail.com</div>
          </div>
          <i class="bi bi-chevron-down" style="font-size:10px;color:var(--fast-text-muted)"></i>
        </div>
      </div>
    </div>
  `;
}

function initSidebarToggle() {
  // Close sidebar on link click (mobile)
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });
}

function openSidebar() {
  document.getElementById('sidebarEl').classList.add('mobile-open');
  document.getElementById('sidebarOverlay').classList.add('active');
}

function closeSidebar() {
  document.getElementById('sidebarEl').classList.remove('mobile-open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

/**
 * Show toast notification
 */
function showToast(msg, type) {
  type = type || 'success';
  const bg = type === 'error' ? 'var(--fast-danger)' : type === 'warning' ? 'var(--fast-warning)' : 'var(--fast-success)';
  const icon = type === 'error' ? 'bi-exclamation-circle' : type === 'warning' ? 'bi-exclamation-triangle' : 'bi-check-circle';
  const toast = document.createElement('div');
  toast.className = 'fast-toast';
  toast.style.background = bg;
  toast.innerHTML = `<i class="bi ${icon}"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
