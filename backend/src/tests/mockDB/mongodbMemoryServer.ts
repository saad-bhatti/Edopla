import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

/** A singleton class to manage the MongoDB memory server. */
let mongoServer: MongoMemoryServer;

/**
 * Function to connect to the in-memory mongodb database.
 * Note: Closes previous connection before establishing a new one.
 */
export const connect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error(error);
  }
};

/** Function to remove all data from collections. */
export const clear = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

/** Function to remove and close the database and server. */
export const close = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
