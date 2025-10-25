<script setup lang="ts">
  import { computed } from 'vue';
  import { getCompanyTypeLabel } from '@/utils/companyTypeHelper';
  import StatusSelector from './StatusSelector.vue';
  import InteractiveInterest from './InteractiveInterest.vue';
  import { NotepadText, UserRoundPen, Trash2, FilePlus2, ExternalLink } from 'lucide-vue-next';

  const props = defineProps<{
    company: any;
  }>();

  const emit = defineEmits(['update', 'edit', 'delete', 'view-notes']);

  const location = computed(() => {
    return [props.company.city, props.company.country].filter(Boolean).join(', ');
  });
</script>

<template>
  <div class="card bg-base-100 shadow-md border border-base-300 transition-all hover:shadow-xl hover:-translate-y-1">
    <div class="card-body p-4">
      <!-- Cabecera de la Tarjeta -->
      <div class="card-title flex justify-between items-start">
        <h2 class="text-lg font-bold text-primary mr-2">{{ company.name }}</h2>
        <span class="badge badge-ghost badge-sm">{{ getCompanyTypeLabel(company.type) }}</span>
      </div>

      <!-- Información Secundaria -->
      <p v-if="location" class="text-sm text-base-content/70 -mt-2 mb-2">{{ location }}</p>

      <!-- Indicadores Interactivos -->
      <div class="flex justify-between items-center my-2">
        <div class="flex flex-col items-start">
          <span class="text-xs font-semibold mb-1">Estado</span>
          <StatusSelector
            :contact-id="company.id"
            :current-status="company.status"
            @status-updated="(updatedCompany) => emit('update', updatedCompany)"
          />
        </div>
        <div class="flex flex-col items-end">
          <span class="text-xs font-semibold mb-1">Interés</span>
          <InteractiveInterest
            :contact-id="company.id"
            :current-level="company.interestLevel"
            @level-updated="(updatedCompany) => emit('update', updatedCompany)"
          />
        </div>
      </div>
      
      <!-- Enlace al Sitio Web -->
      <a v-if="company.website" :href="company.website" target="_blank" rel="noopener noreferrer" class="link link-primary link-hover text-xs inline-flex items-center gap-1">
        Visitar Sitio Web <ExternalLink :size="14" />
      </a>
      
      <!-- Acciones de la Tarjeta -->
      <div class="card-actions justify-end mt-4">
        <div class="tooltip" :data-tip="company.notes ? 'Ver/Editar Notas' : 'Añadir Nota'">
          <button class="btn btn-sm btn-square btn-ghost" @click="$emit('view-notes', company)">
            <NotepadText v-if="company.notes" :size="20" />
            <FilePlus2 v-else :size="20" />
          </button>
        </div>
        <div class="tooltip" data-tip="Editar Compañía">
          <button class="btn btn-sm btn-square btn-ghost" @click="$emit('edit', company)">
            <UserRoundPen :size="20" />
          </button>
        </div>
        <div class="tooltip" data-tip="Eliminar">
          <button class="btn btn-sm btn-square btn-ghost text-error" @click="$emit('delete', company.id)">
            <Trash2 :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>