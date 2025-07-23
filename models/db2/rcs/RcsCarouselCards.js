import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsCarouselTemplate from "./RcsCarouselTemplate.js";

const RcsCarouselCards = sequelize.define(
  "rcs_carousel_cards",
  {
    carousel_card_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_carousel_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    card_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_file_path: {
      type: DataTypes.STRING(200),
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
  },
  {
    sequelize,
    schema: "dbo",
    tableName: "rcs_carousel_cards",
    timestamps: false,
  }
);

// RcsCarouselCards.belongsTo(RcsCarouselTemplate, {
//   foreignKey: "rcs_carousel_template_id",
//   as: "rcs_carousel_template",
// });

export default RcsCarouselCards;
