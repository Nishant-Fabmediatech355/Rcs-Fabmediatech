//import authRoutes from './routes/ADMIN/adminUsers/adminUsers.js';
import authRoutes from './routes/auth/authRoutes.js';
import commonRoute from './routes/common/commonRoute.js'
import RcsBotTypeRoutes from './routes/rcs/RcsBotTypeRoutes.js';
import RcsBotRoutes from './routes/ADMIN/rcsBotMaster/rcsBotRoutes.js';

import express from 'express';


const mainRouter = express();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/common", commonRoute);
mainRouter.use("/rcs", RcsBotTypeRoutes);

// Admin Routes(For the access of this API we have to use Admin panel token)
mainRouter.use("/rcsBot", RcsBotRoutes);





export default mainRouter;

