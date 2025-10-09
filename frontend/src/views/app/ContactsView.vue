<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import apiClient from '@/utils/api'
  import Modal from '@/components/ui/Modal.vue'
  import ContactForm from '@/components/ContactForm.vue'
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
  import InterestIndicator from '@/components/ui/InterestIndicator.vue'
  import InteractiveInterest from '@/components/InteractiveInterest.vue'
  import StatusSelector from '@/components/StatusSelector.vue'
  import SortIcon from '@/components/ui/SortIcon.vue'

  import { UserRoundPlus, NotepadText, Trash2, UserRoundPen, ChevronUp, ChevronDown } from 'lucide-vue-next';
  
  // TODO: Improve spinners in general
  // --- STATES ---
  const contacts = ref<any[]>([])
  const isLoading = ref(true) // Spinner
  const error = ref<string | null>(null)
  const sortKey = ref<string>('companyName')
  const sortOrder = ref<'asc' | 'desc'>('asc')  

  // State modal
  const isFormModalOpen = ref(false)
  const contactToEdit = ref<any | null>(null) // KEY: si es null=Crear, si tiene objeto=Editar

  const isConfirmModalOpen = ref(false)
  const contactToDeleteId = ref<string | null>(null)
  const isDeleting = ref(false) // Spinner
  
  // --- COMPUTED PROPERTIES ---
  const modalTitle = computed(() => 
    contactToEdit.value ? 'Editar Contacto' : 'Añadir Nuevo Contacto'
  )

  // --- METHODS ---
  async function fetchContacts() {
    isLoading.value = true
    try {
      contacts.value = await apiClient.get('/api/contacts')
    } catch (e: any) { 
      error.value = e.message || 'Error al cargar contactos.' 
    } finally { 
      isLoading.value = false 
    }
  }

  onMounted(fetchContacts)
  
  // --- UPDATE CONTACT METHOD ---
  function handleContactUpdate(updatedContact: any) {
    const index = contacts.value.findIndex(c => c.id === updatedContact.id)
    if (index !== -1) {
      contacts.value[index] = updatedContact
    }
  }  
  
  // -- MODALS ---  
  function openCreateModal() {
    contactToEdit.value = null
    isFormModalOpen.value = true
  }  

  function openEditModal(contact: any) {
    contactToEdit.value = contact
    isFormModalOpen.value = true
  }
  
  // --- FORM SUBMIT ---
  async function handleFormSubmit(formData: Record<string, any>) {
    try {
      if (contactToEdit.value) {
        // Update
        const updatedContact = await apiClient.put(`/api/contacts/${contactToEdit.value.id}`, formData)
        // Local update
        const index = contacts.value.findIndex(c => c.id === updatedContact.id)
        if (index !== -1) {
          contacts.value[index] = updatedContact
        }
      } else {
        // Create
        const newContact = await apiClient.post('/api/contacts', formData)
        contacts.value.unshift(newContact)
      }
      isFormModalOpen.value = false
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }  
    
  // --- DELETE LOGIC ---
  // Delete modal
  function promptForDelete(contactId: string) {
    contactToDeleteId.value = contactId
    isConfirmModalOpen.value = true
  }

  async function handleConfirmDelete() {
    if (!contactToDeleteId.value) return
    
    isDeleting.value = true
    try {
      await apiClient.delete(`/api/contacts/${contactToDeleteId.value}`)
      contacts.value = contacts.value.filter(c => c.id !== contactToDeleteId.value)
      isConfirmModalOpen.value = false
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      isDeleting.value = false
      contactToDeleteId.value = null
    }
  }

  // --- SORTING ---
  const sortedContacts = computed(() => {
    const sorted = [...contacts.value]

    if (sortKey.value) {
      sorted.sort((a, b) => {
        // Para un ordenamiento más robusto, maneja nulos y mayúsculas/minúsculas
        const valA = a[sortKey.value] ?? '' // Usa '' si el valor es null/undefined
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


    // if (sortKey.value) {
    //   sorted.sort((a, b) => {
    //     const valA = a[sortKey.value]
    //     const valB = b[sortKey.value]
        
    //     if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    //     if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    //     return 0
    //   })      
    // }

    return sorted
  })

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

  <div class="p-4 md:p-8">
    <div class="flex flex-wrap gap-4 justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Contactos</h1>
      <div class="flex gap-4 items-center">
        <!-- 4. Botón que abre el modal -->
        <button class="btn btn-primary" @click="openCreateModal">
          <UserRoundPlus class="mr-2" /> Añadir Contacto
        </button>        
      </div>
    </div>
    
    <!-- Loading -->
    <div v-if="isLoading" class="text-center p-10">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <!-- Data wrapper -->              
    <div v-else class="">
      <!-- No contacts -->
      <div v-if="contacts.length === 0" class="text-center p-10 border-2 border-dashed rounded-lg">
        <p>Aún no tienes contactos.</p>
        <button class="btn btn-primary mt-4">Añadir el primero</button>
      </div>
      <!-- Table with contacts -->
      <div v-else class="bg-base-100 rounded-lg shadow">
        <table class="table w-full table-fixed">
          <thead class="bg-base-300 text-base-content text-sm">
            <tr>
              <!-- <th>
                <button @click="setSort('companyName')" class="flex items-center gap-2 w-full">
                  Empresa <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="companyName" />
                </button>
              </th> -->
              <th class="p-0">
                <button @click="setSort('companyName')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2 cursor-pointer">
                  <span>Empresa</span>
                  <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="companyName" />
                </button>
              </th>

              <th class="p-0">
                <button @click="setSort('contactName')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2 cursor-pointer">
                  <span>Contacto</span>
                  <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="contactName" />
                </button>
              </th>
              
              
              <!-- <th>
                <button @click="setSort('contactName')" class="flex items-center gap-2">
                  Contacto <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="contactName" />
                </button>
              </th>              
               -->
              <th>Email</th>
              <th>Sitio Web</th>      

              <th class="p-0">
                <button @click="setSort('sector')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2 cursor-pointer">
                  <span>Sector</span>
                  <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="sector" />
                </button>
              </th>

              <th class="p-0 w-[110px]"> <!-- Le damos un poco más de espacio a Interés -->
                <button @click="setSort('interestLevel')" class="flex items-center justify-center w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2 cursor-pointer">
                  <span>Interés</span>
                  <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="interestLevel" />
                </button>
              </th>

              <th class="p-0">
                <button @click="setSort('status')" class="flex items-center justify-between w-full px-4 py-3 hover:bg-base-200/50 transition-colors gap-2 cursor-pointer">
                  <span>Estado</span>
                  <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="status" />
                </button>
              </th>            
              
              <!-- <th class="text-center">
                <button @click="setSort('sector')" class="flex items-center gap-2">
                  Sector <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="sector" />
                </button>
              </th>
              <th class="w-[120px]">
                <button @click="setSort('interestLevel')" class="flex items-center justify-center gap-2 w-full">
                  Interés <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="interestLevel" />
                </button>
              </th>
              <th class="text-center">
                <button @click="setSort('status')" class="flex items-center justify-center gap-2 w-full">
                  Estado <SortIcon :sortKey="sortKey" :sortOrder="sortOrder" currentKey="status" />
                </button>
              </th> -->
              <th class="text-center w-[150px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in sortedContacts" :key="contact.id" class="hover:bg-base-200 hover">
              <td><b>{{ contact.companyName }}</b></td>
              <td>{{ contact.contactName }}</td>
              <td>{{ contact.email }}</td>              
              <td>{{ contact.website }}</td>
              <td>{{ contact.sector }}</td>
              <td class="text-center">
                <InteractiveInterest
                  :contact-id="contact.id"
                  :current-level="contact.interestLevel"
                  @level-updated="handleContactUpdate"
                />                
              </td>               
              <td class="text-center">
                <StatusSelector 
                  :contact-id="contact.id"
                  :current-status="contact.status"
                  @status-updated="handleContactUpdate"
                />
              </td>
              <td class="text-center space-x-2">
                <div v-if="contact.notes && contact.notes.trim() !== ''" class="tooltip tooltip-top" data-tip="Ver notas">
                  <button class="btn btn-sm btn-square btn-primary" @click="openEditModal(contact)"> <NotepadText color="white":size="20":stroke-width="1.5"/></button>
                </div>
                <div class="tooltip" v-else>
                  <button class="btn btn-sm btn-square btn-disabled"> <NotepadText color="white":size="20":stroke-width="1.5"/></button>
                </div>                
                <div class="tooltip tooltip-top" data-tip="Editar">
                  <button class="btn btn-sm btn-square btn-primary" @click="openEditModal(contact)"> <UserRoundPen color="white":size="20":stroke-width="1.5"/></button>
                </div>
                <div class="tooltip tooltip-top" data-tip="Eliminar">
                  <button class="btn btn-sm btn-square btn-error" @click="promptForDelete(contact.id)"> <Trash2 color="white":size="20":stroke-width="1.5"/></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <Modal v-model="isFormModalOpen" :title="modalTitle">
    <ContactForm 
      :initial-data="contactToEdit"
      @submit="handleFormSubmit" 
      @cancel="isFormModalOpen = false"
    />
  </Modal>

  <ConfirmationModal
    v-model="isConfirmModalOpen"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que quieres eliminar este contacto? Esta acción es permanente y no se puede deshacer."
    confirm-text="Sí, Eliminar"
    :is-loading="isDeleting"
    @confirm="handleConfirmDelete"
    @cancel="isConfirmModalOpen = false"
  />

</template>



