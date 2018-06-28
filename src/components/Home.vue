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
  get blogsBrief(): BlogList {
    return this.$store.state.blogBrief
  }
  mounted() {
    this.$router.replace('loading')
    let _this: any = this
    this.$store.dispatch('refreshBlogBrief', () => {
      _this.$router.replace('blogs')
    })
  }
}
</script>

<style scoped>
.viewport {
  height: 100%;
}
</style>
