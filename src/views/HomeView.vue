<!-- Now acts as your main UI layout for the notes page 
 Handles rendering the sidebar, note editor, and binding v-model to input fields -->

<!-- src/views/HomeView.vue -->
<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useNotesStore } from '../stores/notesStore'
import { ref, watch } from 'vue'
import { nextTick } from 'vue'


const store = useNotesStore()

// Local reactive bindings
const input_title = ref('')
const input_content = ref('')

// Watch for active note changes to sync input fields
watch(() => store.activeNote, (note) => {
  input_title.value = note?.title || ''
  input_content.value = note?.content || ''
})

// after calling store.addNote
function focusTitleInput() {
  nextTick(() => {
    const input = document.querySelector('input[type="text"]')
    if (input) input.focus()
  })
}

function createNoteAndFocus() {
  store.create_note()           // Centralized logic
  focusTitleInput()         // After DOM is updated
}


function update_note() {
  if (store.activeNote) {
    store.updateNote(input_title.value, input_content.value)
  }
}

</script>

<template>
    <div class="bg-gray-700 text-white min-h-screen flex items-stretch justify-start">
      <!-- Sidebar -->
      <Sidebar 
        :notes="store.notes" 
        @new-note="createNoteAndFocus"
        :activeNote="store.activeNoteId" 
        @set-active-note="store.setActiveNote"
        @delete-note="store.delete_note"
    />
  
      <main class="flex-1">
        <div v-if="store.activeNote" class="px-4 py-8 flex flex-col h-full">
          <input
            v-model="input_title"
            @input="update_note"
            @change="update_note"

            type="text"
            class="block w-full text-3xl pb-2 font-bold border-b-2 border-gray-500 focus:border-white outline-none transition-colors duration-200"
          />
          <textarea
            v-model="input_content"
            @input="update_note"
            @change="update_note"
            class="block w-full h-full mt-4 text-lg outline-none flex-1"
          />
        </div>
        <div v-else class="p-4 text-lg text-gray-300">
          No note selected. Click "New Note" to begin.
        </div>
      </main>
    </div>
  </template>