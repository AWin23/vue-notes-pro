<script setup>
const props = defineProps(['active_note', 'notes', 'searchQuery']);
</script>

<template>
    <aside class="w-[256px] min-h-screen bg-gray-800">
        <div class="p-4">
            <button class="button w-full" @click="$emit('new-note')">
                New Note
            </button>
        </div>
 
            <ul>
                <li 
                    v-for="note in notes"
                    :key="note.id"
                    @click="$emit('set-active-note', note.id)"
                    class="p-4 border-b border-gray-700 hover:bg-gray-600 cursor-pointer flex
                    justify-between items-center gap-4"
                >
                    <span>{{ note.title }}</span>
                    <button 
                        class="text-red-500 cursor-pointer" 
                        @click="evt => $emit('delete-note', {id: note.id, evt})">Delete</button>
                </li>
            </ul>
    </aside>
</template>