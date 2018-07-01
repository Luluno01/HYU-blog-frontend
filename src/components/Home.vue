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
import HotBallots from './HotBallots.vue'
import generateAvatar from '../Lib/generateAvatar'
import { BlogList } from '../types'


@Component({
  components: {
    Splash,
    HotBlogs,
    HotBallots
  }
})
export default class Home extends Vue {
  refresh(): void {
    this.$router.replace('loading')
    let _this = this
    if(this.$store.state.home == 'blogs') {
      this.$store.dispatch('refreshHotBlogs', () => {
        _this.$router.replace('blogs')
      })
    } else {
      this.$store.dispatch('refreshHotBallots', () => {
        _this.$router.replace('ballots')
      })
    }
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
