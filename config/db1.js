import { Sequelize } from "sequelize";

const db1 = new Sequelize("mediatech2", "mediatech2", "mediatech@123", {
  host: "127.0.0.1", //  49.50.64.35 || 127.0.0.1
  dialect: "mssql",
  port: 1433,
  logging: false,
  timezone: "+05:30",
  pool: {
    max: 50, // Increased connection pool size
    min: 5,
    acquire: 60000, // Time Sequelize will try to get a connection before throwing error
    idle: 10000, // Time before releasing idle connections
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
    timestamps: true, // Enable automatic timestamps globally
    underscored: false, // Set true if you prefer snake_case
    freezeTableName: true, // Prevent pluralization
  },
});

export default db1;

