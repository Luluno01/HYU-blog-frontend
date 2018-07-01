<template>
  <v-app class="unselectable">
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <user-view
        :user-info="$store.state.user"
        :mini-variant="miniVariant"
        ripple
        @click="profileOrLogin"
      />
      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          ripple
          @click.stop="$router.replace(item.link)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          ripple
          @click.stop="postBlog"
        >
          <v-list-tile-action>
            <summit title="Post a new blog" class="icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Post Blog</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          ripple
          @click.stop="$router.replace('signup')"
          v-if="!user.loggedIn"
        >
          <v-list-tile-action>
            <account-plus title="Sign up" class="icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign up</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          ripple
          @click.stop="logout()"
          v-if="user.loggedIn"
        >
          <v-list-tile-action>
            <logout title="Logout" class="icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      color="primary"
      :clipped-left="clipped"
      @dblclick="$vuetify.goTo(0)"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-slide-x-transition mode="out-in">
        <v-btn icon @click.stop="miniVariant = !miniVariant" v-show="drawer" class="hidden-md-and-down">
          <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-btn icon @click.stop="clipped = !clipped" v-show="drawer" class="hidden-md-and-down">
          <v-icon>web</v-icon>
        </v-btn>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-btn icon @click.stop="fixed = !fixed" v-show="drawer" class="hidden-md-and-down">
          <v-icon>remove</v-icon>
        </v-btn>
      </v-slide-x-transition>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        hide-details
        single-line
        style="max-width"
        v-model="searchWord"
        v-show="isBlogs"
      ></v-text-field>
      <v-slide-x-transition mode="out-in">
        <v-btn icon v-show="isBlogs" @click="search">
          <v-icon>search</v-icon>
        </v-btn>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-btn icon replace to="/about">
          <v-icon>help</v-icon>
        </v-btn>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-btn icon @click="refresh">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-slide-x-transition>
    </v-toolbar>
    <v-content>
      <!-- Main content -->
      <v-slide-y-transition mode="out-in">
        <router-view></router-view>
      </v-slide-y-transition>
    </v-content>
    <v-snackbar
      :timeout="snackbar.timeout"
      :bottom="true"
      v-model="snackbarVisible"
    >
      {{ snackbar.text }}
      <v-btn flat color="pink" @click.native="snackbarVisible = false">Close</v-btn>
    </v-snackbar>
    <alert
      v-model="alert.alert"
      :title="alert.title"
      :text="alert.text"
      @confirm="alert.alert = false"
    />
    <v-footer :fixed="fixed" app class="px-2 hidden-md-and-down">
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
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
import UserView from './components/UserView.vue'
import HelloWorld from './components/HelloWorld.vue'
import VButton from './components/Button.vue'
import User from './Lib/sdk/User'
import Logout from 'vue-material-design-icons/login.vue'
import AccountPlus from 'vue-material-design-icons/account-plus.vue'
import Summit from 'vue-material-design-icons/summit.vue'
import Alert from './components/Alert.vue'

@Component({
  components: {
    UserView,
    HelloWorld,
    VButton,
    Logout,
    AccountPlus,
    Summit,
    Alert
  }
})
export default class App extends Vue {
  // Navigation drawer
  clipped: boolean = true;
  drawer: boolean = false;
  fixed: boolean = false;
  buttonText: string = 'echo';
  items = [
    {
      icon: 'home',
      title: 'Home Page',
      link: '/'
    }
  ];
  miniVariant: boolean = false;
  siteName: string = 'HYU-blog'

  alert = {
    alert: false,
    title: 'Please login',
    text: 'You have to login first to proceed the operation'
  }

  searchWord: string = ''
  get isBlogs(): boolean {
    return this.$route.name == 'blogs'
  }

  search(): void {
    this.$store.commit('setSearchWord', this.searchWord)
    this.$store.dispatch('refreshHotBlogs', (err?) => {
      if(err) {
        this.snackbarVisible = true
        this.snackbar.text = 'Failed to search : ('
      }
    })
  }

  @Watch('$route')
  onRouteChange(to): void {
    if(to.name == 'blogs') this.clearSearch()
  }

  clearSearch(): void {
    this.searchWord = ''
  }

  postBlog(): void {
    if(!this.user.loggedIn) {
      this.alert.alert = true
      this.alert.title = 'Please login'
      this.alert.text = 'You have to login first to proceed the operation'
      return
    } else if(!this.user.isBlogger && !this.user.isAdmin) {
      this.alert.alert = true
      this.alert.title = 'I\'m Sorry, but...'
      this.alert.text = `You have to be a blogger or administrator.\nPlease contact the administrator of ${this.siteName} for more information.`
      return
    }
    this.$store.commit('setEdit', false)
    this.$router.replace('/edit-blog')
  }

  get snackbar() {
    return this.$store.state.snackbar
  }

  get snackbarVisible(): boolean {
    return this.snackbar.snackbar
  }

  set snackbarVisible(s: boolean) {
    this.$store.commit('snackbarVisible', s)
  }

  profileOrLogin(): void {
    if(this.user.loggedIn) {
      this.$store.commit('setProfilePageNum', 1)
      this.$store.commit('setProfilePageSize', 15)
      this.$store.dispatch('setProfileUser', {
        id: this.user.id,
        onComplete: err => {
          if(err) {
            this.snackbarVisible = true
            this.snackbar.text = 'Unable to get profile : ('
          } else {
            this.$router.replace('/profile')
          }
        }
      })
    } else this.$router.replace('/login')
  }

  // Top toolbar
  // title: string = 'HYU-blog';
  get title(): string {
    if(this.$route.name == 'home' || this.$route.name == 'blogs') return this.siteName
    else if(this.$route.meta.title) return this.$route.meta.title
    else return this.$route.name && ((this.$route.name[0]).toUpperCase() + this.$route.name.substring(1)) || this.siteName
  }

  onComplete(err?): void {
    this.snackbarVisible = true
    if(err) {
      this.snackbar.text = 'Refresh failed : ('
    } else {
      this.snackbar.text = 'Refreshed : )'
    }
  }

  refresh(): void {
    switch(this.$route.name) {
      case 'profile': this.$store.dispatch('setProfileUser', {
        id: this.$store.state.profileUser.id,
        onComplete: this.onComplete
      }); break
      case 'blog': this.$store.dispatch('getBlog', {
        id: this.$store.state.blog.id,
        onComplete: this.onComplete
      }); break
      case 'blogs': {
        this.clearSearch()
        this.$store.commit('setSearchWord', '')
        this.$store.dispatch('refreshHotBlogs', this.onComplete)
      }
    }
  }

  mounted(): void {
    this.$store.dispatch('updateLoginState')
  }

  get user(): User {
    return this.$store.state.user
  }

  logout(): void {
    this.$store.dispatch('logout', err => {
      this.snackbar.snackbar = true
      if(err) {
        this.snackbar.text = err.message
      } else {
        this.snackbar.text = 'Logged out'
      }
      if(this.$route.name == 'profile') this.$router.replace('/login')
    })
  }
}
</script>

<style>
html {
  overflow-y: auto
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: #E0E0E0;
  border: none;
}

::-webkit-scrollbar-track-piece {
  background: 0 0;
}
</style>


