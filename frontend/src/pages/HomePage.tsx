import { Container } from "react-bootstrap";
import HomePageLoggedInView from "../components/view/HomePageLoggedInView";
import HomePageLoggedOutView from "../components/view/HomePageLoggedOutView";
import { User } from "../models/users/user";

/** "Type" for the props of the home page. */
interface HomePageProps {
  loggedInUser: User | null;
}

/** UI for the home page, depending on user's login status. */
const NotesPage = ({ loggedInUser }: HomePageProps) => {
  return (
    <Container>
      <>{loggedInUser ? <HomePageLoggedInView /> : <HomePageLoggedOutView />}</>
    </Container>
  );
};

export default NotesPage;
