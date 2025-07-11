import { useState, useEffect, useRef } from "react";

interface Props {
  onSubmit: (content: string) => void;
  initialValue?: string;
  editing?: boolean;
  onCancel?: () => void;
}

export default function NoteEditor({
  onSubmit,
  initialValue = "",
  editing = false,
  onCancel,
}: Readonly<Props>) {
  const [content, setContent] = useState<string>(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setContent(initialValue);
    if (editing) {
      textareaRef.current?.focus();
    }
  }, [initialValue, editing]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
    if (!editing) setContent("");
  };

  const handleCancel = () => {
    setContent(initialValue);
    onCancel?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white px-4 py-6 mb-6 rounded-xl shadow"
    >
      <textarea
        ref={textareaRef}
        className="w-full h-24 border border-gray-300 rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-blue-500"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
      />
      <div className="flex justify-end space-x-4 mt-4">
        {editing && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          {editing ? "Update" : "Add Note"}
        </button>
      </div>
    </form>
  );
}
