import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import tipsRoutes from "./routes/tips.js";

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set DATABASE_URL and a JWT_SECRET of at least 32 characters in .env");
}

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || false }));
app.use(express.json({ limit: "20kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

app.get("/health", (_req, res) => res.json({ status: "ok", app: "4U'S TIPS API" }));
app.use("/api/auth", authRoutes);
app.use("/api/tips", tipsRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`4U'S TIPS API running on port ${port}`));
