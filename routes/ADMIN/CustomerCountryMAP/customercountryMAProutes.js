import express from "express";
import { CreateCustomerCountryMap, DeleteCustomerCountryMap, GetAllCustomerCountryMap, GetOneCustomerCountryMap, UpdateCustomerCountryMap } from "../../../controllers/ADMIN/CustomerCountryMap/customercountryMAP.js";
const CustomerCountryMapRouter = express.Router();

// Routes for CustomerCountryMap
CustomerCountryMapRouter.post('/create-customercountrymap',CreateCustomerCountryMap);
CustomerCountryMapRouter.get('/getall-customercountrymap',GetAllCustomerCountryMap);
CustomerCountryMapRouter.get('/getone-customercountrymap',GetOneCustomerCountryMap);
CustomerCountryMapRouter.patch('/update-customercountrymap',UpdateCustomerCountryMap);
CustomerCountryMapRouter.delete('/delete-customercountrymap',DeleteCustomerCountryMap);

export default CustomerCountryMapRouter;