import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import Role from "./role.js";

const AdminMaster = sequelize.define(
  "AdminMaster",
  {
    admin_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    admin_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin_pic: {
      type: DataTypes.STRING,
    },
    admin_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_pwd: {
      type: DataTypes.STRING,
    },
    access_token: {
      type: DataTypes.STRING,
    },
    is_Active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    session_duration: {
      type: DataTypes.STRING,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'AdminMaster',
    schema: "dbo",
    indexes: [
      {
        unique: true,
        fields: ["admin_name"],
      },
    ],
  }
);

// Associations
// AdminMaster.belongsTo(Permission, { foreignKey: "permission_id", as: "permission"});

AdminMaster.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

export default AdminMaster;
