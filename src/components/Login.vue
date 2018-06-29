<template>
  <v-container fluid fill-height>
    <v-layout row align-center justify-center>
      <v-flex xs12 sm10 md8 lg6>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            label="User Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="visible ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (visible = !visible)"
            :type="visible ? 'password' : 'text'"
            name="password"
            ref="password"
            label="Enter Your Password"
            :rules="passwordRules"
            counter
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            @click="login"
            class="ml-0"
            color="primary"
          >
            Login
          </v-btn>
          <v-btn @click="clear">Clear</v-btn>
        </v-form>
      </v-flex>
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
import { Route } from 'vue-router'
import Errors from '../Lib/sdk/User/Errors'

@Component
export default class Login extends Vue {
  // valid: boolean = false
  username: string = ''
  password: string = ''
  visible: boolean = true

  passwordRules = [ v => !!v || 'Password is required' ]

  clear(): void {
    (this.$refs.form as any).reset()
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

  get valid(): boolean {
    return !!this.password && !!this.username
  }

  set valid(v: boolean) {}

  login(): void {
    this.$store.dispatch('login', {
      username: this.username,
      password: this.password,
      onComplete: err => {
        this.snackbarVisible = true
        if(err) {
          this.snackbar.text = err.message || 'Login failed : ('
          switch(err) {
            case Errors.AlreadyLoginError: this.$store.dispatch('updateLoginState', () => this.$router.replace('/')); break
            case Errors.UsernameOrPasswordError: this.password = ''; break
            case Errors.StateError: this.snackbar.text = 'Suspicious behavior detected, please restart your app'; break
          }
        } else {
          this.snackbar.text = 'Login successfully'
          this.$router.replace('/')
        }
      }
    })
  }
}
</script>

