<script setup lang="ts">
  import { UserRoundPen, Trash2, ExternalLink, AtSign, Linkedin, NotepadText, FilePlus} from 'lucide-vue-next';

  const props = defineProps<{
    person: any;
  }>();

  const emit = defineEmits(['edit', 'delete', 'view-notes']);
</script>

<template>
  <div class="card bg-base-100 shadow-md transition-all hover:shadow-lg relative focus-within:z-10">
    <div class="card-body flex-col justify-between p-4">
      <!-- Cabecera: Nombre y Email -->
      <div class="card-title flex justify-between items-start">        
        <div class="flex flex-col items-left gap-2 mb-2">
          
          <h2 class="text-2xl font-bold text-primary hover:text-secondary transition-colors">
            {{ person.name }}
          </h2>        
          
          <a v-if="person.email" :href="`mailto:${person.email}`" class="text-primary hover:text-secondary text-md inline-flex items-center gap-1">
            <AtSign :size="20" /> {{ person.email }} 
          </a>
          <a v-if="person.linkedinUrl" :href="person.linkedinUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary link-hover text-xs inline-flex items-center gap-1">
            <Linkedin :size="20" />
          </a>          

        </div>
      </div>

      <!-- Acciones de la Tarjeta -->
      <div class="card-actions justify-between items-baseline pt-4 border-t border-base-300">

        <div class="flex flex-wrap gap-1">
          <div v-if="person.companies && person.companies.length > 0" class="flex gap-2 mt-2">
            <span v-for="assignment in person.companies" :key="assignment.company.id" class="badge badge-ghost">
              {{ assignment.company.name }}
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <div class="tooltip" :data-tip="person.notes ? 'Ver/Editar Notas' : 'Añadir Nota'">
            <button class="btn btn-sm btn-square btn-ghost" @click="$emit('view-notes', person)">
              <NotepadText v-if="person.notes" :size="20" />
              <FilePlus v-else :size="20" />
            </button>
          </div>   
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
  </div>
</template>