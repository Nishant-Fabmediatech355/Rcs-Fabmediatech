import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";

const ResellerProfile= sequelize.define('reseller_profile', {
    reseller_id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    reseller_domain: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    customer_id: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      defaultValue: 1
    },
    reseller_header: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    reseller_footer: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    reseller_logo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    TM_ID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TM_ID_type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "aggregator"
    }
  }, {
    sequelize,
    tableName: 'reseller_profile',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_reseller_profile",
        unique: true,
        fields: [
          { name: "reseller_id" },
        ]
      },
    ]
  });
export default ResellerProfile;
