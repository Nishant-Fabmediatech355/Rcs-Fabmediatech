import express from "express";
// import { authenticate } from "../../../middleware/authMiddleware.js";
import  {authenticate } from "../../../middleware/ADMIN/authenticateRoute.js";
import {
  createCustomerBot,
  getCustomerBots,
  updateCustomerBot,
  deleteCustomerBot,
  getAllBotTypes,
  getOperatorNames,
} from "../../../controllers/ADMIN/rcsBotMaster/rcsBotController.js";


const RcsBotRoutes = express.Router();

// bot type for admin only start
RcsBotRoutes.post("/create", authenticate, createCustomerBot);
RcsBotRoutes.get("/getbot-details/:customer_id", authenticate, getCustomerBots);
RcsBotRoutes.put("/update-details", authenticate, updateCustomerBot);
RcsBotRoutes.get("/delete/:id", authenticate, deleteCustomerBot);
RcsBotRoutes.get("/all-category-type", authenticate, getAllBotTypes);
RcsBotRoutes.get("/getOperatorName", authenticate, getOperatorNames);



export default RcsBotRoutes;