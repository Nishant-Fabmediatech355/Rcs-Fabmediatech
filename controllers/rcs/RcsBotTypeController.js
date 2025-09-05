import RcsBotTypeMaster from "../../models/db2/rcs/RcsBotTypeMaster.js";
import RcsCustomerBotMaster from "../../models/db2/rcs/RcsCustomerBotMaster.js";
import RcsTemplateCategoryMaster from "../../models/db2/rcs/RcsTemplateCategoryMaster.js";
import RcsTemplateMaster from "../../models/db2/rcs/RcsTemplateMaster.js";
import RcsTemplateTypeMaster from "../../models/db2/rcs/RcsTemplateTypeMaster.js";
import RcsTextTemplate from "../../models/db2/rcs/RcsTextTemplate.js";
import sequelize from "../../config/db2.js";
import CustomerProfile from "../../models/db1/customer_profile.js";
import RcsButtonActionTypeMaster from "../../models/db2/rcs/RcsButtonActionTypeMaster.js";
import RcsTemplateButtons from "../../models/db2/rcs/RcsTemplateButtons.js";
import RcsRichCardTemplate from "../../models/db2/rcs/RcsRichCardTemplate.js";
import RcsCarouselTemplate from "../../models/db2/rcs/RcsCarouselTemplate.js";
import RcsCarouselCards from "../../models/db2/rcs/RcsCarouselCards.js";
import "dotenv/config";
import { QueryTypes } from "sequelize";
import sharp from "sharp";
import fs from "fs";
import path from "path";
//  rcs bot type start
export const createRcsBootType = async (req, res) => {
  const { bot_type_name } = req.body;
  try {
    if (!bot_type_name) {
      return res.status(400).json({ message: "bot_type_name is required" });
    }
    const existingBot = await RcsBotTypeMaster.findOne({
      where: { bot_type_name },
    });

    if (existingBot) {
      return res.status(409).json({ message: "Bot type already exists" });
    }

    const newBot = await RcsBotTypeMaster.create({ bot_type_name });

    return res.status(201).json({
      status: true,
      message: "Bot type created successfully",
    });
  } catch (error) {
    console.error("Error creating bot type:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateRcsBootType = async (req, res) => {
  const { bot_type_name, rcs_bot_type_id } = req.body;
  try {
    if (!bot_type_name || !rcs_bot_type_id) {
      const missingFields = [];
      if (!bot_type_name) missingFields.push("Bot Type Name");
      if (!rcs_bot_type_id) missingFields.push("Bot Type ID");
      return res.status(400).json({
        status: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length === 1 ? "is" : "are"
        } required`,
      });
    }
    const data = await RcsBotTypeMaster.update(
      { bot_type_name },
      {
        where: { rcs_bot_type_id },
      }
    );
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Bot type not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Bot type updated successfully",
    });
  } catch (error) {
    console.error("Error creating bot type:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllRcsBootType = async (req, res) => {
  try {
    const data = await RcsBotTypeMaster.findAll();
    res.status(200).json({
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Error creating bot type:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteRcsBootType = async (req, res) => {
  const { rcs_bot_type_id } = req.body;
  try {
    if (!rcs_bot_type_id) {
      return res.status(400).json({
        status: false,
        message: "rcs_bot_type_id is required",
      });
    }
    const data = await RcsBotTypeMaster.destroy({
      where: { rcs_bot_type_id },
    });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Bot type not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Bot type deleted successfully",
    });
  } catch (error) {
    console.error("Error creating bot type:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//  rcs bot type end

//  customer bot master start
export const createCustomerBot = async (req, res) => {
  const { customer_id, bot_id, rcs_bot_type_id, is_active } = req.body;
  try {
    if (!customer_id || !bot_id || !rcs_bot_type_id) {
      const missingFields = [];
      if (!customer_id) missingFields.push("Customer Id");
      if (!bot_id) missingFields.push("Bot Id");
      if (!rcs_bot_type_id) missingFields.push("RCS bot type Id");

      return res.status(400).json({
        status: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length === 1 ? "is" : "are"
        } required`,
      });
    }

    await RcsCustomerBotMaster.create({
      customer_id,
      bot_id,
      rcs_bot_type_id,
      is_active: is_active,
    });
    return res.status(201).json({
      status: true,
      message: "Customer bot created successfully",
    });
  } catch (error) {
    console.error("Error creating customer bot:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getCustomerBots = async (req, res) => {
  const { customer_id } = req.query;
  try {
    if (!customer_id) {
      return res.status(400).json({
        status: false,
        message: "Customer Id is required",
      });
    }
    const bots = await RcsCustomerBotMaster.findAll({
      where: { customer_id: customer_id },
    });
    return res.status(200).json({
      status: true,
      message: "Customer bots fetched successfully",
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
  const { rcs_customer_bot_id, bot_id, rcs_bot_type_id, is_active } = req.body;
  try {
    if (!rcs_customer_bot_id) {
      return res.status(400).json({
        status: false,
        message: "RCS Customer bot ID is required",
      });
    }
    let query = {};
    if (bot_id) {
      query.bot_id = bot_id;
    }
    if (rcs_bot_type_id) {
      query.rcs_bot_type_id = rcs_bot_type_id;
    }
    if (is_active) {
      query.is_active = is_active;
    }
    const data = await RcsCustomerBotMaster.update(query, {
      where: {
        rcs_customer_bot_id: rcs_customer_bot_id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "RCS Customer bot not found",
      });
    }
    return res.status(200).json({
      message: "Customer bot updated successfully",
      data: bot,
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
  const { rcs_customer_bot_id } = req.body;
  try {
    if (!rcs_customer_bot_id) {
      return res
        .status(400)
        .json({ message: "RCS Customer bot ID is required in body" });
    }
    const data = await RcsCustomerBotMaster.destroy({
      where: {
        rcs_customer_bot_id: rcs_customer_bot_id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "RCS Customer bot not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Customer bot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer bot:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//  customer bot master end

// customer template category start
export const createRcsTemplateCategory = async (req, res) => {
  const { customer_id, category_name } = req.body;
  try {
    if (!customer_id || !category_name) {
      const missingFields = [];
      if (!customer_id) missingFields.push("Customer Id");
      if (!category_name) missingFields.push("Template Name");
      return res.status(400).json({
        status: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length === 1 ? "is" : "are"
        } required`,
      });
    }
    const newCategory = await RcsTemplateCategoryMaster.create({
      customer_id,
      category_name,
    });
    return res.status(201).json({
      status: true,
      message: "RCS Template Category created successfully",
    });
  } catch (error) {
    console.error("Error creating RCS Template Category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// customer template category end
export const createRcsTemplateType = async (req, res) => {
  try {
    const { rcs_template_type } = req.body;

    if (!rcs_template_type) {
      return res.status(400).json({ message: "Template type is required" });
    }

    const exists = await RcsTemplateTypeMaster.findOne({
      where: { rcs_template_type },
    });
    if (exists) {
      return res.status(400).json({ message: "Template type already exists" });
    }

    const newType = await RcsTemplateTypeMaster.create({ rcs_template_type });

    return res.status(201).json({
      message: "Template type created successfully",
      data: newType,
    });
  } catch (error) {
    console.error("Error creating template type:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createRcsTemplate = async (req, res) => {
  try {
    const {
      rcs_customer_bot_id,
      rcs_template_category_id,
      rcs_template_type_id,
      template_name,
      isApproved,
    } = req.body;

    if (
      !rcs_customer_bot_id ||
      !rcs_template_category_id ||
      !rcs_template_type_id ||
      !template_name
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    const bot = await RcsCustomerBotMaster.findByPk(rcs_customer_bot_id);
    if (!bot)
      return res.status(404).json({ message: "Customer bot not found" });

    const category = await RcsTemplateCategoryMaster.findByPk(
      rcs_template_category_id
    );
    if (!category)
      return res.status(404).json({ message: "Template category not found" });

    const type = await RcsTemplateTypeMaster.findByPk(rcs_template_type_id);
    if (!type)
      return res.status(404).json({ message: "Template type not found" });

    const newTemplate = await RcsTemplateMaster.create({
      rcs_customer_bot_id,
      rcs_template_category_id,
      rcs_template_type_id,
      template_name,
      isApproved: isApproved || false,
    });

    return res.status(201).json({
      message: "Template created successfully",
      data: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getRcsTemplates = async (req, res) => {
  try {
    const { customer_bot_id, category_id, type_id } = req.query;

    const where = {};
    if (customer_bot_id) where.rcs_customer_bot_id = customer_bot_id;
    if (category_id) where.rcs_template_category_id = category_id;
    if (type_id) where.rcs_template_type_id = type_id;

    const templates = await RcsTemplateMaster.findAll({
      where,
      include: [
        { model: RcsCustomerBotMaster, as: "rcs_customer_bot_master" },
        {
          model: RcsTemplateCategoryMaster,
          as: "rcs_template_category_master",
        },
        { model: RcsTemplateTypeMaster, as: "rcs_template_type_master" },
      ],
    });

    return res.status(200).json({
      message: "Templates fetched successfully",
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateRcsTemplate = async (req, res) => {
  try {
    const {
      rcs_template_id,
      rcs_customer_bot_id,
      rcs_template_category_id,
      rcs_template_type_id,
      template_name,
      isApproved,
    } = req.body;

    if (!rcs_template_id) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const template = await RcsTemplateMaster.findByPk(rcs_template_id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (rcs_customer_bot_id) {
      const bot = await RcsCustomerBotMaster.findByPk(rcs_customer_bot_id);
      if (!bot)
        return res.status(404).json({ message: "Customer bot not found" });
      template.rcs_customer_bot_id = rcs_customer_bot_id;
    }

    if (rcs_template_category_id) {
      const category = await RcsTemplateCategoryMaster.findByPk(
        rcs_template_category_id
      );
      if (!category)
        return res.status(404).json({ message: "Template category not found" });
      template.rcs_template_category_id = rcs_template_category_id;
    }

    if (rcs_template_type_id) {
      const type = await RcsTemplateTypeMaster.findByPk(rcs_template_type_id);
      if (!type)
        return res.status(404).json({ message: "Template type not found" });
      template.rcs_template_type_id = rcs_template_type_id;
    }

    if (template_name !== undefined) template.template_name = template_name;
    if (isApproved !== undefined) template.isApproved = isApproved;

    await template.save();

    return res.status(200).json({
      message: "Template updated successfully",
      data: template,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteRcsTemplate = async (req, res) => {
  try {
    const { rcs_template_id } = req.body;

    if (!rcs_template_id) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const template = await RcsTemplateMaster.findByPk(rcs_template_id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    await template.destroy();

    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createRcsTextTemplate = async (req, res) => {
  try {
    const { rcs_template_id, rcs_text } = req.body;

    if (!rcs_template_id || !rcs_text) {
      return res
        .status(400)
        .json({ message: "rcs_template_id and rcs_text are required" });
    }

    const template = await RcsTemplateMaster.findByPk(rcs_template_id);
    if (!template) {
      return res.status(404).json({ message: "RCS Template not found" });
    }

    const newTextTemplate = await RcsTextTemplate.create({
      rcs_template_id,
      rcs_text,
    });

    return res.status(201).json({
      message: "RCS Text Template created successfully",
      data: newTextTemplate,
    });
  } catch (error) {
    console.error("Error creating RCS text template:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Nishant  Start Create API of Agent Catagory

export const getAllAgents = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
      cp.customer_name as bot_Name,
      cp.customer_name,
      scm.rcs_customer_bot_id,
      rtm.bot_type_name,
      rtm.rcs_bot_type_id,
      scm.customer_id,
      scm.bot_id,
      scm.is_active
      FROM rcs_customer_bot_master scm
      INNER JOIN rcs_bot_type_master rtm ON rtm.rcs_bot_type_id = scm.rcs_bot_type_id
      INNER join [mediatech].[dbo].customer_profile cp on cp.customer_id=scm.customer_id
    `);

    res.status(200).json({
      message: "RCS agents fetch successfully",
      data: results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: err.message });
  }
};

// Start Currently Create Agent API is not in Use when Neeraj Sir will tell then we will chnages in API.
export const creatAgent = async (req, res) => {
  const {
    customer_id,
    bot_id,
    bot_Name,
    bot_type_name,
    is_active = true,
  } = req.body;

  try {
    if (!bot_id || !bot_Name || !bot_type_name) {
      return res.status(400).json({
        message: "bot_id, bot_Name, and bot_type_name are required",
      });
    }

    const existingBotId = await RcsCustomerBotMaster.findOne({
      where: { bot_id },
    });
    if (existingBotId) {
      return res
        .status(409)
        .json({ message: "Bot with this ID already exists" });
    }

    const existingBotName = await RcsCustomerBotMaster.findOne({
      where: { bot_Name },
    });
    if (existingBotName) {
      return res
        .status(409)
        .json({ message: "Bot with this name already exists" });
    }

    let botType = await RcsBotTypeMaster.findOne({ where: { bot_type_name } });

    if (!botType) {
      botType = await RcsBotTypeMaster.create({ bot_type_name });
    }

    const rcs_bot_type_id = botType.rcs_bot_type_id;

    if (customer_id) {
      const customer = await CustomerProfile.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    const newBot = await RcsCustomerBotMaster.create({
      customer_id,
      bot_id,
      bot_Name,
      rcs_bot_type_id,
      is_active,
    });

    res.status(201).json({
      message: "Bot created successfully",
      data: newBot,
    });
  } catch (err) {
    console.error("Error creating bot:", err);
    res.status(500).json({ message: "Failed to create bot" });
  }
};

export const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { customer_id, bot_id, bot_Name, bot_type_name, is_active } = req.body;

  try {
    const bot = await RcsCustomerBotMaster.findByPk(id);
    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    let botType = await RcsBotTypeMaster.findByPk(bot.rcs_bot_type_id);

    if (!botType) {
      return res.status(404).json({ message: "Bot type not found" });
    }

    if (bot_type_name && bot_type_name !== botType.bot_type_name) {
      await botType.update({ bot_type_name });
    }

    const updated_rcs_bot_type_id = botType.rcs_bot_type_id;

    if (customer_id) {
      const customer = await CustomerProfile.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    // Step 3: Update rcs_customer_bot_master
    await bot.update({
      customer_id: customer_id ?? bot.customer_id,
      bot_id: bot_id ?? bot.bot_id,
      bot_Name: bot_Name ?? bot.bot_Name,
      rcs_bot_type_id: updated_rcs_bot_type_id,
      is_active: typeof is_active === "boolean" ? is_active : bot.is_active,
    });

    res.status(200).json({
      message: "Bot and Bot Type updated successfully",
      data: bot,
    });
  } catch (err) {
    console.error("Error updating bot:", err);
    res.status(500).json({ message: "Failed to update bot" });
  }
};

export const deleteAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const bot = await RcsCustomerBotMaster.findByPk(id);

    if (!bot) {
      return res.status(404).json({ message: "Agent not found" });
    }

    await bot.destroy();

    res.status(200).json({
      message: "Bot deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting bot:", err);
    res.status(500).json({ message: "Failed to delete bot" });
  }
};

// End

export const createRcsCategory = async (req, res) => {
  const { customer_id, category_name } = req.body;

  if (!category_name || category_name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Category name must be at least 2 characters" });
  }

  try {
    const category = await RcsTemplateCategoryMaster.create({
      customer_id,
      category_name,
    });
    res.status(201).json({ message: "Category created", data: category });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create category",
      details: err.errors ? err.errors.map((e) => e.message) : err.message,
    });
  }
};

// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await RcsTemplateCategoryMaster.findAll({
//       include: {
//         model: CustomerProfile,
//         as: "customer_profile",
//         attributes: ["customer_id", "customer_name"],
//       },
//     });
//     res
//       .status(200)
//       .json({ message: "Fetch all categories successfully", data: categories });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch categories", details: err });
//   }
// };

export const getAllCategories = async (req, res) => {
  try {
    const query = `
      SELECT rtcm.* 
      FROM rcs_template_category_master rtcm
      INNER JOIN [mediatech].[dbo].customer_profile cp 
        ON cp.customer_id = rtcm.customer_id
    `;

    const categories = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      message: "Fetch all categories successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch categories",
      details: err.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { customer_id, category_name } = req.body;

  try {
    if (!customer_id || !category_name) {
      return res.status(400).json({
        message: "Both customer_id and category_name are required",
      });
    }

    const customer = await CustomerProfile.findOne({
      where: { customer_id },
    });
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found with the provided ID",
      });
    }

    const existingCategory = await RcsTemplateCategoryMaster.findOne({
      where: { rcs_template_category_id: id },
    });
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found with the provided ID",
      });
    }

    const [affectedRows] = await RcsTemplateCategoryMaster.update(
      { customer_id, category_name },
      {
        where: { rcs_template_category_id: id },
        individualHooks: true,
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "No records were updated",
      });
    }

    const updatedCategory = await RcsTemplateCategoryMaster.findByPk(id);

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({
      error: err.message,
      message: "Failed to update category",
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }
    const category = await RcsTemplateCategoryMaster.findOne({
      where: { rcs_template_category_id: id },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found with the provided ID",
      });
    }

    // Perform deletion
    const deletedCount = await RcsTemplateCategoryMaster.destroy({
      where: { rcs_template_category_id: id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No category was deleted",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      deletedCategoryId: id,
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};

// Submit Text data
export const createRcsTextTemplateData = async (req, res) => {
  const {
    rcs_customer_bot_id,
    rcs_template_category_id,
    rcs_template_type_id,
    template_name,
    isApproved = false,
    rcs_text,
  } = req.body;

  try {
    // Validate required fields
    if (
      !rcs_customer_bot_id ||
      !rcs_template_category_id ||
      !rcs_template_type_id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTemplate = await RcsTemplateMaster.create({
      rcs_customer_bot_id,
      rcs_template_category_id,
      rcs_template_type_id,
      template_name,
      isApproved,
    });

    const newTextTemplate = await RcsTextTemplate.create({
      rcs_template_id: newTemplate.rcs_template_id,
      rcs_text,
    });

    res.status(201).json({
      message: "Template and text created successfully",
      data: {
        template: newTemplate,
        textTemplate: newTextTemplate,
      },
    });
  } catch (err) {
    console.error("Error creating template:", err);
    res.status(500).json({ message: "Failed to create template" });
  }
};

// Get All Button Actions
export const getAllButtonActions = async (req, res) => {
  try {
    const actions = await RcsButtonActionTypeMaster.findAll();

    if (!actions || actions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No button actions found.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched all button actions successfully.",
      data: actions,
    });
  } catch (error) {
    console.error("Error fetching button actions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

function formatToMSSQLDate(input) {
  if (!input) return null;

  // If already in correct format, return as-is
  if (
    typeof input === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [+-]\d{2}:\d{2}$/.test(input)
  ) {
    return input;
  }

  // Handle ISO format (with 'T' separator)
  if (typeof input === "string" && input.includes("T")) {
    const date = new Date(input);
    if (isNaN(date.getTime())) return null;

    // Format to: 'YYYY-MM-DD HH:mm:ss.SSS +05:30'
    const pad = (num) => num.toString().padStart(2, "0");
    const offset = date.getTimezoneOffset();
    const absOffset = Math.abs(offset);
    const sign = offset > 0 ? "-" : "+";
    const hours = pad(Math.floor(absOffset / 60));
    const minutes = pad(absOffset % 60);

    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}.000 ` +
      `${sign}${hours}:${minutes}`
    );
  }

  return null; // Fallback for invalid formats
}

function formatDateForMSSQL(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const ms = date.getMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}

const validateCoordinates = (value, fieldName) => {
  if (value && isNaN(parseFloat(value))) {
    throw new Error(`Invalid ${fieldName} value: must be a number`);
  }
  return value ? parseFloat(value) : null;
};

// Start Create Template API

export const createTemplate = async (req, res) => {
  var {
    rcs_customer_bot_id,
    rcs_template_category_id,
    rcs_template_type_id,
    template_name,
    isApproved,
    rcs_text,
    cardData,
    carouselData,
    media_details,
    card_title,
    card_description,
    customer_id,
    card_width,
    rcs_media_height,
    rcs_mediaHeight,
    card_no,
    card_orientation,
  } = req.body;
  let buttons = req.body.buttons;
  if (typeof buttons === "string") {
    try {
      buttons = JSON.parse(buttons);
    } catch (err) {
      console.error("Invalid buttons JSON:", err);
      throw new Error("Buttons format is invalid.");
    }
  }

  // Validation common fields
  const errors = [];

  if (!rcs_customer_bot_id) errors.push("rcs_customer_bot id is required");
  if (!rcs_template_category_id)
    errors.push("rcs_template category id is required");
  if (!rcs_template_type_id) errors.push("rcs_template_type id is required");
  if (!template_name || template_name.trim() === "")
    errors.push("template name is required");

  // Validation based on template type
  switch (parseInt(rcs_template_type_id)) {
    case 1: // Text
      if (!rcs_text || rcs_text.trim() === "")
        errors.push("rcs text is required");
      break;

    case 2: // Rich Card
      if (!card_orientation) errors.push("card orientation is required");
      if (!media_details || media_details.trim() === "")
        errors.push("media details is required");
      if (!card_title || card_title.trim() === "")
        errors.push("card title is required");
      if (!card_description || card_description.trim() === "")
        errors.push("Card description is required");
      if (!req.files?.richCardImage?.[0])
        errors.push("RichCardImage file is required");
      break;

    case 3: // Carousel
      if (!req.body.cards) {
        errors.push("cards array is required");
      } else {
        try {
          console.log("card_width", req.body.card_width);
          if (!card_width) errors.push(`Card width is required`);
          if (!rcs_mediaHeight)
            errors.push(`Card rcs media height is required`);
          const parsedCards = Array.isArray(req.body.cards)
            ? req.body.cards
            : JSON.parse(req.body.cards);

          parsedCards.forEach((card, index) => {
            if (typeof card === "string") card = JSON.parse(card);
            if (!card.card_title || card.card_title.trim() === "")
              errors.push(`Card ${index + 1}: card title is required`);
            if (
              !card.carouselCardDescription ||
              card.carouselCardDescription.trim() === ""
            )
              errors.push(`Card ${index + 1}: card description is required`);
            if (!req.files?.carouselImages?.[index])
              errors.push(`Card ${index + 1}: image file is required`);
          });
        } catch (err) {
          errors.push("Invalid cards format");
        }
      }
      break;

    default:
      errors.push("Invalid rcs_template_type_id");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  //let card_orientation = req.body.card_orientation;
  // if (card_orientation === "Vertical") {
  //   card_orientation = 1;
  // } else {
  //   card_orientation = 2;
  // }
  const files = req.files;
  let t;

  try {
    const existingTemplate = await RcsTemplateMaster.findOne({
      where: {
        template_name,
        rcs_customer_bot_id,
      },
    });

    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: "Template name already exists for this bot.",
      });
    }
    // Start transaction

    t = await sequelize.transaction();
    const formatDateForSQL = (date) => {
      return date.toISOString().slice(0, 23).replace("T", " ");
    };
    // const createdAt = formatDateForSQL(new Date());
    // const updatedAt = formatDateForSQL(new Date());

    const newTemplate = await RcsTemplateMaster.create(
      {
        rcs_customer_bot_id,
        rcs_template_category_id,
        rcs_template_type_id,
        template_name,
        isApproved,
      },
      { transaction: t }
    );

    const templateId = newTemplate.rcs_template_id;
    const createdAt = formatDateForMSSQL(new Date());
    const updatedAt = formatDateForMSSQL(new Date());

    if (rcs_template_type_id == 1) {
      await RcsTextTemplate.create(
        {
          rcs_template_id: templateId,
          rcs_text,
          createdAt,
          updatedAt,
        },
        { transaction: t }
      );
    } else if (rcs_template_type_id == 2) {
      const imageFile = files?.richCardImage?.[0];
      if (!imageFile) throw new Error("Image file is required for Rich Card");

      const fileSizeMB = imageFile.size / (1024 * 1024);
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      const mimeType = imageFile.mimetype;

      if (!allowedTypes.includes(mimeType)) {
        throw new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."
        );
      }

      if (fileSizeMB > 2) {
        throw new Error("File too large. Max size is 2 MB.");
      }

      const imageMeta = await sharp(imageFile.path).metadata();

      const { width, height } = imageMeta;
      const aspectRatio = (width / height).toFixed(2);

      // Validate based on orientation & media height/direction
      if (card_orientation === "Vertical") {
        if (
          media_details === "Short" &&
          !(aspectRatio == 3.0 && width == 1440 && height == 480)
        ) {
          throw new Error(
            "Image must be 3:1 aspect ratio (1440x480) for Short + Vertical"
          );
        }
        if (
          media_details === "Medium" &&
          !(aspectRatio == 2.0 && width == 1440 && height == 720)
        ) {
          throw new Error(
            "Image must be 2:1 aspect ratio (1440x720) for Medium + Vertical"
          );
        }
      }

      if (card_orientation === "Horizontal") {
        if (
          (media_details === "Left" || media_details === "Right") &&
          !(aspectRatio == 0.75 && width == 768 && height == 1024)
        ) {
          throw new Error(
            "Image must be 3:4 aspect ratio (768x1024) for Horizontal + Left/Right"
          );
        }
      }

      let imagePath = imageFile.path.replace(/\\/g, "/");
      let finalPath = `${process.env.backend_img_url}/${imagePath}`;
      console.log("finalPath", finalPath);

      await RcsRichCardTemplate.create(
        {
          rcs_template_id: templateId,
          card_orientation: card_orientation,
          image_file_path: finalPath,
          media_details: media_details,
          card_title: card_title,
          card_description: card_description,
          rcs_template_category_id: rcs_template_category_id,
        },
        { transaction: t }
      );
    } else if (rcs_template_type_id == 3) {
      let cards = [];

      if (req.body.cards) {
        try {
          const rawCards = Array.isArray(req.body.cards)
            ? req.body.cards
            : JSON.parse(req.body.cards);

          cards = rawCards.map((card) =>
            typeof card === "string" ? JSON.parse(card) : card
          );
        } catch (err) {
          console.error("Card parsing failed:", err.message);
          throw new Error("Invalid carousel card format.");
        }
      }

      if (!cards.length) {
        throw new Error("No carousel cards received in request");
      }

      const uploadedImages = files?.carouselImages || [];

      // Validate mediaHeight and cardWidth are present
      if (!rcs_mediaHeight || !card_width) {
        throw new Error("Please select both media height and card width");
      }

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const imageFile = uploadedImages[i];

        if (!imageFile) throw new Error(`Image missing for card ${i + 1}`);

        const mimeType = imageFile.mimetype;
        const fileSizeMB = imageFile.size / (1024 * 1024);
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
        ];

        if (!allowedTypes.includes(mimeType)) {
          throw new Error(`Card ${i + 1}: Invalid file type`);
        }

        if (fileSizeMB > 1) {
          throw new Error(`Card ${i + 1}: File too large. Max size is 1 MB`);
        }

        const { width, height } = await sharp(imageFile.path).metadata();
        const aspectRatio = parseFloat((width / height).toFixed(2));

        // Define expected values
        const rules = [
          {
            mediaHeight: "Short",
            cardWidth: "Small",
            aspect: 1.25, // 5:4
            width: 960,
            height: 720,
          },
          {
            mediaHeight: "Medium",
            cardWidth: "Medium",
            aspect: 1.33, // 4:3
            width: 1440,
            height: 1080,
          },
          {
            mediaHeight: "Short",
            cardWidth: "Medium",
            aspect: 0.8, // 4:5
            width: 576,
            height: 720,
          },
          {
            mediaHeight: "Medium",
            cardWidth: "Small",
            aspect: 2.0, // 2:1
            width: 1440,
            height: 720,
          },
        ];

        const matchRule = rules.find(
          (rule) =>
            rule.mediaHeight === rcs_mediaHeight &&
            rule.cardWidth === card_width
        );

        if (!matchRule) {
          throw new Error(
            "Invalid combination of media height and card width."
          );
        }

        if (
          Math.abs(aspectRatio - matchRule.aspect) > 0.05 ||
          width !== matchRule.width ||
          height !== matchRule.height
        ) {
          throw new Error(
            `Card ${i + 1}: Invalid image dimensions. Expected: ${
              matchRule.width
            }x${matchRule.height}, Aspect ratio: ${matchRule.aspect}`
          );
        }

        const imagePath = imageFile?.path?.replace(/\\/g, "/");
        const finalImageUrl = imagePath
          ? `${process.env.backend_img_url}/${imagePath}`
          : null;

        // Insert carousel template (only once per template)
        const carousel = await RcsCarouselTemplate.create(
          {
            rcs_template_id: templateId,
            card_width: card_width,
            rcs_media_height: rcs_mediaHeight,
          },
          { transaction: t }
        );

        // Insert individual carousel card
        await RcsCarouselCards.create(
          {
            rcs_carousel_template_id: carousel.rcs_carousel_template_id,
            card_no: card.card_no ?? i + 1,
            card_title: card.card_title,
            card_description: card.carouselCardDescription,
            image_file_path: finalImageUrl,
          },
          { transaction: t }
        );
      }
    }

    // Insert buttons if provided
    if (Array.isArray(buttons)) {
      for (const button of buttons) {
        await RcsTemplateButtons.create(
          {
            rcs_template_id: templateId,
            button_action_id: button.button_action_id,
            suggestion_text: button.suggestion_text,
            suggestion_postback: button.suggestion_postback,
            button_no: button.button_no,

            // Optional fields
            url: button.url || null,
            url_action_application: button.application || null,
            dialer_action_Phone_number: button.phone_number || null,
            // latitude: button.latitude || null,
            // longitude: button.longitude || null,
            // latitude: button.latitude ? parseFloat(button.latitude) : null,
            // longitude: button.longitude ? parseFloat(button.longitude) : null,
            latitude: validateCoordinates(button.latitude, "latitude"),
            longitude: validateCoordinates(button.longitude, "longitude"),
            location_query: button.location_query || null,
            //  calendar_start_date_time: formatToMSSQLDate(button.start_date_time),
            //   calendar_end_date_time: formatToMSSQLDate(button.end_date_time),
            // calendar_start_date_time: button.start_date_time
            //   ? moment(button.start_date_time).format("YYYY-MM-DD HH:mm:ss")
            //   : null,
            // calendar_end_date_time: button.end_date_time
            //   ? moment(button.end_date_time).format("YYYY-MM-DD HH:mm:ss")
            //   : null,
            calendar_start_date_time: button.start_date_time
              ? new Date(button.start_date_time)
              : null,
            calendar_end_date_time: button.end_date_time
              ? new Date(button.end_date_time)
              : null,

            calendar_title: button.calendar_title || null,
            calendar_description: button.calendar_description || null,
          },
          { transaction: t }
        );
      }
    }

    // Commit transaction
    await t.commit();
    res
      .status(201)
      .json({ success: true, message: "Template created successfully." });
  } catch (error) {
    if (t && !t.finished) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
    }
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error ? error.message : "Internal server error.",
    });
  }
};

export const getTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await RcsTemplateMaster.findOne({
      where: { rcs_template_id: id },
      include: [
        {
          model: RcsTextTemplate,
          as: "textTemplate",
        },
        {
          model: RcsRichCardTemplate,
          as: "richCardTemplate",
        },
        {
          model: RcsCarouselTemplate,
          as: "carouselTemplate",
          include: [
            {
              model: RcsCarouselCards,
              as: "carouselCards",
            },
          ],
        },
        {
          model: RcsTemplateButtons,
          as: "buttons",
        },
      ],
    });

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found." });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getTemplatesByCustomerId = async (req, res) => {
  const { customer_id } = req.params;

  try {
    // Step 1: Find all bot IDs for this customer
    const bots = await RcsCustomerBotMaster.findAll({
      where: { customer_id },
      attributes: ["rcs_customer_bot_id"],
    });

    const botIds = bots.map((bot) => bot.rcs_customer_bot_id);

    if (!botIds.length) {
      return res.status(404).json({
        success: false,
        message: "No templates found for this customer.",
      });
    }

    // Step 2: Find templates with related data
    const templates = await RcsTemplateMaster.findAll({
      where: {
        rcs_customer_bot_id: botIds,
      },
      include: [
        { model: RcsTextTemplate, as: "textTemplate" },
        { model: RcsRichCardTemplate, as: "richCardTemplate" },
        {
          model: RcsCarouselTemplate,
          as: "carouselTemplate",
          include: [{ model: RcsCarouselCards, as: "carouselCards" }],
        },
        { model: RcsTemplateButtons, as: "buttons" },
      ],
    });

    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getTemplatesByCustomerRaw = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const [results] = await sequelize.query(
      `
      SELECT DISTINCT 
    tma.rcs_template_type_id,
    tma.rcs_template_id,
    tma.template_name,
    ttm.rcs_template_type,
    CASE 
      WHEN tma.isApproved = 1 THEN 'Approved' 
      ELSE 'Pending' 
    END AS Status,
   -- COALESCE(rct.image_file_path, cca.image_file_path) AS image_file_path,
    rct.media_details,
    rct.card_orientation,
    rct.card_title,
    tma.updatedAt,
    tma.createdAt, 
    CONCAT(cbm.agent_name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent
FROM rcs_template_master tma
INNER JOIN rcs_customer_bot_master cbm ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
INNER JOIN rcs_bot_type_master btm ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
INNER JOIN [mediatech].[dbo].customer_profile cp ON cp.customer_id = cbm.customer_id
LEFT JOIN rcs_text_template tm ON tma.rcs_template_id = tm.rcs_template_id
LEFT JOIN rcs_template_type_master ttm ON ttm.rcs_template_type_id = tma.rcs_template_type_id
LEFT JOIN rcs_template_buttons tb ON tma.rcs_template_id = tb.rcs_template_id
LEFT JOIN rcs_button_action_type_master batm ON batm.button_action_id = tb.button_action_id
LEFT JOIN rcs_carousel_template ct ON ct.rcs_template_id = tma.rcs_template_id
LEFT JOIN rcs_carousel_cards cca ON cca.rcs_carousel_template_id = ct.rcs_carousel_template_id
LEFT JOIN rcs_rich_card_template rct ON tma.rcs_template_id = rct.rcs_template_id
WHERE tma.IsActive=1
ORDER BY tma.createdAt DESC;`
    );

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Raw SQL error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTemplate = async (req, res) => {
  const templateId = req.params.id;
  let t;
  try {
    t = await sequelize.transaction();

    const template = await RcsTemplateMaster.findOne({
      where: { rcs_template_id: templateId },
      transaction: t,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    switch (template.rcs_template_type_id) {
      case 1:
        await RcsTextTemplate.destroy({
          where: { rcs_template_id: templateId },
          transaction: t,
        });
        break;

      case 2:
        await RcsRichCardTemplate.destroy({
          where: { rcs_template_id: templateId },
          transaction: t,
        });
        break;

      case 3:
        const carousels = await RcsCarouselTemplate.findAll({
          where: { rcs_template_id: templateId },
          transaction: t,
        });

        if (carousels.length > 0) {
          const carouselTemplateIds = carousels.map(
            (c) => c.rcs_carousel_template_id
          );

          await RcsCarouselCards.destroy({
            where: {
              rcs_carousel_template_id: carouselTemplateIds,
            },
            transaction: t,
          });

          await RcsCarouselTemplate.destroy({
            where: {
              rcs_carousel_template_id: carouselTemplateIds,
            },
            transaction: t,
          });
        }
        break;
      default:
        throw new Error("Invalid template type");
    }

    await RcsTemplateButtons.destroy({
      where: { rcs_template_id: templateId },
      transaction: t,
    });

    await RcsTemplateMaster.update(
      { isActive: false },
      {
        where: { rcs_template_id: templateId },
        transaction: t,
      }
    );

    // Commit transaction
    await t.commit();
    res.status(200).json({
      success: true,
      message: "Template deleted successfully .",
    });
  } catch (error) {
    if (t && !t.finished) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
    }
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getAllRcsBotTypes = async (req, res) => {
  try {
    const botTypes = await RcsBotTypeMaster.findAll();

    return res.status(200).json({
      success: true,
      message: "Bot types fetched successfully",
      data: botTypes,
    });
  } catch (error) {
    console.error("Error fetching bot types:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCustomerBotsByBotType = async (req, res) => {
  const { rcs_bot_type_id } = req.params;

  try {
    if (!rcs_bot_type_id) {
      return res.status(400).json({
        success: false,
        message: "rcs_bot_type_id is required in params.",
      });
    }

    const bots = await RcsCustomerBotMaster.findAll({
      where: {
        rcs_bot_type_id,
        is_active: 1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Active customer bots fetched successfully.",
      data: bots,
    });
  } catch (error) {
    console.error("Error fetching customer bots:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// export const getViewTemplateById = async (req, res) => {
//   let templateId = req.params.id;

//   // Validate input
//   if (!templateId || isNaN(templateId)) {
//     return res.status(400).json({ message: "Invalid or missing Template ID." });
//   }

//   // Convert to integer
//   templateId = parseInt(templateId);

//   try {
//     const result = await sequelize.query(
//       `
//       -- CTE for Cards
//       WITH CardCTE AS (
//         SELECT
//           cca.card_no,
//           cca.image_file_path,
//           cca.card_title,
//           cca.card_description,
//           ROW_NUMBER() OVER (ORDER BY cca.card_no) AS rn,
//           ct.rcs_template_id
//         FROM rcs_carousel_cards cca
//         INNER JOIN rcs_carousel_template ct
//           ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id
//         WHERE ct.rcs_template_id = :templateId
//       ),

//       -- CTE for Buttons
//       ButtonCTE AS (
//         SELECT
//           teb.button_action_id,
//           teb.suggestion_text,
//           teb.suggestion_postback,
//           ROW_NUMBER() OVER (ORDER BY teb.button_no) AS rn,
//           teb.rcs_template_id
//         FROM rcs_template_buttons teb
//         WHERE teb.rcs_template_id = :templateId
//       )

//       SELECT
//         tma.rcs_template_id,
//         tma.template_name,
//         ttm.rcs_template_type,
//         tcm.category_name,

//         -- Text fields
//         tm.rcs_text,

//         -- Rich card fields
//         rct.media_details,
//         rct.card_orientation,
//         rct.image_file_path AS rich_card_image,
//         rct.card_title AS rich_card_title,
//         rct.card_description AS rich_card_description,

//         -- Carousel Card
//         CardCTE.card_no,
//         CardCTE.image_file_path AS carousel_image,
//         CardCTE.card_title AS carousel_title,
//         CardCTE.card_description AS carousel_description,

//         -- Matched Button
//         ButtonCTE.button_action_id,
//         ButtonCTE.suggestion_text,
//         ButtonCTE.suggestion_postback,

//         -- Common
//         CASE
//           WHEN tma.isApproved = 1 THEN 'Approved'
//           ELSE 'Pending'
//         END AS status,

//         CONCAT(cbm.bot_Name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

//       FROM rcs_template_master tma
//       INNER JOIN rcs_customer_bot_master cbm
//         ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
//       INNER JOIN rcs_bot_type_master btm
//         ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
//       INNER JOIN rcs_template_category_master tcm
//         ON tcm.rcs_template_category_id = tma.rcs_template_category_id
//       INNER JOIN rcs_template_type_master ttm
//         ON ttm.rcs_template_type_id = tma.rcs_template_type_id
//       LEFT JOIN rcs_text_template tm
//         ON tma.rcs_template_id = tm.rcs_template_id
//       LEFT JOIN rcs_rich_card_template rct
//         ON tma.rcs_template_id = rct.rcs_template_id
//       LEFT JOIN CardCTE
//         ON CardCTE.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN ButtonCTE
//         ON ButtonCTE.rcs_template_id = tma.rcs_template_id AND ButtonCTE.rn = CardCTE.rn

//       WHERE tma.IsActive = 1 AND tma.rcs_template_id = :templateId
//       ORDER BY CardCTE.card_no;
//       `,
//       {
//         replacements: { templateId },
//         type: QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Template data fetched successfully.",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching template data:", {
//       message: error.message,
//       stack: error.stack,
//       sql: error.sql || "",
//     });

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch template data. Please try again later.",
//     });
//   }
// };

// export const getViewTemplateById = async (req, res) => {
//   const templateId = req.params.id;

//   if (!templateId || isNaN(templateId)) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid template ID." });
//   }

//   try {
//     const data = await sequelize.query(
//       `
//       SELECT
//         tma.rcs_template_id,
//         tma.template_name,
//         ttm.rcs_template_type,
//         tcm.category_name,

//         -- Text fields
//         tm.rcs_text,

//         -- Rich card fields
//         rct.media_details,
//         rct.card_orientation,
//         rct.image_file_path AS rich_card_image,
//         rct.card_title AS rich_card_title,
//         rct.card_description AS rich_card_description,

//         -- Carousel card fields
//         cca.card_no,
//         cca.image_file_path AS carousel_image,
//         cca.card_title AS carousel_title,
//         cca.card_description AS carousel_description,

//         -- Button info (matched by card_no if Carousel, otherwise joined directly)
//         teb.button_no,
//         teb.button_action_id,
//         teb.suggestion_text,
//         teb.suggestion_postback,
//         teb.url,
//         teb.url_action_application,
//         teb.dialer_action_Phone_number,
//         teb.latitude,
//         teb.longitude,
//         teb.location_query,
//         teb.calendar_start_date_time,
//         teb.calendar_end_date_time,
//         teb.calendar_title,
//         teb.calendar_description,

//         -- Status
//         CASE
//           WHEN tma.isApproved = 1 THEN 'Approved'
//           ELSE 'Pending'
//         END AS status,

//         CONCAT(cbm.agent_name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

//       FROM rcs_template_master tma
//       INNER JOIN rcs_customer_bot_master cbm
//         ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
//       INNER JOIN rcs_bot_type_master btm
//         ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
//       INNER JOIN rcs_template_category_master tcm
//         ON tcm.rcs_template_category_id = tma.rcs_template_category_id
//       INNER JOIN rcs_template_type_master ttm
//         ON ttm.rcs_template_type_id = tma.rcs_template_type_id

//       LEFT JOIN rcs_text_template tm
//         ON tm.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN rcs_rich_card_template rct
//         ON rct.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN rcs_carousel_template ct
//         ON ct.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN rcs_carousel_cards cca
//         ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id

//       LEFT JOIN rcs_template_buttons teb
//         ON teb.rcs_template_id = tma.rcs_template_id
//         AND (
//           ttm.rcs_template_type = 'Carousel' AND teb.button_no = cca.card_no
//           OR ttm.rcs_template_type != 'Carousel'
//         )

//       WHERE tma.IsActive = 1

//       AND tma.rcs_template_id = :templateId
//       ORDER BY
//         CASE
//           WHEN ttm.rcs_template_type = 'Carousel' THEN cca.card_no
//           ELSE teb.button_no
//         END;
//       `,
//       {
//         replacements: { templateId: Number(templateId) },
//         type: QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Template data fetched successfully.",
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching template data:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching template data.",
//     });
//   }
// };

// export const getViewTemplateById = async (req, res) => {
//   const templateId = req.params.id;

//   if (!templateId || isNaN(templateId)) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid template ID." });
//   }

//   try {
//     const data = await sequelize.query(
//       `
//      SELECT
//   tma.rcs_template_id,
//   tma.template_name,
//   ttm.rcs_template_type,
//   tcm.category_name,

//   -- Text fields
//   tm.rcs_text,

//   -- Rich card fields
//   rct.media_details,
//   rct.card_orientation,
//   rct.image_file_path AS rich_card_image,
//   rct.card_title AS rich_card_title,
//   rct.card_description AS rich_card_description,

//   -- Carousel card fields
//   cca.card_no,
//   cca.image_file_path AS carousel_image,
//   cca.card_title AS carousel_title,
//   cca.card_description AS carousel_description,

//   -- Button info (now includes all buttons)
//   teb.button_no,
//   teb.button_action_id,
//   teb.suggestion_text,
//   teb.suggestion_postback,
//   teb.url,
//   teb.url_action_application,
//   teb.dialer_action_Phone_number,
//   teb.latitude,
//   teb.longitude,
//   teb.location_query,
//   teb.calendar_start_date_time,
//   teb.calendar_end_date_time,
//   teb.calendar_title,
//   teb.calendar_description,

//   -- Status
//   CASE
//     WHEN tma.isApproved = 1 THEN 'Approved'
//     ELSE 'Pending'
//   END AS status,

//   CONCAT(cbm.agent_name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

// FROM rcs_template_master tma
// INNER JOIN rcs_customer_bot_master cbm
//   ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
// INNER JOIN rcs_bot_type_master btm
//   ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
// INNER JOIN rcs_template_category_master tcm
//   ON tcm.rcs_template_category_id = tma.rcs_template_category_id
// INNER JOIN rcs_template_type_master ttm
//   ON ttm.rcs_template_type_id = tma.rcs_template_type_id

// LEFT JOIN rcs_text_template tm
//   ON tm.rcs_template_id = tma.rcs_template_id
// LEFT JOIN rcs_rich_card_template rct
//   ON rct.rcs_template_id = tma.rcs_template_id
// LEFT JOIN rcs_carousel_template ct
//   ON ct.rcs_template_id = tma.rcs_template_id
// LEFT JOIN rcs_carousel_cards cca
//   ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id

// -- ✅ Join ALL buttons (don't restrict to card_no here)
// LEFT JOIN rcs_template_buttons teb
//   ON teb.rcs_template_id = tma.rcs_template_id

// WHERE tma.IsActive = 1
//   AND tma.rcs_template_id = :templateId

// ORDER BY
//   CASE
//     WHEN ttm.rcs_template_type = 'Carousel' THEN cca.card_no
//     ELSE teb.button_no
//   END;

//       `,
//       {
//         replacements: { templateId: Number(templateId) },
//         type: QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Template data fetched successfully.",
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching template data:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching template data.",
//     });
//   }
// };

export const getViewTemplateById = async (req, res) => {
  const templateId = req.params.id;

  if (!templateId || isNaN(templateId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid template ID.",
    });
  }

  try {
    const [result] = await sequelize.query(
      "EXEC TemplateDetailJSON :templateId",
      {
        replacements: { templateId: Number(templateId) },
        type: QueryTypes.SELECT,
      }
    );

    const finalData = {
      templateDetails: JSON.parse(result.template),
      buttonInformation: JSON.parse(result.buttons),
      carousel_cards: JSON.parse(result.carousel_cards),
    };

    res.json({
      success: true,
      message: "Template data fetched successfully.",
      data: finalData,
    });
  } catch (error) {
    console.error("Error fetching template data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching template data.",
    });
  }
};

export const getTemplatesByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res
        .status(400)
        .json({ message: "rcs_template_category_id is required" });
    }

    const templates = await RcsTemplateMaster.findAll({
      where: { rcs_template_category_id: categoryId },
      attributes: [
        "rcs_template_id",
        "rcs_customer_bot_id",
        "rcs_template_category_id",
        "rcs_template_type_id",
        "template_name",
        "isApproved",
      ],
    });

    if (templates.length === 0) {
      return res
        .status(404)
        .json({ message: "No templates found for the given category ID" });
    }

    return res.status(200).json({ data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const getViewTemplateById = async (req, res) => {
//   const templateId = req.params.id;

//   if (!templateId) {
//     return res.status(400).json({ message: "Template ID is required" });
//   }

//   try {
//     const result = await sequelize.query(
//       `
//       WITH CardCTE AS (
//         SELECT
//           cca.card_no,
//           cca.image_file_path,
//           cca.card_title,
//           cca.card_description,
//           ROW_NUMBER() OVER (ORDER BY cca.card_no) AS rn,
//           ct.rcs_template_id
//         FROM rcs_carousel_cards cca
//         INNER JOIN rcs_carousel_template ct
//           ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id
//         WHERE ct.rcs_template_id = :templateId
//       ),

//       ButtonCTE AS (
//         SELECT
//           teb.button_action_id,
//           teb.suggestion_text,
//           teb.suggestion_postback,
//           ROW_NUMBER() OVER (ORDER BY teb.button_no) AS rn,
//           teb.rcs_template_id
//         FROM rcs_template_buttons teb
//         WHERE teb.rcs_template_id = :templateId
//       )

//       SELECT
//         tma.rcs_template_id,
//         tma.template_name,
//         ttm.rcs_template_type,
//         tcm.category_name,

//         -- Text fields
//         tm.rcs_text,

//         -- Rich card fields
//         rct.media_details,
//         rct.card_orientation,
//         rct.image_file_path AS rich_card_image,
//         rct.card_title AS rich_card_title,
//         rct.card_description AS rich_card_description,

//         -- Carousel card fields
//         CardCTE.card_no,
//         CardCTE.image_file_path AS carousel_image,
//         CardCTE.card_title AS carousel_title,
//         CardCTE.card_description AS carousel_description,

//         -- One matching button per card
//         ButtonCTE.button_action_id,
//         ButtonCTE.suggestion_text,
//         ButtonCTE.suggestion_postback,

//         -- Common fields
//         CASE
//           WHEN tma.isApproved = 1 THEN 'Approved'
//           ELSE 'Pending'
//         END AS status,
//         CONCAT(cbm.bot_Name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

//       FROM rcs_template_master tma
//       INNER JOIN rcs_customer_bot_master cbm
//         ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
//       INNER JOIN rcs_bot_type_master btm
//         ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
//       INNER JOIN rcs_template_category_master tcm
//         ON tcm.rcs_template_category_id = tma.rcs_template_category_id
//       LEFT JOIN rcs_template_type_master ttm
//         ON ttm.rcs_template_type_id = tma.rcs_template_type_id
//       LEFT JOIN rcs_text_template tm
//         ON tma.rcs_template_id = tm.rcs_template_id
//       LEFT JOIN rcs_rich_card_template rct
//         ON tma.rcs_template_id = rct.rcs_template_id
//       LEFT JOIN CardCTE
//         ON CardCTE.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN ButtonCTE
//         ON ButtonCTE.rcs_template_id = tma.rcs_template_id AND CardCTE.rn = ButtonCTE.rn

//       WHERE
//         tma.IsActive = 1
//         AND tma.rcs_template_id = :templateId
//       ORDER BY CardCTE.card_no;
//       `,
//       {
//         replacements: { templateId },
//         type: QueryTypes.SELECT
//       }
//     );

//     return res.status(200).json({
//       message: "Successfully fetched template details.",
//       data: result
//     });
//   } catch (error) {
//     console.error("Error fetching template details:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const getViewTemplateById = async (req, res) => {
//   const templateId = req.params.id;

//   if (!templateId) {
//     return res.status(400).json({ message: 'Template ID is required' });
//   }

//   try {
//     const result = await sequelize.query(
//       `
//       -- CTE for Cards
//       WITH CardCTE AS (
//         SELECT
//           cca.card_no,
//           cca.image_file_path,
//           cca.card_title,
//           cca.card_description,
//           ROW_NUMBER() OVER (ORDER BY cca.card_no) AS rn,
//           ct.rcs_template_id
//         FROM rcs_carousel_cards cca
//         INNER JOIN rcs_carousel_template ct
//           ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id
//         WHERE ct.rcs_template_id = :templateId
//       ),

//       -- CTE for Buttons
//       ButtonCTE AS (
//         SELECT
//           teb.button_action_id,
//           teb.suggestion_text,
//           teb.suggestion_postback,
//           ROW_NUMBER() OVER (ORDER BY teb.button_no) AS rn,
//           teb.rcs_template_id
//         FROM rcs_template_buttons teb
//         WHERE teb.rcs_template_id = :templateId
//       )

//       SELECT
//         tma.rcs_template_id,
//         tma.template_name,
//         ttm.rcs_template_type,
//         tcm.category_name,

//         -- Text fields
//         tm.rcs_text,

//         -- Rich card fields
//         rct.media_details,
//         rct.card_orientation,
//         rct.image_file_path AS rich_card_image,
//         rct.card_title AS rich_card_title,
//         rct.card_description AS rich_card_description,

//         -- Carousel Card
//         CardCTE.card_no,
//         CardCTE.image_file_path AS carousel_image,
//         CardCTE.card_title AS carousel_title,
//         CardCTE.card_description AS carousel_description,

//         -- Matched Button
//         ButtonCTE.button_action_id,
//         ButtonCTE.suggestion_text,
//         ButtonCTE.suggestion_postback,

//         -- Common
//         CASE
//           WHEN tma.isApproved = 1 THEN 'Approved'
//           ELSE 'Pending'
//         END AS status,

//         CONCAT(cbm.bot_Name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

//       FROM rcs_template_master tma
//       INNER JOIN rcs_customer_bot_master cbm
//         ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
//       INNER JOIN rcs_bot_type_master btm
//         ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
//       INNER JOIN rcs_template_category_master tcm
//         ON tcm.rcs_template_category_id = tma.rcs_template_category_id
//       INNER JOIN rcs_template_type_master ttm
//         ON ttm.rcs_template_type_id = tma.rcs_template_type_id
//       LEFT JOIN rcs_text_template tm
//         ON tma.rcs_template_id = tm.rcs_template_id
//       LEFT JOIN rcs_rich_card_template rct
//         ON tma.rcs_template_id = rct.rcs_template_id
//       LEFT JOIN CardCTE
//         ON CardCTE.rcs_template_id = tma.rcs_template_id
//       LEFT JOIN ButtonCTE
//         ON ButtonCTE.rcs_template_id = tma.rcs_template_id AND ButtonCTE.rn = CardCTE.rn

//       WHERE tma.IsActive = 1 AND tma.rcs_template_id = :templateId
//       ORDER BY CardCTE.card_no;
//       `,
//       {
//         replacements: { templateId },
//         type: QueryTypes.SELECT
//       }
//     );

//     return res.status(200).json({
//       message: 'Template data fetched successfully.',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error fetching template data:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getViewTemplateById = async (req, res) => {
//   const templateId = req.params.id;

//   if (!templateId) {
//     return res.status(400).json({ message: 'Template ID is required' });
//   }

//   try {
//     const result = await sequelize.query(
//       `
//       SELECT
//         tma.rcs_template_id,
//         tma.template_name,
//         ttm.rcs_template_type,
//         tcm.category_name,

//         -- Text fields
//         tm.rcs_text,

//         -- Rich card fields
//         rct.media_details,
//         rct.card_orientation,
//         rct.image_file_path AS rich_card_image,
//         rct.card_title AS rich_card_title,
//         rct.card_description AS rich_card_description,

//         -- Carousel card fields
//         cca.card_no,
//         cca.image_file_path AS carousel_image,
//         cca.card_title AS carousel_title,
//         cca.card_description AS carousel_description,

//         -- Common
//         CASE
//           WHEN tma.isApproved = 1 THEN 'Approved'
//           ELSE 'Pending'
//         END AS status,
//         teb.button_action_id,
//         teb.suggestion_text,
//         teb.suggestion_postback,
//         CONCAT(cbm.bot_Name, ' ', cbm.bot_id, ' (', btm.bot_type_name, ')') AS Agent

//       FROM rcs_template_master tma
//       INNER JOIN rcs_customer_bot_master cbm
//         ON tma.rcs_customer_bot_id = cbm.rcs_customer_bot_id
//       INNER JOIN rcs_bot_type_master btm
//         ON btm.rcs_bot_type_id = cbm.rcs_bot_type_id
//       INNER JOIN rcs_template_category_master tcm
//         ON tcm.rcs_template_category_id = tma.rcs_template_category_id
//       LEFT JOIN rcs_template_type_master ttm
//         ON ttm.rcs_template_type_id = tma.rcs_template_type_id
//       LEFT JOIN rcs_text_template tm
//         ON tma.rcs_template_id = tm.rcs_template_id
//       LEFT JOIN rcs_rich_card_template rct
//         ON tma.rcs_template_id = rct.rcs_template_id
//       LEFT JOIN rcs_carousel_template ct
//         ON tma.rcs_template_id = ct.rcs_template_id
//       LEFT JOIN rcs_carousel_cards cca
//         ON ct.rcs_carousel_template_id = cca.rcs_carousel_template_id
//       LEFT join rcs_template_buttons teb on teb.rcs_template_id=tma.rcs_template_id

//       WHERE
//         tma.IsActive = 1
//         AND tma.rcs_template_id = :templateId
//       ORDER BY cca.card_no;
//       `,
//       {
//         replacements: { templateId },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     return res.status(200).json({ message: 'Successfully fetching template details:',data: result });
//   } catch (error) {
//     console.error('Error fetching template details:');
//     return res.status(500).json({ message: 'Server error'});
//   }
// };

// export const getTemplateDetailsByCustomer = async (req, res) => {

//   const { customer_id } = req.params;

//   try {
//     const templates = await RcsTemplateMaster.findAll({
//       include: [
//         {
//           model: RcsCustomerBotMaster,
//           as: 'botMaster',
//           where: { customer_id },
//           include: [
//             { model: CustomerProfile, as: 'customerProfile' },
//             { model: RcsBotTypeMaster, as: 'botType' }
//           ]
//         },
//         {
//           model: RcsTemplateTypeMaster,
//           as: 'templateType'
//         },
//         {
//           model: RcsTextTemplate,
//           as: 'textTemplate'
//         },
//         {
//           model: RcsTemplateButtons,
//           as: 'buttons',
//           include: [
//             { model: RcsButtonActionTypeMaster, as: 'buttonAction' }
//           ]
//         },
//         {
//           model: RcsCarouselTemplate,
//           as: 'carouselTemplate',
//           include: [
//             { model: RcsCarouselCards, as: 'carouselCards' }
//           ]
//         }
//       ]
//     });

//     // Optional: Transform the response to match SQL format
//     const result = templates.map(template => {
//       const bot = template.botMaster;
//       const agent = `${bot?.bot_Name} ${bot?.bot_id} (${bot?.botType?.bot_type_name})`;

//       return {
//         template_name: template.template_name,
//         rcs_template_type: template.templateType?.rcs_template_type,
//         Status: template.isApproved === 1 ? 'Approved' : 'Pending',
//         Agent: agent
//         // You can add more fields here if needed (buttons, cards, etc.)
//       };
//     });

//     res.status(200).json({ success: true, data: result });

//   } catch (error) {
//     console.error('Error fetching templates by customer_id:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// export const createTemplate = async (req, res) => {
//   const {
//     rcs_customer_bot_id, rcs_template_category_id, rcs_template_type_id,
//     template_name, isApproved, rcs_text, cardData, carouselData, buttons
//   } = req.body;

//   const files = req.files;
//   const t = await sequelize.transaction();

//   try {
//     const newTemplate = await RcsTemplateMaster.create({
//       rcs_customer_bot_id,
//       rcs_template_category_id,
//       rcs_template_type_id,
//       template_name,
//       isApproved
//     }, { transaction: t });

//     const templateId = newTemplate.rcs_template_id;

//     if (rcs_template_type_id == 1) {
//       await RcsTextTemplate.create({
//         rcs_template_id: templateId,
//         rcs_text
//       }, { transaction: t });

//     } else if (rcs_template_type_id == 2) {
//       // Rich Card - Single image
//       const imagePath = files?.richCardImage?.[0]?.path;

//       await RcsRichCardTemplate.create({
//         rcs_template_id: templateId,
//         card_orientation: cardData.card_orientation,
//         image_file_path: imagePath,
//         media_details: cardData.media_details,
//         card_title: cardData.card_title,
//         card_description: cardData.card_description,
//         rcs_template_category_id: cardData.rcs_template_category_id
//       }, { transaction: t });

//     } else if (rcs_template_type_id == 3) {
//       // Carousel
//       const carousel = await RcsCarouselTemplate.create({
//         rcs_template_id: templateId,
//         card_width: carouselData.card_width,
//         rcs_media_height: carouselData.rcs_media_height
//       }, { transaction: t });

//       const uploadedImages = files?.carouselImages || [];

//       for (let i = 0; i < carouselData.cards.length; i++) {
//         const card = carouselData.cards[i];
//         const imagePath = uploadedImages[i]?.path || null;

//         await RcsCarouselCard.create({
//           rcs_carousel_template_id: carousel.rcs_carousel_template_id,
//           card_no: card.card_no,
//           image_file_path: imagePath,
//           card_title: card.card_title,
//           card_description: card.card_description
//         }, { transaction: t });
//       }
//     }

//     // Common Buttons
//     if (Array.isArray(buttons)) {
//       for (const button of buttons) {
//         await RcsTemplateButtons.create({
//           rcs_template_id: templateId,
//           button_action_id: button.button_action_id,
//           suggestion_text: button.suggestion_text,
//           suggestion_postback: button.suggestion_postback,
//           button_no: button.button_no
//         }, { transaction: t });
//       }
//     }

//     await t.commit();
//     res.status(201).json({ success: true, message: "Template created successfully." });

//   } catch (error) {
//     await t.rollback();
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };

// export const createTemplate = async (req, res) => {
//   const {
//     rcs_customer_bot_id, rcs_template_category_id, rcs_template_type_id,
//     template_name, isApproved, rcs_text, cardData, carouselData, buttons
//   } = req.body;

//   const t = await sequelize.transaction(); // for rollback on failure

//   try {
//     // 1. Common Template Master Entry
//     const newTemplate = await RcsTemplateMaster.create({
//       rcs_customer_bot_id,
//       rcs_template_category_id,
//       rcs_template_type_id,
//       template_name,
//       isApproved
//     }, { transaction: t });

//     const templateId = newTemplate.rcs_template_id;

//     // 2. Case Handling Based on Template Type
//     if (rcs_template_type_id === 1) { // Text
//       await RcsTextTemplate.create({
//         rcs_template_id: templateId,
//         rcs_text
//       }, { transaction: t });

//     } else if (rcs_template_type_id === 2) { // Rich Card
//       await RcsRichCardTemplate.create({
//         rcs_template_id: templateId,
//         ...cardData, // should contain: card_orientation, image_file_path, media_details, card_title, card_description, rcs_template_category_id
//       }, { transaction: t });

//     } else if (rcs_template_type_id === 3) { // Carousel
//       const carousel = await RcsCarouselTemplate.create({
//         rcs_template_id: templateId,
//         card_width: carouselData.card_width,
//         rcs_media_height: carouselData.rcs_media_height
//       }, { transaction: t });

//       // Insert multiple cards
//       for (const card of carouselData.cards) {
//         await RcsCarouselCard.create({
//           rcs_carousel_template_id: carousel.rcs_carousel_template_id,
//           card_no: card.card_no,
//           image_file_path: card.image_file_path,
//           card_title: card.card_title,
//           card_description: card.card_description
//         }, { transaction: t });
//       }
//     }

//     // 3. Insert Buttons
//     if (Array.isArray(buttons)) {
//       for (const button of buttons) {
//         await RcsTemplateButtons.create({
//           rcs_template_id: templateId,
//           button_action_id: button.button_action_id,
//           suggestion_text: button.suggestion_text,
//           suggestion_postback: button.suggestion_postback,
//           button_no: button.button_no
//         }, { transaction: t });
//       }
//     }

//     await t.commit();
//     res.status(201).json({ success: true, message: "Template created successfully" });

//   } catch (error) {
//     await t.rollback();
//     console.error("Error creating template:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// Nishant  End
// export const createCampaign = async (req, res) => {
//   try {
//     const {
//       customer_id,
//       campaign_name,
//       campaign_category_id,
//       tcNumber,
//       message_category,
//       campaign_body,
//       button_type,
//       time_to_send,
//     } = req.body;

//     // File paths
//     const data_file_path = req.files?.dataFile
//       ? req.files.dataFile[0].path.replace(/\\/g, "/")
//       : null;
//     const media_path = req.files?.mediaFile
//       ? req.files.mediaFile[0].path.replace(/\\/g, "/")
//       : null;

//     // Convert dates into SQL-friendly format
//     const parsedTimeToSend = time_to_send
//       ? new Date(time_to_send).toISOString().slice(0, 19).replace("T", " ")
//       : null;

//     const time_of_upload = new Date().toISOString().slice(0, 19).replace("T", " ");

//     await sequelize.query(
//       `
//       INSERT INTO tc_campaign_master
//       (customer_id, campaign_name, campaign_category_id, tcNumber,
//        message_category, data_file_path, media_path, campaign_body,
//        button_type, time_to_send, time_of_upload)
//       VALUES
//       (:customer_id, :campaign_name, :campaign_category_id, :tcNumber,
//        :message_category, :data_file_path, :media_path, :campaign_body,
//        :button_type, :time_to_send, :time_of_upload)
//       `,
//       {
//         replacements: {
//           customer_id,
//           campaign_name,
//           campaign_category_id,
//           tcNumber,
//           message_category,
//           data_file_path,
//           media_path,
//           campaign_body,
//           button_type,
//           time_to_send: parsedTimeToSend,
//           time_of_upload,
//         },
//       }
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Campaign created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating campaign:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export const createCampaign = async (req, res) => {
//   try {
//     const {
//       campaign_name,
//       campaign_category_id,
//       tcNumber,
//       message_category,
//       campaign_body,
//       button_type,
//       time_to_send,
//     } = req.body;

//     // ✅ customer_id middleware se aayega (req.userId me)
//     const customer_id = req.userId;
//     if (!customer_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer ID missing from token",
//       });
//     }

//     // File paths
//     const data_file_path = req.files?.dataFile
//       ? req.files.dataFile[0].path.replace(/\\/g, "/")
//       : null;
//     const media_path = req.files?.mediaFile
//       ? req.files.mediaFile[0].path.replace(/\\/g, "/")
//       : null;

//     // Convert dates into SQL-friendly format
//     const parsedTimeToSend = time_to_send
//       ? new Date(time_to_send).toISOString().slice(0, 19).replace("T", " ")
//       : null;

//     const time_of_upload = new Date().toISOString().slice(0, 19).replace("T", " ");

//     await sequelize.query(
//       `
//       INSERT INTO tc_campaign_master
//       (customer_id, campaign_name, campaign_category_id, tcNumber,
//        message_category, data_file_path, media_path, campaign_body,
//        button_type, time_to_send, time_of_upload)
//       VALUES
//       (:customer_id, :campaign_name, :campaign_category_id, :tcNumber,
//        :message_category, :data_file_path, :media_path, :campaign_body,
//        :button_type, :time_to_send, :time_of_upload)
//       `,
//       {
//         replacements: {
//           customer_id,
//           campaign_name,
//           campaign_category_id,
//           tcNumber,
//           message_category,
//           data_file_path,
//           media_path,
//           campaign_body,
//           button_type,
//           time_to_send: parsedTimeToSend,
//           time_of_upload,
//         },
//       }
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Campaign created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating campaign:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const createCampaign = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      campaign_name,
      campaign_category_id,
      tcNumber, // ✅ Directly save in DB
      message_category,
      campaign_body,
      button_type,
      time_to_send,
      quickReplies,
      callToActions,
    } = req.body;

    const customer_id = req.userId;
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID missing from token",
      });
    }

    let data_file_path = null;

    // ✅ Case 1: If file uploaded, save its path
    if (req.files?.dataFile) {
      data_file_path = req.files.dataFile[0].path.replace(/\\/g, "/");
    }

    const media_path = req.files?.mediaFile
      ? req.files.mediaFile[0].path.replace(/\\/g, "/")
      : null;

    const parsedTimeToSend = time_to_send
      ? new Date(time_to_send).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const time_of_upload = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Step 1: Insert Campaign
    const [rows] = await sequelize.query(
      `
      INSERT INTO tc_campaign_master
      (customer_id, campaign_name, campaign_category_id, tcNumber,
       message_category, data_file_path, media_path, campaign_body,
       button_type, time_to_send, time_of_upload)
      VALUES
      (:customer_id, :campaign_name, :campaign_category_id, :tcNumber,
       :message_category, :data_file_path, :media_path, :campaign_body,
       :button_type, :time_to_send, :time_of_upload);

      SELECT CAST(SCOPE_IDENTITY() as int) as tc_campaign_id;
      `,
      {
        replacements: {
          customer_id,
          campaign_name,
          campaign_category_id,
          tcNumber, // ✅ Directly save incoming number
          message_category,
          data_file_path,
          media_path,
          campaign_body,
          button_type,
          time_to_send: parsedTimeToSend,
          time_of_upload,
        },
        transaction: t,
      }
    );

    const tc_campaign_id = rows[0].tc_campaign_id;
    console.log("Inserted Campaign ID:", tc_campaign_id);

    // Step 2: Insert Buttons
    if (
      (button_type === "quickReply" || button_type === "quick_reply") &&
      Array.isArray(quickReplies)
    ) {
      for (const text of quickReplies) {
        console.log("Inserting Quick Reply:", text);
        await sequelize.query(
          `
          INSERT INTO tc_campaign_buttons
          (tc_campaign_id, quick_reply_text, callToActionType, button_text, website_URL)
          VALUES (:tc_campaign_id, :quick_reply_text, NULL, NULL, NULL)
          `,
          {
            replacements: { tc_campaign_id, quick_reply_text: text },
            transaction: t,
          }
        );
      }
    }

    if (
      (button_type === "callToAction" || button_type === "call_to_action") &&
      Array.isArray(callToActions)
    ) {
      for (const btn of callToActions) {
        console.log("Inserting CallToAction:", btn);
        await sequelize.query(
          `
          INSERT INTO tc_campaign_buttons
          (tc_campaign_id, quick_reply_text, callToActionType, button_text, website_URL)
          VALUES (:tc_campaign_id, NULL, :callToActionType, :button_text, :website_URL)
          `,
          {
            replacements: {
              tc_campaign_id,
              callToActionType: btn.callToActionType,
              button_text: btn.button_text,
              website_URL: btn.Website_url,
            },
            transaction: t,
          }
        );
      }
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Campaign and buttons created successfully",
      tc_campaign_id,
      tcNumber,
      data_file_path,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating campaign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCustomerNumbers = async (req, res) => {
  try {
    // customer_id middleware se aayega
    const customer_id = req.userId;
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID missing from token",
      });
    }

    const [numbers] = await sequelize.query(
      `
      SELECT tc_number_id, tc_number
      FROM tc_numbers
      WHERE customer_id = :customer_id
      ORDER BY tc_number_id DESC
      `,
      {
        replacements: { customer_id },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Customer numbers fetched successfully",
      data: numbers,
    });
  } catch (error) {
    console.error("Error fetching customer numbers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
