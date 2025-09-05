import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import {
  createRcsBootType,
  updateRcsBootType,
  getAllRcsBootType,
  deleteRcsBootType,
  createCustomerBot,
  getCustomerBots,
  updateCustomerBot,
  deleteCustomerBot,
  getAllAgents,
  createRcsCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  creatAgent,
  updateAgent,
  deleteAgent,
  getAllButtonActions,
  createTemplate,
  getTemplatesByCustomerRaw,
  deleteTemplate,
  getViewTemplateById,
  getTemplatesByCategoryId,
  createCampaign,
  getCustomerNumbers,
} from "../../controllers/rcs/RcsBotTypeController.js";
import upload from "../../middleware/rcsMulterMiddleware.js";

const RcsBotTypeRoutes = express.Router();

// bot type for admin only start
RcsBotTypeRoutes.post("/create-rcs-bot-type", authenticate, createRcsBootType);
RcsBotTypeRoutes.patch("/update-rcs-bot-type", authenticate, updateRcsBootType);
RcsBotTypeRoutes.get("/get-all-rcs-bot-type", authenticate, getAllRcsBootType);
RcsBotTypeRoutes.delete(
  "/delete-rcs-bot-type",
  authenticate,
  deleteRcsBootType
);
// bot type for admin only end

// customer rcs bot type start
RcsBotTypeRoutes.post("/create-customer-bot", authenticate, createCustomerBot);
RcsBotTypeRoutes.get("/get-all-customer-bot", authenticate, getCustomerBots);
RcsBotTypeRoutes.patch("/update-customer-bot", authenticate, updateCustomerBot);
RcsBotTypeRoutes.delete(
  "/delete-customer-bot",
  authenticate,
  deleteCustomerBot
);
// customer rcs bot type end

// Nishant Start
RcsBotTypeRoutes.get("/get-all-rcs-agents", authenticate, getAllAgents);
RcsBotTypeRoutes.post("/create-rcs-agent", authenticate, creatAgent);
RcsBotTypeRoutes.put("/update-rcs-agent/:id", authenticate, updateAgent);
RcsBotTypeRoutes.delete("/delete-agent/:id", authenticate, deleteAgent);

RcsBotTypeRoutes.get("/categories", authenticate, getAllCategories);
RcsBotTypeRoutes.post("/create-categories", authenticate, createRcsCategory);
RcsBotTypeRoutes.put("/categories/:id", authenticate, updateCategory);
RcsBotTypeRoutes.delete("/delete-categories/:id", authenticate, deleteCategory);

//RcsBotTypeRoutes.post("/create-text-template",authenticate, createRcsTextTemplateData);
RcsBotTypeRoutes.get("/get-action-button", authenticate, getAllButtonActions);

RcsBotTypeRoutes.post(
  "/create-template",
  upload.fields([
    { name: "richCardImage", maxCount: 1 },
    { name: "carouselImages", maxCount: 10 },
  ]),
  authenticate,
  createTemplate
);

RcsBotTypeRoutes.delete("/delete-template/:id", authenticate, deleteTemplate);

// RcsBotTypeRoutes.get('/templates-customer/:customer_id',authenticate, getTemplatesByCustomerId);

RcsBotTypeRoutes.get(
  "/templates-customer/:customer_id",
  authenticate,
  getTemplatesByCustomerRaw
);

RcsBotTypeRoutes.get(
  "/get-view-template-data/:id",
  authenticate,
  getViewTemplateById
);

RcsBotTypeRoutes.get(
  "/get-template-name/:id",
  authenticate,
  getTemplatesByCategoryId
);
RcsBotTypeRoutes.post(
  "/create-campaign",
  authenticate,
  upload.fields([
    { name: "dataFile", maxCount: 1 },
    { name: "mediaFile", maxCount: 1 },
  ]),
  createCampaign
);
RcsBotTypeRoutes.get("/get-customer-numbers", authenticate, getCustomerNumbers);

// Nishant End

export default RcsBotTypeRoutes;
