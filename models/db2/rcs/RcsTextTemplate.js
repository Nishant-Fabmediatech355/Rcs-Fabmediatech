import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsTemplateMaster from "./RcsTemplateMaster.js";

const RcsTextTemplate = sequelize.define(
  "rcs_text_template",
  {
    rcs_text_template_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_text: {
      type: DataTypes.STRING(4000),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
RcsTextTemplate.belongsTo(RcsTemplateMaster, {
  foreignKey: "rcs_template_id",
  as: "rcs_template_master",
});
export default RcsTextTemplate;
