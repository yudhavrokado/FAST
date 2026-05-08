document.addEventListener('DOMContentLoaded', async () => {
  initLayout('edit-lifting');
  await initFASTData();
  loadLiftingData();
});

function loadLiftingData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const lifting = getLiftingDetail(id);

  if (lifting) {
    document.getElementById('display-id').textContent = lifting.LiftingID;

    const st = lifting.Status || { StatusLabel: 'Drafted', CssClass: 'bg-secondary-subtle text-secondary' };
    const badge = document.getElementById('status-badge');
    
    // Match CSS from data.js
    badge.className = 'badge-fast';
    badge.style.padding = '5px 14px';
    badge.style.fontSize = '12px';
    
    const colors = {
      'draft': { bg: '#f1f5f9', color: 'var(--fast-text-muted)' },
      'revisi': { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
      'lifting_locked': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
      'submitted': { bg: 'rgba(245,158,11,0.1)', color: 'var(--fast-warning)' },
      'approved': { bg: 'rgba(0,166,81,0.1)', color: 'var(--fast-success)' },
    };
    const c = colors[st.StatusCode] || colors.draft;
    badge.style.background = c.bg;
    badge.style.color = c.color;
    badge.style.border = `1px solid ${c.color}`;
    badge.textContent = st.StatusLabel;

    document.getElementById('e-pembelian').value = lifting.TransactionType || 'Domestik Reguler';
    document.getElementById('e-commodity').value = lifting.CommodityType || 'Crude';
    document.getElementById('e-seller').value = lifting.Partner?.PartnerName || '';
    document.getElementById('e-cargo').value = lifting.Crude?.CrudeName || '';
    document.getElementById('e-blDate').value = lifting.BLDate || '';
    document.getElementById('e-blNumber').value = lifting.BLNumber || '';
    document.getElementById('e-tipeLifting').value = lifting.TransactionType === 'Pipeline' ? 'pipeline' : 'vessel';
    document.getElementById('e-vessel').value = ''; // Placeholder as it's not in Fact
    document.getElementById('e-volume').value = lifting.VolumeBbls || '';

    const settlement = FAST_DATA.Fact_Settlement.find(s => s.LiftingKey === lifting.LiftingKey);

    if (st.StatusCode !== 'draft' && st.StatusCode !== 'revisi') {
      document.getElementById('billing-section').style.display = '';
      document.getElementById('lifting-buttons').style.display = 'none';
      if (settlement) {
        document.getElementById('e-invoiceNumber').value = settlement.InvoiceNumber || '';
        document.getElementById('e-invoiceDate').value = settlement.InvoiceDate || '';
        document.getElementById('e-priceUsd').value = settlement.UnitPriceUsd || '';
      }
    }
  }
}

function lockLifting() {
  // Find ID
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if(id) {
    updateLifting(id, { StatusKey: 2 }); // Lifting Locked
  }
  
  document.getElementById('billing-section').style.display = '';
  document.getElementById('lifting-buttons').style.display = 'none';
  const badge = document.getElementById('status-badge');
  badge.style.background = 'rgba(139,92,246,0.1)';
  badge.style.color = '#8b5cf6';
  badge.style.border = '1px solid #8b5cf6';
  badge.textContent = 'Lifting Terkunci';
  showToast('Data Lifting berhasil dikunci. Membuka form penagihan...');
}

function submitInvoice() {
  const inv = document.getElementById('e-invoiceNumber').value;
  const price = document.getElementById('e-priceUsd').value;
  if (!inv || !price) {
    showToast('Invoice Number dan Harga wajib diisi', 'error');
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if(id) {
    submitLifting(id);
    const l = getLiftingDetail(id);
    
    createSettlement({
        LiftingKey: l ? l.LiftingKey : Date.now(),
        LiftingID: id,
        InvoiceNumber: inv,
        InvoiceDate: new Date().toISOString().slice(0,10),
        UnitPriceUsd: parseFloat(price),
        TotalAmountUsd: parseFloat(price) * (l ? l.VolumeBbls : 0)
    });
  }
  
  showToast('Data berhasil disubmit ke verifikasi L1');
  setTimeout(() => window.location.href = 'submission.html', 1200);
}
