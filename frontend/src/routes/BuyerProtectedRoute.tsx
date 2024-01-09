/**************************************************************************************************
 * This file creates a custom wrapper component for routes requiring a buyer profile.             *
 **************************************************************************************************/

import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../models/users/user";

/** Props for the protected routes. */
interface ProtectedRouteProps {
  user: User | null | undefined;
  children: React.ReactNode;
}

/** Buyer protected route component. */
const BuyerProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  // If the user does not have a buyer profile, redirect to the forbidden page.
  if (!user || !user._buyer) return <Navigate to="/forbidden" replace />;

  // Otherwise, return the child.
  return <>{children}</>;
};

export default BuyerProtectedRoute;
