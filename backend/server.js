const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = 3001; // CHANGED TO 3001 TO AVOID GHOST SERVERS
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function loadDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[FAST Backend] Gagal membaca db.json');
    return { Fact_Lifting: [], Dim_Partner: [], Dim_Crude: [], Dim_Status: [], Dim_Port: [] };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('[FAST Backend] Data berhasil disimpan ke db.json');
  } catch (err) {
    console.error('[FAST Backend] Gagal menyimpan ke db.json:', err);
  }
}

app.get('/api/sync', (req, res) => {
  const currentDB = loadDB();
  const targetId = 'LFT-20260509-F85T';
  const target = currentDB.Fact_Lifting.find(l => l.LiftingID === targetId);
  console.log(`[DEBUG SYNC] Reading file from: ${DB_PATH}`);
  console.log(`[DEBUG SYNC] ID ${targetId} StatusKey: ${target ? target.StatusKey : 'NOT FOUND'}`);
  res.json({ success: true, data: currentDB });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FAST System Backend running on PORT 3001.' });
});

app.get('/api/dim/status', (req, res) => res.json({ success: true, data: loadDB().Dim_Status }));
app.get('/api/fact/lifting', (req, res) => res.json({ success: true, data: loadDB().Fact_Lifting }));

app.post('/api/fact/lifting', (req, res) => {
  const DATABASE = loadDB();
  const payload = req.body;
  const newLifting = {
    LiftingKey: DATABASE.Fact_Lifting.length + 1,
    LiftingID: `LFT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    StatusKey: 1,
    ...payload,
    CreatedAt: new Date().toISOString()
  };
  DATABASE.Fact_Lifting.unshift(newLifting);
  saveDB(DATABASE); 
  res.status(201).json({ success: true, data: newLifting });
});

app.put('/api/fact/lifting/:id', (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const DATABASE = loadDB();
  const idx = DATABASE.Fact_Lifting.findIndex(l => l.LiftingID === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  
  DATABASE.Fact_Lifting[idx] = {
    ...DATABASE.Fact_Lifting[idx],
    ...payload,
    UpdatedAt: new Date().toISOString()
  };
  saveDB(DATABASE);
  res.json({ success: true, data: DATABASE.Fact_Lifting[idx] });
});

app.listen(PORT, () => {
  console.log(`[FAST Backend] Server berjalan di http://localhost:${PORT}`);
});
