<template>
  <div class="viewport">
    <v-fade-transition mode="out-in">
      <router-view></router-view>
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
import Splash from './Splash.vue'
import HotBlogs from './HotBlogs.vue'
import generateAvatar from '../Lib/generateAvatar'
import { BlogList } from '../types'


@Component({
  components: {
    Splash,
    HotBlogs
  }
})
export default class Home extends Vue {
  get hotBlogs(): BlogList {
    return this.$store.state.hotBlogs
  }

  refresh(): void {
    this.$router.replace('loading')
    let _this = this
    this.$store.dispatch('refreshHotBlogs', () => {
      _this.$router.replace('blogs')
    })
  }

  mounted(): void {
    this.refresh()
  }

  @Watch('$route')
  onRouteChange(to, from) {
    if(to.name == 'home') this.refresh()
  }
}
</script>
