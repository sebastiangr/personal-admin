<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import apiClient from '@/utils/api' // <-- ¡Importamos nuestro cliente!
  import Modal from '@/components/ui/Modal.vue' // <-- 1. Importa el Modal
  import ContactForm from '@/components/ContactForm.vue' // <-- 2. Importa el Formulario

  // --- Estado Reactivo ---
  const contacts = ref<any[]>([]) // Un array para guardar los contactos
  const isLoading = ref(true) // Para mostrar un spinner mientras cargan los datos
  const error = ref<string | null>(null) // Para mostrar mensajes de error
  const isModalOpen = ref(false)

  // --- Lógica ---

  // onMounted es un "lifecycle hook" de Vue. El código dentro de él
  // se ejecuta automáticamente justo después de que el componente se ha
  // montado en el DOM. Es el lugar perfecto para hacer llamadas a APIs.
  onMounted(async () => {
    try {
      // Usamos nuestro apiClient para hacer la petición.
      // ¡Automáticamente incluirá el token!
      const data = await apiClient.get('/api/contacts')
      contacts.value = data
    } catch (e: any) {
      error.value = e.message || 'No se pudieron cargar los contactos.'
    } finally {
      isLoading.value = false
    }
  })

  // --- Lógica de Creación de Contacto ---
  async function handleCreateContact(formData: Record<string, any>) {
    try {
      // 5. Llama a la API para crear el nuevo contacto
      const newContact = await apiClient.post('/api/contacts', formData)
      
      // 6. Actualiza la lista de contactos localmente para una UI instantánea
      contacts.value.unshift(newContact) // unshift lo añade al principio
      
      // 7. Cierra el modal
      isModalOpen.value = false
    } catch (e: any) {
      // Aquí podríamos mostrar un toast o un mensaje de error en el formulario
      console.error("Error al crear el contacto:", e)
      alert("Error: " + e.message)
    }
  }
</script>

<template>



  <div class="p-4 md:p-8">
    <div class="flex flex-wrap gap-4 justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Contactos</h1>
      <div class="flex gap-4 items-center">
        <!-- 4. Botón que abre el modal -->
        <button class="btn btn-primary" @click="isModalOpen = true">
          Añadir Contacto
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
    <div v-else>
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id" class="hover">
              <td>{{ contact.companyName }}</td>
              <td>{{ contact.contactName }}</td>
              <td>{{ contact.email }}</td>
              <td><span class="badge badge-ghost">{{ contact.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Modal v-model="isModalOpen" title="Añadir Nuevo Contacto">
    <!-- Pasamos el formulario dentro del slot por defecto del modal -->
    <ContactForm 
      @submit="handleCreateContact" 
      @cancel="isModalOpen = false"
    />
  </Modal>

</template>



