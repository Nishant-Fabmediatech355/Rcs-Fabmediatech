import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsButtonActionTypeMaster = sequelize.define(
  "rcs_button_action_type_master",
  {
    button_action_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default RcsButtonActionTypeMaster;
