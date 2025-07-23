import { createLogger } from '../../../common/logger.js';
import Country from '../../../models/country.js';
import Country_Route_Map from '../../../models/country_route_map.js'
import SMSCRoutes from '../../../models/SMSCRoutes.js';
const logger = createLogger("user");

//  Apis for Customer Route Mapping..................................................................................................
export const CreateCountryRouteMap = async (req, res) => {
  try {
    const { country_id, route_id } = req.body;

    if (!country_id || !route_id) {
      return res.status(400).json({ status: false, error: "Missing required fields" });
    }

    // Check if country exists
    const country = await Country.findByPk(country_id);
    if (!country) {
      return res.status(404).json({ status: false, error: "Country not found" });
    }

    // Check if route exists
    const route = await SMSCRoutes.findByPk(route_id);
    if (!route) {
      return res.status(404).json({ status: false, error: "Route not found" });
    }

    await Country_Route_Map.create({ country_id, route_id });

    return res.status(200).json({
      status: 200,
      message: "CreateCountryRouteMap Created Successfully!",
    });

  } catch (error) {
    logger.info(`Failed due to ${error}`);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
  // export const GetOneCountryRouteMapByCountryId = async (req, res) => {
  //   try {
  //     const { country_id } = req.query;
  //     if (!country_id) {
  //       return res.status(400).json({status:false, error: "Missing required fields" });
  //     }
  //     const records = await Country_Route_Map.findAll({
  //       where: {
  //         country_id: country_id,
  //       },
  //       include: [
  //         { model: SMSCRoutes, as: 'SMSCRoutes' },
  //       ],
  //     });
  //     const menuCount = records.length;
  
  //     return res.status(200).json({status:true,menuCount: menuCount, Data:records });
  //   } catch (error) {
  //     return res.status(500).json({status:false,error:error.message});
  //   }
  // };
  
  export const GetAllCountryRouteMap = async (req, res) => {
    try {
      const records = await Country_Route_Map.findAll({
        include: [
          { model: Country, as: 'country' },
          { model: SMSCRoutes, as: 'SMSCRoutes' },
        ],      });
      return res.status(200).json({status:true,Data:records});
    } catch (error) {
      return res.status(500).json({status:false,error:error.message});
    }
  };
  
  // export const DeleteCountryRouteMapByCountryId = async (req, res) => {
  //   try {
  //     const { Country_id } = req.query;
  
  //     // Validate if Country_route_id is provided
  //     if (!Country_id) {
  //       return res.status(400).json({ status:false,error: "Country Route ID is required!" });
  //     }
  
  //     // Find the record by Country_route_id
  //     const CountryRoute = await Country_Route_Map.findOne({
  //       where: { Country_id: Country_id },
  //     });
  
  //     // If the record doesn't exist, return a 404 response
  //     if (!CountryRoute) {
  //       return res
  //         .status(404)
  //         .json({status:false, message: "No record found with the given Country  ID." });
  //     }
  
  //     // Delete the found record
  //     await CountryRoute.destroy();
  
  //     // Send a success response
  //     return res.status(200).json({
  //       status:true,
  //       message: `Country Route Map with ID ${Country_id} deleted successfully.`,
  //     });
  //   } catch (error) {
  //     // Handle and log errors gracefully
  //     console.error("Error in deletion:", error);
  //     return res.status(500).json({status:false,
  //       error: error.message,
  //     });
  //   }
  // };
  
  export const DeleteCountryRouteMap = async (req, res) => {
    try {
      const { country_route_id } = req.body;
  
      // Validate if Country_route_id is provided
      if (!country_route_id) {
        return res.status(400).json({status:false, error: "Country Route ID is required!" });
      }
  
      // Find the record by Country_route_id
      const CountryRoute = await Country_Route_Map.findOne({
        where: { Country_route_id: country_route_id },
      });
  
      // If the record doesn't exist, return a 404 response
      if (!CountryRoute) {
        return res
          .status(404)
          .json({ status:false,message: "No record found with the given Country  ID." });
      }
  
      // Delete the found record
      await CountryRoute.destroy();
  
      // Send a success response
      return res.status(200).json({
        status:true,
        message: `Country Route Map with ID ${country_route_id} deleted successfully.`,
      });
    } catch (error) {
      // Handle and log errors gracefully
      console.error("Error in deletion:", error);
      return res.status(500).json({
        status:false,
        error: error.message,
      });
    }
  };
  
  export const UpdateCountryRouteMap = async (req, res) => {
    try {
      const { country_route_id, country_id, route_id } = req.body;
      if (!country_id || !route_id || !country_route_id) {
        return res.status(400).json({status:false,message:"Fields Are  Required!"});
      }
  
      const record = await Country_Route_Map.findOne({
        where: { country_route_id: country_route_id },
      });
  
      if (!record) {
        return res
          .status(404)
          .json({status:false, error: "Record for UpdateCountryRouteMap  not found" });
      }
  
     const updatedData= await record.update({ country_route_id, country_id, route_id });
      return res
        .status(200)
        .json({status:true, message: "SuccessFully Updated UpdateCountryRouteMap",Data:updatedData });
    } catch (error) {
      return res.status(500).json({status:false,error: error.message });
    }
  };
  