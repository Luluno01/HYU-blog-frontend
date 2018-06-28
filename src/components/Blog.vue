<template>
  <v-container mx-4>
    <!-- Author -->
    <v-container mx-0 px-0>
      <v-layout row wrap align-center>
        <img :src="avatar" alt="avatar" width="64px">
        <v-layout column wrap class="ml-3" justify-center>
          <span class="subheading">{{ blog.owner.userName }}</span>
          <span class="body-2">{{ blog.time.toLocaleString() }}</span>
        </v-layout>
      </v-layout>
    </v-container>
    <!-- Text -->
    <v-container mx-0 px-0 mb-5>
      <v-layout column wrap>
        <p class="headline">{{ blog.title }}</p>
        <v-divider></v-divider>
        <vue-markdown>{{ blog.text }}</vue-markdown>
      </v-layout>
    </v-container>
    <p class="text-xs-center">End.</p>
    <!-- Comment -->
    <strong class="subheading">{{ this.$store.state.blog.comments.length }} Comment{{ this.$store.state.blog.comments.length > 1 ? 's' : '' }}</strong>
    <v-container mx-0 px-0 pt-0>
      <comment v-for="comment in this.$store.state.blog.comments" :key="comment.id" :comment="comment"></comment>
    </v-container>
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
import Comment from './Comment.vue'
import generateAvatar from '../Lib/generateAvatar'
import VueMarkdown from 'vue-markdown'


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
  get avatar(): string {
    if(this.blog.owner.avatar && this.blog.owner.avatar != 'default') return this.blog.owner.avatar
    return generateAvatar(this.blog.owner.userName, this.blog.owner.userId)
  }
}
</script>
