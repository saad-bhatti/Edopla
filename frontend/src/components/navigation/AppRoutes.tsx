import { Route, Routes } from "react-router-dom";
import BuyPage from "../../pages/Buy/BuyPage";
import CartsPage from "../../pages/Carts/CartsPage";
import HomePage from "../../pages/Home/HomePage";
import LogInPage from "../../pages/LogInPage";
import MenuPage from "../../pages/Menu/MenuPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ProfilesPage from "../../pages/ProfilesPage";
import SignUpPage from "../../pages/SignUp/SignUpPage";

/** Define styles for the page containers. */
const style = {
  padding: "1% 0%",
  margin: "0% 5%",
};

/** Define sx prop for the page containers. */
const sx = {
  minWidth: "90%",
};

/** UI component for the routes of the application. */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage style={style} sx={sx} />} />
      <Route path="/login" element={<LogInPage style={style} sx={sx} />} />
      <Route path="/buy" element={<BuyPage style={style} sx={sx} />} />
      <Route path="/profiles" element={<ProfilesPage style={style} sx={sx} />} />
      <Route path="/carts" element={<CartsPage style={style} sx={sx} />} />
      <Route path="/menu/:vendorId" element={<MenuPage style={style} sx={sx} />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
