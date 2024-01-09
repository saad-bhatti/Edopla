import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import morgan from "morgan";
import { Http_Error, NotFound } from "../errors/http_errors";
import { requiresBuyer } from "../middleware/auth";
import cartsRoutes from "../routes/items/carts";
import menusRoutes from "../routes/items/menus";
import ordersRoutes from "../routes/items/orders";
import buyersRoutes from "../routes/users/buyers";
import usersRoutes from "../routes/users/users";
import vendorsRoutes from "../routes/users/vendors";
import env from "../util/validateEnv";

// Initialize the app
const testApp = express();

// Add middleware to log HTTP requests
testApp.use(morgan("dev"));

// Add middleware to parse JSON bodies of requests
testApp.use(express.json());

// Add middleware to enable CORS
testApp.use(cors());

// Add middleware to set-up & handle sessions
testApp.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    rolling: true,
    store: MongoStore.create({ // Continue to store sessions in the database
      mongoUrl: env.DATABASE_URL,
      collectionName: "sessions",
    }),
  })
);

// Add middleware to handle routes
testApp.use("/api/users", usersRoutes);
testApp.use("/api/vendors", vendorsRoutes);
testApp.use("/api/menus", menusRoutes);
testApp.use("/api/buyers", buyersRoutes);
testApp.use("/api/carts", requiresBuyer, cartsRoutes);
testApp.use("/api/orders", ordersRoutes);

// Catch invalid routes
testApp.use((req, res, next) => {
  next(new NotFound("Endpoint"));
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
testApp.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // Initialize to internal server error
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  // If the error is an HTTP error, set the status code and message
  if (error instanceof Http_Error) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default testApp;
