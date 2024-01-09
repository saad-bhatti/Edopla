import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

// Attempt to connect to MongoDB
mongoose
  .connect(env.DATABASE_URL)
  .then(() => {
    // Log the flags
    for (let i = 2; i < process.argv.length; i++) {
      const flag = process.argv[i].split("=")[0];
      const value = process.argv[i].split("=")[1];
      console.log(`index: ${i}, flag: ${flag}, value: ${value}`);
    }

    // Start the server
    app.listen(env.PORT!, () => {
      // Log the server port
      console.log(`Server listening at http://localhost:${env.PORT!}`);
    });
  })
  .catch(console.error);
