import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import { requiresBuyer } from "./middleware/auth";
import cartsRoutes from "./routes/items/carts";
import menusRoutes from "./routes/items/menus";
import ordersRoutes from "./routes/items/orders";
import buyersRoutes from "./routes/users/buyers";
import usersRoutes from "./routes/users/users";
import vendorsRoutes from "./routes/users/vendors";
import env from "./util/validateEnv";

// Initialize the app
const app = express();

// Add middleware to log HTTP requests
app.use(morgan("dev"));

// Add middleware to parse JSON bodies of requests
app.use(express.json());

// Add middleware to set-up & handle sessions
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.DATABASE_URL,
      collectionName: "sessions",
    }),
  })
);

// Add middleware to handle routes
app.use("/api/users", usersRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/menus", menusRoutes);
app.use("/api/buyers", buyersRoutes);
app.use("/api/carts", requiresBuyer, cartsRoutes);
app.use("/api/orders", ordersRoutes);

// Catch invalid routes
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  // Initialize to internal server error
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  // If the error is an HTTP error, set the status code and message
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
