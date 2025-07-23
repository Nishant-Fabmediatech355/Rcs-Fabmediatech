import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsCardWidthMaster from "./RcsCardWidthMaster.js";
import RcsMediaHeightMaster from "./RcsMediaHeightMaster.js";
import RcsCarouselCards from "./RcsCarouselCards.js";
import RcsTemplateMaster from "./RcsTemplateMaster.js";

const RcsCarouselTemplate = sequelize.define(
  "rcs_carousel_template",
  {
    rcs_carousel_template_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_width: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    rcs_media_height: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    schema: "dbo",
    tableName: "rcs_carousel_template",
    freezeTableName: true,   
    timestamps: false,
  }
);

RcsCarouselTemplate.belongsTo(RcsTemplateMaster, {
  foreignKey: "rcs_template_id",
  as: "rcs_template_master",
});

// RcsCarouselTemplate.hasMany(RcsCarouselCards, {
//   foreignKey: "carousel_card_id",
//   as: "rcs_carousel_cards",
// });
RcsCarouselTemplate.hasMany(RcsCarouselCards, {
  foreignKey: "rcs_carousel_template_id",
  as: "rcs_carousel_cards",
});
// RcsCarouselTemplate.hasMany(RcsCarouselCards, { foreignKey: 'rcs_carousel_template_id', as: 'carouselCards' });

export default RcsCarouselTemplate;
