import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // console.log({name:file.originalname});
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log({fileName:(uniqueSuffix + '-' + file.originalname)});
    
    cb(null, (uniqueSuffix + '-' + file.originalname));
  }
});

const upload = multer({ storage });

export { upload };
