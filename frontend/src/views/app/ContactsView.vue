<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import apiClient from '@/utils/api' // <-- ¡Importamos nuestro cliente!
  import Modal from '@/components/ui/Modal.vue' // <-- 1. Importa el Modal
  import ContactForm from '@/components/ContactForm.vue' // <-- 2. Importa el Formulario
  import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
  import { UserRoundPlus } from 'lucide-vue-next';
  
  // --- ESTADO ---
  const contacts = ref<any[]>([]) // Un array para guardar los contactos
  const isLoading = ref(true) // Para mostrar un spinner mientras cargan los datos
  const error = ref<string | null>(null) // Para mostrar mensajes de error

  // Estado para el modal de Crear/Editar
  const isFormModalOpen = ref(false)
  const contactToEdit = ref<any | null>(null) // KEY: si es null=Crear, si tiene objeto=Editar

  // Estado para el modal de Confirmar Borrado
  const isConfirmModalOpen = ref(false)
  const contactToDeleteId = ref<string | null>(null) // Para recordar qué ID borrar
  const isDeleting = ref(false) // Para mostrar un spinner en el botón de confirmar

  // --- PROPIEDADES COMPUTADAS ---
  // El título del modal cambiará dependiendo de si estamos creando o editando.
  const modalTitle = computed(() => 
    contactToEdit.value ? 'Editar Contacto' : 'Añadir Nuevo Contacto'
  )

  // --- MÉTODOS ---

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

  // --- LÓGICA DE MODALES ---

  // Prepara el modal para CREAR un nuevo contacto
  function openCreateModal() {
    contactToEdit.value = null // Asegura que el formulario esté vacío
    isFormModalOpen.value = true
  }  

  // Prepara el modal para EDITAR un contacto existente
  function openEditModal(contact: any) {
    contactToEdit.value = contact // Asigna el contacto a editar
    isFormModalOpen.value = true
  }

  // --- LÓGICA DE ENVÍO DE FORMULARIO ---
  async function handleFormSubmit(formData: Record<string, any>) {
    try {
      if (contactToEdit.value) {
        // --- LÓGICA DE UPDATE ---
        const updatedContact = await apiClient.put(`/api/contacts/${contactToEdit.value.id}`, formData)
        // Actualiza la lista localmente
        const index = contacts.value.findIndex(c => c.id === updatedContact.id)
        if (index !== -1) {
          contacts.value[index] = updatedContact
        }
      } else {
        // --- LÓGICA DE CREATE ---
        const newContact = await apiClient.post('/api/contacts', formData)
        contacts.value.unshift(newContact)
      }
      isFormModalOpen.value = false
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }  
  
  // --- LÓGICA DE BORRADO ---

  // 1. Cuando el usuario hace clic en "Eliminar", solo preparamos el modal.
  function promptForDelete(contactId: string) {
    contactToDeleteId.value = contactId // Guardamos el ID
    isConfirmModalOpen.value = true     // Abrimos el modal de confirmación
  }

  // 2. Este método se llama solo si el usuario confirma en el modal.
  async function handleConfirmDelete() {
    if (!contactToDeleteId.value) return
    
    isDeleting.value = true
    try {
      await apiClient.delete(`/api/contacts/${contactToDeleteId.value}`)
      contacts.value = contacts.value.filter(c => c.id !== contactToDeleteId.value)
      isConfirmModalOpen.value = false // Cierra el modal de confirmación
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      isDeleting.value = false
      contactToDeleteId.value = null // Limpia el ID guardado
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
    
    <!-- Estado de Carga -->
    <div v-if="isLoading" class="text-center p-10">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>
    
    <!-- Estado de Error -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <!-- Contenido Principal (cuando todo va bien) -->              
    <div v-else class="overflow-x-auto bg-base-100 rounded-lg shadow">
      <!-- Si no hay contactos -->
      <div v-if="contacts.length === 0" class="text-center p-10 border-2 border-dashed rounded-lg">
        <p>Aún no tienes contactos.</p>
        <button class="btn btn-primary mt-4">Añadir el primero</button>
      </div>
      <!-- Si hay contactos (mostramos una tabla) -->
      <div v-else class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th> <!-- Nueva columna -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id" class="hover">
              <td>{{ contact.companyName }}</td>
              <td>{{ contact.contactName }}</td>
              <td>{{ contact.email }}</td>
              <td><span class="badge badge-ghost">{{ contact.status }}</span></td>
              <!-- Nuevos botones de acción -->
              <td class="text-right space-x-2">

                <button class="btn btn-xs btn-outline" @click="openEditModal(contact)">Editar</button>
                <!-- <button class="btn btn-xs btn-outline" @click="openEditModal(contact)">Editar</button> -->
                <button class="btn btn-xs btn-outline btn-error" @click="promptForDelete(contact.id)">Eliminar</button>
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



