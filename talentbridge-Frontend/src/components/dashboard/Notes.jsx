import { useState, useEffect } from "react";
import { Plus, Trash2, StickyNote } from "lucide-react";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ topic: "", description: "" });

    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem("talentbridge_notes") || "[]");
        setNotes(storedNotes);
    }, []);

    const addNote = (e) => {
        e.preventDefault();
        if (!newNote.topic.trim() && !newNote.description.trim()) return;

        const note = {
            id: Date.now(),
            topic: newNote.topic,
            description: newNote.description,
            // Fallback for legacy notes if needed, though we are changing structure
            text: newNote.description,
            createdAt: new Date().toLocaleDateString()
        };

        const updatedNotes = [note, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem("talentbridge_notes", JSON.stringify(updatedNotes));
        setNewNote({ topic: "", description: "" });
    };

    const deleteNote = (id) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("talentbridge_notes", JSON.stringify(updatedNotes));
    };

    return (
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <StickyNote className="text-yellow-500" size={20} />
                    My Notes
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                    {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                </span>
            </div>

            <form onSubmit={addNote} className="mb-6 space-y-3">
                <input
                    type="text"
                    value={newNote.topic}
                    onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
                    placeholder="Topic / Title"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                />
                <textarea
                    value={newNote.description}
                    onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                    placeholder="Note description..."
                    rows="5"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!newNote.topic.trim() && !newNote.description.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                        Add Note
                    </button>
                </div>
            </form >

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {notes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 dark:border-slate-700/50 rounded-xl p-8">
                        <StickyNote size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No notes yet</p>
                    </div>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="group p-4 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl hover:shadow-sm transition-all relative">
                            {/* Handle legacy notes that might only have 'text' */}
                            {note.topic && (
                                <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm mb-1">
                                    {note.topic}
                                </h3>
                            )}
                            <p className="text-slate-600 dark:text-slate-400 text-sm pr-6 break-words leading-relaxed whitespace-pre-wrap">
                                {note.description || note.text}
                            </p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-100 dark:border-yellow-900/30">
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    {note.createdAt}
                                </span>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 absolute top-3 right-3"
                                    title="Delete note"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
}
