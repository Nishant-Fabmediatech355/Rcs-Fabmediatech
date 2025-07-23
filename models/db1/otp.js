import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import CustomerProfile from "./customer_profile.js";
import AdminMaster from "./admin_master.js";

const OTP = sequelize.define(
  "otp",
  {
    otp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default OTP;
