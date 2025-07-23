import express from 'express';

import { getSmsUploadIdsByCustomerId, searchCustomerSMSUploads,searchNumbersByCustomer } from '../../../controllers/ADMIN/report/reportController.js';
import { authenticate } from '../../../middleware/ADMIN/authenticateRoute.js';
const reportRoute = express.Router();
reportRoute.get("", authenticate, getSmsUploadIdsByCustomerId);
reportRoute.get("/search/smsupload", authenticate, searchCustomerSMSUploads);
reportRoute.get("/search/numbers", authenticate, searchNumbersByCustomer);

export default reportRoute;