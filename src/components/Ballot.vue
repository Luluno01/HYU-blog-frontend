<template>
  <div class="vieport mx-4 px-4 mt-4">
    <!-- Author -->
    <div class="mx-0 px-0 mb-3">
      <v-layout row wrap align-center>
        <img :src="ballot.owner.avatar" alt="avatar" width="64px">
        <v-layout column wrap class="ml-3" justify-center>
          <span class="subheading">{{ ballot.owner.nickname }}</span>
          <span class="body-2">{{ new Date(ballot.updatedAt).toLocaleString() }}</span>
        </v-layout>
      </v-layout>
    </div>
    <!-- Text -->
    <div class="mx-0 px-0 mb-5">
      <v-layout column wrap>
        <p class="headline">{{ ballot.title }}</p>
        <v-divider></v-divider>
        <mavon-editor
          :toolbars-flag="false"
          :subfield="false"
          default-open="preview"
          :box-shadow="false"
          :editable="false"
          :value="ballot.text"
        />
        <!-- <vue-markdown>{{ ballot.text }}</vue-markdown> -->
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
            v-for="option in ballot.options"
            :key="option.id"
            :label="option.title"
            :value="option.id"
            disabled
          ></v-radio>
        </v-radio-group>
        <div v-if="ballot.chosen">
          <v-alert v-model="vAlert" type="warning" color="error" outline icon="warning" dismissible transition="fade-transition">
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
      :text="`You have chosen: ${selectedTitle}`"
    />
    <alert
      v-model="alert.alert"
      :title="alert.title"
      :text="alert.text"
      @confirm="aConfirm"
    />
    <v-fade-transition>
      <v-speed-dial
        v-model="fab"
        fixed
        :bottom="true"
        :right="true"
        direction="top"
        :open-on-hover="false"
        v-show="loaded"
        transition="slide-y-reverse-transition"
      >
        <v-btn
          slot="activator"
          v-model="fab"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="green"
          v-if="isOwnerOrAdmin"
          @click="edit"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="indigo"
          v-if="isBlogger"
          @click="create"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
          v-if="isOwnerOrAdmin"
          @click="del"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fade-transition>
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
import Alert from './Alert.vue'
import generateAvatar from '../Lib/generateAvatar'
import Ball from '../Lib/sdk/Ballot'
import { Route } from 'vue-router'
import User from '../Lib/sdk/User'


@Component({
  components: {
    Confirm,
    Alert
  }
})
export default class Ballot extends Vue {
  selected: number = -1
  vAlert: boolean = false
  confirmTitle: string = ''
  disabled: boolean = false
  loaded: boolean = false
  confirm: boolean = false
  alert = {
    alert: false,
    title: 'Please login',
    text: 'You have to login first to proceed the operation'
  }
  fab: boolean = false
  selectedTitle: string = ''

  get isBlogger(): boolean { return this.$store.state.user.isBlogger }
  get isOwnerOrAdmin(): boolean {
    if(this.$store.state.user.isAdmin || this.$store.state.user.id == this.ballot.owner.id) return true
    else return false
  }

  get snackbar() {
    return this.$store.state.snackbar
  }

  set snackbarVisible(s: boolean) {
    this.$store.commit('snackbarVisible', s)
  }

  get snackbarVisible(): boolean {
    return this.snackbar.snackbar
  }

  resetAlert(): void {
    this.vAlert = !!this.$store.state.ballot.chosen
  }
  get ballot(): Ball {
    return this.$store.state.ballot
  }

  get selectedOption(): { title: string, votes: number, id: number } {
    return (this.ballot.options[this.selected] || { title: 'Error', votes: -1, id: 0 }) as any
  }

  get user(): User {
    return this.$store.state.user
  }

  vote(selected) {
    this.selectedTitle = this.selectedOption.title
    this.confirm = true
  }

  _confirm() {
    // TODO: Vote
    this.snackbarVisible = true
    this.$store.dispatch('vote', {
      id: this.selectedOption.id,
      onComplete: (err?) => {
        if(err) {
          this.snackbar.text = 'Vote failed : ('
          this.selected = -1
        } else {
          this.disabled = true
          this.snackbar.text = 'Vote successful!'
        }
      }
    })
  }

  _cancel() {
    // Reset selection
    this.confirm = false
    this.selected = -1
  }

  mounted(): void {
    this.resetAlert()
    setTimeout(() => {
      this.loaded = true
    }, 500)
  }

  aConfirm(): void {
    this.alert.alert = false
    if(!this.user.loggedIn) this.$router.replace('/login')
  }

  create(): void {
    if(!this.user.loggedIn) {
      this.alert.alert = true
      this.alert.title = 'Please login'
      this.alert.text = 'You have to login first to proceed the operation :P'
      return
    } else if(!this.user.isBlogger && !this.user.isAdmin) {
      this.alert.alert = true
      this.alert.title = 'I\'m Sorry, but...'
      this.alert.text = `You have to be a blogger or administrator.\nPlease contact the administrator of ${(this.$root as any).siteName} for more information :P`
      return
    }
    this.$store.commit('setEdit', false)
    this.$router.replace('/edit-ballot')
  }

  edit(): void {
    if(!this.user.loggedIn) {
      this.alert.alert = true
      this.alert.title = 'Please login'
      this.alert.text = 'You have to login first to proceed the operation :P'
      return
    } else if(!this.isOwnerOrAdmin) {
      this.alert.alert = true
      this.alert.title = 'I\'m Sorry, but...'
      this.alert.text = 'You have to be the owner of this blog or administrator :P'
      return
    }
    this.$store.commit('setEdit', true)
    this.$router.replace('/edit-ballot')
  }

  del(): void {
    if(!this.user.loggedIn) {
      this.alert.alert = true
      this.alert.title = 'Please login'
      this.alert.text = 'You have to login first to proceed the operation :P'
      return
    } else if(!this.isOwnerOrAdmin) {
      this.alert.alert = true
      this.alert.title = 'I\'m Sorry, but...'
      this.alert.text = 'You have to be the owner of this blog or administrator :P'
      return
    }
    this.$store.dispatch('deleteBallot', (err?) => {
      this.snackbarVisible = true
      if(err) {
        this.snackbar.text = 'Unable to delete blog : ('
      } else {
        this.snackbar.text = 'Blog deleted : )'
        this.$router.replace('/')
      }
    })
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    if(to.name == 'ballot') this.resetAlert()
  }
}
</script>

<style scoped>
.markdown-body {
  min-height: inherit;
}
</style>
