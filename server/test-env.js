const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
console.log('Resolved path:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('Content starts with:', content.substring(0, 20));
  const result = dotenv.config({ path: envPath });
  console.log('Dotenv result:', result.error ? 'Error' : 'Success');
  console.log('SMTP_USER:', process.env.SMTP_USER);
}
