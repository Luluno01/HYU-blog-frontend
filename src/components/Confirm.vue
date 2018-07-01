<template>
  <v-layout row justify-center v-show="value" style="position: absolute">
    <v-dialog v-model="_confirm" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="confirm()">Confirm</v-btn>
          <v-btn color="grey darken-1" flat @click.native="cancel()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

@Component
export default class Confirm extends Vue {
  @Model('input', { type: Boolean }) value!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) text!: string

  get _confirm(): boolean {
    return this.value
  }

  set _confirm(con: boolean) {
    this.close(con)
  }

  @Emit('confirm')
  confirm(): void {
    this.close()
  }

  @Emit('cancel')
  cancel(): void {
    this.close()
  }

  @Emit('input')
  close(con: boolean = false) {}
}
</script>
