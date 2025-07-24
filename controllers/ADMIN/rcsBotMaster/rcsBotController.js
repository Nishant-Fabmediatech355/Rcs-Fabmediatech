import RcsCustomerBotMaster from "../../../models/db2/rcs/RcsCustomerBotMaster.js";
import SMSCRoutes from "../../../models/db1/SMSCRoutes.js";
import RcsBotTypeMaster from "../../../models/db2/rcs/RcsBotTypeMaster.js";
import sequelize from "../../../config/db2.js";

//  customer bot master start
// export const createCustomerBot = async (req, res) => {
//   const {
//     customer_id,
//     bot_id,
//     rcs_bot_type_id,
//     is_active = true,
//     agent_name,
//     route_id,
//   } = req.body;

//   try {
//     // Collect missing fields for validation
//     const missingFields = [];
//     if (!customer_id) missingFields.push("Customer ID");
//     if (!bot_id) missingFields.push("Bot ID");
//     if (!rcs_bot_type_id) missingFields.push("RCS Bot Type ID");
//     if (!agent_name) missingFields.push("Agent Name");

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         status: false,
//         message: `${missingFields.join(", ")} ${
//           missingFields.length === 1 ? "is" : "are"
//         } required`,
//       });
//     }

//     // Check for uniqueness of agent_name and bot_id combination
//     const existingBot = await RcsCustomerBotMaster.findOne({
//       where: {
//         agent_name,
//         bot_id,
//       },
//     });

//     if (existingBot) {
//       return res.status(409).json({
//         status: false,
//         message: `The combination of agent name "${agent_name}" and bot ID "${bot_id}" already exists.`,
//       });
//     }

//     const newCustomerBot = await RcsCustomerBotMaster.create({
//       customer_id,
//       bot_id,
//       rcs_bot_type_id,
//       is_active,
//       agent_name,
//       route_id,
//     });

//     return res.status(201).json({
//       status: true,
//       message: "Customer bot created successfully.",
//       data: newCustomerBot,
//     });
//   } catch (error) {
//     console.error("Error creating customer bot:", error);

//     return res.status(500).json({
//       status: false,
//       message: "Internal server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };

