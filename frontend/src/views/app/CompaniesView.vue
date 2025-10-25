<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import apiClient from '@/utils/api';
  import Modal from '@/components/ui/Modal.vue';
  import NotesModal from '@/components/ui/NotesModal.vue';
  import CompanyForm from '@/components/CompanyForm.vue';
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
  import InteractiveInterest from '@/components/InteractiveInterest.vue';
  import StatusSelector from '@/components/StatusSelector.vue';
  import SortIcon from '@/components/ui/SortIcon.vue';
  import { getCompanyTypeLabel } from '@/utils/companyTypeHelper';
  import { UserRoundPlus, NotepadText, Trash2, UserRoundPen, FilePlus, FileText, Pencil, Plus } from 'lucide-vue-next';

  // --- STATES ---
  const companies = ref<any[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const sortKey = ref<string>('createdAt'); // Ordenar por fecha de creación por defecto
  const sortOrder = ref<'asc' | 'desc'>('desc');

  // Modal states
  const isFormModalOpen = ref(false);
  const companyToEdit = ref<any | null>(null);
  const isConfirmModalOpen = ref(false);
  const companyToDeleteId = ref<string | null>(null);
  const isNotesModalOpen = ref(false);
  const companyForNotes = ref<any | null>(null);
  const isDeleting = ref(false);

  // --- COMPUTED PROPERTIES ---
  const modalTitle = computed(() => companyToEdit.value ? 'Editar Compañía' : 'Añadir Nueva Compañía');

  // Sorting
  const sortedCompanies = computed(() => {
    const sorted = [...companies.value]

    if (sortKey.value) {
      sorted.sort((a, b) => {
        
        const valA = a[sortKey.value] ?? ''
        const valB = b[sortKey.value] ?? ''
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder.value === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA)
        }
        
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })      
    }

    return sorted
  })

  // --- METHODS ---
  async function fetchCompanies() {
    isLoading.value = true;
    try {      
      companies.value = await apiClient.get('/companies');
    } catch (e: any) {
      error.value = e.message || 'Error al cargar compañías.';
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(fetchCompanies);


  function handleCompanyUpdate(updatedCompany: any) {
    const index = companies.value.findIndex(c => c.id === updatedCompany.id);
    if (index !== -1) {
      companies.value.splice(index, 1, updatedCompany);
    }
  }

  function openCreateModal() {
    companyToEdit.value = null;
    isFormModalOpen.value = true;
  }

  function openEditModal(company: any) {
    companyToEdit.value = company;
    isFormModalOpen.value = true;
  }

  function openNotesModal(company: any) {
    companyForNotes.value = company;
    isNotesModalOpen.value = true;
  }


  async function handleFormSubmit(formData: Record<string, any>) {
    error.value = null;
    try {
      if (companyToEdit.value) {
        const updatedCompany = await apiClient.put(`/companies/${companyToEdit.value.id}`, formData);
        handleCompanyUpdate(updatedCompany);
      } else {
        const newCompany = await apiClient.post('/companies', formData);
        companies.value.unshift(newCompany);
      }
      isFormModalOpen.value = false;
    } catch (e: any) {      
      if (e.status === 400 && e.data?.details) {
        // Formatea los errores para que sean legibles
        const validationErrors = e.data.details.map((d: any) => d.message).join('. ');
        error.value = `Error de validación: ${validationErrors}`;
      } else {
        error.value = e.message || "Ocurrió un error al guardar.";
      }      
    }
  }

  function promptForDelete(companyId: string) {
    companyToDeleteId.value = companyId;
    isConfirmModalOpen.value = true;
  }

  async function handleConfirmDelete() {
    if (!companyToDeleteId.value) return;
    isDeleting.value = true;
    try {
      await apiClient.delete(`/companies/${companyToDeleteId.value}`);
      companies.value = companies.value.filter(c => c.id !== companyToDeleteId.value);
      isConfirmModalOpen.value = false;
    } catch (e: any) {      
      error.value = e.message || "Ocurrió un error al eliminar.";
    } finally {
      isDeleting.value = false;
      companyToDeleteId.value = null;
    }
  }

  function setSort(key: string) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'    
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }

</script>

<template>
  <div>
    <!-- ENCABEZADO DE LA VISTA -->
    <div class="flex flex-wrap gap-4 justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Compañías</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <Plus :size="20" class="mr-2" /> Añadir Compañía
      </button>
    </div>

    <!-- ESTADO DE CARGA -->
    <div v-if="isLoading" class="text-center p-10">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>
    
    <!-- ESTADO DE ERROR -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <!-- CONTENIDO PRINCIPAL -->
    <div v-else>
      <!-- ESTADO VACÍO (SIN COMPAÑÍAS) -->
      <div v-if="companies.length === 0" class="text-center p-10 border-2 border-dashed rounded-lg bg-base-100">
        <p class="text-lg">Aún no has añadido ninguna compañía.</p>
        <button class="btn btn-primary mt-4" @click="openCreateModal">Añadir la primera</button>
      </div>

      <!-- TABLA DE COMPAÑÍAS (CON DATOS) -->
      <div v-else class="overflow-x bg-base-100 rounded-lg shadow">
        <table class="table w-full">
          <!-- ENCABEZADO DE LA TABLA -->
          <thead class="bg-base-300 text-base-content text-sm uppercase">
            <tr>
              <th class="p-0">
                <button @click="setSort('name')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Compañía</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="name" />
                </button>
              </th>
              <th class="p-0 hidden lg:table-cell">
                <button @click="setSort('type')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Tipo</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="type" />
                </button>
              </th>
              <th class="p-0 hidden xl:table-cell">
                <button @click="setSort('country')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Ubicación</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="country" />
                </button>
              </th>
              <th class="p-0 w-20 hidden md:table-cell">
                <button @click="setSort('interestLevel')" class="flex items-center justify-center w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Interés</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="interestLevel" />
                </button>
              </th>
              <th class="p-0 hidden sm:table-cell">
                <button @click="setSort('status')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2">
                  <span>Estado</span>
                  <SortIcon :sort-key="sortKey" :sort-order="sortOrder" current-key="status" />
                </button>
              </th>
              <th class="text-center w-[150px] px-4 py-3">Acciones</th>            
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in sortedCompanies" :key="company.id" class="hover">
              <td>
                <RouterLink 
                  :to="{ name: 'company-detail', params: { id: company.id } }"
                  class="link link-hover link-primary font-semibold"
                >
                  {{ company.name }}
                </RouterLink>
              </td>
              <td class="hidden lg:table-cell">
                {{ getCompanyTypeLabel(company.type) }}
              </td>
              <td class="hidden xl:table-cell">
                {{ company.city || '' }}, {{ company.country || '' }}
              </td>
              <td class="text-center hidden md:table-cell">
                <InteractiveInterest
                  :contact-id="company.id"
                  :current-level="company.interestLevel"
                  @level-updated="handleCompanyUpdate"
                />
              </td>
              <td class="text-center hidden sm:table-cell">
                <StatusSelector
                  :contact-id="company.id"
                  :current-status="company.status"
                  @status-updated="handleCompanyUpdate"
                />
              </td>
              <td class="text-center space-x-2">
                <div v-if="company.notes && company.notes.trim() !== ''" class="tooltip tooltip-left" data-tip="Ver/Editar Notas">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openNotesModal(company)">
                    <FileText :size="20" />
                  </button>
                </div>            
                <div v-else class="tooltip tooltip-left" data-tip="Añadir Nota">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openNotesModal(company)">      
                    <FilePlus :size="20" />
                  </button>
                </div>    

                <div class="tooltip tooltip-left" data-tip="Editar Compañía">
                  <button class="btn btn-sm btn-square btn-ghost" @click="openEditModal(company)">
                    <Pencil :size="20" />
                  </button>
                </div>

                <div class="tooltip tooltip-left" data-tip="Eliminar">
                  <button class="btn btn-sm btn-square btn-ghost text-error" @click="promptForDelete(company.id)">
                    <Trash2 :size="20" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- MODALES (Viven fuera del flujo principal del template) -->
  <Modal v-model="isFormModalOpen" :title="modalTitle">
    <CompanyForm
      :initial-data="companyToEdit"
      @submit="handleFormSubmit"
      @cancel="isFormModalOpen = false"
    />
  </Modal>

  <NotesModal
    v-model="isNotesModalOpen"
    :company="companyForNotes"
    @notes-updated="handleCompanyUpdate"
  />

  <ConfirmationModal
    v-model="isConfirmModalOpen"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que quieres eliminar esta compañía? Toda la información y personas asociadas se perderán."
    confirm-text="Sí, Eliminar"
    :is-loading="isDeleting"
    @confirm="handleConfirmDelete"
    @cancel="isConfirmModalOpen = false"
  />
</template>