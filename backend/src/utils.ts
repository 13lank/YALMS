const crypto = require('crypto')

export function sha512(password: string, salt: string): string {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return value;
}
export function genSalt(): string {
  return crypto.randomBytes(8).toString().slice(0, 16);
}