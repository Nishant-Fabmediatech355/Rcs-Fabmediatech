import express from 'express'
import {
 // dlrResponse,
 // dlrResponseforApi,
  getDomainDetails,
 // updateSMSRoute,
} from "../../controllers/common/commonController.js";

const commonRoute = express.Router();

commonRoute.get("/get-doamain-details", getDomainDetails);
// commonRoute.get("/get-dlr-report", dlrResponse);
// commonRoute.get("/get-dlr-api-report", dlrResponseforApi);
// commonRoute.patch("/update-map", updateSMSRoute);

export default commonRoute;