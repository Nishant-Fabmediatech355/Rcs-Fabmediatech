import { Service } from "../models/service/Services.js";

export const Insertservice = async (req, res) => {
  try {
    const [service, created] = await Service.findOrCreate({
      where: { service_name: "SMS" },
      defaults: { service_name: "SMS" },
    });
    // console.log({ service });

    return console.log(
      created ? "Country created successfully" : "Country already exists"
    );
  } catch (error) {
    console.log({ error: error.message });
  }
};
