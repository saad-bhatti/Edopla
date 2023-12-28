import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT!;

// Attempt to connect to MongoDB
mongoose
  .connect(env.DATABASE_URL)
  .then(() => {
    // Log the flags
    for (let i = 2; i < process.argv.length; i++) {
      const flag = process.argv[i].split("=")[0];
      const value = process.argv[i].split("=")[1];
      console.log(`${flag}: ${value}`);
    }

    // Log the database connection
    console.log("Connected to the database");

    // Start the server
    app.listen(port!, () => {
      // Log the server port
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(console.error);
