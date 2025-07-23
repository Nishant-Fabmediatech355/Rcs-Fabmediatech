import Country from "../../../models/country.js";
import { createLogger } from "../../../common/logger.js";
import { Op } from "sequelize";
const logger = createLogger("user");

// Create a new Country
export const CreateCountry = async (req, res) => {
  try {
    const { Country_name, CountryCode } = req.body;
    if (!Country_name || !CountryCode) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields (Country_name or CountryCode)" });
    }
    // Check for duplicate
    const existingCountry = await Country.findOne({
      where: {
        [Op.or]: [{ Country_name }, { CountryCode }],
      },
    });

    if (existingCountry) {
      return res.status(409).json({
        status: false,
        message: "Country name or Country code already exists",
      });
    }
    const newCountry = await Country.create({ Country_name, CountryCode });
    logger.info(`Country Created Successfully : ${newCountry.dataValues}`);
    res.status(201).json({
      status: true,
      message: "Country Created Successfully",
    });
  } catch (error) {
    logger.info(`Failed due to ${error}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// Get all countries
export const GetAllCountry = async (req, res) => {
  try {
    const countries = await Country.findAll({});
    res.status(200).json({
      status:true,
      message:"Counrty Are Fetched !",
      Data:countries});
  } catch (error) {
    res.status(500).json({
      status:false,
      message: error.message });
  }
};
export const GetOneCountry = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Country ID is required in query",
      });
    }

    const country = await Country.findByPk(id);

    if (!country) {
      return res.status(404).json({
        status: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Country fetched by ID!",
      data: country,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//
export const UpdateCountry = async (req, res) => {
  try {
    const { country_id, Country_name, CountryCode } = req.body;

    if (!country_id) {
      return res.status(400).json({
        status: false,
        message: "Country ID is required in query",
      });
    }

    const [updatedRowsCount, updatedRows] = await Country.update(
      { Country_name, CountryCode },
      {
        where: { country_id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ status: false, message: "Country not found or no changes made" });
    }

    res.status(200).json({
      status: true,
      message: "Country Details Updated",
      Data: updatedRows[0],
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ status: false, message: error.message });
  }
};
export const DeleteCountry = async (req, res) => {
  try {
    const { country_id } = req.body;

    if (!country_id) {
      return res.status(400).json({
        status: false,
        message: "Country ID is required in query",
      });
    }
    const country = await Country.findByPk(country_id);
    if (!Country) {
      return res.status(404).json({status:false, message: "Country not found" });
    }
    await country.destroy();
    logger.info(`Country Deleted Successfully : ${Country.dataValues}`);
    res.status(200)
      .json({ status: true, message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};