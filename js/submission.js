document.addEventListener('DOMContentLoaded', async () => {
  initLayout('submission');
  await initFASTData();
  populateSellerOptions();
  populateCargoOptions();
  populatePortOptions();
  renderLiftingTable();
  updateFormVisibility();
});

function switchTab(tab, btn) {
  document.getElementById('tab-manual').style.display = tab === 'manual' ? 'block' : 'none';
  document.getElementById('tab-bulk').style.display = tab === 'bulk' ? 'block' : 'none';
  document.querySelectorAll('.fast-tab-strip-btn').forEach(b => {
    b.style.background = 'transparent';
    b.style.color = 'var(--fast-text-muted)';
  });
  btn.style.background = 'var(--fast-accent)';
  btn.style.color = 'white';
}

function setCombinedMode(val, btn) {
  if (btn) {
    document.querySelectorAll('#combinedTabs .btn').forEach(b => {
      b.classList.remove('active');
      b.classList.add('btn-outline-primary');
    });
    btn.classList.add('active');
    btn.classList.remove('btn-outline-primary');
  }

  const [trx, lifting] = val.split('|');
  document.getElementById('f-trxType').value = trx;
  document.getElementById('f-liftingType').value = lifting;
  updateFormVisibility();
}

function updateFormVisibility() {
  const trxType = document.getElementById('f-trxType').value;
  const liftType = document.getElementById('f-liftingType').value;
  
  document.getElementById('form-title').innerText = `Form Input: ${trxType} (${liftType})`;
  
  const isImport = trxType === 'Import';
  const isProforma = trxType === 'Domestik Proforma';
  const isPipeline = liftType === 'Pipeline';

  // 1. Commodity Lock for Proforma
  const cmdSel = document.getElementById('f-commodity');
  if (isProforma) {
    cmdSel.value = 'Crude';
    cmdSel.setAttribute('disabled', 'true');
  } else {
    cmdSel.removeAttribute('disabled');
  }

  // 2. Incoterm
  document.getElementById('wrap-incoterm').style.display = isImport ? 'block' : 'none';
  
  // 3. PPL (Proforma Only)
  document.getElementById('wrap-pplDate').style.display = isProforma ? 'block' : 'none';
  document.getElementById('wrap-pplNumber').style.display = isProforma ? 'block' : 'none';

  // 4. B/L Dated vs Pipeline B/L Dated
  if (isProforma) {
    document.getElementById('wrap-blDate').style.display = 'none';
    document.getElementById('wrap-pipelineDate').style.display = 'none';
    document.getElementById('wrap-blNumber').style.display = 'none';
  } else {
    document.getElementById('wrap-blDate').style.display = isPipeline ? 'none' : 'block';
    document.getElementById('wrap-pipelineDate').style.display = isPipeline ? 'block' : 'none';
    document.getElementById('wrap-blNumber').style.display = 'block';
  }

  // 5. Nama Vessel
  document.getElementById('wrap-vessel').style.display = isPipeline ? 'none' : 'block';

  // 6. Volume Label
  document.getElementById('lbl-volume').innerHTML = isProforma 
    ? 'Volume Nominasi (bbls) <span class="text-danger">*</span>'
    : 'Volume Realisasi (bbls) <span class="text-danger">*</span>';
}

function populateSellerOptions() {
  const k3s = FAST_DATA.Dim_Partner.filter(p => p.PartnerType === 'KKKS');
  const sup = FAST_DATA.Dim_Partner.filter(p => p.PartnerType === 'Supplier');
  document.getElementById('seller-k3s').innerHTML = k3s.map(k => `<option value="${k.PartnerKey}">${k.PartnerName}</option>`).join('');
  document.getElementById('seller-supplier').innerHTML = sup.map(s => `<option value="${s.PartnerKey}">${s.PartnerName}</option>`).join('');
}

function populateCargoOptions() {
  const el = document.getElementById('f-cargo');
  let html = '<option value="">-- Pilih Cargo/Produk --</option>';
  html += '<optgroup label="Primary Crudes">';
  html += FAST_DATA.Dim_Crude.filter(c => !c.IsDerived).map(c => `<option value="${c.CrudeKey}">${c.CrudeName}</option>`).join('');
  html += '</optgroup><optgroup label="Derived Crudes">';
  html += FAST_DATA.Dim_Crude.filter(c => c.IsDerived).map(c => `<option value="${c.CrudeKey}">${c.CrudeName}</option>`).join('');
  html += '</optgroup>';
  el.innerHTML = html;
}

function populatePortOptions() {
  const ports = FAST_DATA.Dim_Port;
  document.getElementById('f-loadPort').innerHTML = '<option value="">-- Pilih Loading Port --</option>' + 
    ports.filter(p => p.PortType === 'Loading').map(p => `<option value="${p.PortKey}">${p.PortName}</option>`).join('');
  document.getElementById('f-dischargePort').innerHTML = '<option value="">-- Pilih Discharge Port --</option>' + 
    ports.filter(p => p.PortType === 'Discharge').map(p => `<option value="${p.PortKey}">${p.PortName}</option>`).join('');
}

async function saveDraft() {
  const data = {
    TransactionType: document.getElementById('f-trxType').value,
    LiftingType: document.getElementById('f-liftingType').value,
    CommodityType: document.getElementById('f-commodity').value,
    Incoterm: document.getElementById('f-importTerm') ? document.getElementById('f-importTerm').value : '',
    PeriodBulan: document.getElementById('f-bulan').value,
    PeriodTahun: document.getElementById('f-tahun').value,
    PartnerKey: parseInt(document.getElementById('f-seller').value) || null,
    CrudeKey: parseInt(document.getElementById('f-cargo').value) || null,
    BLDate: document.getElementById('f-blDate').value,
    PipelineBLDateStart: document.getElementById('f-plDateStart').value,
    PipelineBLDateEnd: document.getElementById('f-plDateEnd').value,
    BLNumber: document.getElementById('f-blNumber').value,
    PPLDate: document.getElementById('f-pplDate').value,
    PPLNumber: document.getElementById('f-pplNumber').value,
    VesselName: document.getElementById('f-vesselName').value,
    LoadPortKey: parseInt(document.getElementById('f-loadPort').value) || null,
    DischargePortKey: parseInt(document.getElementById('f-dischargePort').value) || null,
    VolumeBbls: parseFloat(document.getElementById('f-volume').value) || 0
  };

  const newLifting = await createDraft(data);
  if (newLifting) {
    showToast('Data Lifting berhasil disimpan sebagai Draft.');
    // Refresh the table to show the new entry immediately
    renderLiftingTable();
  }
}

function renderLiftingTable() {
  const search = (document.getElementById('liftingSearch').value || '').toLowerCase();
  const filtered = FAST_DATA.Fact_Lifting.filter(l => {
    const p = FAST_DATA.Dim_Partner.find(pt => pt.PartnerKey === l.PartnerKey) || {};
    const c = FAST_DATA.Dim_Crude.find(cr => cr.CrudeKey === l.CrudeKey) || {};
    return (p.PartnerName || '').toLowerCase().includes(search) ||
            (c.CrudeName || '').toLowerCase().includes(search) ||
            (l.LiftingID || '').toLowerCase().includes(search);
  });

  document.getElementById('lifting-tbody').innerHTML = filtered.length === 0
    ? '<tr><td colspan="14" class="text-center py-4 text-muted">Tidak ada data yang cocok.</td></tr>'
    : filtered.map(l => {
      const detail = getLiftingDetail(l.LiftingID);
      const settlement = FAST_DATA.Fact_Settlement.find(s => s.LiftingKey === l.LiftingKey) || {};
      const status = FAST_DATA.Dim_Status.find(s => s.StatusKey === l.StatusKey) || {};
      
      const actionLabel = (status.StatusCode === 'draft' || status.StatusCode === 'revisi') ? '<i class="bi bi-pencil-square me-1"></i>Proses'
        : status.StatusCode === 'lifting_locked' ? '<i class="bi bi-plus-lg me-1"></i>Penagihan'
        : '<i class="bi bi-eye me-1"></i>Detail';
      
      const actionCls = (['draft', 'revisi', 'lifting_locked'].includes(status.StatusCode)) ? 'btn-fast-primary' : 'btn-fast-outline';
      
      return `<tr>
        <td class="text-center"><a href="edit-lifting?id=${l.LiftingID}" class="btn btn-sm ${actionCls}" style="padding:6px 14px;border-radius:4px;font-size:12px;text-decoration:none">${actionLabel}</a></td>
        <td><div class="fw-semibold">${l.BLNumber || l.PPLNumber || 'No B/L'}</div><div style="font-size:11px;color:var(--fast-text-muted)">${l.BLDate || l.PPLDate || l.PipelineBLDateStart || '-'}</div></td>
        <td>${(l.PeriodBulan && l.PeriodTahun) ? l.PeriodBulan + '/' + l.PeriodTahun : (l.BLDate ? l.BLDate.substring(5,7) + '/' + l.BLDate.substring(0,4) : '-')}</td>
        <td style="font-size:12px;font-weight:600;color:var(--fast-accent)">${detail.Partner?.PartnerName || '-'}</td>
        <td>${detail.Crude?.CrudeName || '-'}</td>
        <td>${l.CommodityType || '-'}</td>
        <td class="text-center">
          <div style="font-size:11px;font-weight:700;color:${l.TransactionType === 'Import' ? '#ef4444' : '#00a651'}">${l.TransactionType || 'Domestik Reguler'}</div>
          <div class="badge rounded-pill" style="background:var(--fast-bg-surface);color:var(--fast-text-muted);border:1px solid var(--fast-border);font-size:10px;margin-top:2px">${l.LiftingType || (l.TransactionType === 'Pipeline' ? 'Pipeline' : 'Vessel')}</div>
        </td>
        <td><div style="font-size:11px;color:var(--fast-text-muted)">L: ${detail.LoadPort?.PortName || '-'}</div><div style="font-size:11px;color:var(--fast-text-muted)">D: ${detail.DischargePort?.PortName || '-'}</div></td>
        <td class="text-end fw-semibold">${formatNumber(l.VolumeBbls)}</td>
        <td><div class="fw-semibold" style="font-size:12px">${settlement.InvoiceNumber || '-'}</div><div style="font-size:10px;color:var(--fast-text-muted)">${settlement.InvoiceDate || '-'}</div></td>
        <td class="text-end fw-medium">${settlement.UnitPriceUsd ? '$' + settlement.UnitPriceUsd : '-'}</td>
        <td class="text-center">${getStatusBadge(l.StatusKey)}</td>
      </tr>`;
    }).join('');
}
