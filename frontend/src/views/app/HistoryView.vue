<!-- src/views/app/ContactsView.vue -->
<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold">History View</h1>
    <p class="mt-4 text-lg">Sección History.</p>
    <div class="mt-8">
        <button class="btn btn-error" @click="useAuthStore().logout()">Cerrar Sesión</button>
    </div>


    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend class="fieldset-legend">Page details</legend>

      <label class="label">Title</label>
      <input type="text" class="input" placeholder="My awesome page" />

      <label class="label">Slug</label>
      <input type="text" class="input" placeholder="my-awesome-page" />

      <label class="label">Author</label>
      <input type="text" class="input" placeholder="Name" />
    </fieldset>

    <div role="alert" class="alert alert-success mt-10 mb-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Your purchase has been confirmed!</span>
    </div>

    <div class="stats shadow">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-8 w-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Likes</div>
        <div class="stat-value text-primary">25.6K</div>
        <div class="stat-desc">21% more than last month</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-8 w-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Page Views</div>
        <div class="stat-value text-secondary">2.6M</div>
        <div class="stat-desc">21% more than last month</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <div class="avatar avatar-online">
            <div class="w-16 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp" />
            </div>
          </div>
        </div>
        <div class="stat-value">86%</div>
        <div class="stat-title">Tasks done</div>
        <div class="stat-desc text-secondary">31 tasks remaining</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  // Importamos el store solo para el botón de logout
  import { useAuthStore } from '@/stores/auth' 
</script>