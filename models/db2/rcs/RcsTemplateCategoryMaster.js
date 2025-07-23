import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import CustomerProfile from "../../db1/customer_profile.js";

const RcsTemplateCategoryMaster = sequelize.define(
  "rcs_template_category_master",
  {
    rcs_template_category_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      references: {
        model: CustomerProfile,
        key: "customer_id",
      },
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

RcsTemplateCategoryMaster.belongsTo(CustomerProfile, {
  foreignKey: "customer_id",
  as: "customer_profile",
  onDelete: "SET NULL",
});

export default RcsTemplateCategoryMaster;
