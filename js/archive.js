let archiveTab = 'output';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout('archive');
  await initFASTData();
  renderArchive();
});

function switchArchiveTab(tab, el) {
  archiveTab = tab;
  document.getElementById('tab-output').style.display = tab === 'output' ? '' : 'none';
  document.getElementById('tab-raw').style.display = tab === 'raw' ? '' : 'none';
  document.querySelectorAll('.fast-tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderArchive();
}

function renderArchive() {
  const search = (document.getElementById('archSearch').value || '').toLowerCase();

  // Output tab (Approved Settlements)
  const outputData = FAST_DATA.Fact_Settlement.filter(s => {
    const l = FAST_DATA.Fact_Lifting.find(lf => lf.LiftingKey === s.LiftingKey) || {};
    const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
    const c = FAST_DATA.Dim_Crude.find(cr => cr.CrudeKey === l.CrudeKey) || {};
    
    const matchSearch = s.InvoiceNumber.toLowerCase().includes(search) || 
                        (p.PartnerName || '').toLowerCase().includes(search);
    
    return s.PaymentStatus === 'Paid' || s.PaymentStatus === 'Approved' ? matchSearch : false;
  });

  document.getElementById('archive-output-tbody').innerHTML = outputData.length === 0
    ? '<tr><td colspan="9" class="text-center py-4 text-muted">Tidak ada data arsip.</td></tr>'
    : outputData.map(s => {
      const l = FAST_DATA.Fact_Lifting.find(lf => lf.LiftingKey === s.LiftingKey) || {};
      const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
      const c = FAST_DATA.Dim_Crude.find(cr => cr.CrudeKey === l.CrudeKey) || {};
      return `
      <tr>
        <td class="fw-medium" style="color:var(--fast-accent)">${s.InvoiceNumber}</td>
        <td>${p.PartnerName || '-'}</td>
        <td>${c.CrudeName || '-'}</td>
        <td>${s.InvoiceDate}</td>
        <td class="text-end">${formatNumber(l.VolumeBbls)}</td>
        <td class="text-end">${formatCurrency(s.UnitPriceUsd)}</td>
        <td class="text-end fw-semibold" style="color:var(--fast-success)">${formatCurrency(s.TotalAmountUsd)}</td>
        <td class="text-center"><span class="badge bg-success-subtle text-success" style="font-size:11px">${s.PaymentStatus}</span></td>
        <td><button class="btn btn-sm btn-fast-outline" style="padding:4px 10px;font-size:11px" onclick="showToast('Membuka lembar settlement...')"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Lihat Sheet</button></td>
      </tr>
    `}).join('');
  document.getElementById('archive-output-count').textContent = `${outputData.length} record approved`;

  // Raw tab (All Liftings)
  const rawData = FAST_DATA.Fact_Lifting.filter(l => {
    const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
    return l.LiftingID.toLowerCase().includes(search) || (p.PartnerName || '').toLowerCase().includes(search);
  });

  document.getElementById('archive-raw-tbody').innerHTML = rawData.length === 0
    ? '<tr><td colspan="9" class="text-center py-4 text-muted">Tidak ada data.</td></tr>'
    : rawData.map(l => {
      const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
      const c = FAST_DATA.Dim_Crude.find(cr => cr.CrudeKey === l.CrudeKey) || {};
      return `
      <tr>
        <td style="font-family:monospace;font-size:12px">${l.LiftingID}</td>
        <td>${getStatusBadge(l.StatusKey)}</td>
        <td class="fw-medium">${p.PartnerName || '-'}</td>
        <td>${c.CrudeName || '-'}</td>
        <td>${l.BLNumber || '-'}</td>
        <td>${l.BLDate ? l.BLDate.substring(5,7) + '/' + l.BLDate.substring(0,4) : '-'}</td>
        <td class="text-end">${formatNumber(l.VolumeBbls)}</td>
        <td><span class="badge rounded-pill" style="background:${l.TransactionType === 'Import' ? 'rgba(239,68,68,0.08)' : 'rgba(0,166,81,0.08)'};color:${l.TransactionType === 'Import' ? '#ef4444' : '#00a651'};font-size:11px">${l.TransactionType || 'Domestik Reguler'}</span></td>
        <td><a href="edit-lifting?id=${l.LiftingID}" class="btn btn-sm btn-fast-outline" style="padding:4px 10px;font-size:11px;text-decoration:none"><i class="bi bi-eye me-1"></i>Detail</a></td>
      </tr>
    `}).join('');
  document.getElementById('archive-raw-count').textContent = `${rawData.length} total record`;
}

function exportCSV() {
  const headers = ['No. Invoice', 'KKKS', 'Crude', 'Volume', 'Price USD', 'Total USD', 'Invoice Date', 'Status'];
  const outputData = FAST_DATA.Fact_Settlement.filter(s => s.PaymentStatus === 'Paid' || s.PaymentStatus === 'Approved' || s.PaymentStatus === 'Unpaid');
  const rows = outputData.map(s => {
    const l = FAST_DATA.Fact_Lifting.find(lf => lf.LiftingKey === s.LiftingKey) || {};
    const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
    const c = FAST_DATA.Dim_Crude.find(cr => cr.CrudeKey === l.CrudeKey) || {};
    return [s.InvoiceNumber, p.PartnerName || '-', c.CrudeName || '-', l.VolumeBbls || 0, s.UnitPriceUsd || 0, s.TotalAmountUsd || 0, s.InvoiceDate || '-', s.PaymentStatus];
  });
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fast_settlement_archive.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('File CSV berhasil diunduh');
}
