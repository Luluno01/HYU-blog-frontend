<template>
  <v-layout column align-center>
    <v-btn color="success" @click="echo()">{{ text }}</v-btn>
  </v-layout>
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

@Component({
  props: {
    text: String
  }
})
export default class Button extends Vue {
  echo(): void {
    console.log('In sub-component')
    this.$emit('click', 'In sub-component')
  }
}
</script>
