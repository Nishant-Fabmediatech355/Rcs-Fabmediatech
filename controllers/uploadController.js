import ExcelJS from 'exceljs';
import { filterDuplicates } from '../utils/filterDuplicates.js';
import { chunkInsert } from '../utils/chunkInsert.js';

export const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'File required' });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file.path);
  const worksheet = workbook.getWorksheet(1);

  const batch = [];
  worksheet.eachRow(async (row, rowNumber) => {
    const [phone, message] = row.values.slice(1);
    if (await filterDuplicates(phone)) return;

    batch.push({ phone, message });

    if (batch.length >= 1000) {
      await chunkInsert(batch);
      batch.length = 0;
    }
  });

  if (batch.length > 0) await chunkInsert(batch);

  res.json({ success: true, message: 'Data processed' });
};
