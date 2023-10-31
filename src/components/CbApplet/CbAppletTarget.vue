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
      :user="appletUser"
      v-bind="$attrs"
    />
  </VExpandTransition>
</template>

<script setup>
import { setActivePinia, storeToRefs } from 'pinia'
import { computed, onBeforeMount, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppletsStore } from '../../stores/applets'
import CbApplet from './CbApplet.vue'

const props = defineProps({
  /** String identifier for a specific applet name to target */
  name: {
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
  /** Designate application context for applet store */
  targetApplication: {
    type: String,
    default: 'cui'
  },
  useAlertStore: {
    type: Function,
    default: () => {}
  },
  /**
   * User info passed either directly or through pinia store
   */
  useUserStore: {
    type: Function,
    default: () => {}
  },
  user: {
    type: Object,
    default: () => ({})
  },
})
setActivePinia(props.pinia)
const { t } = useI18n()
const { name, page, area,  context } = toRefs(props)

const appletsStore = useAppletsStore()
appletsStore.appletTargetApplication = props.targetApplication
if (props.useAlertStore) {
  appletsStore.useAlertStore = props.useAlertStore
}

const fetchOptions = { errorMessage: t('error') }
const fetchApplets = () => appletsStore.fetchApplets(fetchOptions)

// Set user based on pinia UserStore if available, or directly passed user data
const appletUser = computed(() => props.useUserStore != undefined && props.useUserStore() ? props.useUserStore() : props.user ? props.user  : {} )
const appletUserName = computed(() => props.useUserStore != undefined && props.useUserStore() ?  storeToRefs(props.useUserStore()).username : appletUser.value.username || '' )
// Fetch and cache the user's applets on the CUI
watch(appletUserName, fetchApplets)
onBeforeMount(fetchApplets)

// Find which applets we should be rendering here
const targetApplets = computed(() =>
  appletsStore.getAppletsForTarget(page, area, name)
)
</script>

<i18n lang="json" locale="en">
{
  "error": "Failed to load applets."
}
</i18n>
