<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import PersonForm from '@/components/PersonForm.vue';
  import { ChevronLeft } from 'lucide-vue-next';

  const route = useRoute();
  const router = useRouter();
  const company = ref<any>(null);
  const peopleInCompany = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const companyId = route.params.id as string;


  const isAssignModalOpen = ref(false);
  const allPeople = ref<any[]>([]); // Para poblar el select
  const personToAssignId = ref<string | null>(null);
  const assignmentRole = ref('');

  onMounted(async () => {
    try {
      // Hacemos las llamadas en paralelo para más eficiencia
      const [companyData, peopleData] = await Promise.all([
        apiClient.get(`/companies/${companyId}`),
        apiClient.get(`/companies/${companyId}/people`)
      ]);
      company.value = companyData;
      peopleInCompany.value = peopleData;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  });

  async function openAssignModal() {
    // Obtenemos la lista de todas las personas para el select
    try {
      allPeople.value = await apiClient.get('/people');
      isAssignModalOpen.value = true;
    } catch (e: any) {
      error.value = "No se pudo cargar la lista de personas.";
    }
  }

  async function handleAssignPerson() {
    if (!personToAssignId.value) return;
    try {
      await apiClient.post(`/companies/${companyId}/people`, {
        personId: personToAssignId.value,
        role: assignmentRole.value
      });
      // Refrescamos la lista de personas en la compañía
      peopleInCompany.value = await apiClient.get(`/companies/${companyId}/people`);
      isAssignModalOpen.value = false;
      personToAssignId.value = null;
      assignmentRole.value = '';
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }
</script>

<template>
  <div v-if="isLoading">Cargando...</div>
  <div v-else-if="error" class="alert alert-error">{{ error }}</div>
  
  <div v-else-if="company">
    <!-- SECCIÓN DE DETALLES DE LA COMPAÑÍA -->
    <div class="mb-8">
      <button @click="router.back()" class="btn btn-ghost btn-sm mb-4">
        <ChevronLeft :size="20" class="mr-2" />
        Volver
      </button>

      <h1 class="text-4xl font-bold">{{ company.name }}</h1>
      <p>{{ company.type }} - {{ company.city }}, {{ company.country }}</p>
      <!-- ... (muestra aquí más detalles de la compañía) ... -->
    </div>

    <!-- SECCIÓN DE PERSONAS ASIGNADAS -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">Contactos en esta Empresa</h2>
        <button class="btn btn-primary" @click="openAssignModal">Asignar Persona</button>
      </div>
      
      <div v-if="peopleInCompany.length === 0">
        <p>No hay personas asignadas a esta compañía.</p>
      </div>
      <ul v-else class="space-y-2">
        <li v-for="person in peopleInCompany" :key="person.id" class="p-2 bg-base-100 rounded-lg">
          {{ person.name }} <span v-if="person.role" class="text-base-content/60">- {{ person.role }}</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- MODAL PARA ASIGNAR PERSONA EXISTENTE -->
  <Modal v-model="isAssignModalOpen" title="Asignar Persona a la Compañía">
    <div class="form-control">
      <label class="label"><span class="label-text">Selecciona una Persona</span></label>
      <select v-model="personToAssignId" class="select select-bordered">
        <option disabled :value="null">Elige un contacto</option>
        <option v-for="person in allPeople" :key="person.id" :value="person.id">
          {{ person.name }}
        </option>
      </select>
    </div>
    <div class="form-control mt-4">
      <label class="label"><span class="label-text">Rol (Opcional)</span></label>
      <input v-model="assignmentRole" type="text" class="input input-bordered" />
    </div>

    <template #actions>
      <button class="btn btn-ghost" @click="isAssignModalOpen = false">Cancelar</button>
      <button class="btn btn-primary" @click="handleAssignPerson">Asignar</button>
    </template>
  </Modal>
</template>