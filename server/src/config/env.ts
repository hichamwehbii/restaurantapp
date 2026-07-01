import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

export const MONGO_URI = mongoUri;
export const PORT = process.env.PORT || "5000";
