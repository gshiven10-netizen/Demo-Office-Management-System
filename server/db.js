const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'oms.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        phone TEXT,
        department TEXT,
        joiningDate TEXT,
        salary INTEGER,
        package TEXT,
        avatar TEXT,
        experience TEXT,
        quit_reason TEXT,
        expertise TEXT,
        status TEXT DEFAULT 'APPROVED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure columns exist for existing databases
    const columns = ['experience', 'quit_reason', 'expertise', 'status'];
    columns.forEach(col => {
      db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, (err) => {
        // Ignore error if column already exists
      });
    });

    // Set default status for existing users to APPROVED
    db.run(`UPDATE users SET status = 'APPROVED' WHERE status IS NULL`);

    db.run(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        action TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS penalties (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        reason TEXT,
        amount INTEGER,
        date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert demo users if not exists
    db.get('SELECT count(*) as count FROM users', (err, row) => {
      if (row && row.count === 0) {
        const insert = db.prepare(`INSERT INTO users (id, name, email, password, role, phone, department, joiningDate, salary, package, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
        insert.run('admin-001', 'Super Admin', 'gshiven10@gmail.com', 'Shiven@7000', 'admin', '+91-9999999999', 'Management', '2020-01-01', 150000, 'Executive', 'SA');
        insert.run('w-001', 'Rahul Sharma', 'rahul@company.com', 'Rahul@123', 'worker', '+91-9876543210', 'Engineering', '2022-03-15', 55000, 'Senior', 'RS');
        insert.run('w-002', 'Priya Mehta', 'priya@company.com', 'Priya@123', 'worker', '+91-9765432109', 'Design', '2023-06-01', 48000, 'Junior', 'PM');
        
        insert.finalize();
      }
    });

  });
};

initDb();

module.exports = db;
