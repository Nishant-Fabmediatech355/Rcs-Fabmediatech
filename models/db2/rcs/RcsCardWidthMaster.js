import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsCardWidthMaster = sequelize.define(
  "rcs_card_width_master",
  {
    card_width_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    card_width: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default RcsCardWidthMaster;
