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
        :user-info="userInfo"
        :mini-variant="miniVariant"
      />
      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      color="primary"
      :clipped-left="clipped"
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
      <v-btn icon replace to="/about">
        <i class="material-icons">help</i>
      </v-btn>
    </v-toolbar>
    <v-content>
      <!-- Main content -->
      <v-slide-y-transition mode="out-in">
        <router-view></router-view>
      </v-slide-y-transition>
    </v-content>
    <v-footer :fixed="fixed" app class="pl-2 pr-2">
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import UserView from './components/UserView.vue'
import HelloWorld from './components/HelloWorld.vue'
import VButton from './components/Button.vue'

@Component({
  components: {
    UserView,
    HelloWorld,
    VButton
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
      icon: 'bubble_chart',
      title: 'Inspire'
    }
  ];
  miniVariant: boolean = false;

  // Top toolbar
  title: string = 'HYU-blog';

  msg: string = 'Rua!';

  // User view
  userInfo = {
    avatar: '',
    userId: 256,
    userName: 'Admin',
    extraInfo: 'Administrator of HYU-blog'
  };
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


