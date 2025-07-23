import SMSCRoutes from "../../../models/SMSCRoutes.js";
import { createLogger } from "../../../common/logger.js";
import { Service } from "../../../models/service/Services.js";

const logger = createLogger("user");
// Create
export const CreateSMSCRoutes = async (req, res) => {
  const { routeSMPPName, routeDisplayName, service_id } = req.body;
  try {
    if (!routeSMPPName || !service_id || !routeDisplayName) {
      return res
        .status(400)
        .json({ status: false, error: "Missing required fields" });
    }
    let query = {
      service_id,
    };
    if (routeSMPPName) {
      query.routeSMPPName = routeSMPPName;
    }
    if (routeDisplayName) {
      query.routeDisplayName = routeDisplayName;
    }
    const newRoute = await SMSCRoutes.create(query);
    logger.info(`SMSCRoutes Created Successfully : ${newRoute.dataValues}`);
    res.status(201).json({
      status: true,
      message: "SMSCRoutes Created Succesfully !",
    });
  } catch (error) {
    logger.info(`Failed due to ${error}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// Read (Get all routes)
export const GetAllSMSCRoutes = async (req, res) => {
  try {
    const routes = await SMSCRoutes.findAll({
      include: [
        {
          model: Service,
          as: "service",
        },
      ],
    });
    res
      .status(200)
      .json({ status: true, message: "Fetched All Routes", Data: routes });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// Read (Get single route by ID)
export const GetOneSMSCRoutes = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(404)
        .json({ status: false, error: "Route_id query Not Found ! " });
    }
    const route = await SMSCRoutes.findByPk(id);
    if (!route) {
      return res.status(404).json({ status: false, error: "Route not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "SMSC Routes Fetched!", Data: route });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

export const UpdateSMSCRoutes = async (req, res) => {
  const { route_id, routeSMPPName, routeDisplayName } = req.body;

  try {
    if (!route_id) {
      return res
        .status(404)
        .json({ status: false, error: "Route_id in query not found!" });
    }
    let query = {};
    if (routeSMPPName) {
      query.routeSMPPName = routeSMPPName;
    }
    if (routeDisplayName) {
      query.routeDisplayName = routeDisplayName;
    }
    const updatedRows = await SMSCRoutes.update(query, {
      where: {
        route_id: route_id,
      },
    });

    res.status(200).json({
      status: true,
      message: "Updated successfully!",
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

// Delete
export const DeleteSMSCRoutes = async (req, res) => {
  const { route_id } = req.body;
  try {
    const route = await SMSCRoutes.findByPk(route_id);
    if (!route) {
      return res.status(404).json({ staus: false, error: "Route not found" });
    }
    await SMSCRoutes.destroy({
      where: {
        route_id,
      },
    });
    logger.info(`Routes DELETED Succesfully!`);
    res.status(200).json({
      status: true,
      message: "SuccessFully Delete",
    });
  } catch (error) {
    console.log({ error: error.message });

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
