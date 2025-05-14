require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let deposits = [];
let adminSession = false;

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    adminSession = true;
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/deposits', (req, res) => {
  if (!adminSession) return res.status(403).json({ error: 'Unauthorized' });
  res.json(deposits);
});

app.post('/api/transfer', (req, res) => {
  const { fromAddress, asset } = req.body;
  if (!fromAddress || !asset) return res.status(400).json({ error: 'Missing fields' });
  deposits.push({ from: fromAddress, asset, time: new Date().toISOString() });
  res.json({ success: true, message: `Simulated ${asset} transfer to admin wallet.` });
});

app.listen(PORT, () => console.log(`Demo admin backend on http://localhost:${PORT}`));
