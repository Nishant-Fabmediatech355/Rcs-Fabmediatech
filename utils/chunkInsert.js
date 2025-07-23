import { SmsModel } from '../models/db1/SmsModel.js'; // Adjust based on your file
export const chunkInsert = async (batch) => {
  try {
    await SmsModel.bulkCreate(batch);
  } catch (err) {
    console.error('Insert failed:', err);
  }
};
