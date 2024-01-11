/**************************************************************************************************
 * This file contains the available routes for the application.                                   *
 **************************************************************************************************/

import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import BuyerPage from "../pages/Buyer/BuyerPage";
import CartsPage from "../pages/Carts/CartsPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import HomePage from "../pages/Home/HomePage";
import LogInPage from "../pages/LogInPage";
import MenuPage from "../pages/Menu/MenuPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilesPage from "../pages/ProfilesPage";
import SignUpPage from "../pages/SignUpPage";
import { UserContext, UserContextProps } from "../utils/contexts";
import BuyerProtectedRoute from "./BuyerProtectedRoute";
import UserProtectedRoute from "./UserProtectedRoute";

/** UI component for the routes of the application. */
const AppRoutes = () => {
  // Retrieve the logged in user.
  const { user: loggedInUser } = useContext<UserContextProps | null>(UserContext) || {};

  return (
    <Routes>
      {/* Routes accessible to all users. */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LogInPage />} />

      {/* Routes accessible to logged in users. */}
      <Route
        path="/profiles"
        element={
          <UserProtectedRoute user={loggedInUser}>
            <ProfilesPage />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/menu/:vendorId"
        element={
          <UserProtectedRoute user={loggedInUser}>
            <MenuPage />
          </UserProtectedRoute>
        }
      />

      {/* Routes accessible to users with a buyer profile. */}
      <Route
        path="/buy"
        element={
          <BuyerProtectedRoute user={loggedInUser}>
            <BuyerPage />
          </BuyerProtectedRoute>
        }
      />
      <Route
        path="/carts"
        element={
          <BuyerProtectedRoute user={loggedInUser}>
            <CartsPage />
          </BuyerProtectedRoute>
        }
      />

      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
