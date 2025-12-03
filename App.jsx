import React, { useState } from 'react';

const App = () => {

  // Initial state for notes. Added 'isImportant' property, set to false by default.
  const [notes, setNotes] = useState([
    { id: 1, content: "Learn the GitHub Flow workflow.", timestamp: Date.now() - 60000 * 5, isImportant: true },
    { id: 2, content: "Build a simple CRUD application to practice.", timestamp: Date.now() - 60000 * 2, isImportant: false },
  ]);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');


  // --- CRUD Operations ---

  // 1. CREATE: Adds a new note to the list, defaulting to not important
  const addNote = () => {
    if (newNoteContent.trim() === '') return;

    const newNote = {
      id: Date.now(),
      content: newNoteContent.trim(),
      timestamp: Date.now(),
      isImportant: false, // New property initialization
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
  };

  // 2. DELETE: Removes a note by its ID
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // 3. UPDATE (Start): Sets the state to begin editing a note
  const startEdit = (note) => {
    setEditingId(note.id);
    setEditingContent(note.content);
  };

  // 4. UPDATE (Save): Saves the edited content and exits edit mode
  const saveEdit = (id) => {
    if (editingContent.trim() === '') {
      deleteNote(id);
      setEditingId(null);
      return;
    }

    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: editingContent.trim(), timestamp: Date.now() } : note
    ));
    setEditingId(null);
  };

  // 5. NEW FEATURE: Toggles the importance status of a note
  const toggleImportance = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isImportant: !note.isImportant } : note
    ));
  };

  // Helper function to format the timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Note component for displaying a single note card
  const NoteCard = ({ note }) => {
    // Dynamically change border color based on importance
    const cardClasses = `bg-white p-4 rounded-xl shadow-lg transition duration-300 flex flex-col justify-between ${
      note.isImportant ? 'border-4 border-yellow-500 ring-2 ring-yellow-300' : 'hover:shadow-xl border border-gray-100'
    }`;

    // SVG icon for importance (Star/Unstarred)
    const StarIcon = ({ filled, onClick }) => (
      <button 
        onClick={onClick}
        className={`p-1 rounded-full transition ${filled ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}
        aria-label={filled ? "Mark as Not Important" : "Mark as Important"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          {filled ? (
            // Filled Star
            <path d="M9.049 2.927c.3-.921 1.63-.921 1.93 0l2.427 7.464a1 1 0 00.95.69h7.838a1 1 0 01.597 1.847l-6.347 4.607a1 1 0 00-.362 1.118l2.427 7.464a1 1 0 01-1.535 1.118l-6.347-4.607a1 1 0 00-1.175 0l-6.347 4.607a1 1 0 01-1.535-1.118l2.427-7.464a1 1 0 00-.362-1.118l-6.347-4.607a1 1 0 01.597-1.847h7.838a1 1 0 00.95-.69l2.427-7.464z" />
          ) : (
            // Outline Star
            <path fillRule="evenodd" d="M10 2a1 1 0 01.624.237l2.427 7.464a1 1 0 00.95.69h7.838a1 1 0 01.597 1.847l-6.347 4.607a1 1 0 00-.362 1.118l2.427 7.464a1 1 0 01-1.535 1.118l-6.347-4.607a1 1 0 00-1.175 0l-6.347 4.607a1 1 0 01-1.535-1.118l2.427-7.464a1 1 0 00-.362-1.118l-6.347-4.607a1 1 0 01.597-1.847h7.838a1 1 0 00.95-.69L10 2zM10 4.75L7.906 10.395l-5.636.818 4.072 2.978-.962 5.564 4.618-3.376 4.618 3.376-.962-5.564 4.072-2.978-5.636-.818L10 4.75z" clipRule="evenodd" />
          )}
        </svg>
      </button>
    );

    return (
      <div className={cardClasses}>
        {editingId === note.id ? (
          // EDIT MODE UI
          <div className="flex flex-col space-y-3">
            <textarea
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition resize-y"
              rows="4"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => saveEdit(note.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // READ MODE UI
          <div className="flex flex-col h-full">
            <p className="text-gray-800 text-base flex-grow break-words whitespace-pre-wrap mb-3">{note.content}</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
              <span className="text-xs text-gray-500 italic">
                Last updated: {formatTime(note.timestamp)}
              </span>
              <div className="flex space-x-2">
                {/* NEW Importance Toggle Button */}
                <StarIcon 
                  filled={note.isImportant} 
                  onClick={() => toggleImportance(note.id)} 
                />

                <button
                  onClick={() => startEdit(note)}
                  className="text-blue-500 hover:text-blue-700 transition p-1 rounded-full hover:bg-gray-100"
                  aria-label="Edit Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.182-1.99a1 1 0 00-.707 0L2 13.586V17h3.414L15.586 7.414l-2.828-2.828-1.99 1.99z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-100"
                  aria-label="Delete Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-blue-500 pb-2">
          GitHub Flow Practice: Note Manager
        </h1>

        {/* Note Creation Area (CREATE) */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Note</h2>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <textarea
              className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="What's on your mind? Type a new note here..."
              rows="3"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  addNote();
                }
              }}
            />
            <button
              onClick={addNote}
              className="flex-shrink-0 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg self-stretch md:self-auto"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Note List (READ) */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your Notes ({notes.length})
        </h2>
        {notes.length === 0 ? (
          <p className="text-gray-500 italic p-6 text-center bg-white rounded-xl shadow">
            You currently have no notes. Start by adding one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;