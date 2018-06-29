<template>
  <div class="vieport mx-4 px-4 mt-4">
    <!-- Author -->
    <div class="mx-0 px-0">
      <v-layout row wrap align-center>
        <img :src="ballot.owner.avatar" alt="avatar" width="64px">
        <v-layout column wrap class="ml-3" justify-center>
          <span class="subheading">{{ ballot.owner.userName }}</span>
          <span class="body-2">{{ ballot.time.toLocaleString() }}</span>
        </v-layout>
      </v-layout>
    </div>
    <!-- Text -->
    <div class="mx-0 px-0 mb-5">
      <v-layout column wrap>
        <p class="headline">{{ ballot.title }}</p>
        <v-divider></v-divider>
        <vue-markdown>{{ ballot.text }}</vue-markdown>
        <v-radio-group v-if="!ballot.chosen" v-model="selected" @change="vote" :mandatory="false">
          <v-radio
            v-for="(option, i) in ballot.options"
            :key="i"
            :label="option.title"
            :value="i"
            :disabled="disabled"
            ref="radio"
          ></v-radio>
        </v-radio-group>
        <v-radio-group v-else v-model="ballot.chosen" :mandatory="false">
          <v-radio
            v-for="(option, i) in ballot.options"
            :key="i"
            :label="option.title"
            :value="option.id"
            disabled
          ></v-radio>
        </v-radio-group>
        <div v-if="ballot.chosen">
          <v-alert v-model="alert" type="warning" color="error" outline icon="warning" dismissible transition="fade-transition">
            You have already voted.
          </v-alert>
        </div>
      </v-layout>
    </div>
    <!-- End marker -->
    <p class="text-xs-center"><v-icon>check</v-icon>End.</p>
    <confirm
      v-model="confirm"
      @confirm="_confirm()"
      @cancel="_cancel()"
      title="Please confirm your choice"
      :text="`You have chosen: ${selectedOption.title}`"
    />
    <v-snackbar
      :timeout="snackbar.timeout"
      :bottom="true"
      v-model="snackbar.snackbar"
    >
      {{ snackbar.text }}
      <v-btn flat color="pink" @click.native="snackbar.snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
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
import Confirm from './Confirm.vue'
import generateAvatar from '../Lib/generateAvatar'
import VueMarkdown from 'vue-markdown'
import '@/assets/css/public.css'
import { Route } from 'vue-router'


@Component({
  components: {
    VueMarkdown,
    Confirm
  }
})
export default class Ballot extends Vue {
  selected: number = -1
  alert: boolean = false
  confirm: boolean = false
  confirmTitle: string = ''
  disabled: boolean = false

  snackbar = {
    snackbar: false,
    timeout: 3000,
    text: ''
  }

  resetAlert(): void {
    this.alert = !!this.$store.state.ballot.chosen
  }
  get ballot() {
    return this.$store.state.ballot
  }

  get selectedOption(): { title: string, votes: number, id: number } {
    return this.ballot.options[this.selected] || {}
  }

  vote(selected) {
    this.confirm = true
  }

  _confirm() {
    // TODO: Vote
    this.snackbar.snackbar = true
    if(Math.random() > 0.5) {
      this.snackbar.text = 'Vote failed : ('
      this.selected = -1
    } else {
      this.disabled = true
      this.snackbar.text = 'Vote successful!'
    }
  }

  _cancel() {
    // Reset selection
    this.selected = -1
  }

  mounted(): void {
    this.resetAlert()
  }
  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    if(to.name == 'ballot') this.resetAlert()
  }
}
</script>
