import sequelize from "../../config/db1.js";
import { DataTypes } from "sequelize";
// ---------- PERMISSION ----------
const Permission = sequelize.define(
  "permission",
  {
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // likely needs a PK
      autoIncrement: true,
      allowNull: false,
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
  }
);
   

  export default Permission