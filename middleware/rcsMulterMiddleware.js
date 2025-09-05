import multer from 'multer';
import path from 'path';
import fs from "fs";

// Storage configuration
const storage = multer.diskStorage({
destination: function (req, file, cb) {
  const customerId = req.body.customer_id || "defaultCustomer";
  let dir;

  if (req.body.rcs_template_category_id) {
    // template case
    dir = path.join("rcsImages", customerId.toString(), req.body.rcs_template_category_id.toString());
  } else {
    // campaign case
    dir = path.join("rcsImages", customerId.toString(), "campaigns");
  }

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