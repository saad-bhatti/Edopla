import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import TextInputField from "./form/TextInputField";
import { NoteInput } from "../network/notes_api";
import * as NotesAPI from "../network/notes_api";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {
  // React hook form to manage the form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: { title: noteToEdit?.title || "", text: noteToEdit?.text || "" },
  });

  // Function to handle the form submission
  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse: Note;
      // Updating a note
      if (noteToEdit) noteResponse = await NotesAPI.updateNote(noteToEdit._id, input);
      // Adding a note
      else noteResponse = await NotesAPI.createNote(input);
      onNoteSaved(noteResponse); // Passes the note back to the caller
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      {/* Dialog for the header */}
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? "Edit this Note" : "Add a Note"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the title field */}
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Enter title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          {/* Dialog for the text field */}
          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Enter text"
            register={register}
          />
        </Form>
      </Modal.Body>

      {/* Dialog footer */}
      <Modal.Footer>
        <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
          Save Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
