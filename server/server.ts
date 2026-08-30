import "dotenv/config";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

const PORT = Number(process.env.PORT) || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(DATABASE_URL);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;

    res.status(200).json({
      message: "Server and database are working",
      database: result[0].version,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const startServer = async () => {
  try {
    await sql`SELECT 1`;

    console.log("✅ Connected to Neon PostgreSQL successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();