import { ChangeEvent, useState } from "react";
import logo from "./asserts/logo2.svg";
import { NewNodeCard } from "./components/new-node-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  data: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      data: new Date(),
      content,
    };
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteEdited(id: string, newContent: string) {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, content: newContent };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <div className="flex items-center md:justify-between">
        <img src={logo} className="md:w-40 w-24" alt="logo" />
        <form className="flex-grow ">
          <input
            type="text"
            placeholder="Busque em suas Notas..."
            className="w-full bg-transparent lg:text-3xl text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
            onChange={handleSearch}
          />
        </form>
      </div>

      <div className="h-px bg-slate-700 " />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNodeCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            nota={note}
            onNoteDeleted={onNoteDeleted}
            onNoteEdited={onNoteEdited}
          />
        ))}
      </div>
    </div>
  );
}
