<template>
  <VApp>
    <component :is="is" v-bind="combinedAttrs">
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps || {}" />
      </template>
    </component>
  </VApp>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const props = defineProps({
  // component requires v-binding to an is prop.
  // eslint-disable-next-line vue/no-reserved-props
  is: {
    type: Object,
    required: true
  },
  // Handling this prop manually, else VApp eats it.
  attributes: {
    type: Array,
    default: () => []
  }
})

/**
 * If a prop called "attributes" is passed in, add it to the attrs we bind to the wrapped component.
 * Otherwise:
 *   If we rely on just binding it to $attrs, then VApp will eat 'attributes'.
 *   If we add "attributes" to every component, some components will spit out warnings.
 */
const combinedAttrs = computed(() => {
  if (!props.attributes.length) return useAttrs()

  return {
    ...useAttrs(),
    attributes: props.attributes
  }
})
</script>
