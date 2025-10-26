<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
  import PersonForm from '@/components/PersonForm.vue';
  import { ChevronLeft, Trash2 } from 'lucide-vue-next';

  const route = useRoute();
  const router = useRouter();
  const company = ref<any>(null);
  const peopleInCompany = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const companyId = route.params.id as string;

  const isAssignModalOpen = ref(false);
  const isConfirmUnassignModalOpen = ref(false);
  const allPeople = ref<any[]>([]);
  const availablePeople = ref<any[]>([]);
  const personToAssignId = ref<string | null>(null);
  const personToUnassign = ref<any | null>(null);
  const isUnassigning = ref(false);
  const assignmentRole = ref('');

  onMounted(async () => {
    try {      
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
    try {
      allPeople.value = await apiClient.get('/people');
      const assignedIds = new Set(peopleInCompany.value.map(p => p.id));
      availablePeople.value = allPeople.value.filter(p => !assignedIds.has(p.id));
      isAssignModalOpen.value = true;
    } catch (e: any) {
      error.value = "No se pudo cargar la lista de personas.";
    }
  }

  // TODO: No urgente, verificar que la persona ya no esté asignada a la compañía, no mostrarla en el dropdown.
  async function handleAssignPerson() {
    if (!personToAssignId.value) return;
    try {
      await apiClient.post(`/companies/${companyId}/people`, {
        personId: personToAssignId.value,
        role: assignmentRole.value
      });
      
      peopleInCompany.value = await apiClient.get(`/companies/${companyId}/people`);
      isAssignModalOpen.value = false;
      personToAssignId.value = null;
      assignmentRole.value = '';
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }

  function promptForUnassign(person: any) {
    personToUnassign.value = person;
    isConfirmUnassignModalOpen.value = true;
  }  

  async function handleConfirmUnassign() {
    if (!personToUnassign.value) return;

    isUnassigning.value = true;
    try {      
      await apiClient.delete(`/companies/${companyId}/people/${personToUnassign.value.id}`);            
      peopleInCompany.value = peopleInCompany.value.filter(p => p.id !== personToUnassign.value.id);            
      isConfirmUnassignModalOpen.value = false;
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      isUnassigning.value = false;
      personToUnassign.value = null;
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
      <!-- TODO: Mostrar más campos y mejorar visualización de detalle compañía -->
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
        <li v-for="person in peopleInCompany" :key="person.id" class="flex justify-between items-center p-2 bg-base-100 rounded-lg">
          <span>
            {{ person.name }} <span v-if="person.role" class="text-base-content/60">- {{ person.role }}</span>
          </span>          
          <button class="btn btn-xs btn-ghost text-error" @click="promptForUnassign(person)">
            <Trash2 :size="16" />
          </button>     
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
        <option v-for="person in availablePeople" :key="person.id" :value="person.id">
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

  <ConfirmationModal
    v-model="isConfirmUnassignModalOpen"
    title="Confirmar Desasignación"
    :message="`¿Estás seguro de que quieres desasignar a '${personToUnassign?.name}' de esta compañía?`"
    confirm-text="Sí, Desasignar"
    :is-loading="isUnassigning"
    @confirm="handleConfirmUnassign"
    @cancel="isConfirmUnassignModalOpen = false"
  />

</template>