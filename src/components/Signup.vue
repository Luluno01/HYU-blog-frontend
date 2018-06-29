<template>
  <v-container fluid fill-height>
    <v-layout row align-center justify-center>
      <v-flex xs12 sm10 md8 lg6>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            :counter="32"
            label="User Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="nickname"
            :rules="nameRules"
            :counter="32"
            label="Nickname"
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
            hint="At least 8 characters"
            :rules="passwordRules"
            min="8"
            counter
            required
          ></v-text-field>
          <v-text-field
            v-model="password2"
            :append-icon="visible2 ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (visible2 = !visible2)"
            :type="visible2 ? 'password' : 'text'"
            name="password"
            label="Repeat Your Password"
            hint="Make sure you still remember your password"
            :rules="passwordRepeatRules"
            counter
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            @click="signup"
            class="ml-0"
            color="primary"
          >
            Sign up
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
export default class Signup extends Vue {
  // valid: boolean = false
  username: string = ''
  nickname: string = ''
  nameRules = [
    v => !!v || 'Name is required',
    v => (v && v.length <= 32) || 'Name must be less than 32 characters'
  ]
  password: string = ''
  password2: string = ''
  visible: boolean = false
  visible2: boolean = false
  passwordRules = [
    v => !!v || 'Password is required',
    v => (v && v.length >= 8) || 'Password must be longer than 8 characters'
  ]
  passwordRepeatRules = [
    v => !!v || 'Please repeat your password',
    v => (v && v == (this.$refs.password as any).value) || 'Password must match'
  ]
  
  get valid(): boolean {
    if(this.nameRules.every(v => typeof v(this.username) == 'boolean' && typeof v(this.nickname) == 'boolean')) {
      if(this.passwordRules.every(v => typeof v(this.password) == 'boolean')) {
        if(this.passwordRepeatRules.every(v => typeof v(this.password2) == 'boolean')) {
          return true
        }
      }
    }
    return false
  }

  set valid(v: boolean) {}

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

  signup(): void {
    this.$store.dispatch('signup', {
      username: this.username,
      nickname: this.nickname,
      password: this.password,
      onComplete: err => {
        this.snackbarVisible = true
        if(err) {
          if(err instanceof Errors.UsernameExistsError) this.username = ''
          this.snackbar.text = err.message || 'Sign up failed : ('
        } else {
          this.snackbar.text = 'Signed up successfully'
          this.$router.replace('/login')
        }
      }
    })
  }
}
</script>

