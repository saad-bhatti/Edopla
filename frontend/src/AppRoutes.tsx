/**************************************************************************************************
 * This file contains the available routes for the application.                                   *
 **************************************************************************************************/
import { Route, Routes } from "react-router-dom";
import BuyerPage from "./pages/Buyer/BuyerPage";
import CartsPage from "./pages/Carts/CartsPage";
import HomePage from "./pages/Home/HomePage";
import LogInPage from "./pages/LogInPage";
import MenuPage from "./pages/Menu/MenuPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilesPage from "./pages/ProfilesPage";
import SignUpPage from "./pages/SignUp/SignUpPage";

/** UI component for the routes of the application. */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/buy" element={<BuyerPage />} />
      <Route path="/profiles" element={<ProfilesPage />} />
      <Route path="/carts" element={<CartsPage />} />
      <Route path="/menu/:vendorId" element={<MenuPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
