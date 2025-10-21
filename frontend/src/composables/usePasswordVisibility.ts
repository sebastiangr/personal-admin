import { ref, computed, onUnmounted, type Ref } from 'vue';

export function usePasswordVisibility(timeoutDuration: number = 3000) {
  
  const isVisible = ref(false);
  let timeoutId: number | undefined = undefined;

  const fieldType = computed(() => (isVisible.value ? 'text' : 'password'));

  function toggle() {
    isVisible.value = !isVisible.value;

    clearTimeout(timeoutId);

    if (isVisible.value) {
      timeoutId = setTimeout(() => {
        isVisible.value = false;
      }, timeoutDuration);
    }
  }

  onUnmounted(() => {
    clearTimeout(timeoutId);
  });

  return {
    isVisible,
    fieldType,
    toggle,
  };
}