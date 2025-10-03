<!-- src/views/app/ContactsView.vue -->
<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold text-primary">Contacts View</h1>
    <p class="mt-4 text-lg">Sección Contacts.</p>
    <div class="mt-8">
        <button class="btn btn-error" @click="useAuthStore().logout()">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Importamos el store solo para el botón de logout
  import { useAuthStore } from '@/stores/auth' 
</script>