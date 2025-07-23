import express from 'express';
import { createRole, deleteRole, getAllRole, getRole, updateRole } from '../../../controllers/ADMIN/manageRole/manageRole.js';
const roleRouter = express.Router();

roleRouter.post('/create-role',createRole)
roleRouter.get('/get-all-roles',getAllRole);
roleRouter.get('/get-role',getRole)
roleRouter.patch('/update-role',updateRole)
roleRouter.delete('/delete-role',deleteRole)

export default roleRouter