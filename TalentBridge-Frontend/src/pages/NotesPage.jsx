import Notes from "../components/dashboard/Notes";

export default function NotesPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500 h-[calc(100vh-64px)]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">My Notes</h1>
                <p className="text-slate-500 dark:text-slate-400">Keep track of your personal tasks and ideas.</p>
            </div>

            <div className="h-[calc(100%-120px)]">
                <Notes />
            </div>
        </div>
    );
}
