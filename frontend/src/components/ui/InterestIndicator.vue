<script setup lang="ts">
  defineProps<{ level: 1 | 2 | 3 }>();
</script>

<template>
  <div class="flex items-center justify-center gap-1" :title="`Nivel de interés: ${level}`">
    <div 
      class="h-4 w-4 rounded-full"
      :class="level >= 1 ? 'bg-error' : 'bg-base-300 opacity-20'"
    ></div>
    <div 
      class="h-4 w-4 rounded-full"
      :class="level >= 2 ? 'bg-warning' : 'bg-base-300 opacity-20'"
    ></div>
    <div 
      class="h-4 w-4 rounded-full"
      :class="level === 3 ? 'bg-success' : 'bg-base-300 opacity-20'"
    ></div>
  </div>
</template>