import sequelize from "../../config/db1.js";
import { DataTypes } from "sequelize";
// ---------- ROLE ----------
const Role = sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["role_name"],
      },
    ],
  }
);

export default  Role