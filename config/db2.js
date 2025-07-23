
// export const db1 = new Sequelize(process.env.DB1_NAME, process.env.DB1_USER, process.env.DB1_PASS, {
//   host: process.env.DB1_HOST,
//   dialect: 'mssql',
//   logging: false,
// });

import { Sequelize } from "sequelize";

const db2 = new Sequelize("mediatech_rcs", "mediatech2", "mediatech@123", {
  host: "127.0.0.1", //  49.50.64.35 || 127.0.0.1
  dialect: "mssql",
  port: 1433,
  logging: false,
  timezone: "+05:30",
  pool: {
    max: 50,
    min: 5,
    acquire: 60000, 
    idle: 10000,
  },
  dialectOptions: {
    useUTC: false,

    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 60000, // Increase timeout for long-running queries
      dateFirst: 1,
    },
  },
  define: {
    timestamps: true, 
    underscored: false, 
    freezeTableName: true,
  },
});

export default db2;

