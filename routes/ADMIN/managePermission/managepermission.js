import express from 'express';
import { createPermission, deletePermission, getAllPermission, getPermission, updatePermission } from '../../../controllers/ADMIN/managePermission/managePermission.js';
const permissionRouter = express.Router();

permissionRouter.post('/create-permission',createPermission);
permissionRouter.patch('/update-permission',updatePermission);
permissionRouter.get('/get-permission',getPermission);
permissionRouter.get('/get-all-permission',getAllPermission);
permissionRouter.delete('/delete-permission',deletePermission);


export default permissionRouter