import { useEffect, useState } from "react";
import { useUser } from "../auth/useUser";
import Button from "../components/ui/Button";
import NoteEditor from "../components/notes/NoteEditor";
import { useNotes } from "../store/useNotes";
import NoteCard from "../components/notes/NoteCard";
import { toast } from "react-toastify";
import api from "../api/axios";
import Header from "../components/ui/layout/Header";
import WelcomeCard from "../components/ui/layout/WelcomeCard";

export default function Dashboard() {
  const { name, email, setUser } = useUser();
  const [showEditor, setShowEditor] = useState(false);

  const { notes, fetchNotes, addNote, loading, error } = useNotes();
  // Fetching user details on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.name, res.data.email);
      } catch (err: any) {
        toast.error("Failed to load user info");
        console.error(err.message);
      }
    };
    getUser();
    fetchNotes();
  }, []);

  const handleAddNote = async (content: string) => {
    await addNote(content);
    setShowEditor(false);
  };

  let content: any;

  if (loading) {
    content = (
      <div className="text-center text-sm text-gray-400">Loading...</div>
    );
  } else if (error) {
    content = (
      <div className="text-center text-sm text-red-500">
        Error loading notes
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <Header />
      <WelcomeCard name={name || "User"} email={email || "..."} />

      {/* Create Note Button */}
      <div className="mb-4">
        <Button onClick={() => setShowEditor(!showEditor)}>
          {showEditor ? "Cancel" : "Create Note"}
        </Button>
      </div>

      {/* Note Editor */}
      {showEditor && <NoteEditor onSubmit={handleAddNote} />}

      {/* Notes */}
      <h3 className="text-md font-semibold mb-2">Notes</h3>
      {content}
    </div>
  );
}
