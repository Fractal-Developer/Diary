const crypto = require('crypto');
export default function encrypt(text, password, iv = Buffer.alloc(16, 0), algorithm = 'aes-256-cbc') {
    if (!password) return text;
    const key = crypto.createHash('sha256').update(password).digest();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }