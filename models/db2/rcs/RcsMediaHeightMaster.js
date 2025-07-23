import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsMediaHeightMaster = sequelize.define(
  "rcs_media_height_Master",
  {
    rcs_media_height_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    media_height: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default RcsMediaHeightMaster;
