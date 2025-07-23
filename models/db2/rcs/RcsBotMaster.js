import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";

const RcsBotTypeMaster = sequelize.define(
  "rcs_bot_master",
  {
    rcs_bot_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bot_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
      sequelize,
      schema: "dbo",
      tableName: "rcs_bot_master",
      timestamps: false,
    }
);

export default RcsBotTypeMaster;
