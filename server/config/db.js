const fs = require('fs');
const mysql = require('mysql2');

const SECRET_PATH = '/mnt/secrets';

function readSecret(name, fallback) {
  const filePath = `${SECRET_PATH}/${name}`;

  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch (error) {
    // Keep local Docker Compose development working
    return process.env[name] || fallback;
  }
}

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: readSecret('MYSQL_USER', 'appuser'),
  password: readSecret('MYSQL_PASSWORD', 'apppassword'),
  database: readSecret('MYSQL_DATABASE', 'userdb'),
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }

  console.log('Database connected.');

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      role ENUM('Admin', 'User') NOT NULL
    )
  `;

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error('Failed to create users table:', err.stack);
      process.exit(1);
    }

    console.log('Users table initialized or already exists.');
  });
});

module.exports = db;