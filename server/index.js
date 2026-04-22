const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { sendOTPToEmail, sendEnrollmentToAdmin } = require('./mailer');
const { makeWelcomeCall } = require('./twilio');

console.log('--- SERVER STARTUP ---');
console.log('SMTP_USER loaded:', process.env.SMTP_USER ? 'YES' : 'NO');
console.log('-----------------------');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory OTP store wrapper
const otps = {};

const generateOTP = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = { code, expires: Date.now() + 5 * 60 * 1000 };
  await sendOTPToEmail(email, code);
  return code;
};

// API ROUTES

app.get('/api/users', (req, res) => {
  // Returns all users except password
  db.all('SELECT id, name, email, role, phone, department, joiningDate, salary, package, avatar, experience, quit_reason, expertise, status FROM users', [], (err, userRows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM penalties', [], (err, penaltyRows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const users = userRows.map(u => ({
        ...u,
        workingHours: [], // Still mocking these for now
        leaves: [],
        penalties: penaltyRows.filter(p => p.user_id === u.id),
        bonus: 0
      }));
      res.json(users);
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid email or password' });
    
    // Generate OTP
    await generateOTP(email);
    res.json({ message: 'OTP sent', user: row });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, department, experience, quit_reason, expertise, lang } = req.body;
  
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
    if (row) return res.status(400).json({ error: 'Email already registered' });
    
    const id = "w-" + Date.now();
    const role = 'worker';
    const joiningDate = new Date().toISOString().split("T")[0];
    const salary = 0; // Set to 0, admin will set it later
    const pkg = "Pending";
    const status = 'PENDING';
    const avatar = name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();

    const insert = db.prepare(`INSERT INTO users (id, name, email, password, role, phone, department, joiningDate, salary, package, avatar, experience, quit_reason, expertise, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    insert.run(id, name, email, password, role, phone, department, joiningDate, salary, pkg, avatar, experience, quit_reason, expertise, status, async function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Log creation
      db.run('INSERT INTO access_logs (user_email, action) VALUES (?, ?)', [email, 'CREATED_ACCOUNT']);
      
      // Trigger automated call with selected language
      makeWelcomeCall(phone, lang);

      // Notify admin
      sendEnrollmentToAdmin({ name, email, phone, experience, expertise, quit_reason });

      // Generate OTP implicitly logs them in
      await generateOTP(email);
      res.json({
         message: 'Account created and OTP sent',
         user: { id, name, email, role, phone, department, joiningDate, salary, package: pkg, avatar, status }
      });
    });
  });
});

app.post('/api/admin/approve-user', (req, res) => {
  const { userId, salary, package: jobTitle } = req.body;
  
  db.run(`UPDATE users SET status = 'APPROVED', salary = ?, package = ? WHERE id = ?`, [salary, jobTitle, userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User approved successfully' });
  });
});

app.post('/api/auth/verify', (req, res) => {
  const { email, code } = req.body;
  const entry = otps[email];
  
  if (!entry) return res.status(400).json({ error: 'No OTP generated for this email' });
  if (Date.now() > entry.expires) return res.status(400).json({ error: 'OTP has expired' });
  if (entry.code !== code) return res.status(400).json({ error: 'Invalid OTP' });
  
  // Valid OTP
  delete otps[email]; // clear used OTP
  
  // Log the login to access_logs database
  db.run('INSERT INTO access_logs (user_email, action) VALUES (?, ?)', [email, 'LOGGED_IN']);
  
  res.json({ message: 'Verified successfully' });
});

app.post('/api/auth/resend', async (req, res) => {
  const { email } = req.body;
  try {
    await generateOTP(email);
    res.json({ message: 'OTP Resent' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

app.post('/api/penalties', (req, res) => {
  const { workerId, reason, amount, date } = req.body;
  const id = "pen-" + Date.now();
  
  db.run('INSERT INTO penalties (id, user_id, reason, amount, date) VALUES (?, ?, ?, ?, ?)', 
    [id, workerId, reason, amount, date], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Penalty added successfully', id });
    }
  );
});

app.delete('/api/penalties/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM penalties WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Penalty removed successfully' });
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('(.*)', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`OM Server running on port ${PORT}`);
});
