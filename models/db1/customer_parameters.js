import { DataTypes } from "sequelize";
import sequelize from "../../config/db1.js";

const CustomerParameters = sequelize.define(
  "customer_parameters",
  {
    custParam_id: {
      autoIncrement: true,
      type: DataTypes.DECIMAL(18, 0),
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
    },
    is_loginOTP_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phNo_greater_than: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    deduct_percent: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    deduct_id: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    od_balance: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
      defaultValue: 0,
    },
    check_balance: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
      defaultValue: 0,
    },
    isFailed_refund: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        name: "PK_customer_parameters",
        unique: true,
        fields: [{ name: "custParam_id" }],
      },
    ],
  }
);

CustomerParameters.addHook("beforeSave", (instance) => {
  const balance = parseFloat(instance.balance) || 0;
  const od_balance = parseFloat(instance.od_balance) || 0;
  instance.check_balance = balance + od_balance;
});

export default CustomerParameters;
