import express from 'express';
import {
  CreateCustomerAdmin,
  DeleteCustomer,
  UpdateCustomer,
  ViewCustomer,
  ViewCustomerById,
  updateCustomerBalanceByAdmin,
  searchCustomer,
  AddToCustomerWhitelist,
  GetAccountManagersByRole,
  getCustomerTransactionHistoryByAdmin
} from '../../../controllers/ADMIN/manageCustomer/managecustomer.js';
import { authenticate } from '../../../middleware/ADMIN/authenticateRoute.js';
import { upload } from '../../../middleware/ADMIN/multer.js';

const customerrouter = express.Router();

// customerRoutes.js
customerrouter.route('/create-customer').post(authenticate, CreateCustomerAdmin);
customerrouter.route('/get-account-managers').get(authenticate, GetAccountManagersByRole);
customerrouter.route('/update-customer/:id').patch(authenticate, UpdateCustomer);
customerrouter.route('/viewall-customer').get(authenticate, ViewCustomer);
customerrouter.route('/viewByID-customer/:customer_id').get(authenticate, ViewCustomerById);
customerrouter.route('/delete-customer').delete(authenticate, DeleteCustomer);
customerrouter.route('/update-customer-balance-admin').put(authenticate, updateCustomerBalanceByAdmin);
customerrouter.route('/search-customer').get(authenticate, searchCustomer);
customerrouter
  .route('/add-customer-whitelist')
  .post(authenticate, upload.single('whitelistFile'), AddToCustomerWhitelist)
customerrouter.get('/get-customer-transaction-history/:customer_id', authenticate, getCustomerTransactionHistoryByAdmin);


export default customerrouter;
