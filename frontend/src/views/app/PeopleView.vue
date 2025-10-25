<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import PersonForm from '@/components/PersonForm.vue';
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
  import SortIcon from '@/components/ui/SortIcon.vue';
  import PersonNotesModal from '@/components/ui/PersonNotesModal.vue';
  import { Plus, UserRoundPen, Trash2, UserRoundPlus, NotepadText, FilePlus2 } from 'lucide-vue-next';

  // --- ESTADO ---
  const people = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const sortKey = ref<string>('createdAt');
  const sortOrder = ref<'asc' | 'desc'>('asc');
  const isNotesModalOpen = ref(false);
  const personForNotes = ref<any | null>(null);

  // Estado de modales
  const isFormModalOpen = ref(false);
  const personToEdit = ref<any | null>(null);
  const isConfirmModalOpen = ref(false);
  const personToDeleteId = ref<string | null>(null);
  const isDeleting = ref(false);

  // --- PROPIEDADES COMPUTADAS ---
  const modalTitle = computed(() => personToEdit.value ? 'Editar Persona' : 'Añadir Nueva Persona');

  // Sorting
  const sortedPeople = computed(() => {
    const sorted = [...people.value];

    if (sortKey.value) {
      sorted.sort((a, b) => {

        let valA = a[sortKey.value] ?? '';
        let valB = b[sortKey.value] ?? '';

        // --- LÓGICA ESPECIAL PARA ORDENAR POR COMPAÑÍAS ---
        if (sortKey.value === 'companies') {
          // Ordenamos por el NÚMERO de compañías asignadas
          valA = a.companies?.length || 0;
          valB = b.companies?.length || 0;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder.value === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }

        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  });

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

  function openNotesModal(person: any) {
    personForNotes.value = person;
    isNotesModalOpen.value = true;
  }

  function setSort(key: string) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
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
              <th class="p-0">
                <button @click="setSort('name')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Nombre</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="name" />
                </button>
              </th>
              <th class="p-0">
                <button @click="setSort('email')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Email</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="email" />
                </button>
              </th>
              
              <!-- La columna de LinkedIn no es ordenable, así que mantiene un estilo simple -->
              <th class="px-4 py-3">LinkedIn</th>
              
              <th class="p-0">
                <button @click="setSort('companies')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Compañías Asignadas</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="companies" />
                </button>
              </th>
              <th class="text-center w-[150px] px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- ¡IMPORTANTE! Iteramos sobre 'sortedPeople' -->
            <tr v-for="person in sortedPeople" :key="person.id" class="hover">
              <td class="font-semibold">{{ person.name }}</td>
              <td>{{ person.email }}</td>
              <td>
                <a v-if="person.linkedinUrl" :href="person.linkedinUrl" target="_blank" class="link link-primary">
                  Ver Perfil
                </a>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <!-- El contenido no cambia, pero se ordenará según el número de badges -->
                  <span v-for="assignment in person.companies" :key="assignment.company.id" class="badge badge-ghost">
                    {{ assignment.company.name }}
                  </span>
                </div>
              </td>
              <td class="text-center space-x-2">

                <div v-if="person.notes && person.notes.trim() !== ''" class="tooltip tooltip-left" data-tip="Ver/Editar Notas">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openNotesModal(person)">
                    <NotepadText :size="20" />
                  </button>
                </div>
                <div v-else class="tooltip tooltip-left" data-tip="Añadir Nota">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openNotesModal(person)">
                    <FilePlus2 :size="20" />
                  </button>
                </div>

                <div class="tooltip tooltip-left" data-tip="Editar Persona">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openEditModal(person)">
                    <UserRoundPen :size="20" />
                  </button>
                </div>

                <div class="tooltip tooltip-left" data-tip="Eliminar Persona">
                  <button class="btn btn-sm btn-square btn-ghost text-error" @click="promptForDelete(person.id)">
                    <Trash2 :size="20" />
                  </button>
                </div>

                <!-- <button class="btn btn-sm btn-square btn-ghost" @click="openEditModal(person)" data-tip="Editar Persona">
                  <UserRoundPen :size="20" />
                </button>
                <button class="btn btn-sm btn-square btn-ghost text-error" @click="promptForDelete(person.id)" data-tip="Eliminar Persona">
                  <Trash2 :size="20" />
                </button> -->
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

  <PersonNotesModal
    v-model="isNotesModalOpen"
    :person="personForNotes"
    @notes-updated="handlePersonUpdate"
  /> 
</template>