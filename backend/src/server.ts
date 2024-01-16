import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

// Log the flags
for (let i = 2; i < process.argv.length; i++) {
  const flag = process.argv[i].split("=")[0];
  const value = process.argv[i].split("=")[1];
  console.log(`index: ${i}, flag: ${flag}, value: ${value}`);
}

const isTest = process.argv[2].split("=")[1] === "test";
const databaseUrl = !isTest ? env.DATABASE_URL : env.TEST_DATABASE_URL;
const port = !isTest ? env.PORT : env.TEST_PORT;

// Attempt to connect to MongoDB
mongoose
  .connect(databaseUrl)
  .then(() => {
    // Start the server
    app.listen(port, () => {
      // Log the server port
      console.log(`${!isTest ? "Dev" : "Test"} server listening at http://localhost:${port!}`);
    });
  })
  .catch(console.error);
