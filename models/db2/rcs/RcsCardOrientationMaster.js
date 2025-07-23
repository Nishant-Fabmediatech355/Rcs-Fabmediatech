import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsCardOrientationMaster = sequelize.define(
  "rcs_card_orientation_master",
  {
    card_orientation_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_orientation_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default RcsCardOrientationMaster;
