import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT!;

// Attempt to connect to MongoDB
mongoose
  .connect(env.DATABASE_URL)
  .then(() => {
    console.log("Connected to the database");
    app.listen(port!, () => {
      // Start the server
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(console.error);
