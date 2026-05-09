document.addEventListener('DOMContentLoaded', async () => {
  initLayout('edit-lifting');
  await initFASTData();
  loadLiftingData();
  attachNumericFormatting();
});

function loadLiftingData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const lifting = getLiftingDetail(id);

  if (!lifting) {
    console.error("Lifting data not found for ID:", id);
    return;
  }

  populateDropdowns(); 

  document.getElementById('display-id').textContent = lifting.LiftingID;

  // --- PURE ID-BASED LOGIC ---
  const sKey = parseInt(lifting.StatusKey);
  const st = lifting.Status || { StatusLabel: 'Unknown' };

  console.log(`Lifting ID: ${id} | StatusKey: ${sKey} | Status:`, st);

  // Manual Lifting (Left Side) is OPEN only for Status 1 (Draft) and 4 (Revisi)
  const isManualEditable = (sKey === 1 || sKey === 4);
  
  // Billing Section (Right Side) is VISIBLE if status >= 2 (Locked and onwards)
  const isBillingVisible = (sKey !== 1 && sKey !== 4);
  
  // Billing Section is EDITABLE for Status 2 (Locked), 8 (Draft Penagihan)
  // Status 5 (Approved Provisional) allows changing to Final
  // Status 9 (Submitted Adjustment) should be READ ONLY
  const isBillingEditable = (sKey === 2 || sKey === 8); 
  const isApprovedProv = (sKey === 5);
  const isSubmittedAdj = (sKey === 9);

  updateStatusBadge(st);

  // Populate Lifting Data
  document.getElementById('e-pembelian').value = lifting.TransactionType || 'Domestik Reguler';
  document.getElementById('e-commodity').value = lifting.CommodityType || 'Crude';
  document.getElementById('e-seller').value = lifting.PartnerKey || '';
  document.getElementById('e-cargo').value = lifting.CrudeKey || '';
  document.getElementById('e-blDate').value = lifting.BLDate || '';
  document.getElementById('e-blNumber').value = lifting.BLNumber || '';
  document.getElementById('e-tipeLifting').value = lifting.LiftingType || 'vessel';
  document.getElementById('e-vessel').value = lifting.VesselName || '';
  document.getElementById('e-loadPort').value = lifting.LoadPortKey || '';
  document.getElementById('e-dischargePort').value = lifting.DischargePortKey || '';
  
  setFormattedValue('e-volume', lifting.VolumeBbls);
  document.getElementById('e-remarks').value = lifting.Remarks || '';

  // Control Left Side Inputs
  toggleInputs('lifting-details-container', !isManualEditable);

  const draftBtn = document.querySelector('button[onclick="saveDraft()"]');
  const lockBtn = document.querySelector('button[onclick="lockLifting()"]');
  const deleteBtn = document.querySelector('.btn.text-danger.me-auto');

  if (!isManualEditable) {
    if (draftBtn) draftBtn.disabled = true;
    if (lockBtn) {
      lockBtn.disabled = true;
      lockBtn.innerHTML = '<i class="bi bi-lock-fill"></i> Data Terkunci';
      lockBtn.style.background = 'var(--fast-text-muted)';
    }
    if (deleteBtn) deleteBtn.style.display = 'none';
  }

  // Control Billing Section
  if (isBillingVisible) {
    document.getElementById('billing-section').style.display = 'block';
    
    if (lifting.TransactionType === 'Import') {
      document.getElementById('container-currency-main').style.display = 'none';
      document.getElementById('container-currency').style.display = 'block';
      document.getElementById('container-datedBrent').style.display = 'block';
      document.getElementById('container-kurs').style.display = 'block';
      hideDomesticSections();
    } else {
      document.getElementById('container-currency-main').style.display = 'block';
      document.getElementById('container-currency').style.display = 'none';
      document.getElementById('container-datedBrent').style.display = 'none';
      document.getElementById('container-kurs').style.display = 'none';
      
      const skema = document.getElementById('e-skema');
      skema.addEventListener('change', updateDomesticSections);
    }

    // --- POPULATE SETTLEMENT DATA ---
    if (lifting.Settlement) {
      document.getElementById('e-kindOfTransaction').value = lifting.Settlement.KindOfTransaction || 'Provisional';
      document.getElementById('e-skema').value = lifting.Settlement.SkemaKomersialisasi || '';
      document.getElementById('e-invoiceNumber').value = lifting.Settlement.InvoiceNumber || '';
      document.getElementById('e-invoiceDate').value = lifting.Settlement.InvoiceDate || '';
      document.getElementById('e-poMySap').value = lifting.Settlement.POMySAP || '';
      document.getElementById('e-poDocument').value = lifting.Settlement.PODocument || '';
      document.getElementById('e-fakturPajak').value = lifting.Settlement.FakturPajak || '';
      document.getElementById('e-tglFakturPajak').value = lifting.Settlement.TanggalFakturPajak || '';
      
      document.getElementById('e-currency').value = lifting.Settlement.Currency || 'USD';
      document.getElementById('e-currency-import').value = lifting.Settlement.Currency || 'USD';
      setFormattedValue('e-datedBrent', lifting.Settlement.DatedBrentPrice);
      setFormattedValue('e-kurs', lifting.Settlement.Kurs);
      
      document.getElementById('e-dueDateProv').value = lifting.Settlement.DueDateProv || '';
      document.getElementById('e-dueDateFinal').value = lifting.Settlement.DueDateFinal || '';

      if (lifting.Settlement.SKKMigas) {
        setFormattedValue('e-skk-prov', lifting.Settlement.SKKMigas.Prov);
        setFormattedValue('e-skk-vol', lifting.Settlement.SKKMigas.Volume);
        setFormattedValue('e-skk-icp', lifting.Settlement.SKKMigas.ICP);
        setFormattedValue('e-skk-alpha', lifting.Settlement.SKKMigas.Alpha);
        setFormattedValue('e-skk-price', lifting.Settlement.SKKMigas.Price);
        setFormattedValue('e-skk-kurs', lifting.Settlement.SKKMigas.Kurs);
        setFormattedValue('e-skk-amount', lifting.Settlement.SKKMigas.Amount);
      }
      if (lifting.Settlement.KKKS) {
        setFormattedValue('e-kkks-prov', lifting.Settlement.KKKS.Prov);
        setFormattedValue('e-kkks-vol', lifting.Settlement.KKKS.Volume);
        setFormattedValue('e-kkks-icp', lifting.Settlement.KKKS.ICP);
        setFormattedValue('e-kkks-alpha', lifting.Settlement.KKKS.Alpha);
        setFormattedValue('e-kkks-price', lifting.Settlement.KKKS.Price);
        setFormattedValue('e-kkks-kurs', lifting.Settlement.KKKS.Kurs);
        setFormattedValue('e-kkks-amount', lifting.Settlement.KKKS.Amount);
      }

      // Populate Adjustment
      if (lifting.Settlement.Adjustment) {
        setFormattedValue('e-adj-vol', lifting.Settlement.Adjustment.Volume);
        setFormattedValue('e-adj-price', lifting.Settlement.Adjustment.Price);
        setFormattedValue('e-adj-kurs', lifting.Settlement.Adjustment.Kurs);
        setFormattedValue('e-adj-amount', lifting.Settlement.Adjustment.Amount);
      }
    }

    if (lifting.TransactionType === 'Domestik Reguler') {
       updateDomesticSections();
    }

    // --- LOGIC FOR STATUS 5 (Approved Prov) & 9 (Submitted Adj) ---
    if (isApprovedProv) {
      toggleInputs('billing-section', true); 
      document.getElementById('e-kindOfTransaction').disabled = false;
      
      const kot = document.getElementById('e-kindOfTransaction');
      kot.addEventListener('change', () => {
        updateDueDateState();
        updateAdjustmentVisibility();
      });
      
      updateDueDateState();
      updateAdjustmentVisibility();
      
      const submitBtn = document.querySelector('button[onclick="submitInvoice()"]');
      if (submitBtn) {
        submitBtn.style.display = 'block';
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Submit Final Adjustment';
      }
      const draftBillingBtn = document.querySelector('button[onclick="saveBillingDraft()"]');
      if (draftBillingBtn) draftBillingBtn.style.display = 'none';
      
    } else if (isSubmittedAdj) {
      // FOR STATUS 9: EVERYTHING READ ONLY BUT ADJUSTMENT MUST BE VISIBLE
      toggleInputs('billing-section', true);
      updateAdjustmentVisibility(); // Ensure it shows if it was Final
      
      const billingSubmitBtns = document.querySelectorAll('#billing-section button');
      billingSubmitBtns.forEach(b => b.style.display = 'none');
      
    } else {
      // Normal lock/unlock (Status 2, 8, etc)
      toggleInputs('billing-section', !isBillingEditable);
      
      const billingSubmitBtns = document.querySelectorAll('#billing-section button');
      if (!isBillingEditable) {
        billingSubmitBtns.forEach(b => b.style.display = 'none');
      } else {
        billingSubmitBtns.forEach(b => b.style.display = '');
        const kot = document.getElementById('e-kindOfTransaction');
        kot.addEventListener('change', updateDueDateState);
        updateDueDateState(); 
        updateAdjustmentVisibility();
        
        if (lifting.TransactionType === 'Import') {
           document.getElementById('e-skema').disabled = true;
        }
      }
    }
  } else {
    document.getElementById('billing-section').style.display = 'none';
  }
}

// FORMATTING HELPERS
function attachNumericFormatting() {
  const numericIds = [
    'e-volume', 'e-datedBrent', 'e-kurs',
    'e-skk-prov', 'e-skk-vol', 'e-skk-icp', 'e-skk-alpha', 'e-skk-price', 'e-skk-kurs', 'e-skk-amount',
    'e-kkks-prov', 'e-kkks-vol', 'e-kkks-icp', 'e-kkks-alpha', 'e-kkks-price', 'e-kkks-kurs', 'e-kkks-amount',
    'e-adj-vol', 'e-adj-price', 'e-adj-kurs', 'e-adj-amount'
  ];
  
  numericIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^\d.,-]/g, '');
      e.target.value = val;
    });
    
    el.addEventListener('blur', (e) => {
      const num = unformat(e.target.value);
      if (!isNaN(num)) {
        e.target.value = formatNum(num);
      }
    });
    
    el.addEventListener('focus', (e) => {
      e.target.value = e.target.value.replace(/\./g, ''); 
    });
  });
}

function formatNum(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }).format(num);
}

function unformat(val) {
  if (!val) return 0;
  return parseFloat(val.toString().replace(/\./g, '').replace(',', '.')) || 0;
}

function setFormattedValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = formatNum(val);
}

function updateDomesticSections() {
  const skema = document.getElementById('e-skema').value;
  const skkSection = document.getElementById('section-skk-entitlement');
  const kkksSection = document.getElementById('section-kkks-entitlement');
  
  if (!skkSection || !kkksSection) return;

  if (skema === 'Election In Kind (SKK Migas)') {
    skkSection.style.display = 'block';
    kkksSection.style.display = 'none';
  } else if (skema === 'Election In Kind (KKKS or SHU)') {
    skkSection.style.display = 'none';
    kkksSection.style.display = 'block';
  } else if (skema === 'Election Not to Take In Kind (SKK Migas)') {
    skkSection.style.display = 'block';
    kkksSection.style.display = 'block';
  } else {
    skkSection.style.display = 'none';
    kkksSection.style.display = 'none';
  }
}

