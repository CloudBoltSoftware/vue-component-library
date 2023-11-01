<template>
  <!-- Load the styles for all mounted applets exactly once per applet -->
  <link
    v-for="href in appletsCssHrefs"
    :key="href"
    rel="stylesheet"
    :href="href"
    data-test="applet-css"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppletsStore } from '../../stores/applets'

const { appletsCssHrefs } = storeToRefs(useAppletsStore())
</script>
