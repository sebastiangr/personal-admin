<script setup lang="ts">
  import CompanyCard from './CompanyCard.vue';

  defineProps<{
    companies: any[];
  }>();
  
  const emit = defineEmits(['update-company', 'edit-company', 'delete-company', 'view-company-notes']);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <CompanyCard
      v-for="company in companies"
      :key="company.id"
      :company="company"
      @update="(updatedCompany) => emit('update-company', updatedCompany)"
      @edit="(companyToEdit) => emit('edit-company', companyToEdit)"
      @delete="(companyId) => emit('delete-company', companyId)"
      @view-notes="(companyForNotes) => emit('view-company-notes', companyForNotes)"
    />
  </div>
</template>