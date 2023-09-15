const crypto = require('crypto');

export default function hashText(text) {
  const hash = crypto.createHash('sha512');
  hash.update(text);
  return hash.digest('hex');
}