function updateAdjustmentVisibility() {
  const kot = document.getElementById('e-kindOfTransaction').value;
  const adjSection = document.getElementById('section-adjustment');
  if (!adjSection) return;
  
  if (kot === 'Final') {
    adjSection.style.display = 'block';
    
    // Logic for locking/unlocking adjustment inputs
    const lifting = getLiftingDetail(new URLSearchParams(window.location.search).get('id'));
    const sKey = lifting ? parseInt(lifting.StatusKey) : 0;
    const isLocked = (sKey === 9 || sKey === 5); // Status 9 & 5 should not allow editing adj inputs normally unless logic says otherwise
    
    // Actually, for Status 5, they ARE editable when it switches to Final
    // For Status 9, they are LOCKED.
    
    const inputs = adjSection.querySelectorAll('input');
    inputs.forEach(i => {
       if (sKey === 9) i.disabled = true;
       else if (sKey === 5) i.disabled = false;
       else {
         // Default for other editable statuses
         i.disabled = false;
       }
    });
  } else {
    adjSection.style.display = 'none';
  }
}

function hideDomesticSections() {
  const skk = document.getElementById('section-skk-entitlement');
  const kkks = document.getElementById('section-kkks-entitlement');
  if (skk) skk.style.display = 'none';
  if (kkks) kkks.style.display = 'none';
}

// CALCULATION LOGIC
window.calcSkk = function() {
  const icp = unformat(document.getElementById('e-skk-icp').value);
  const alpha = unformat(document.getElementById('e-skk-alpha').value);
  const price = icp + alpha;
  setFormattedValue('e-skk-price', price);
  calcSkkAmount();
};

window.calcSkkAmount = function() {
  const prov = unformat(document.getElementById('e-skk-prov').value) / 100;
  const vol = unformat(document.getElementById('e-skk-vol').value);
  const price = unformat(document.getElementById('e-skk-price').value);
  const kurs = unformat(document.getElementById('e-skk-kurs').value) || 1;
  const amount = (vol * prov) * price * kurs;
  setFormattedValue('e-skk-amount', amount);
};

window.calcKkks = function() {
  const icp = unformat(document.getElementById('e-kkks-icp').value);
  const alpha = unformat(document.getElementById('e-kkks-alpha').value);
  const price = icp + alpha;
  setFormattedValue('e-kkks-price', price);
  calcKkksAmount();
};

