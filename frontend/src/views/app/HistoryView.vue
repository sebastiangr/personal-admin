<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import apiClient from '@/utils/api';
  import { statusMap } from '@/utils/statusHelper';
  import type { ContactStatus } from '@/utils/statusHelper';

  // --- ESTADO ---
  const logs = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  // --- MÉTODOS ---

  /**
   * Formatea una fecha ISO a un formato legible (DD/MM/AA hh:mm am/pm)
   * en la zona horaria local del navegador.
   */
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
}

  /**
   * Traduce los valores de estado del backend (ej: 'BACKLOG') a texto legible
   * usando nuestro statusMap.
   */
  function translateLog(logText: string): string {
    // Crea una expresión regular para encontrar cualquiera de las claves de nuestro mapa
    const statusKeys = Object.keys(statusMap).join('|');
    const regex = new RegExp(statusKeys, 'g');

    // Reemplaza cada coincidencia con su texto legible
    return logText.replace(regex, (match) => {
      return statusMap[match as ContactStatus]?.text || match;
    });
  }

  // Carga los datos del historial cuando el componente se monta
  onMounted(async () => {
    try {
      logs.value = await apiClient.get('/activity-logs');
    } catch (e: any) {
      error.value = e.message || 'Error al cargar el historial.';
    } finally {
      isLoading.value = false;
    }
  });
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Historial de Actividad</h1>

    <!-- ESTADO DE CARGA -->
    <div v-if="isLoading" class="text-center p-10">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>
    
    <!-- ESTADO DE ERROR -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <!-- CONTENIDO PRINCIPAL -->
    <div v-else class="bg-base-100 rounded-lg shadow">
      <!-- ESTADO VACÍO -->
      <div v-if="logs.length === 0" class="text-center p-10">
        <p class="text-lg">No hay actividad registrada todavía.</p>
      </div>
      
      <!-- LISTA DE LOGS -->
      <div v-else class="p-4">
        <ul>
          <li 
            v-for="log in logs" 
            :key="log.id" 
            class="grid grid-cols-[150px_minmax(150px,_1fr)_2fr] items-center gap-4 py-3 border-b border-base-200 last:border-b-0"
          >
            <!-- Columna de Fecha -->
            <div class="text-sm text-base-content/60 font-mono">
              {{ formatDate(log.createdAt) }}
            </div>

            <!-- Columna de Nombre de Compañía (con enlace) -->
            <div class="font-semibold truncate">
              <RouterLink 
                v-if="log.company"
                :to="{ name: 'company-detail', params: { id: log.company.id } }"
                class="link link-hover link-primary"
                :title="log.company.name"
              >
                {{ log.company.name }}
              </RouterLink>
              <span v-else class="italic text-base-content/50">Compañía eliminada</span>
            </div>
            
            <!-- Columna de Descripción del Log -->
            <div class="text-sm text-base-content/80">
              {{ translateLog(log.eventDescription) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>