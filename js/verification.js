document.addEventListener('DOMContentLoaded', async () => {
  initLayout('verification');
  await initFASTData();
  renderVerification();
});

function renderVerification() {
  const search = (document.getElementById('vSearch').value || '').toLowerCase();
  const filter = document.getElementById('vFilter').value;

  // Filter liftings that are in verification workflow
  const data = FAST_DATA.Fact_Lifting.filter(l => {
    const status = FAST_DATA.Dim_Status.find(s => s.StatusKey === l.StatusKey) || {};
    const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === l.PartnerKey) || {};
    
    const validCodes = ['submitted', 'revisi', 'approved_provisional', 'approved_final'];
    if (!validCodes.includes(status.StatusCode)) return false;

    const matchSearch = (l.BLNumber || '').toLowerCase().includes(search) || (partner.PartnerName || '').toLowerCase().includes(search);
    
    if (filter === 'Semua Status') return matchSearch;
    if (filter === 'Menunggu Review') return matchSearch && status.StatusCode === 'submitted';
    if (filter === 'Butuh Perbaikan') return matchSearch && status.StatusCode === 'revisi';
    if (filter === 'Approved') return matchSearch && (status.StatusCode === 'approved_provisional' || status.StatusCode === 'approved_final');
    return matchSearch;
  });

  const getStatusBadgeV = (statusKey) => {
    const s = FAST_DATA.Dim_Status.find(st => st.StatusKey === statusKey) || {};
    if (s.StatusCode === 'submitted') return '<span class="badge rounded-pill" style="background:rgba(245,158,11,0.12);color:#d97706;border:1px solid rgba(245,158,11,0.25);font-size:11px">Menunggu Review L1</span>';
    if (s.StatusCode === 'revisi') return '<span class="badge rounded-pill" style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);font-size:11px">Butuh Perbaikan</span>';
    if (s.StatusCode === 'approved_provisional') return '<span class="badge rounded-pill" style="background:rgba(34,197,94,0.12);color:#16a34a;border:1px solid rgba(34,197,94,0.25);font-size:11px">Approved Prov. (L1)</span>';
    if (s.StatusCode === 'approved_final') return '<span class="badge rounded-pill" style="background:rgba(34,197,94,0.2);color:#16a34a;border:1px solid rgba(34,197,94,0.3);font-size:11px">Approved Final (L1)</span>';
    return `<span class="badge bg-light text-muted" style="font-size:11px">${s.StatusLabel}</span>`;
  };

  const getActionBtn = (statusKey, id) => {
    const s = FAST_DATA.Dim_Status.find(st => st.StatusKey === statusKey) || {};
    if (s.StatusCode === 'submitted') {
      return `<button class="btn btn-sm btn-success me-1" style="padding:6px 12px;font-size:12px" onclick="handleApprove('${id}')"><i class="bi bi-check-lg"></i> Approve</button>
              <button class="btn btn-sm btn-danger" style="padding:6px 12px;font-size:12px" onclick="handleReject('${id}')"><i class="bi bi-x-lg"></i> Reject</button>`;
    }
    if (s.StatusCode === 'revisi') return `<span class="text-danger fw-semibold" style="font-size:12px">Menunggu Perbaikan L0</span>`;
    if (s.StatusCode === 'approved_provisional' || s.StatusCode === 'approved_final') {
      return `<button class="btn btn-sm btn-fast-outline" style="padding:6px 12px;font-size:12px;opacity:0.7" onclick="window.location.href='archive.html'"><i class="bi bi-file-earmark-text me-1"></i>Lihat Arsip</button>`;
    }
    return '';
  };

  document.getElementById('v-tbody').innerHTML = data.length === 0
    ? '<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada dokumen yang sesuai dengan kriteria pencarian/filter.</td></tr>'
    : data.map(l => {
      const partner = FAST_DATA.Dim_Partner.find(p => p.PartnerKey === l.PartnerKey) || {};
      const status = FAST_DATA.Dim_Status.find(s => s.StatusKey === l.StatusKey) || {};
      return `
      <tr>
        <td class="fw-medium">${l.BLNumber || 'No B/L'}</td>
        <td>${partner.PartnerName || '-'}</td>
        <td>${l.BLDate || '-'}</td>
        <td>${formatNumber(l.VolumeBbls)}</td>
        <td>${getStatusBadgeV(l.StatusKey)}</td>
        <td style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${status.StatusCode === 'revisi' ? '#ef4444' : 'var(--fast-text-muted)'}">
          ${l.RejectionNotes || '-'}
        </td>
        <td>${getActionBtn(l.StatusKey, l.LiftingID)}</td>
      </tr>
    `}).join('');

  const countEl = document.getElementById('v-count');
  if (countEl) countEl.textContent = `Menampilkan ${data.length} baris dokumen aktif`;
}

async function handleApprove(id) {
  if(confirm('Approve Lifting ini?')) {
    const lifting = getLiftingDetail(id);
    const newStatus = (lifting.Settlement && lifting.Settlement.KindOfTransaction === 'Final') ? 6 : 5;
    
    await updateLifting(id, { StatusKey: newStatus, ApprovalNotes: 'Approved by L1' });
    showToast('Lifting berhasil di-approve.', 'success');
    renderVerification();
  }
}

async function handleReject(id) {
  const reason = prompt('Alasan penolakan / revisi:');
  if(reason !== null) {
    await updateLifting(id, { StatusKey: 4, RejectionNotes: reason }); // Status 4 = Revisi
    showToast('Lifting dikembalikan untuk revisi.', 'warning');
    renderVerification();
  }
}
