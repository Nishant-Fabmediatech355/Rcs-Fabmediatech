import multer from 'multer';
import path from 'path';
import fs from "fs";

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const customerId = req.body.customer_id;
    const templateId = req.body.rcs_template_category_id;

    const dir = path.join('rcsImages', customerId, templateId);

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

export default upload;