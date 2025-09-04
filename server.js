import express from 'express';
import dotenv from 'dotenv';
import mainRouter from './mainRouter.js';
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";
import sequelize from "./config/db1.js";
import http from "http";
import { createLogger } from "./common/logger.js";
import { fileURLToPath } from "url";
// import uploadRoutes from './routes/uploadRoutes.js';
// import{ errorHandler } from './middlewares/errorHandler.js'; 

dotenv.config();
const logger = createLogger("server");
const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 9001;

app.use(
  cors({
    origin: [
      process.env.frontend,
      // "https://smssite.fabmediatech.com",
      "http://localhost:3000",
       "http://192.168.1.41:3000",
      // "https://testf.fabmediatech.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json());

app.use('/rcsImages', express.static(path.join(__dirname, "rcsImages")));

// ✅ Routes AFTER CORS
app.use("/api", mainRouter);
app.get("/", (req, res) => res.send("<h1>Server running</h1>"));
// app.use('/api/upload', uploadRoutes);
// app.use(errorHandler);




// server.listen(PORT, '0.0.0.0', async () => {
//   try {
//    await sequelize.sync({force:false});
//     console.log("Database connected successfully");

//     // await Amodel.create({
//     //   customer_id: 1,
//     //   smsText: "kjfhgj jkhkdgjf",
//     //   template_id: 1,
//     // });
//    console.log(`✅ Server running at http://localhost:${PORT}`);
//   } catch (err) {
//     // logger.error("❌ Server startup error:", {err:err.message});
//     console.error("❌ Server startup error:", { err: err });
//   }
// });


server.listen(PORT, '0.0.0.0', async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ force: false });
    console.log(`✅ Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Server startup error:", { err: err.message });
  }
});
