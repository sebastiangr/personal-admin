<script setup lang="ts">
  import { UserRoundPen, Trash2, ExternalLink } from 'lucide-vue-next';

  const props = defineProps<{
    person: any;
  }>();

  const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="card bg-base-100 shadow-md border border-base-300 transition-all hover:shadow-xl hover:-translate-y-1">
    <div class="card-body p-4">
      <!-- Cabecera: Nombre y Email -->
      <div>
        <h2 class="card-title text-lg font-bold text-primary">{{ person.name }}</h2>
        <p v-if="person.email" class="text-sm text-base-content/70">{{ person.email }}</p>
      </div>
      
      <!-- Enlace a LinkedIn -->
      <a v-if="person.linkedinUrl" :href="person.linkedinUrl" target="_blank" rel="noopener noreferrer" class="link link-primary link-hover text-xs inline-flex items-center gap-1 my-2">
        Ver Perfil de LinkedIn <ExternalLink :size="14" />
      </a>

      <!-- Compañías Asignadas -->
      <div v-if="person.companies && person.companies.length > 0" class="mt-2">
        <h3 class="text-xs font-semibold mb-1">Trabaja en:</h3>
        <div class="flex flex-wrap gap-1">
          <span v-for="assignment in person.companies" :key="assignment.company.id" class="badge badge-ghost">
            {{ assignment.company.name }}
          </span>
        </div>
      </div>

      <!-- Acciones de la Tarjeta -->
      <div class="card-actions justify-end mt-4">
        <div class="tooltip" data-tip="Editar Persona">
          <button class="btn btn-sm btn-square btn-ghost" @click="$emit('edit', person)">
            <UserRoundPen :size="20" />
          </button>
        </div>
        <div class="tooltip" data-tip="Eliminar">
          <button class="btn btn-sm btn-square btn-ghost text-error" @click="$emit('delete', person.id)">
            <Trash2 :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>