export const createCustomerBot = async (req, res) => {
  const {
    customer_id,
    bot_id,
    rcs_bot_type_id,
    is_active = true,
    agent_name,
    route_id,
  } = req.body;

  try {
    const missingFields = [];
    if (!customer_id) missingFields.push("Customer ID");
    if (!bot_id) missingFields.push("Bot ID");
    if (!rcs_bot_type_id) missingFields.push("RCS Bot Type ID");
    if (!agent_name) missingFields.push("Agent Name");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length === 1 ? "is" : "are"
        } required`,
      });
    }

    if (route_id) {
      const routeExists = await SMSCRoutes.findByPk(route_id);
      if (!routeExists) {
        return res.status(400).json({
          status: false,
          message: `Invalid route_id: ${route_id}. No such route exists in SMSCRoutes.`,
        });
      }
    }

    const existingBotId = await RcsCustomerBotMaster.findOne({
      where: { bot_id },
    });

    if (existingBotId) {
      return res.status(409).json({
        status: false,
        message: `Bot ID "${bot_id}" already exists.`,
      });
    }

    const existingAgentName = await RcsCustomerBotMaster.findOne({
      where: { agent_name },
    });

    if (existingAgentName) {
      return res.status(409).json({
        status: false,
        message: `Agent Name "${agent_name}" already exists.`,
      });
    }

    const newCustomerBot = await RcsCustomerBotMaster.create({
      customer_id,
      bot_id,
      rcs_bot_type_id,
      is_active,
      agent_name,
      route_id,
    });

    return res.status(201).json({
      status: true,
      message: "Customer bot created successfully.",
      data: newCustomerBot,
    });
  } catch (error) {
    console.error("Error creating customer bot:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getCustomerBots = async (req, res) => {
  const customer_id = req.params.customer_id || req.params;

  try {
    if (!customer_id) {
      return res.status(400).json({
        status: false,
        message: "Customer ID is required in query parameters.",
      });
    }

    const bots = await RcsCustomerBotMaster.findAll({
      where: { customer_id },
    });

    return res.status(200).json({
      status: true,
      message: "Customer bots fetched successfully.",
      data: bots,
    });
  } catch (error) {
    console.error("Error fetching customer bots:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateCustomerBot = async (req, res) => {
  const {
    rcs_customer_bot_id,
    bot_id,
    rcs_bot_type_id,
    is_active,
    agent_name,
    route_id,
  } = req.body;

  try {
    if (!rcs_customer_bot_id) {
      return res.status(400).json({
        status: false,
        message: "RCS Customer Bot ID is required in body.",
      });
    }

    // Check if the bot exists
    const bot = await RcsCustomerBotMaster.findByPk(rcs_customer_bot_id);
    if (!bot) {
      return res.status(404).json({
        status: false,
        message: "RCS Customer bot not found.",
      });
    }

    // Check uniqueness of agent_name + bot_id if changed
    if (
      (agent_name || bot_id) &&
      (agent_name !== bot.agent_name || bot_id !== bot.bot_id)
    ) {
      const existing = await RcsCustomerBotMaster.findOne({
        where: {
          agent_name: agent_name || bot.agent_name,
          bot_id: bot_id || bot.bot_id,
        },
      });

      if (existing && existing.rcs_customer_bot_id !== rcs_customer_bot_id) {
        return res.status(409).json({
          status: false,
          message: `The combination of agent name "${agent_name}" and bot ID "${bot_id}" already exists.`,
        });
      }
    }

    // Check if new route_id (if present) is valid
    if (route_id !== undefined) {
      const routeExists = await SMSCRoutes.findByPk(route_id);
      if (!routeExists) {
        return res.status(400).json({
          status: false,
          message: `Invalid route_id: ${route_id}. No such route exists in Rcs Routes.`,
        });
      }
    }

    const updatedFields = {};
    if (bot_id !== undefined) updatedFields.bot_id = bot_id;
    if (rcs_bot_type_id !== undefined)
      updatedFields.rcs_bot_type_id = rcs_bot_type_id;
    if (is_active !== undefined) updatedFields.is_active = is_active;
    if (agent_name !== undefined) updatedFields.agent_name = agent_name;
    if (route_id !== undefined) updatedFields.route_id = route_id;

    await RcsCustomerBotMaster.update(updatedFields, {
      where: { rcs_customer_bot_id },
    });

    const updatedBot = await RcsCustomerBotMaster.findByPk(rcs_customer_bot_id);

    return res.status(200).json({
      status: true,
      message: "Customer bot updated successfully.",
      data: updatedBot,
    });
  } catch (error) {
    console.error("Error updating customer bot:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteCustomerBot = async (req, res) => {
  const rcs_customer_bot_id = req.params.rcs_customer_bot_id;

  try {
    if (!rcs_customer_bot_id) {
      return res.status(400).json({
        status: false,
        message: "RCS Customer Bot ID is required .",
      });
    }

    const existing = await RcsCustomerBotMaster.findByPk(rcs_customer_bot_id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "RCS Customer bot not found.",
      });
    }

    await RcsCustomerBotMaster.destroy({
      where: { rcs_customer_bot_id },
    });

    return res.status(200).json({
      status: true,
      message: "Customer bot deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting customer bot:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllBotTypes = async (req, res) => {
  try {
    const botTypes = await RcsBotTypeMaster.findAll();
    res.status(200).json({
      success: true,
      message: "Fetched all RCS bot types successfully.",
      data: botTypes,
    });
  } catch (error) {
    console.error("Error fetching bot types:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch RCS bot types.",
      error: error.message,
    });
  }
};

export const getOperatorNames = async (req, res) => {
  try {
    const routes = await SMSCRoutes.findAll({
      attributes: [["routeDisplayName", "OperatorName"], "route_id"],
      where: {
        route_id: [2, 7],
      },
    });

    res.status(200).json({
      success: true,
      message: "Operator names with route IDs fetched successfully",
      data: routes,
    });
  } catch (error) {
    console.error("Error fetching operator names:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch operator names",
      error: error.message,
    });
  }
};

// export const getBotTypes = async (req, res) => {
//   try {
//     const bots = await RcsCustomerBotMaster.findAll({
//       attributes: ['agent_name', 'bot_id'],
//       include: [
//         {
//           model: RcsBotTypeMaster,
//           as: 'botType',
//           attributes: ['bot_type_name'],
//         },
//         {
//           model: SMSCRoutes,
//           as: 'route',
//           attributes: [['routeDisplayName', 'operatorName']],
//         },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       message: "Fetched all bot data successfully.",
//       data: bots,
//     });
//   } catch (error) {
//     console.error("Error fetching bot data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch bot data.",
//       error: error.message,
//     });
//   }
// };

export const getBotTypes = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT 
        ct.agent_name,
        ct.bot_id,
        bm.bot_type_name,
         ct.rcs_customer_bot_id,
        ct.is_active, 
        sms.routeDisplayName AS operatorName
      FROM rcs_customer_bot_master ct
      INNER JOIN rcs_bot_type_master bm 
        ON bm.rcs_bot_type_id = ct.rcs_bot_type_id
      INNER JOIN mediatech.dbo.SMSCRoutes sms 
        ON sms.route_id = ct.route_id
    `);

    res.status(200).json({
      success: true,
      message: "Fetched all bot data successfully.",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching bot data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bot data.",
      error: error.message,
    });
  }
};
