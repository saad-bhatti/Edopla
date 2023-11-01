import mongoose from 'mongoose';

declare module 'express-session' {
  interface SessionData {
    userId: mongoose.Types.ObjectId;
    buyerId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
  }
}