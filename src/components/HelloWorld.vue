<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <VProgressCircular width="10" indeterminate color="blue"/>
    <h1 class="green">{{ msg }}</h1>
    <h3>
      {{ t('success') }}
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<i18n lang="json" locale="en">
  {
    "success": "You’ve super successfully created a project with"
  }
  </i18n>


<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  color: red;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
