import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import ConnectDB from "../config/db.js";

dotenv.config();
ConnectDB();

//create express server and HTTP server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
   })
);

app.get("/", (req, res) => {
   res.send("hello server");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
