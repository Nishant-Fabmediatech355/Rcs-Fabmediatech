import Country from "../../../models/db1/country.js";
import Customer_Country_MAP from"../../../models/db1/customer_country_MAP.js"
import CustomerProfile from "../../../models/db1/customer_profile.js";
import SMSCRoutes from "../../../models/db1/SMSCRoutes.js";
// Crud Apis for Customer_Country_MAP ------------------------------------------------------------------------------------------------
// Create
export const CreateCustomerCountryMap = async (req, res) => {
    try {
      const { customer_id, country_id,sms_rates,dlt_rates, route_id } = req.body;
  
      if (!customer_id || !country_id  || !route_id || !sms_rates || !dlt_rates) {
        return res.status(400).json({ status:false,error: "All fields are required." });
      }
      const newRecord = await Customer_Country_MAP.create({
        customer_id,
        country_id,
        sms_rates,
        dlt_rates,
        route_id,
      });
      res.status(201).json({status:true,message:"Records fetched !",Data:newRecord});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status:false,
        error: error.message,
      });
    }
  };
  
  // Read (Get all customer Country maps with associated data)
export const GetAllCustomerCountryMap = async (req, res) => {
    try {
      
      const records = await Customer_Country_MAP.findAll({
        include: [
          {
            model: CustomerProfile,
            as: 'customer_profile', 
          },
          { model: Country,
            as: 'country', 
             },
          {
            model: SMSCRoutes,
            as: 'SMSCRoutes', 
          },
        ],
      });
      res.status(200).json({status:true,Data:records});
    } catch (error) {
      res.status(400).json({ status:false ,error: error.message });
    }
  };
  
  // Read (Get single record by ID)
  export const GetOneCustomerCountryMap = async (req, res) => {
    try {
        const{customer_id}=req.query
        if(!customer_id){
            return res.status(404).json({ status:false, error: "Query not found For Result!" });

        }
      const record = await Customer_Country_MAP.findByPk(customer_id, {
        include: [
            {
              model: CustomerProfile,
              as: 'customer_profile', 
            },
            { model: Country,
              as: 'country', 
               },
            {
              model: SMSCRoutes,
              as: 'SMSCRoutes', 
            },
          ],
      });
      if (!record) {
        return res.status(404).json({ status:false, error: "Record not found" });
      }
      res.status(200).json({status:true,message:"Record Fetched",Data:record});
    } catch (error) {
      res.status(400).json({ status:false ,error: error.message });
    }
  };
  
  // Update
  export const UpdateCustomerCountryMap = async (req, res) => {
    try {
        const{id}=req.query
        if(!id){
            return res.status(404).json({ status:false, error: "Query not found For Result!" });
        }
      const record = await Customer_Country_MAP.findByPk(id);
      if (!record) {
        return res.status(404).json({ status:false, error: "Record not found" });
      }
      await record.update(req.body);
      res.status(200).json({status:true, Data:record});
    } catch (error) {
      res.status(400).json({  status:false,error: error.message });
    }
  };
  
  // Delete
  export const DeleteCustomerCountryMap = async (req, res) => {
    try {
        const{id}=req.query
        if(!id){
            return res.status(404).json({ status:false, error: "Query not found For Result!" });
        }
      const record = await Customer_Country_MAP.findByPk(id);
      if (!record) {
        return res.status(404).json({ status:false ,error: "Record not found" });
      }
      await record.destroy();
      return res.status(204).json({status:true,message:"Record Deleted!"});
    } catch (error) {
      return res.status(400).json({  status:false,error: error.message });
    }
  };