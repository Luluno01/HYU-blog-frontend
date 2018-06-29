<template>
  <v-container fluid mx-0 my-0 px-0 py-0>
    <!-- User view -->
    <v-layout mx-auto pt-5 pb-3 justify-center align-center class="grey lighten-4">
      <v-flex offset-xs3>
        <v-layout row justify-center align-center>
          <v-avatar
            :tile="false"
            :size="125"
            color="grey lighten-4"
          >
            <img :src="user.avatar" alt="avatar">
          </v-avatar>
          <v-layout align-center justify-left fill-height pl-3>
            <div>
              <div class="headline">{{ user.nickname }}</div>
              <div class="subheading" v-if="user.id">UID: {{ user.id }}</div>
              <div v-if="user.isBlogger">{{ user.isBlogger ? 'Blogger' : 'Visitor' }}</div>
            </div>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
    <hot-blogs :profile="true"></hot-blogs>
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
import HotBlogs from './HotBlogs.vue'

@Component({
  components: {
    HotBlogs
  }
})
export default class Profile extends Vue {
  dummy: number = 1
  get user() {
    return this.$store.state.user
  }
}
</script>
