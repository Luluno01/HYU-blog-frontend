<template>
  <div class="mx-4 px-4 my-4">
    <!-- Author -->
    <div class="mx-0 px-0 mb-3">
      <v-layout row wrap align-center>
        <img :src="blog.owner.avatar" alt="avatar" width="64px">
        <v-layout column wrap class="ml-3" justify-center>
          <span class="subheading">{{ blog.owner.nickname }}</span>
          <span class="body-2">{{ new Date(blog.updatedAt).toLocaleString() }}</span>
        </v-layout>
      </v-layout>
    </div>
    <!-- Text -->
    <div class="mx-0 px-0 mb-5">
      <v-layout column wrap>
        <p class="headline">{{ blog.title }}</p>
        <v-divider></v-divider>
        <!-- <vue-markdown>{{ blog.text }}</vue-markdown> -->
        <mavon-editor
          :toolbars-flag="false"
          :subfield="false"
          default-open="preview"
          :box-shadow="false"
          :editable="false"
          :value="blog.text"
        />
      </v-layout>
    </div>
    <!-- End marker -->
    <p class="text-xs-center"><v-icon>check</v-icon>End.</p>
    <!-- Comment -->
    <v-divider></v-divider>
    <strong class="subheading">Comment</strong>
    <mavon-editor v-model="comment" class="mb-3" />
    <v-btn class="hidden-md-and-up" block @click="submitComment" :disabled="!comment || !!comment.match(/^\s*$/)">Submit Comment</v-btn>
    <v-layout row wrap>
      <strong class="subheading" style="padding-top: 24px">{{ this.$store.state.blog.comments && this.$store.state.blog.comments.length || 'No' }} Comment{{ (this.$store.state.blog.comments && this.$store.state.blog.comments.length > 1 ? 's' : '') || '' }}</strong>
      <v-spacer></v-spacer>
      <v-btn class="mr-0 hidden-sm-and-down" @click="submitComment" :disabled="!comment || !!comment.match(/^\s*$/)">Submit Comment</v-btn>
    </v-layout>
    <div class="mx-0 px-0 pt-0" v-if="this.$store.state.blog.comments && this.$store.state.blog.comments.length">
      <comment v-for="comment in this.$store.state.blog.comments" :key="comment.id" :comment="comment"></comment>
    </div>
    <alert
      v-model="alert.alert"
      :title="alert.title"
      :text="alert.text"
      @confirm="confirm"
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
import Comment from './Comment.vue'
import Alert from './Alert.vue'
import Confirm from './Confirm.vue'
import Com from '../Lib/sdk/Comment'
import User from '../Lib/sdk/User'
import BlogModel from '../Lib/sdk/Blog'
import getScroll from '../Lib/getScroll'
import generateAvatar from '../Lib/generateAvatar'


@Component({
  components: {
    Comment,
    Alert,
    Confirm
  }
})
export default class Blog extends Vue {
  fab: boolean = false
  loaded: boolean = false
  get isBlogger(): boolean { return this.$store.state.user.isBlogger }
  get isOwnerOrAdmin(): boolean {
    if(this.$store.state.user.isAdmin || this.$store.state.user.id == this.blog.owner.id) return true
    else return false
  }
  get blog(): BlogModel {
    return this.$store.state.blog
  }
  alert = {
    alert: false,
    title: 'Please login',
    text: 'You have to login first to proceed the operation'
  }
  get user(): User {
    return this.$store.state.user
  }

  comment: string = ''

  mounted() {
    setTimeout(() => {
      this.loaded = true
    }, 500)
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

  confirm(): void {
    this.alert.alert = false
    if(!this.user.loggedIn) this.$router.replace('/login')
  }

  submitComment(): void {
    if(!this.user.loggedIn) {
      this.alert.alert = true
      this.alert.title = 'Please login'
      this.alert.text = 'You have to login first to comment :P'
      return
    }
    Com.create({
      blog: this.blog.id,
      text: this.comment,
      owner: this.user.id
    })
    .then(msg => {
      this.snackbarVisible = true
      this.snackbar.text = 'Comment posted'
      this.comment = ''
      this.$store.dispatch('getBlog', {
        id: this.blog.id,
        onComplete: (err?) => {
          if(!err) this.$nextTick(() => (this as any).$vuetify.goTo(getScroll.scrollHeight))
        }
      })
    })
    .catch(err => {
      this.snackbarVisible = true
      this.snackbar.text = 'Comment failed : ('
    })
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
    this.$router.replace('/edit-blog')
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
    this.$router.replace('/edit-blog')
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
    this.$store.dispatch('deleteBlog', (err?) => {
      this.snackbarVisible = true
      if(err) {
        this.snackbar.text = 'Unable to delete blog : ('
      } else {
        this.snackbar.text = 'Blog deleted : )'
        this.$router.replace('/')
      }
    })
  }
}
</script>

<style scoped>
.markdown-body {
  min-height: inherit;
  max-height: calc(100vh - 150px);
}
</style>
