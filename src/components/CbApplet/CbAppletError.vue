<template>
  <VTooltip location="bottom">
    <template #activator="{ props }">
      <VIcon v-bind="props">mdi-cancel</VIcon>
    </template>
    {{ t('error') }}
  </VTooltip>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<i18n lang="json" locale="en">
{
  "error": "There was an error loading the applet."
}
</i18n>