window.calcKkksAmount = function() {
  const prov = unformat(document.getElementById('e-kkks-prov').value) / 100;
  const vol = unformat(document.getElementById('e-kkks-vol').value);
  const price = unformat(document.getElementById('e-kkks-price').value);
  const kurs = unformat(document.getElementById('e-kkks-kurs').value) || 1;
  const amount = (vol * prov) * price * kurs;
  setFormattedValue('e-kkks-amount', amount);
};

window.calcAdj = function() {
  const vol = unformat(document.getElementById('e-adj-vol').value);
  const price = unformat(document.getElementById('e-adj-price').value);
  const kurs = unformat(document.getElementById('e-adj-kurs').value);
  const amount = vol * price * kurs;
  setFormattedValue('e-adj-amount', amount);
};

function populateDropdowns() {
  const db = window.FAST_DATA;
  if (!db || !db.Dim_Partner) return; 

  const sellerSelect = document.getElementById('e-seller');
  if (sellerSelect) {
    sellerSelect.innerHTML = '<option value="">-- Pilih Seller --</option>' + 
      db.Dim_Partner.map(p => `<option value="${p.PartnerKey}">${p.PartnerName}</option>`).join('');
  }
  const cargoSelect = document.getElementById('e-cargo');
  if (cargoSelect) {
    cargoSelect.innerHTML = '<option value="">-- Pilih Cargo --</option>' + 
      db.Dim_Crude.map(c => `<option value="${c.CrudeKey}">${c.CrudeName}</option>`).join('');
  }
  const loadPortSelect = document.getElementById('e-loadPort');
  if (loadPortSelect) {
    loadPortSelect.innerHTML = '<option value="">-- Pilih Load Port --</option>' + 
      db.Dim_Port.filter(p => p.PortType === 'Loading').map(p => `<option value="${p.PortKey}">${p.PortName}</option>`).join('');
  }
  const dischargePortSelect = document.getElementById('e-dischargePort');
  if (dischargePortSelect) {
    dischargePortSelect.innerHTML = '<option value="">-- Pilih Discharge Port --</option>' + 
      db.Dim_Port.filter(p => p.PortType === 'Discharge').map(p => `<option value="${p.PortKey}">${p.PortName}</option>`).join('');
  }
}

function updateStatusBadge(st) {
  const badge = document.getElementById('status-badge');
  if (!badge) return;
  const colors = {
    'draft': { bg: '#f1f5f9', color: '#64748b' },
    'revisi': { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    'lifting_locked': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
    'draft_penagihan': { bg: '#e2e8f0', color: '#64748b' },
    'submitted': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    'approved_provisional': { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
    'approved_final': { bg: 'rgba(34,197,94,0.2)', color: '#16a34a' },
    'submitted_adjustment': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  };
  const c = colors[st.StatusCode] || { bg: '#f1f5f9', color: '#64748b' };
  badge.style.background = c.bg;
  badge.style.color = c.color;
  badge.style.border = `1px solid ${c.color}`;
  badge.textContent = st.StatusLabel || 'Unknown';
}

function updateDueDateState() {
  const kot = document.getElementById('e-kindOfTransaction').value;
  const provInput = document.getElementById('e-dueDateProv');
  const finalInput = document.getElementById('e-dueDateFinal');
  if (kot === 'Provisional') {
    if (provInput) provInput.disabled = false;
    if (finalInput) {
      finalInput.disabled = true;
      finalInput.value = "";
    }
  } else {
    if (provInput) provInput.disabled = true;
    if (finalInput) finalInput.disabled = false;
  }
}

function toggleInputs(sectionId, disabled) {
  let container;
  if (sectionId === 'lifting-details-container') {
    container = document.querySelector('.col-lg-5');
  } else {
    container = document.getElementById('billing-section');
  }
  if (!container) return;
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.disabled = disabled;
  });
}

async function saveDraft() {
  const id = new URLSearchParams(window.location.search).get('id');
  const data = gatherLiftingData();
  const updated = await updateLifting(id, data);
  if (updated) showToast('Draft Lifting berhasil diperbarui');
}

async function lockLifting() {
  const id = new URLSearchParams(window.location.search).get('id');
  const data = gatherLiftingData();
  data.StatusKey = 2; 
  const updated = await updateLifting(id, data);
  if (updated) {
    showToast('Data Lifting berhasil dikunci.');
    loadLiftingData();
  }
}

