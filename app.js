import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

let envFile = ".env";

dotenv.config({
  path: envFile,
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const db = mongoClient.db(process.env.DB_NAME);

const app = express();

app.use(cors());
app.use(express.json());

//HEALTH
app.get("/health", async (req, res) => {
  res.sendStatus(200);
});

//TEST
app.get("/test", async (req, res) => {
  try {
    const collection = db.collection("test");
    const response = await collection.find({}).toArray();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/test", async (req, res) => {
  try {
    const response = await db
      .collection("test")
      .insertOne({ test: "pai ta on!" });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}.
  Server running at ${process.env.NODE_ENV} mode`);
});
