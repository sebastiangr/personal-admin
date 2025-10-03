<script setup lang="ts">

  import { RouterView } from 'vue-router';
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

  <RouterView />

  <ul class="flex flex-row bottom">
    <li><a>Home</a></li>
    <li><a>Home</a></li>
    <li><a>History</a></li>
    <li><a>Contact</a></li>    
    <li><a>Login</a></li>    
  </ul>

</template>

<style scoped>

</style>
