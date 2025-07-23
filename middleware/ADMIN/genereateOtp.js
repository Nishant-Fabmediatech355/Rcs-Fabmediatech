import crypto from 'crypto';

function generateOtp(length = 6) {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(crypto.randomInt(0, chars.length))];
  }
  return otp;
}

export default generateOtp;
