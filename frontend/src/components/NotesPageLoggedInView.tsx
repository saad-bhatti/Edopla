import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import * as NotesAPI from "../network/notes_api";
import styles from "../styles/NotesPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from "./Note";

const NotesPageLoggedInView = () => {
  // State to contain the notes retrieved from the backend
  const [notes, setNotes] = useState<NoteModel[]>([]);
  // State to track whether the notes are being loaded
  const [notesLoading, setNotesLoading] = useState(true);
  // State to show an error message if the notes fail to load
  const [showNotesLoadingError, setshowNotesLoadingError] = useState(false);
  // State to control whether the add note dialog is shown
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  // State to control the note to edit
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  // Retrieve the notes only once before rendering the page
  useEffect(() => {
    async function loadNotes() {
      try {
        setshowNotesLoadingError(false);
        setNotesLoading(true); // Show the loading indicator
        const notes = await NotesAPI.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setshowNotesLoadingError(true); // Show the loading error
      } finally {
        setNotesLoading(false); // Hide the loading indicator
      }
    }
    loadNotes();
  }, []);

  // Function to handle deleting a note
  async function deleteNote(note: NoteModel) {
    try {
      // Delete & remove the note from the list of notes
      await NotesAPI.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // Variable containing the display for all notes
  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {notes.map((note) => (
        <Col key={note._id}>
          <Note
            note={note}
            className={styles.note}
            onNoteClicked={setNoteToEdit}
            onDeleteNoteClicked={deleteNote}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {/* Display for the 'add new note' button */}
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <FaPlus />
        Add a new note
      </Button>

      {/* Display for the indicator when notes are loading */}
      {notesLoading && <Spinner animation="border" variant="primary " />}

      {/* Display for when notes fail to load */}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}

      {/* Display all notes or message when no notes exist */}
      {!notesLoading && !showNotesLoadingError && (
        <>{notes.length > 0 ? notesGrid : <p>No notes to display</p>}</>
      )}

      {/* Add new note dialog */}
      {showAddNoteDialog && (
        <AddEditNoteDialog
          // Upon dismissing the dialog box, hide the dialog box
          onDismiss={() => setShowAddNoteDialog(false)}
          // Upon submitting the dialog box, add the new note to the existing list of notes
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}

      {/* Edit note dialog */}
      {noteToEdit && (
        <AddEditNoteDialog
          // Pass the note to be edited to the dialog box
          noteToEdit={noteToEdit}
          // Upon dismissing the dialog box, reset the variable tracking the note to be edited
          onDismiss={() => setNoteToEdit(null)}
          // Upon submitting the dialog box, update the note in the existing list of notes
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id ? updatedNote : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
