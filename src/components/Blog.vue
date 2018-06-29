<template>
  <div class="viewport mx-4 px-4 mt-4">
    <!-- Author -->
    <div class="mx-0 px-0">
      <v-layout row wrap align-center>
        <img :src="blog.owner.avatar" alt="avatar" width="64px">
        <v-layout column wrap class="ml-3" justify-center>
          <span class="subheading">{{ blog.owner.userName }}</span>
          <span class="body-2">{{ blog.time.toLocaleString() }}</span>
        </v-layout>
      </v-layout>
    </div>
    <!-- Text -->
    <div class="mx-0 px-0 mb-5">
      <v-layout column wrap>
        <p class="headline">{{ blog.title }}</p>
        <v-divider></v-divider>
        <vue-markdown>{{ blog.text }}</vue-markdown>
      </v-layout>
    </div>
    <!-- End marker -->
    <p class="text-xs-center"><v-icon>check</v-icon>End.</p>
    <!-- Comment -->
    <strong class="subheading">{{ this.$store.state.blog.comments.length }} Comment{{ this.$store.state.blog.comments.length > 1 ? 's' : '' }}</strong>
    <div class="mx-0 px-0 pt-0" v-if="this.$store.state.blog.comments.length">
      <comment v-for="comment in this.$store.state.blog.comments" :key="comment.id" :comment="comment"></comment>
    </div>
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
import generateAvatar from '../Lib/generateAvatar'
import VueMarkdown from 'vue-markdown'
import '@/assets/css/public.css'


@Component({
  components: {
    VueMarkdown,
    Comment
  }
})
export default class Blog extends Vue {
  get blog() {
    return this.$store.state.blog
  }
}
</script>
