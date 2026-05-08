let filterLevel = 'all';

const levelConfig = {
  overdue: { label: 'Overdue', bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.3)', dot: '#ef4444' },
  critical: { label: 'Critical', bg: 'rgba(239,68,68,0.07)', color: '#ef4444', border: 'rgba(239,68,68,0.2)', dot: '#ee312a' },
  warning: { label: 'Warning', bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.22)', dot: '#f59e0b' },
  watch: { label: 'Watch', bg: 'rgba(59,130,246,0.07)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)', dot: '#3b82f6' },
};

document.addEventListener('DOMContentLoaded', async () => {
  initLayout('exception');
  await initFASTData();
  renderSummary();
  renderFilters();
  renderSignals();
});

function renderSummary() {
  const signals = FAST_DATA.signals;
  const criticalCount = signals.filter(s => s.Level === 'critical' || s.Level === 'overdue').length;
  const warningCount = signals.filter(s => s.Level === 'warning').length;
  const totalExposure = signals.reduce((a, s) => a + (s.TotalAmountUsd || 0), 0);

  document.getElementById('signal-summary').innerHTML = `
    <div class="col-md-4">
      <div class="summary-card" style="border-left:3px solid #ef4444">
        <div>
          <div class="summary-card-label">Overdue / Critical</div>
          <div class="summary-card-value" style="color:#ef4444">${criticalCount}</div>
          <div class="summary-card-sub">Jatuh tempo ≤ 3 hari</div>
        </div>
        <div class="summary-card-icon" style="background:rgba(239,68,68,0.1)"><i class="bi bi-exclamation-circle" style="font-size:22px;color:#ef4444"></i></div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="summary-card" style="border-left:3px solid var(--fast-warning)">
        <div>
          <div class="summary-card-label">Warning</div>
          <div class="summary-card-value" style="color:var(--fast-warning)">${warningCount}</div>
          <div class="summary-card-sub">Jatuh tempo 4–14 hari</div>
        </div>
        <div class="summary-card-icon" style="background:rgba(245,158,11,0.12)"><i class="bi bi-exclamation-circle" style="font-size:22px;color:var(--fast-warning)"></i></div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="summary-card" style="border-left:3px solid #3b82f6">
        <div>
          <div class="summary-card-label">Total Eksposur (USD)</div>
          <div class="summary-card-value" style="font-size:22px;color:var(--fast-accent)">$${(totalExposure / 1e6).toFixed(1)}M</div>
          <div class="summary-card-sub">${signals.length} invoice belum dibayar</div>
        </div>
        <div class="summary-card-icon" style="background:rgba(0,82,156,0.08)"><i class="bi bi-currency-dollar" style="font-size:22px;color:var(--fast-accent)"></i></div>
      </div>
    </div>
  `;
}

function renderFilters() {
  const levels = ['all', 'overdue', 'critical', 'warning', 'watch'];
  document.getElementById('level-filters').innerHTML = levels.map(lvl => {
    const lbl = lvl === 'all' ? 'Semua' : levelConfig[lvl].label;
    const isActive = filterLevel === lvl;
    return `<button class="btn btn-sm" onclick="setFilter('${lvl}')" style="
      background:${isActive ? (lvl === 'all' ? 'var(--fast-accent)' : levelConfig[lvl]?.bg || 'transparent') : 'transparent'};
      color:${isActive ? (lvl === 'all' ? 'white' : levelConfig[lvl]?.color || 'var(--fast-text-muted)') : 'var(--fast-text-muted)'};
      border:1px solid ${isActive ? (lvl === 'all' ? 'var(--fast-accent)' : levelConfig[lvl]?.border || 'var(--fast-border)') : 'var(--fast-border)'};
      font-weight:${isActive ? 700 : 500};font-size:12px;padding:5px 12px">${lbl}</button>`;
  }).join('');
}

function setFilter(lvl) {
  filterLevel = lvl;
  renderFilters();
  renderSignals();
}

function getDaysLabel(days) {
  if (days < 0) return { text: `${Math.abs(days)} hari lewat`, color: '#ef4444' };
  if (days === 0) return { text: 'Hari ini!', color: '#ef4444' };
  if (days === 1) return { text: 'Besok', color: '#ee312a' };
  return { text: `${days} hari lagi`, color: days <= 7 ? '#ef4444' : days <= 14 ? '#f59e0b' : '#3b82f6' };
}

function renderSignals() {
  const search = (document.getElementById('sigSearch').value || '').toLowerCase();
  const filtered = FAST_DATA.signals.filter(s => {
    const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === s.PartnerKey) || {};
    const matchLevel = filterLevel === 'all' || s.Level === filterLevel;
    const matchSearch = s.InvoiceNumber.toLowerCase().includes(search) || (partner.PartnerName || '').toLowerCase().includes(search);
    return matchLevel && matchSearch;
  });

  document.getElementById('signal-tbody').innerHTML = filtered.length === 0
    ? '<tr><td colspan="10" class="text-center py-4 text-muted">Tidak ada exception signal untuk filter ini.</td></tr>'
    : filtered.map(s => {
      const cfg = levelConfig[s.Level];
      const dl = getDaysLabel(s.DaysLeft);
      const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === s.PartnerKey) || {};
      return `<tr style="background:${s.Level === 'overdue' ? 'rgba(239,68,68,0.025)' : ''}">
        <td><span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.border}"><span style="width:6px;height:6px;border-radius:50%;background:${cfg.dot};flex-shrink:0"></span>${cfg.label}</span></td>
        <td class="fw-medium" style="color:var(--fast-accent)">${s.InvoiceNumber}</td>
        <td>${partner.PartnerName || '-'}</td>
        <td>${s.LiftingDate}</td>
        <td class="fw-medium">${s.DueDateLabel}</td>
        <td class="text-center"><span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;background:${s.DaysLeft < 0 ? 'rgba(239,68,68,0.1)' : s.DaysLeft <= 3 ? 'rgba(238,49,42,0.08)' : s.DaysLeft <= 7 ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.08)'};color:${dl.color}">${dl.text}</span></td>
        <td>${formatNumber(s.Volume)}</td>
        <td class="fw-medium">${formatCurrency(s.TotalAmountUsd)}</td>
        <td><span class="badge rounded-pill ${s.PaymentStatus === 'Overdue' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}" style="font-size:11px">● ${s.PaymentStatus}</span></td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-fast-outline" style="padding:4px 10px;font-size:11px" onclick="showToast('Membuka detail ${s.InvoiceNumber}')"><i class="bi bi-eye me-1"></i>Detail</button>
            <button class="btn btn-sm btn-fast-primary" style="padding:4px 10px;font-size:11px" onclick="eskalasiSignal('${s.InvoiceNumber}')"><i class="bi bi-bell me-1"></i>Eskalasi</button>
          </div>
        </td>
      </tr>`;
    }).join('');

  document.getElementById('signal-count').innerHTML = `Total <strong>${filtered.length}</strong> exception signal aktif`;
}

function eskalasiSignal(invoiceNum) {
  if(confirm('Kirim email eskalasi ke partner terkait untuk Invoice ' + invoiceNum + '?')) {
    showToast('Email eskalasi berhasil dikirim ke Partner terkait.', 'success');
  }
}
