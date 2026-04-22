const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 3002;
const DATA     = path.join(__dirname, 'ejf-data.json');

app.use(express.json({ limit: '20mb' }));

function read() {
  if (!fs.existsSync(DATA)) return { products: [], shop: { name: 'The Vapor Place', address: '', phone: '' }, password: 'vape123' };
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch { return { products: [], shop: {}, password: 'vape123' }; }
}
function write(data) { fs.writeFileSync(DATA, JSON.stringify(data), 'utf8'); }

app.get ('/api/ejf/products',  (req, res) => res.json(read().products));
app.put ('/api/ejf/products',  (req, res) => { const d = read(); d.products = req.body; write(d); res.json({ ok: true }); });

app.get ('/api/ejf/shop',      (req, res) => res.json(read().shop));
app.put ('/api/ejf/shop',      (req, res) => { const d = read(); d.shop = req.body; write(d); res.json({ ok: true }); });

app.post('/api/ejf/auth',      (req, res) => res.json({ ok: req.body.password === read().password }));
app.put ('/api/ejf/password',  (req, res) => { const d = read(); d.password = req.body.password; write(d); res.json({ ok: true }); });

app.listen(PORT, () => console.log(`EJF API on :${PORT}`));
