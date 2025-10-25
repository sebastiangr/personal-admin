<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import PersonForm from '@/components/PersonForm.vue';
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
  import { Plus, UserRoundPen, Trash2 } from 'lucide-vue-next';

  // --- ESTADO ---
  const people = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  // Estado de modales
  const isFormModalOpen = ref(false);
  const personToEdit = ref<any | null>(null);
  const isConfirmModalOpen = ref(false);
  const personToDeleteId = ref<string | null>(null);
  const isDeleting = ref(false);

  // --- PROPIEDADES COMPUTADAS ---
  const modalTitle = computed(() => personToEdit.value ? 'Editar Persona' : 'Añadir Nueva Persona');

  // --- MÉTODOS ---
  async function fetchPeople() {
    isLoading.value = true;
    try {
      people.value = await apiClient.get('/people');
    } catch (e: any) {
      error.value = e.message || 'Error al cargar las personas.';
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(fetchPeople);

  function handlePersonUpdate(updatedPerson: any) {
    const index = people.value.findIndex(p => p.id === updatedPerson.id);
    if (index !== -1) {
      people.value.splice(index, 1, updatedPerson);
    }
  }

  function openCreateModal() {
    personToEdit.value = null;
    isFormModalOpen.value = true;
  }

  function openEditModal(person: any) {
    personToEdit.value = person;
    isFormModalOpen.value = true;
  }

  async function handleFormSubmit(formData: Record<string, any>) {
    error.value = null;
    try {
      if (personToEdit.value) {
        const updatedPerson = await apiClient.put(`/people/${personToEdit.value.id}`, formData);
        handlePersonUpdate(updatedPerson);
      } else {
        const newPerson = await apiClient.post('/people', formData);
        people.value.unshift(newPerson);
      }
      isFormModalOpen.value = false;
    } catch (e: any) {
      error.value = e.message || "Ocurrió un error al guardar.";
    }
  }

  function promptForDelete(personId: string) {
    personToDeleteId.value = personId;
    isConfirmModalOpen.value = true;
  }

  async function handleConfirmDelete() {
    if (!personToDeleteId.value) return;
    isDeleting.value = true;
    try {
      await apiClient.delete(`/people/${personToDeleteId.value}`);
      people.value = people.value.filter(p => p.id !== personToDeleteId.value);
      isConfirmModalOpen.value = false;
    } catch (e: any) {
      error.value = e.message || "Ocurrió un error al eliminar.";
    } finally {
      isDeleting.value = false;
      personToDeleteId.value = null;
    }
  }
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-4 justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Personas</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <Plus :size="20" class="mr-2" /> Añadir Persona
      </button>
    </div>

    <div v-if="isLoading" class="text-center p-10">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>
    
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <div v-else>
      <div v-if="people.length === 0" class="text-center p-10 border-2 border-dashed rounded-lg bg-base-100">
        <p class="text-lg">Aún no has añadido ninguna persona.</p>
        <button class="btn btn-primary mt-4" @click="openCreateModal">Añadir la primera</button>
      </div>

      <div v-else class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table w-full">
          <thead class="bg-base-300 text-base-content text-sm uppercase">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>LinkedIn</th>
              <th>Compañías Asignadas</th>
              <th class="text-center w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in people" :key="person.id" class="hover">
              <td class="font-semibold">{{ person.name }}</td>
              <td>{{ person.email }}</td>
              <td>
                <a v-if="person.linkedinUrl" :href="person.linkedinUrl" target="_blank" class="link link-primary">
                  Ver Perfil
                </a>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span v-for="assignment in person.companies" :key="assignment.company.id" class="badge badge-ghost">
                    {{ assignment.company.name }}
                  </span>
                </div>
              </td>
              <td class="text-center space-x-2">
                <button class="btn btn-sm btn-square btn-ghost" @click="openEditModal(person)" data-tip="Editar Persona">
                  <UserRoundPen :size="20" />
                </button>
                <button class="btn btn-sm btn-square btn-ghost text-error" @click="promptForDelete(person.id)" data-tip="Eliminar Persona">
                  <Trash2 :size="20" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Modal v-model="isFormModalOpen" :title="modalTitle">
    <PersonForm
      :initial-data="personToEdit"
      @submit="handleFormSubmit"
      @cancel="isFormModalOpen = false"
    />
  </Modal>

  <ConfirmationModal
    v-model="isConfirmModalOpen"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que quieres eliminar a esta persona? Se desasignará de todas las compañías."
    confirm-text="Sí, Eliminar"
    :is-loading="isDeleting"
    @confirm="handleConfirmDelete"
    @cancel="isConfirmModalOpen = false"
  />
</template>