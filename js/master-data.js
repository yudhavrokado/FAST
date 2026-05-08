document.addEventListener('DOMContentLoaded', async () => {
  initLayout('master-data');
  await initFASTData();
  renderMasterData();
});

function switchMdTab(tabId, btn) {
  document.querySelectorAll('.md-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('[id^="md-tab-"]').forEach(el => el.style.display = 'none');
  document.getElementById('md-tab-' + tabId).style.display = 'block';
}

function renderMasterData() {
  // 1. ICP History (Dummy)
  const icpTbody = document.getElementById('tbl-icp-history');
  let icpHtml = `
    <tr><td>Mei 2026</td><td class="fw-bold text-primary">$82.45</td><td class="fw-bold text-warning">$74.85</td><td><span class="badge bg-success-subtle text-success">Aktif</span></td></tr>
    <tr><td>April 2026</td><td class="fw-bold text-primary">$83.10</td><td class="fw-bold text-warning">$75.20</td><td><span class="badge bg-secondary-subtle text-secondary">Selesai</span></td></tr>
  `;
  icpTbody.innerHTML = icpHtml;

  // 2. Crude
  const crudeTbody = document.getElementById('tbl-crude');
  crudeTbody.innerHTML = FAST_DATA.Dim_Crude.map((c, i) => `
    <tr>
      <td><span class="badge bg-primary-subtle text-primary">${c.CrudeCode}</span></td>
      <td class="fw-semibold">${c.CrudeName}</td>
      <td>${c.RefType}</td>
      <td class="fw-bold ${c.Alpha >= 0 ? 'text-success' : 'text-danger'}">${c.Alpha >= 0 ? '+' : ''}${c.Alpha.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_Crude', ${i})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // 3. Non Crude
  const nonCrudeTbody = document.getElementById('tbl-noncrude');
  nonCrudeTbody.innerHTML = FAST_DATA.Dim_NonCrude.map((c, i) => `
    <tr>
      <td class="fw-semibold">${c.Name}</td>
      <td><span class="badge bg-secondary-subtle text-secondary">${c.Formula}</span></td>
      <td class="fw-bold">${c.Type === 'fixed' ? 'Fixed' : (c.Alpha >= 0 ? '+' : '') + c.Alpha.toFixed(2)}</td>
      <td class="fw-bold text-primary">$${c.Price.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_NonCrude', ${i})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // 4. Partner
  const partnerTbody = document.getElementById('tbl-partner');
  partnerTbody.innerHTML = FAST_DATA.Dim_Partner.map((p, i) => `
    <tr>
      <td><span class="badge bg-light text-dark border">${p.PartnerID}</span></td>
      <td class="fw-semibold">${p.PartnerName}</td>
      <td>${p.PartnerType === 'KKKS' ? '<span class="badge bg-primary-subtle text-primary">KKKS</span>' : '<span class="badge bg-info-subtle text-info">Supplier</span>'}</td>
      <td>${p.Country}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_Partner', ${i})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // 5. Port
  const portTbody = document.getElementById('tbl-port');
  portTbody.innerHTML = FAST_DATA.Dim_Port.map((p, i) => `
    <tr>
      <td>PT-${String(p.PortKey).padStart(3,'0')}</td>
      <td class="fw-semibold">${p.PortName}</td>
      <td>${p.PortType === 'Loading' ? '<span class="badge bg-warning-subtle text-warning"><i class="bi bi-box-arrow-up me-1"></i>Loading</span>' : '<span class="badge bg-success-subtle text-success"><i class="bi bi-box-arrow-in-down me-1"></i>Discharge</span>'}</td>
      <td>${p.Country}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_Port', ${i})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // 6. Kurs
  const kursTbody = document.getElementById('tbl-kurs');
  kursTbody.innerHTML = FAST_DATA.Dim_KursBI.map((k, i) => `
    <tr>
      <td>${k.Tanggal}</td>
      <td class="fw-bold text-primary">Rp ${k.Harga.toLocaleString('id-ID')}</td>
      <td><button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_KursBI', ${i})"><i class="bi bi-trash"></i></button></td>
    </tr>
  `).join('');

  // 7. VAT
  const vatTbody = document.getElementById('tbl-vat');
  vatTbody.innerHTML = FAST_DATA.Dim_Vat.map((v, i) => `
    <tr>
      <td>${v.Bulan} ${v.Tahun}</td>
      <td class="fw-bold text-primary">${v.Rate}%</td>
      <td><button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="deleteEntity('Dim_Vat', ${i})"><i class="bi bi-trash"></i></button></td>
    </tr>
  `).join('');
}

// Interactive Functions
function syncAndRender() {
  // Simulasi sinkronisasi ke server (TODO: ganti dengan fetch POST ke backend)
  renderMasterData();
}

function deleteEntity(table, index) {
  if(confirm('Hapus data ini?')) {
    FAST_DATA[table].splice(index, 1);
    syncAndRender();
    showToast('Data berhasil dihapus');
  }
}

function addCrude() {
  const name = prompt("Nama Crude Baru:");
  if(name) {
    FAST_DATA.Dim_Crude.push({ CrudeKey: Date.now(), CrudeName: name, CrudeCode: name.substring(0,3).toUpperCase(), RefType: 'Brent', Alpha: 0 });
    syncAndRender();
    showToast('Crude ditambahkan');
  }
}

function addPartner() {
  const name = prompt("Nama Mitra Baru:");
  if(name) {
    FAST_DATA.Dim_Partner.push({ PartnerKey: Date.now(), PartnerID: 'K3S-NEW', PartnerName: name, PartnerType: 'KKKS', Country: 'Indonesia' });
    syncAndRender();
    showToast('Mitra ditambahkan');
  }
}

function addPort() {
  const name = prompt("Nama Pelabuhan Baru:");
  if(name) {
    FAST_DATA.Dim_Port.push({ PortKey: Date.now(), PortName: name, PortType: 'Loading', Country: 'Indonesia' });
    syncAndRender();
    showToast('Pelabuhan ditambahkan');
  }
}
