"use strict";

const { MongoClient } = require("mongodb");

const MONGO_URL =
  "mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.gxluysn.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity";

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to the database...");
    console.log("MONGO_URL ", MONGO_URL);

    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("nodebucket");
    console.log("Connected to database");

    await operations(db);
    console.log("Operation was successful");

    client.close();
    console.log("Disconnected from database");
  } catch (err) {
    const error = new Error("Error connecting to the database:", err);
    error.status = 500;
    console.error("Error connecting to database:", err);
    next(error);
  }
};

module.exports = { mongo };
