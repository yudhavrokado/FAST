document.addEventListener('DOMContentLoaded', async () => {
  initLayout('dashboard');
  await initFASTData();
  renderKPICards();
  renderPriceChart();
  renderTrendChart();
  renderLoadports();
  filterInvoices('gabungan');
});

function renderKPICards() {
  const colors = ['#00529c', '#00a651', '#f59e0b', '#8b5cf6'];
  
  const totalVerified = FAST_DATA.Fact_Settlement.filter(s => s.PaymentStatus === 'Paid' || s.PaymentStatus === 'Approved').reduce((a,b) => a + (b.TotalAmountUsd || 0), 0);
  const totalReceivables = FAST_DATA.Fact_Settlement.reduce((a,b) => a + (b.TotalAmountUsd || 0), 0);
  const pendingVerifications = FAST_DATA.Fact_Lifting.filter(l => l.StatusKey === 3 || l.StatusKey === 4).length;
  const approvedInvoices = FAST_DATA.Fact_Lifting.filter(l => l.StatusKey === 5).length;
  
  const cards = [
    { title: 'Total Tagihan (USD)', value: formatCurrency(totalReceivables), sub: 'Invoice aktif bulan ini', icon: 'bi-currency-dollar' },
    { title: 'Total Verified (USD)', value: formatCurrency(totalVerified), sub: 'Sudah terverifikasi L2', icon: 'bi-check-circle' },
    { title: 'Invoice Menunggu Verifikasi', value: pendingVerifications, sub: 'Menunggu review L1', icon: 'bi-exclamation-circle' },
    { title: 'Verified Invoice', value: approvedInvoices, sub: 'Invoice selesai diverifikasi', icon: 'bi-check2-square' },
  ];
  document.getElementById('kpi-cards').innerHTML = cards.map((c, i) => `
    <div class="col-xl-3 col-md-6">
      <div class="kpi-card" style="border-top:3px solid ${colors[i]}">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span style="font-size:11px;font-weight:600;color:var(--fast-text-muted);text-transform:uppercase;letter-spacing:0.5px">${c.title}</span>
          <div class="kpi-card-icon" style="background:${colors[i]}15;color:${colors[i]};padding:7px;border-radius:8px">
            <i class="bi ${c.icon}" style="font-size:18px"></i>
          </div>
        </div>
        <div style="font-size:24px;font-weight:700;color:${i === 0 ? 'var(--fast-text-main)' : colors[i]};margin-bottom:4px">${c.value}</div>
        <div style="font-size:11px;color:var(--fast-text-muted)">${c.sub}</div>
      </div>
    </div>
  `).join('');
}

function renderPriceChart() {
  const ctx = document.getElementById('priceChart').getContext('2d');
  const brentData = FAST_DATA.Fact_Daily_Price.filter(p => p.Benchmark === 'Brent');
  const icpData = FAST_DATA.Fact_Daily_Price.filter(p => p.Benchmark === 'ICP');
  
  if (brentData.length === 0 && icpData.length === 0) {
    ctx.font = '12px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Tidak ada data harga', 150, 100);
    return;
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: brentData.map(d => d.DateKey),
      datasets: [
        { label: 'ICP', data: icpData.map(d => d.PriceUsd), borderColor: '#00529c', backgroundColor: 'rgba(0,82,156,0.1)', borderWidth: 2, tension: 0.3, pointRadius: 3, fill: false },
        { label: 'Brent', data: brentData.map(d => d.PriceUsd), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 2, borderDash: [5, 5], tension: 0.3, pointRadius: 3, fill: false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { min: 70, max: 90, ticks: { callback: v => '$' + v, font: { size: 11 } }, grid: { color: '#e4e8ed' } },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  if (!FAST_DATA.chartData || FAST_DATA.chartData.length === 0) {
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Tidak ada data tren', 150, 100);
    return;
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: FAST_DATA.chartData.map(d => d.name),
      datasets: [
        { label: 'Realisasi', data: FAST_DATA.chartData.map(d => d.realisasi), borderColor: '#00529c', backgroundColor: 'rgba(0,82,156,0.08)', borderWidth: 2, tension: 0.3, fill: true },
        { label: 'Estimasi', data: FAST_DATA.chartData.map(d => d.estimasi), borderColor: '#00a651', backgroundColor: 'rgba(0,166,81,0.08)', borderWidth: 2, borderDash: [5, 5], tension: 0.3, fill: true },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { ticks: { callback: v => '$' + (v / 1000) + 'M', font: { size: 11 } }, grid: { color: '#e4e8ed' } },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      },
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } } } }
    }
  });
}

