<script setup lang="ts">
  import PersonCard from './PersonCard.vue';

  defineProps<{
    people: any[];
  }>();

  const emit = defineEmits(['edit-person', 'delete-person', 'view-person-notes']);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <PersonCard
      v-for="person in people"
      :key="person.id"
      :person="person"
      @edit="(personToEdit) => emit('edit-person', personToEdit)"
      @delete="(personId) => emit('delete-person', personId)"
      @view-notes="(personForNotes) => emit('view-person-notes', personForNotes)"
    />
  </div>
</template>