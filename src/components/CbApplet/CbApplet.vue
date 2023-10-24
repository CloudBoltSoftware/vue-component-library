<template>
  <component
    :is="importedComponentModule"
    :api="api"
    :user="useUserStore()"
    :area="area"
    :page="page"
    :context="context"
    @configure="configure"
  />
</template>

<script setup>
import api from '@/api'
import { useAppletsStore } from '@/stores/applets'
import { useUserStore } from '@/stores/user'
import { computed, defineAsyncComponent, toRefs } from 'vue'
import CbAppletError from './CbAppletError.vue'
import CbAppletLoading from './CbAppletLoading.vue'

const props = defineProps({
  /** The Applet's id */
  id: {
    type: String,
    required: true
  },
  // The rest are being explicitly called and passed down to the component
  // for easier testing and explicit warnings in dev mode. Otherwise we'd just
  // normally bind the attrs to the component.
  area: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  },
  context: {
    type: Object,
    default: () => {}
  },
  /**
   * Normally, we'd create a `configure` emit. However, we want to check whether or not there
   * is one set. This isn't possible with a normal emit. See Vue discussion here:
   * https://github.com/vuejs/core/issues/5220
   *
   * The workaround is to define the emit as a prop with a prefix 'on' instead.
   */
  onConfigure: {
    type: Function,
    default: undefined
  }
})

const { id, area, page, context } = toRefs(props)

/**
 * Whereas the `context` event allows every target to pass in arbitrary data, the `configure` event
 * allows the applet to pass arbitrary data back to the target. This is useful for applets that
 * do more than just display the applet, like the `ResourceDetailsTab` which also renders a tab.
 *
 * Applets should always be able to emit the `configure` event with no argument to get instructions
 * on what configuration is available for this target.
 */
const configure = (configuration) => {
  // If there is a configure event handler on this component, call it to allow any CbAppletWrappers to
  // handle the configuration. This allows us to handle configuration differently for different targets
  // if they wrap this component.
  if (props.onConfigure && typeof props.onConfigure === 'function') {
    props.onConfigure(configuration)
    return
  }

  // Otherwise, do the shared global configuration (which is a noop).
  // If we do want to support configuration for all CbApplets, we should implement it below and update the
  // help text message to describe the available options.

  // By convention, if there are no args we should console.log some help text to make the available
  // configuration options discoverable.
  const helpText = `The applet "${id.value}" on page "${page.value}", area "${area.value}" has no configuration options available.`
  if (!configuration) {
    // When a configure event is emitted with no argument, we should console.log out some help text for
    // What's available for this target. In this general case (unless overridden by adding a `configure` handler)
    // we should just log out that there are no configuration options available.
    // eslint-disable-next-line no-console
    console.log(helpText)
    return
  } else {
    // Remember to also validate the configuration and give good warning messages to help out the applet author.
    // eslint-disable-next-line no-console
    console.log(
      helpText +
        ' However, the applet tried to configure it with the following options:',
      configuration
    )
  }
}

// Load the applet from the store
const { getApplet } = useAppletsStore()
const applet = computed(() => getApplet(id.value) || {})

// We're defining this component here rather than in the store because
// it's lazier and potentially more efficient.
const importedComponentModule = defineAsyncComponent({
  loadingComponent: CbAppletLoading,
  errorComponent: CbAppletError,
  loader: async () =>
    await import(/* @vite-ignore */ applet.value.entryComponent)
})
</script>
