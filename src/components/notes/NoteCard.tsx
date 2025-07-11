import type { Note } from "../../types/note";
import { FiEdit2, FiTrash } from "react-icons/fi";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center mb-3">
      <p className="text-gray-800 whitespace-pre-wrap flex-1">{note.content}</p>
      <div className="flex space-x-3 ml-4">
        <button onClick={() => onEdit(note)} type="button">
          <FiEdit2 className="text-blue-500 hover:text-blue-700" />
        </button>
        <button onClick={() => onDelete(note._id)} type="button">
          <FiTrash className="text-red-500 hover:text-red-700" />
        </button>
      </div>
    </div>
  );
}
