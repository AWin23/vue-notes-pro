<!-- Now acts as your main UI layout for the notes page 
 Handles rendering the sidebar, note editor, and binding v-model to input fields -->

<!-- src/views/HomeView.vue -->
<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useNotesStore } from '../stores/notesStore'
import { ref, watch, computed } from 'vue'
import { nextTick } from 'vue'

// declare a store, to utilize noteStore function 
const store = useNotesStore()

// Local reactive bindings
const input_title = ref('')
const input_content = ref('')

// Hook setup for Search Query 
const searchQuery = ref('')

// Hook setup for Note tags
const newTag = ref('')

// adds the tag to notes
function addTag() {
  if (!newTag.value.trim()) return
  store.activeNote.tags.push(newTag.value.trim())
  newTag.value = ''
}

// takes away tag on notes (Deletes em)
function removeTag(index) {
  store.activeNote.tags.splice(index, 1)
}

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

// Computed property that dynamically filters notes based on the user's search input
const filteredNotes = computed(() => {
  // We apply the filter on the full notes list from the store
  return store.notes.filter(note => {
    // Normalize the search query for case-insensitive comparison
    const query = searchQuery.value.toLowerCase()

    // Normalize note title and content for the same reason
    const title = note.title.toLowerCase()
    const content = note.content.toLowerCase()

    // Return true if either the title or content includes the search query
    return title.includes(query) || content.includes(query)
  })
})

// Function that highlights matching text in a string based on the search query
function highlightMatch(text) {
  // If the search query is empty, return the original text unmodified
  if (!searchQuery.value) return text

  // Create a case-insensitive global regex using the search query
  // 'gi' = global + case-insensitive match
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')

  // Replace all matched parts of the text with a <mark> tag
  // The $1 represents the captured match from the regex
  // This wraps the matched portion with a yellow background and black text for visibility
  return text.replace(
    regex,
    '<mark class="bg-yellow-300 text-black">$1</mark>'
  )
}



// object to help tailwind notes colors
const tagColors = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  urgent: 'bg-red-500',
  default: 'bg-gray-600'
}


</script>

<template>

  <div v-if="searchQuery && filteredNotes.length > 0" class="bg-gray-800 p-4 rounded shadow mb-4">
  <p class="text-sm text-gray-300 mb-2">Search Results:</p>
  <ul class="text-white space-y-1">
    <li v-for="note in filteredNotes" :key="note.id" class="hover:underline cursor-pointer" @click="store.setActiveNote(note.id)">
      <span v-html="highlightMatch(note.title)"></span>
    </li>
  </ul>
</div>

  <input
    v-model="searchQuery"
    type="text"
    placeholder="Search notes..."
    class="mb-4 p-2 w-full bg-gray-800 border border-gray-600 rounded outline-none text-white"
  />

    <div class="flex gap-2 mb-2">
      <span
        v-for="(tag, index) in store.activeNote?.tags || []"
        :key="index"
        :class="`text-white px-2 py-1 rounded-full text-xs ${tagColors[tag] || tagColors.default}`"
      >
        {{ tag }}
        <button @click="removeTag(index)" class="ml-1 text-white hover:text-gray-200">×</button>
      </span>
  </div>

  <input
    v-model="newTag"
    @keydown.enter.prevent="addTag"
    placeholder="Add tag and press Enter"
    class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
  />

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