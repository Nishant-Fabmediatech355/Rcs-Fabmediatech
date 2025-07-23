import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import { Service } from "./service/Services.js";

const SMSCRoutes = sequelize.define(
  "SMSCRoutes",
  {
    route_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    routeSMPPName: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    routeIP: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    routePort: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    routeDisplayName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "SMSCRoutes",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_SMSCRoutes",
        unique: true,
        fields: [{ name: "route_id" }],
      },
    ],
  }
);
SMSCRoutes.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
  onDelete: "CASCADE",
});
export default SMSCRoutes;