function renderLoadports() {
  const imp = FAST_DATA.Metrics.TopLoadports.Import || [];
  const dom = FAST_DATA.Metrics.TopLoadports.Domestik || [];
  
  const maxImport = imp.length > 0 ? Math.max(...imp.map(l => l.TotalVolume)) : 1;
  document.getElementById('loadport-import').innerHTML = imp.length === 0
    ? '<div class="text-center py-3 text-muted" style="font-size:12px">Tidak ada data port</div>'
    : imp.map(lp => `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1" style="font-size:13px">
        <span>${lp.PortName}</span><span class="fw-semibold">${formatNumber(lp.TotalVolume)} BBL</span>
      </div>
      <div class="loadport-bar"><div class="loadport-bar-fill" style="width:${(lp.TotalVolume/maxImport)*100}%;background:var(--fast-accent)"></div></div>
    </div>
  `).join('');

  const maxDom = dom.length > 0 ? Math.max(...dom.map(l => l.TotalVolume)) : 1;
  document.getElementById('loadport-domestik').innerHTML = dom.length === 0
    ? '<div class="text-center py-3 text-muted" style="font-size:12px">Tidak ada data port</div>'
    : dom.map(lp => `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1" style="font-size:13px">
        <span>${lp.PortName}</span><span class="fw-semibold">${formatNumber(lp.TotalVolume)} BBL</span>
      </div>
      <div class="loadport-bar"><div class="loadport-bar-fill" style="width:${(lp.TotalVolume/maxDom)*100}%;background:var(--fast-success)"></div></div>
    </div>
  `).join('');
}

let currentViewMode = 'gabungan';
function filterInvoices(mode, btnEl) {
  currentViewMode = mode;
  document.querySelectorAll('#viewModeTabs .fast-tab-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const data = FAST_DATA.Fact_Lifting.filter(l => {
    if(mode === 'estimasi') return l.TransactionType === 'Domestik Proforma Lifting' || l.StatusKey === 1;
    if(mode === 'realisasi') return l.TransactionType !== 'Domestik Proforma Lifting' && l.StatusKey !== 1;
    return true;
  });

  document.getElementById('invoice-tbody').innerHTML = data.length === 0
    ? '<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada data untuk filter ini.</td></tr>'
    : data.map(l => {
      const settlement = FAST_DATA.Fact_Settlement.find(s => s.LiftingKey === l.LiftingKey) || {};
      const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === l.PartnerKey) || {};
      return `
      <tr>
        <td class="fw-medium">${settlement.InvoiceNumber || l.LiftingID}</td>
        <td>${l.BLDate || settlement.InvoiceDate || '-'}</td>
        <td>${partner.PartnerName || '-'}</td>
        <td><span class="badge ${l.TransactionType === 'Domestik Proforma Lifting' || l.StatusKey === 1 ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}" style="font-size:11px">${l.TransactionType === 'Domestik Proforma Lifting' || l.StatusKey === 1 ? 'Estimasi' : 'Realisasi'}</span></td>
        <td>${formatNumber(l.VolumeBbls)}</td>
        <td class="fw-medium" style="color:var(--fast-accent)">${formatCurrency(settlement.TotalAmountUsd || 0)}</td>
        <td>${getStatusBadge(l.StatusKey)}</td>
      </tr>
    `}).join('');

  document.getElementById('invoice-count').textContent = `Menampilkan ${data.length} baris data`;
}

function exportSummary() {
  showToast('Unduh Ringkasan sedang disiapkan...');
  setTimeout(() => {
    const headers = ['No. Referensi', 'KKKS', 'Volume', 'Total Nilai (USD)', 'Status'];
    const rows = FAST_DATA.Fact_Lifting.map(l => {
      const settlement = FAST_DATA.Fact_Settlement.find(s => s.LiftingKey === l.LiftingKey) || {};
      const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === l.PartnerKey) || {};
      const status = FAST_DATA.Dim_Status.find(st => st.StatusKey === l.StatusKey) || {};
      return [settlement.InvoiceNumber || l.LiftingID, partner.PartnerName || '-', l.VolumeBbls || 0, settlement.TotalAmountUsd || 0, status.StatusLabel || '-'];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fast_executive_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, 500);
}
