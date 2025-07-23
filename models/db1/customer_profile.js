import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import AdminMaster from "./admin_master.js";
import CustomerParameters from "./customer_parameters.js";
import CustomerDetails from "./customer_details.js";

const CustomerProfile = sequelize.define(
  "customer_profile",
  {
    customer_id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      primaryKey: true,
    },
    customer_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    customer_add1: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    customer_add2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    PIN: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    aadhar: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    PAN: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    aadharImage: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    PANImage: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    customer_email: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    customer_mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    mobilesForOTP: {
      type: DataTypes.STRING(500),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("mobilesForOTP");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        const formattedValue = Array.isArray(value)
          ? value.join(",")
          : value || "";
        this.setDataValue("mobilesForOTP", formattedValue);
      },
    },
    account_manager_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "AdminMaster",
        key: "admin_id",
      },
    },
  },
  {
   
    timestamps: true,
    indexes: [
      {
        name: "PK_customer_profile",
        unique: true,
        fields: [{ name: "customer_id" }],
      },
    ],
  }
);


export default CustomerProfile;

