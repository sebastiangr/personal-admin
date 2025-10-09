<script setup lang="ts">
  import { ChevronUp, ChevronDown } from 'lucide-vue-next'
  import { computed } from 'vue'
  
  const props = defineProps<{
    sortKey: string
    sortOrder: 'asc' | 'desc'
    currentKey: string
  }>()

  const isActive = computed(() => props.sortKey === props.currentKey)  
</script>

<template>
  <div class="transition-opacity" :class="isActive ? 'opacity-100' : 'opacity-30 hover:opacity-70'">
    <!-- <div v-if="sortKey === currentKey">
      <ChevronUp v-if="sortOrder === 'asc'" :size="16" />
      <ChevronDown v-else :size="16" />
    </div> -->

    <div v-if="!isActive" class="flex flex-col">
      <ChevronUp :size="16" class="-mb-1" />
      <ChevronDown :size="16" class="-mt-1" />
    </div>
    <div v-else>
      <ChevronUp v-if="sortOrder === 'asc'" :size="16" />
      <ChevronDown v-else :size="16" />
    </div>
  </div>
</template>