<template>
  <div class="mx-4 px-4 mt-4 mb-0 pt-0 pb-0">
    <v-layout column wrap>
      <p class="headline">Edit ballot</p>
      <v-divider></v-divider>
      <v-text-field
        name="title"
        label="Title"
        required
        v-model="title"
      ></v-text-field>
      <v-divider></v-divider>
      <mavon-editor class="no-scroll mb-3" v-model="text" />
      <div v-if="!edit">
        <v-form>
          <template v-for="(option, i) in options">
            <v-slide-x-transition :key="i" mode="out-in">
              <v-layout row wrap align-center>
                <v-flex>
                  <v-text-field
                    placeholder="Option"
                    class="my-2"
                    solo
                    flat
                    v-model="option[1]"
                  ></v-text-field>
                </v-flex>
                <v-btn flat icon class="mr-0 pr-0" @click="removeOption(i)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-layout>
            </v-slide-x-transition>
          </template>
        </v-form>
        <v-btn outline color="primary" block class="py-0 ml-0" @click="addOption"><v-icon left dark>add</v-icon>New Option</v-btn>
      </div>
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
import Ballot from '../Lib/sdk/Ballot'
import Alert from './Alert.vue'
import Check from 'vue-material-design-icons/check.vue'
import Option from '../Lib/sdk/Option'

@Component({
  components: {
    Check,
    Alert
  }
})
export default class EditBallot extends Vue {
  title: string = ''
  text: string = '' // '# Rua\n\n* asdf\n* qwer\n'
  options: [ number, string][] = []
  loaded: boolean = false
  alert = {
    alert: false,
    title: 'Nothing changed',
    text: 'No change to submit'
  }
  
  get edit(): boolean { return this.$store.state.edit }

  addOption() {
    this.options.push([ this.options.length, '' ])
  }

  removeOption(index) {
    console.log(index)
    this.options.splice(index, 1)
  }

  @Watch('$route')
  onRouteChange(to) {
    if(to.name == 'edit-ballot') {
      if(this.edit) {
        this.title = this.$store.state.ballot.title || ''
        this.text = this.$store.state.ballot.text || ''
      } else {
        this.title = ''
        this.text = ''
        this.options = []
      }
    }
  }

  mounted() {
    if(this.edit) {
      this.title = this.$store.state.ballot.title || ''
      this.text = this.$store.state.ballot.text || ''
    } else {
      this.title = ''
      this.text = ''
      this.options = []
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
      this.snackbar.text = 'Ballot title, text are required'
      return
    }
    let opt: { title: boolean; text: boolean } = { title: false, text: false }
    if(this.edit) {
      if(this.title != this.$store.state.ballot.title) {
        this.$store.commit('setBallotTitle', this.title)
        opt.title = true
      }
      if(this.text != this.$store.state.ballot.text) {
        this.$store.commit('setBallotText', this.text)
        opt.text = true
      }
      if(!opt.title && !opt.text) {
        // Nothing changed
        this.alert.alert = true
      } else {
        (this.$store.state.ballot as Ballot).update(opt)
        .then(msg => {
          console.log('Ballot updated')
          this.snackbarVisible = true
          this.snackbar.text = 'Ballot updated : )'
          this.$store.dispatch('getBallot', {
            id: this.$store.state.ballot.id,
            onComplete: (err?) => {
              if(err) {
                this.snackbarVisible = true
                this.snackbar.text = 'Unable to show updated ballot : ('
              } else {
                this.$router.replace('/ballot')
              }
            }
          })
        })
        .catch(err => {
          console.error(err)
          this.snackbarVisible = true
          this.snackbar.text = 'Unable to update ballot : ('
        })
      }
    } else {
      if(this.options.length < 2 || this.options.some(option => !!option[1].match(/^\s*$/))) {
        this.snackbarVisible = true
        this.snackbar.text = 'At least 2 options are required and can not be empty'
        return
      }
      Ballot.create({
        title: this.title,
        text: this.text,
        owner: this.$store.state.user,
        options: this.options.map(o => o[1])
      })
      .then(() => {
        this.snackbarVisible = true
        this.snackbar.text = 'Ballot posted : )'
        this.$store.dispatch('setProfileUser', {
          id: this.$store.state.user.id,
          onComplete: (err?) => {
            if(err) {
              this.snackbarVisible = true
              this.snackbar.text = 'Ballot posted, but unable to get user\'s profile'
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

.btn.btn--outline {
  border: 1px dashed currentColor
}
</style>
