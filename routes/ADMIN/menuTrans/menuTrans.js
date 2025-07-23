import express from 'express';
import { CreateTrans, DeleteTrans, GetAllTrans, getMenuTransByAdminId, GetOneTrans, GetTransByAdmin } from '../../../controllers/ADMIN/menuTrans/menutrans.js';
import { authenticate } from '../../../middleware/ADMIN/authenticateRoute.js';

const menutransRouter = express.Router();

// Manage MenuTrans
menutransRouter.route('/create-trans').post(authenticate,CreateTrans);
menutransRouter.route('/get-trans-byadmin').get(authenticate,GetTransByAdmin);
menutransRouter.route('/getall-trans').get(authenticate,GetAllTrans);
menutransRouter.route('/getone-trans').get(authenticate,GetOneTrans);
menutransRouter.route('/delete-trans').delete(authenticate,DeleteTrans);
menutransRouter.route('/get-menu-trans-by-menu').get(authenticate,getMenuTransByAdminId);

export default menutransRouter;