import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsTemplateTypeMaster = sequelize.define(
  "rcs_template_type_master",
  {
    rcs_template_type_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default RcsTemplateTypeMaster;
