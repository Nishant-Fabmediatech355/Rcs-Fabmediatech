const redis = require('../config/redis.js');

module.exports = async function filterDuplicates(phone) {
  const exists = await redis.get(phone);
  if (exists) return true;

  await redis.set(phone, '1', 'EX', 60 * 60 * 24); // 24hr expiry
  return false;
};
