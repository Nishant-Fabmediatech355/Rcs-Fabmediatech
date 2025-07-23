import { DataTypes } from "sequelize";
import sequelize from "../../../config/db1.js";
import CustomerProfile from "../customer_profile.js";
import AdminMaster from "../admin_master.js";

export const Service = sequelize.define("service", {
  service_id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
