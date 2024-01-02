import Container from "@mui/joy/Container";
import { Route, Routes } from "react-router-dom";
import CartsPage from "../../pages/Carts/CartsPage";
import HomePage from "../../pages/HomePage";
import LogInPage from "../../pages/LogInPage";
import MenuPage from "../../pages/Menu/MenuPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ProfilesPage from "../../pages/ProfilesPage";
import SignUpPage from "../../pages/SignUp/SignUpPage";

/** UI component for the routes of the application. */
const AppRoutes = () => {
  return (
    <Container
      id="AppRoutes"
      style={{ padding: "1% 0%", margin: "0% 5%" }}
      sx={{ minWidth: "90%" }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/carts" element={<CartsPage />} />
        <Route path="/menu/:vendorId" element={<MenuPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
};

export default AppRoutes;
