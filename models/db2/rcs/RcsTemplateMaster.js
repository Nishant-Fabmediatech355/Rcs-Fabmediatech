import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsCustomerBotMaster from "./RcsCustomerBotMaster.js";
import RcsTemplateCategoryMaster from "./RcsTemplateCategoryMaster.js";
import RcsTemplateTypeMaster from "./RcsTemplateTypeMaster.js";

const RcsTemplateMaster = sequelize.define(
  "rcs_template_master",
  {
    rcs_template_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_customer_bot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    template_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
     isActive: {
      type: DataTypes.INTEGER,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
  sequelize,
  schema: "dbo",
  tableName: "rcs_template_master",  
  freezeTableName: true,        
  timestamps: true,
  }
);
RcsTemplateMaster.belongsTo(RcsCustomerBotMaster, {
  foreignKey: "rcs_customer_bot_id",
  as: "rcs_customer_bot_master",
});
RcsTemplateMaster.belongsTo(RcsTemplateCategoryMaster, {
  foreignKey: "rcs_template_category_id",
  as: "rcs_template_category_master",
});

RcsTemplateMaster.belongsTo(RcsTemplateTypeMaster, {
  foreignKey: "rcs_template_type_id",
  as: "rcs_template_type_master",
});

export default RcsTemplateMaster;
