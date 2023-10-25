<template>
  <!-- The VExpandTransition provides a little animation as applets load in to keep elements from jumping around on the page too unpredictably. -->
  <VExpandTransition>
    <CbApplet
      v-for="applet in targetApplets"
      :id="applet.id"
      :key="applet.id"
      :page="page"
      :area="area"
      :context="context"
      v-bind="$attrs"
    />
  </VExpandTransition>
</template>

<script setup>
import { setActivePinia, storeToRefs } from 'pinia'
import { computed, onBeforeMount, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppletsStore } from '../../stores/applets'
import { useUserStore } from '../../stores/user'
import CbApplet from './CbApplet.vue'

const props = defineProps({
  /** String identifier for where on the page this target is */
  area: {
    type: String,
    required: true
  },
  /** Any additional info to pass to the applet */
  context: {
    type: Object,
    default: () => ({})
  },
  /** Name for target location. Defaults to the current route name if accessible. */
  page: {
    type: String,
    default: null
  },
  /** Pinia context to pass to the applet */
  pinia: {
    type: Object,
    required: true
  },
  /** Designate HUI or CUI version context */
  version: {
    type: String,
    default: 'cui'
  },
})
setActivePinia(props.pinia)

const { t } = useI18n()
const { page, area, context } = toRefs(props)
const appletsStore = useAppletsStore()
appletsStore.updateVersion(props.version)
const fetchOptions = { errorMessage: t('error') }
const fetchApplets = () => appletsStore.fetchApplets(fetchOptions)

// Fetch and cache the user's applets on the CUI
const userStore = useUserStore()
const { username } = storeToRefs(userStore)
watch(username, fetchApplets)
onBeforeMount(fetchApplets)

// Find which applets we should be rendering here
const targetApplets = computed(() =>
  appletsStore.getAppletsForTarget(page, area)
)
</script>

<i18n lang="json" locale="en">
{
  "error": "Failed to load applets."
}
</i18n>