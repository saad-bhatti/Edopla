import Container from "@mui/joy/Container";
import { Route, Routes } from "react-router-dom";
import CartsPage from "../../pages/Carts/CartsPage";
import HomePage from "../../pages/HomePage";
import MenuPage from "../../pages/Menu/MenuPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ProfilesPage from "../../pages/ProfilesPage";

/** UI component for the routes of the application. */
const AppRoutes = () => {
  return (
    <Container sx={{padding: "1% 0"}}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/carts" element={<CartsPage />} />
        <Route path="/menu/:vendorId" element={<MenuPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
};

export default AppRoutes;
