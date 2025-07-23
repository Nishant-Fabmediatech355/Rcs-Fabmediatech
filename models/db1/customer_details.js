import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import CustomerProfile from "./customer_profile.js";

const CustomerDetails = sequelize.define(
  "customer_details",
  {
    details_id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    intro_by: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
    },
    IS_PWDChanged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    apiToken: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: "PK_customer_details",
        unique: true,
        fields: [{ name: "details_id" }],
      },
    ],
  }
);

// Export both model and associate function

// CustomerDetails.belongsTo(CustomerProfile, {
//   foreignKey: "intro_by",
//   as: "introBy",
//   constraints: false,
// });

// CustomerDetails.belongsTo(CustomerProfile, {
//   foreignKey: "customer_id",
//   as: "customer_profile",
//   constraints: false,
// });


export default CustomerDetails;
