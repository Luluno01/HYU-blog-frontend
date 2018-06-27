<template>
  <v-container fill-height fluid px-0 mx-0>
    <v-layout align-center justify-center>
      <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from 'vue-property-decorator'

@Component
export default class Splash extends Vue {}
</script>
