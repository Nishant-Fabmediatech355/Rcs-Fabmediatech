import express from 'express';
import { CreateSMSCRoutes, DeleteSMSCRoutes, GetAllSMSCRoutes, GetOneSMSCRoutes, UpdateSMSCRoutes } from '../../../controllers/ADMIN/manageroutes/manageroutes.js';
const RoutRouter = express.Router();

// SMSCRoutes for Country
RoutRouter.post('/create-smscroutes',CreateSMSCRoutes);
RoutRouter.get('/getall-smscroutes',GetAllSMSCRoutes);
RoutRouter.get('/getone-smscroutes',GetOneSMSCRoutes);
RoutRouter.patch('/update-smscroutes',UpdateSMSCRoutes);
RoutRouter.delete('/delete-smscroutes',DeleteSMSCRoutes);

export default RoutRouter;