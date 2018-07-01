<template>
  <div class="mx-4 px-4 mt-4 mb-0 pt-0 pb-0">
    <v-layout column wrap>
      <p class="headline">Edit blog</p>
      <v-divider></v-divider>
      <v-text-field
        name="title"
        label="Title"
        required
        v-model="title"
      ></v-text-field>
      <v-divider></v-divider>
      <mavon-editor class="no-scroll" v-model="text" />
      <v-fade-transition>
        <v-btn
          fixed
          dark
          fab
          bottom
          right
          color="accent"
          @click="submit"
          v-show="loaded"
        >
          <v-icon>check</v-icon>
          <!-- <check class="icon" fillColor="white"/> -->
        </v-btn>
      </v-fade-transition>
    </v-layout>
    <alert
      v-model="alert.alert"
      :title="alert.title"
      :text="alert.text"
      @confirm="alert.alert = false"
    />
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
import Blog from '../Lib/sdk/Blog'
import Alert from './Alert.vue'
import Check from 'vue-material-design-icons/check.vue'

@Component({
  components: {
    Check,
    Alert
  }
})
export default class EditBlog extends Vue {
  title: string = ''
  text: string = '' // '# Rua\n\n* asdf\n* qwer\n'
  loaded: boolean = false
  alert = {
    alert: false,
    title: 'Nothing changed',
    text: 'No change to submit'
  }

  @Watch('$route')
  onRouteChange(to) {
    if(to.name == 'edit-blog') {
      if(this.$store.state.edit) {
        this.title = this.$store.state.blog.title || ''
        this.text = this.$store.state.blog.text || ''
      } else {
        this.title = ''
        this.text = ''
      }
    }
  }

  mounted() {
    if(this.$store.state.edit) {
      this.title = this.$store.state.blog.title || ''
      this.text = this.$store.state.blog.text || ''
    } else {
      this.title = ''
      this.text = ''
    }
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

  submit(): void {
    if(!this.title || !this.text) {
      this.snackbarVisible = true
      this.snackbar.text = 'Blog title and text are required'
      return
    }
    let opt: { title: boolean; text: boolean } = { title: false, text: false }
    if(this.$store.state.edit) {
      if(this.title != this.$store.state.blog.title) {
        this.$store.commit('setTitle', this.title)
        opt.title = true
      }
      if(this.text != this.$store.state.blog.text) {
        this.$store.commit('setText', this.text)
        opt.text = true
      }
      if(!opt.title && !opt.text) {
        // Nothing changed
        this.alert.alert = true
      } else {
        (this.$store.state.blog as Blog).update(opt)
        .then(msg => {
          console.log('Blog updated')
          this.snackbarVisible = true
          this.snackbar.text = 'Blog updated : )'
          this.$store.dispatch('getBlog', {
            id: this.$store.state.blog.id,
            onComplete: (err?) => {
              if(err) {
                this.snackbarVisible = true
                this.snackbar.text = 'Unable to show updated blog : ('
              } else {
                this.$router.replace('/blog')
              }
            }
          })
        })
        .catch(err => {
          console.error(err)
          this.snackbarVisible = true
          this.snackbar.text = 'Unable to update blog : ('
        })
      }
    } else {
      Blog.create({
        title: this.title,
        text: this.text,
        owner: this.$store.state.user
      })
      .then(() => {
        this.snackbarVisible = true
        this.snackbar.text = 'Blog posted : )'
        this.$store.dispatch('setProfileUser', {
          id: this.$store.state.user.id,
          onComplete: (err?) => {
            if(err) {
              this.snackbarVisible = true
              this.snackbar.text = 'Blog posted, but unable to get user\'s profile'
              this.$router.replace('/')
            } else {
              this.$router.replace('/profile')
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.no-scroll {
  max-height: calc(100vh - 260px);
  z-index: inherit;
}
</style>
