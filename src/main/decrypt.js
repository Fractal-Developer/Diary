const crypto = require('crypto');
export default function decrypt(text, password, iv = Buffer.alloc(16, 0), algorithm = 'aes-256-cbc') {
    if (!password) return text;
    const key = crypto.createHash('sha256').update(password).digest();
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }