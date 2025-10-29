<script setup lang="ts">
  import { computed } from 'vue';
  import { getCompanyTypeLabel } from '@/utils/companyTypeHelper';
  import StatusSelector from './StatusSelector.vue';
  import InteractiveInterest from './InteractiveInterest.vue';
  import { NotepadText, Pencil, Trash2, FilePlus, ExternalLink, Globe, Instagram, Linkedin, Palette, AtSign} from 'lucide-vue-next';

  const props = defineProps<{
    company: any;
  }>();

  const emit = defineEmits(['update', 'edit', 'delete', 'view-notes']);

  const location = computed(() => {
    return [props.company.city, props.company.country].filter(Boolean).join(', ');
  });
</script>

<template>
  <div class="card bg-base-100 shadow-md transition-all hover:shadow-lg relative focus-within:z-10">
    <div class="card-body flex-col justify-between p-4">

      <!-- Cabecera de la Tarjeta -->
      <div class="card-title flex justify-between items-start">        
        <div class="flex flex-col items-left gap-2">
          <span class="badge badge-soft badge-secondary badge-md">{{ getCompanyTypeLabel(company.type) }}</span>
          <RouterLink 
            :to="{ name: 'company-detail', params: { id: company.id } }"
            class="text-2xl font-bold text-primary hover:text-secondary transition-colors"
          >
            {{ company.name }}
          </RouterLink>
          <p v-if="location" class="text-sm text-base-content/70 mb-2">{{ location }}</p>          
        </div>

        <div class="flex">
          <InteractiveInterest
            :contact-id="company.id"
            :current-level="company.interestLevel"
            @level-updated="(updatedCompany) => emit('update', updatedCompany)"
          />
        </div>
      </div>

      <!-- Enlaces -->
      <div class="flex flex-col mb-2">
        <a v-if="company.email" :href="`mailto:${company.email}`" class="text-primary hover:text-secondary text-md inline-flex items-center gap-1">
          <AtSign :size="20" /> {{ company.email }} 
        </a>            
        <div class="flex flex-row flex-wrap gap-3 mt-4">
          <a v-if="company.website" :href="company.website" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary text-xs inline-flex items-center gap-1">
            <Globe :size="20" />
          </a>
          <a v-if="company.linkedinUrl" :href="company.linkedinUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary link-hover text-xs inline-flex items-center gap-1">
            <Linkedin :size="20" />
          </a> 
          <a v-if="company.instagramUrl" :href="company.instagramUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary link-hover text-xs inline-flex items-center gap-1">
            <Instagram :size="20" />
          </a>   
          <a v-if="company.behanceUrl" :href="company.behanceUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary link-hover text-xs inline-flex items-center gap-1">
            <Palette :size="20" />
          </a>                  
        </div>       
      </div>
      
      <!-- Acciones de la Tarjeta -->
      <div class="card-actions justify-between items-baseline pt-4 border-t border-base-300">

        <div class="flex flex-col">
          <StatusSelector
            :contact-id="company.id"
            :current-status="company.status"
            @status-updated="(updatedCompany) => emit('update', updatedCompany)"
          />
        </div>

        <div class="flex gap-2">
          <div class="tooltip" :data-tip="company.notes ? 'Ver/Editar Notas' : 'Añadir Nota'">
            <button class="btn btn-sm btn-square btn-ghost" @click="$emit('view-notes', company)">
              <NotepadText v-if="company.notes" :size="20" />
              <FilePlus v-else :size="20" />
            </button>
          </div>
          <div class="tooltip" data-tip="Editar Compañía">
            <button class="btn btn-sm btn-square btn-ghost" @click="$emit('edit', company)">
              <Pencil :size="20" />
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
  </div>
</template>