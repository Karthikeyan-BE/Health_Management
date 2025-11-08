import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGODB_URI);
    console.log(con.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB
