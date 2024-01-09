/**************************************************************************************************
 * This file creates a custom wrapper component for routes requiring a user profile.              *
 **************************************************************************************************/

import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../models/users/user";

/** Props for the protected routes. */
interface ProtectedRouteProps {
  user: User | null | undefined;
  children: React.ReactNode;
}

/** User protected route component. */
const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  // If the user is not logged in, redirect to the forbidden page.
  if (!user) return <Navigate to="/forbidden" replace />;

  // Otherwise, return the child.
  return <>{children}</>;
};

export default UserProtectedRoute;
