import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";
import CustomerProfile from "./customer_profile.js";
import Country from "./country.js";
import SMSCRoutes from "./SMSCRoutes.js";
import { Service } from "./service/Services.js";

const CustomerCountryMap = sequelize.define(
  "customer_country_MAP",
  {
    customer_country_id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      references: {
        model: CustomerProfile,
        key: "customer_id",
      },
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Country,
        key: "country_id",
      },
    },
    sms_rates: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
      defaultValue: 0,
    },
    dlt_rates: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
      defaultValue: 0,
    },
    country_rates: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    route_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SMSCRoutes,
        key: "route_id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    amAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "customer_country_MAP",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_customer_country_MAP",
        unique: true,
        fields: [{ name: "customer_country_id" }],
      },
    ],
  }
);

// // Define associations
CustomerCountryMap.belongsTo(CustomerProfile, {
  foreignKey: "customer_id",
  as: "customer_profile",
  constraints: false,
});
CustomerCountryMap.belongsTo(Country, {
  foreignKey: "country_id",
  as: "country",
  constraints: false,
});
CustomerCountryMap.belongsTo(SMSCRoutes, {
  foreignKey: "route_id",
  as: "SMSCRoutes",
  constraints: false,
});
CustomerCountryMap.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
  constraints: false,
});
// Hook to update `country_rates` before inserting or updating
CustomerCountryMap.addHook("beforeCreate", (instance) => {
  instance.country_rates =
    parseFloat(instance.sms_rates) + parseFloat(instance.dlt_rates);
});

CustomerCountryMap.addHook("beforeUpdate", (instance) => {
  instance.country_rates =
    parseFloat(instance.sms_rates) + parseFloat(instance.dlt_rates);
});

export default CustomerCountryMap;
