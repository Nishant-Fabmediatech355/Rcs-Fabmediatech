import express from 'express';
import {  CreateMenu,  DeleteMenu,   GetAllMenu, GetOneMenu,  UpdateMenu } from '../../../controllers/ADMIN/manageMenu/managemenu.js';
const menuRouter = express.Router();



// Manage Menus
menuRouter.route('/create-menu').post(CreateMenu);
menuRouter.route('/getall-menu').get(GetAllMenu);
menuRouter.route('/getone-menu').get(GetOneMenu);
menuRouter.route('/update-menu').patch(UpdateMenu);
menuRouter.route('/delete-menu').delete(DeleteMenu);


export default menuRouter;