async function saveBillingDraft() {
  const id = new URLSearchParams(window.location.search).get('id');
  const settlementData = gatherSettlementData();
  console.log("Saving Billing Draft Payload:", settlementData);
  
  const updated = await updateLifting(id, { 
    StatusKey: 8, 
    Settlement: settlementData 
  });
  if (updated) {
    showToast('Draft Penagihan berhasil disimpan');
    setTimeout(() => location.reload(), 800);
  }
}

async function submitInvoice() {
  const id = new URLSearchParams(window.location.search).get('id');
  const lifting = getLiftingDetail(id);
  const sKey = parseInt(lifting.StatusKey);
  const settlementData = gatherSettlementData();

  let targetStatus = 3; // Submitted
  
  // Logic Status 5 -> 9 (Adjustment)
  if (sKey === 5 && settlementData.KindOfTransaction === 'Final') {
    targetStatus = 9; // Submitted Adjustment
  }

  const updated = await updateLifting(id, { 
    StatusKey: targetStatus, 
    Settlement: settlementData 
  });
  
  if (updated) {
    showToast(targetStatus === 9 ? 'Penyesuaian Final berhasil disubmit' : 'Data berhasil disubmit ke verifikasi');
    setTimeout(() => window.location.href = 'submission.html', 1200);
  }
}

function gatherLiftingData() {
  return {
    TransactionType: document.getElementById('e-pembelian').value,
    CommodityType: document.getElementById('e-commodity').value,
    PartnerKey: parseInt(document.getElementById('e-seller').value) || null,
    CrudeKey: parseInt(document.getElementById('e-cargo').value) || null,
    LiftingType: document.getElementById('e-tipeLifting').value,
    VesselName: document.getElementById('e-vessel').value,
    LoadPortKey: parseInt(document.getElementById('e-loadPort').value) || null,
    DischargePortKey: parseInt(document.getElementById('e-dischargePort').value) || null,
    BLDate: document.getElementById('e-blDate').value,
    BLNumber: document.getElementById('e-blNumber').value,
    VolumeBbls: unformat(document.getElementById('e-volume').value),
    Remarks: document.getElementById('e-remarks').value
  };
}

function gatherSettlementData() {
  const type = document.getElementById('e-pembelian').value;
  const isImport = type === 'Import';
  const isDomestic = type === 'Domestik Reguler';
  
  const data = {
    KindOfTransaction: document.getElementById('e-kindOfTransaction').value,
    SkemaKomersialisasi: document.getElementById('e-skema').value,
    InvoiceNumber: document.getElementById('e-invoiceNumber').value,
    InvoiceDate: document.getElementById('e-invoiceDate').value,
    POMySAP: document.getElementById('e-poMySap').value,
    PODocument: document.getElementById('e-poDocument').value,
    FakturPajak: document.getElementById('e-fakturPajak').value,
    TanggalFakturPajak: document.getElementById('e-tglFakturPajak').value,
    DueDateProv: document.getElementById('e-dueDateProv').value,
    DueDateFinal: document.getElementById('e-dueDateFinal').value,
    Currency: isImport ? document.getElementById('e-currency-import').value : document.getElementById('e-currency').value
  };

  if (isImport) {
    data.DatedBrentPrice = unformat(document.getElementById('e-datedBrent').value);
    data.Kurs = unformat(document.getElementById('e-kurs').value);
  } else if (isDomestic) {
    data.SKKMigas = {
      Prov: unformat(document.getElementById('e-skk-prov').value),
      Volume: unformat(document.getElementById('e-skk-vol').value),
      ICP: unformat(document.getElementById('e-skk-icp').value),
      Alpha: unformat(document.getElementById('e-skk-alpha').value),
      Price: unformat(document.getElementById('e-skk-price').value),
      Kurs: unformat(document.getElementById('e-skk-kurs').value),
      Amount: unformat(document.getElementById('e-skk-amount').value)
    };
    data.KKKS = {
      Prov: unformat(document.getElementById('e-kkks-prov').value),
      Volume: unformat(document.getElementById('e-kkks-vol').value),
      ICP: unformat(document.getElementById('e-kkks-icp').value),
      Alpha: unformat(document.getElementById('e-kkks-alpha').value),
      Price: unformat(document.getElementById('e-kkks-price').value),
      Kurs: unformat(document.getElementById('e-kkks-kurs').value),
      Amount: unformat(document.getElementById('e-kkks-amount').value)
    };
  }

  data.Adjustment = {
    Volume: unformat(document.getElementById('e-adj-vol').value),
    Price: unformat(document.getElementById('e-adj-price').value),
    Kurs: unformat(document.getElementById('e-adj-kurs').value),
    Amount: unformat(document.getElementById('e-adj-amount').value)
  };

  return data;
}
