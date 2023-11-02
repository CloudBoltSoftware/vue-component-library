<template>
  <!-- The VExpandTransition provides a little animation as applets load in to keep elements from jumping around on the page too unpredictably. -->
  <VExpandTransition>
    <CbApplet
      v-for="applet in targetApplets"
      :id="applet.id"
      :key="applet.id"
      :api="api"
      :page="page"
      :area="area"
      :context="context"
      :user="user"
      v-bind="$attrs"
    />
  </VExpandTransition>
</template>

<script setup>
import { setActivePinia } from 'pinia'
import { computed, onBeforeMount, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppletsStore } from '../../stores/applets'
import CbApplet from './CbApplet.vue'

const props = defineProps({
  /** String identifier for a specific applet id to target */
  appletId: {
    type: String,
    default: undefined
  },
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
    default: undefined
  },
  /** Pinia context to pass to the applet */
  pinia: {
    type: Object,
    required: true
  },
  /** API context to pass to the applet */
  api: {
    type: Object,
    required: true
  },
  /** Designate application context for applet store */
  targetApplication: {
    type: String,
    default: ''
  },
  user: {
    type: Object,
    default: () => ({})
  }
})
setActivePinia(props.pinia)
const { t } = useI18n()
const { appletId, page, area, context } = toRefs(props)

const appletsStore = useAppletsStore()
appletsStore.appletTargetApplication = props.targetApplication

const fetchOptions = { errorMessage: t('error') }
const fetchApplets = () => appletsStore.fetchApplets(props.api, fetchOptions)

// Fetch and cache the user's applets on the CUI
const appletUserName = computed(() => props.user?.username || '')
watch(appletUserName, fetchApplets)
onBeforeMount(fetchApplets)

// Find which applets we should be rendering here
const targetApplets = computed(() => appletsStore.getAppletsForTarget(page, area, appletId))
</script>

<i18n lang="json" locale="en">
{
  "error": "Failed to load applets."
}
</i18n>
