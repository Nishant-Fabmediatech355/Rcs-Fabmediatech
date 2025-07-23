  import multer from 'multer';
  import path from 'path';
  import fs from 'fs';
  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const customerId = req.userId ? String(req.userId) : 'default'; 
      const customerUploadDir = path.join(uploadDir, customerId);
      if (!fs.existsSync(customerUploadDir)) {
        fs.mkdirSync(customerUploadDir, { recursive: true });
      }
      cb(null, customerUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, uniqueSuffix)
    },
  }); 

  const upload = multer({ storage });

  export { upload, uploadDir };
