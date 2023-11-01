import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import styles from "../styles/NotesPage.module.css";
import { User } from "../models/user";

// "Type" for the props of the notes page
interface NotesPageProps {
  loggedInUser: User | null;
}

// UI for the notes page, depending on user's login status
const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>{loggedInUser ? <NotesPageLoggedInView /> : <NotesPageLoggedOutView />}</>
    </Container>
  );
};

export default NotesPage;
