import { fetchData } from "../utils/fetchData";
import { Note } from "../models/note";

// Function to retrieve all notes from the backend
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes", {
    method: "GET",
  });
  return response.json();
}

// Interface for the input of a note
export interface NoteInput {
  title: string;
  text?: string;
}

// Function to create a new note in the backend
export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

// Function to update a note in the backend
export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
  const response = await fetchData(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

// Function to delete a note in the backend
export async function deleteNote(noteId: string): Promise<void> {
  await fetchData(`/api/notes/${noteId}`, {
    method: "DELETE",
  });
}
