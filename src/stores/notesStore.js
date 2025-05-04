/** 
Centralizes all the business logic and state:
Stores all notes
Tracks the activeNoteId
Provides reusable functions: addNote, updateNote, deleteNote, setActiveNote
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useNotesStore = defineStore('notes', () => {
    const activeNoteId = ref(null) // ID of the selected note

    const notes = ref([]);

    const active_note = ref(null);

    const input_title = ref('');
    const input_content = ref('');

    // Load existing notes from local storage on startup
    const storedNotes = localStorage.getItem('notes')
    if(storedNotes) {
        notes.value = JSON.parse(storedNotes)
    }

    // Computed property to get the active note object
    const activeNote = computed(() => 
    notes.value.find(note => note.id === activeNoteId.value)
)

// Create Note (Create)
function create_note () {
    // Generate a unique ID using random base-36 string (7 characters)
    const id = Math.random().toString(36).substring(2, 9);
    
    console.log('new note is hit')

    // Push a new note object into the reactive notes array
    notes.value.push({
        id,
        title: 'Untitled',  // default title
        content: '',        // default content
    });

    // Set the newly created note as the active one (for editing)
    setActiveNote(id);
}

// Set Active Note (Read)
function setActiveNote(id) {
    // Update the currently selected note ID
    activeNoteId.value = id;

    // Find the note object in the array using the given ID
    let note = notes.value.find(note => note.id === id);

    // Sync the input fields with the selected note’s data
    input_title.value = note.title;
    input_content.value = note.content;
}

// Delete Note (Delete)
function delete_note ({ id, evt }) {
    // Prevent the click event from bubbling up to parent elements
    evt.stopPropagation();

    // Find the index of the note to delete
    let noteIndex = notes.value.findIndex(note => note.id === id);

    // Remove the note from the array
    notes.value.splice(noteIndex, 1);

    // Reset active note and input fields (clears the editor)
    active_note.value = null;
    input_title.value = '';
    input_content.value = '';
}

// Update Note (Update)
function updateNote(newTitle, newContent) {
    const note = notes.value.find(n => n.id === activeNoteId.value)
    if (note) {
      note.title = newTitle
      note.content = newContent
    }
  }

  // Watch the notes and updaes localStorage whenever they change, perfoming transfiguration
  // after state changes (kinda like useEffect)
  watch(
    notes,
    (newNotes) => {
        localStorage.setItem('notes', JSON.stringify(newNotes))
    }, 
    { deep: true }
  )
  

return {
    notes,
    activeNote,
    activeNoteId,
    setActiveNote,
    create_note,
    delete_note,
    updateNote,
}

})