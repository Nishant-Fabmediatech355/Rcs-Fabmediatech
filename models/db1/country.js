import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";

const Country = sequelize.define('country', {
  country_id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Country_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  CountryCode: {
    type: DataTypes.CHAR(10),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'country',
  schema: 'dbo',
  timestamps: false,
  indexes: [
    {
      name: "PK_country",
      unique: true,
      fields: [
        { name: "country_id" },
      ]
    },
  ]
});

export default Country;
