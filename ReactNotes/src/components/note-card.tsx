import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Edit, Undo2 } from "lucide-react";

interface Note {
  id: string;
  data: Date;
  content: string;
}

interface NoteCardProps {
  nota: Note;
  onNoteDeleted: (id: string) => void;
  onNoteEdited: (id: string, newContent: string) => void;
}

export function NoteCard({ nota, onNoteDeleted, onNoteEdited }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(nota.content);
  const [lastEditTime, setLastEditTime] = useState(nota.data);

  useEffect(() => {
    setLastEditTime(nota.data);
  }, [nota.data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onNoteEdited(nota.id, editedContent);
    const editedDate = new Date();
    setLastEditTime(editedDate);

    const updatedNote = { ...nota, data: editedDate, content: editedContent };
    const notesData = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];
    const updatedNotesData = notesData.map((note) => (note.id === nota.id ? updatedNote : note));
    const sortedNotesData = [updatedNote, ...updatedNotesData.filter((note) => note.id !== nota.id)];
    localStorage.setItem("notes", JSON.stringify(sortedNotesData));

    setIsEditing(false);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(lastEditTime, { locale: ptBR, addSuffix: true })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{nota.content}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none " />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            {isEditing ? (
              <div className="flex flex-1 flex-col gap-3 p-5 w-full">
                <textarea
                  className="text-sm leading-6 py-7 h-48 text-slate-400 bg-transparent outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{ scrollbarWidth: 'none' }}
                />
                
                <div className="flex flex-1 items-end gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full  bg-lime-500 py-4  text-center  rounded-md  text-sm text-white outline-none font-medium group hover:bg-lime-600 focus:outline-none focus-visible:ring-lime-400"
                  >
                    Salvar Edição
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center w-full bg-slate-800 py-4  text-center  rounded-md  text-sm text-slate-300 outline-none font-medium group  hover:bg-slate-600 focus:outline-none focus-visible:ring-lime-400"
                  >
                    <Undo2 className="md:w-5 md:h-5 mr-2" />
                    <span className="text-red-400 group-hover:underline">
                      Cancelar Edição
                    </span>
                  </button>
                </div>
              </div>
                
            ) : (
              <div className=" md:flex md:flex-1 md:flex-col md:gap-3 p-9 ">
                <span className="text-sm font-medium text-slate-300">
                  {formatDistanceToNow(lastEditTime, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
                <p className="text-sm leading-6 text-slate-400">
                  {nota.content}
                </p>
                <div className="flex flex-1 items-end gap-3">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center justify-center w-full  bg-lime-500 py-3 text-white rounded-md text-sm  shadow-md outline-none font-medium hover:bg-lime-600 focus:outline-none focus-visible:ring-lime-400"
                  >
                    <Edit className="mr-2 size={18}" /> {""}
                    <span className="text-lime-50 hover:underline">Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNoteDeleted(nota.id)}
                    className="w-full bg-slate-800 py-4  text-center  rounded-md  text-sm text-slate-300 outline-none font-medium group  hover:bg-slate-600 focus:outline-none focus-visible:ring-lime-400"
                  >
                    Deseja{" "}
                    <span className="text-red-400 group-hover:underline">
                      {" "}
                      apagar Nota ?
                    </span>
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
