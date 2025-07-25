import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsTemplateMaster from "./RcsTemplateMaster.js";
import RcsCardOrientationMaster from "./RcsCardOrientationMaster.js";
import RcsTemplateCategoryMaster from "./RcsTemplateCategoryMaster.js";

const RcsRichCardTemplate = sequelize.define(
  "rcs_rich_card_template",
  {
    rcs_rich_card_template_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_orientation: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image_file_path: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    media_details: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    card_title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    card_description: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    rcs_template_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    schema:"dbo",
    tableName:"rcs_rich_card_template"
  }
);

RcsRichCardTemplate.belongsTo(RcsTemplateMaster, {
  foreignKey: "rcs_template_id",
  as: "rcs_template_master",
});

RcsRichCardTemplate.belongsTo(RcsTemplateCategoryMaster, {
  foreignKey: "rcs_template_category_id",
  as: "rcs_template_category_master",
});

export default RcsRichCardTemplate;
