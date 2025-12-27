import mongoose from "mongoose"
import * as dotenv from "dotenv"

dotenv.config()
 
main().catch(err => console.log(err));

async function main() {

  const MONGODB_URI = process.env.MONGODB_URI

  if(!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in .env file");
  }

  await mongoose.connect(MONGODB_URI);
}