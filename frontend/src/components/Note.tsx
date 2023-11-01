import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

// "Type" for the props of the Note component
interface NoteProps {
  note: NoteModel;
  onNoteClicked: (note: NoteModel) => void;
  onDeleteNoteClicked: (note: NoteModel) => void;
  className?: string;
}

// UI layout for a note
const Note = ({ note, onNoteClicked, onDeleteNoteClicked, className }: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;

  // Initialize the time stamp to its appropriate value
  let timeStampText: string;
  if (updatedAt > createdAt) {
    timeStampText = `Updated: ${formatDate(updatedAt)}`;
  } else timeStampText = `Created: ${formatDate(createdAt)}`;

  return (
    <Card
      className={`${styles.noteCard} ${className}`}
      onClick={() => {
        onNoteClicked(note);
      }}
    >
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styleUtils.flexCenter}>
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteNoteClicked(note); // Pass back the note to the caller
              e.stopPropagation(); // Prevent the card from being clicked
            }}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{timeStampText}</Card.Footer>
    </Card>
  );
};

export default Note;
