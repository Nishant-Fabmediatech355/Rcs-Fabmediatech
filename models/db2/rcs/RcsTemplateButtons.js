import { DataTypes } from "sequelize";
import sequelize from "../../../config/db2.js";
import RcsTemplateMaster from "./RcsTemplateMaster.js";
import RcsButtonActionTypeMaster from "./RcsButtonActionTypeMaster.js";
import moment from "moment";

const RcsTemplateButtons = sequelize.define(
  "rcs_template_buttons",
  {
    rcs_button_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rcs_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    button_action_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    suggestion_text: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    suggestion_postback: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    button_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url_action_application: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dialer_action_Phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
   
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
     longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    location_query: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    calendar_start_date_time: {
  type: DataTypes.DATE,
  allowNull: true
},
calendar_end_date_time: {
  type: DataTypes.DATE,
  allowNull: true
},
calendar_start_date_time: {
  type: DataTypes.DATEONLY, // Changed from DATE to DATEONLY
  allowNull: true,
  get() {
    const value = this.getDataValue('calendar_start_date_time');
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
  },
  set(value) {
    this.setDataValue(
      'calendar_start_date_time',
      value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null
    );
  }
},
calendar_end_date_time: {
  type: DataTypes.DATEONLY,
  allowNull: true,
  get() {
    const value = this.getDataValue('calendar_end_date_time');
    return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
  },
  set(value) {
    this.setDataValue(
      'calendar_end_date_time',
      value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null
    );
  }
},

// calendar_start_date_time: {
//   type: DataTypes.DATE,
//   allowNull: true,
// },
// calendar_end_date_time: {
//   type: DataTypes.DATE,
//   allowNull: true,
// },
    calendar_title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    calendar_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  
  },
  
  {
    timestamps: false,
  }
);

RcsTemplateButtons.belongsTo(RcsTemplateMaster, {
  foreignKey: "rcs_template_id",
  as: "rcs_template_master",
});
RcsTemplateButtons.belongsTo(RcsButtonActionTypeMaster, {
  foreignKey: "button_action_id",
  as: "rcs_button_action_type_master",
});

// RcsTemplateButtons.belongsTo(RcsButtonActionTypeMaster, { foreignKey: 'button_action_id', as: 'buttonAction' });


export default RcsTemplateButtons;
