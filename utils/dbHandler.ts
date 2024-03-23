import mongoose from "mongoose";

const username = "root";
const password = "root";
const host = "localhost";
const port = 27017;
const database = "my_db";

export function connectDatabase() {
  mongoose.connect(`mongodb://${username}:${password}@${host}:${port}`);
}
