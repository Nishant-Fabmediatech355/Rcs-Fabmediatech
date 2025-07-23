import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import CustomerProfile from "../../db1/customer_profile.js";
import RcsBotTypeMaster from "./RcsBotTypeMaster.js";
import { timeStamp } from "console";
// import RcsTemplateMaster from "./RcsTemplateMaster.js"

const RcsCustomerBotMaster = sequelize.define(
  "rcs_customer_bot_master",
  {
    rcs_customer_bot_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      references: {
        model: CustomerProfile,
        key: "customer_id",
      },
    },
    bot_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
    rcs_bot_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: RcsBotTypeMaster,
        key: "rcs_bot_type_id",
      },
    },
    agent_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
    route_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  },
  {
    sequelize,
    schema: "dbo",
    tableName: "rcs_customer_bot_master",
    timestamps: false,
  }
);
RcsCustomerBotMaster.belongsTo(CustomerProfile, {
  foreignKey: "customer_id",
  as: "customer_profile",
  onDelete: "SET NULL",
});
RcsCustomerBotMaster.belongsTo(RcsBotTypeMaster, {
  foreignKey: "rcs_bot_type_id",
  as: "rcs_bot_type_master",
  onDelete: "SET NULL",
});

// Nishant
// RcsCustomerBotMaster.hasMany(RcsTemplateMaster, {
//   foreignKey: 'rcs_customer_bot_id',
//   as: 'templates'
// });
// RcsCustomerBotMaster.belongsTo(CustomerProfile, { foreignKey: 'customer_id', as: 'customerProfile' });
// RcsCustomerBotMaster.belongsTo(RcsBotTypeMaster, { foreignKey: 'rcs_bot_type_id', as: 'botType' });

export default RcsCustomerBotMaster;
