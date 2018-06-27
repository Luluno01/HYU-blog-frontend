<template>
  <v-slide-y-transition mode="out-in">
    <v-list fluid>
      <template v-for="(blog, index) in blogs">
        <v-subheader v-if="blog.header" :key="blog.header">{{ blog.header }}</v-subheader>
        <v-divider v-else-if="blog.divider" :inset="blog.inset" :key="index"></v-divider>
        <v-list-tile v-else :key="index" avatar @click="to(blog.id)">
          <v-list-tile-avatar>
            <img :src="blog.avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="blog.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="blog.subtitle"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-slide-y-transition>
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
import { BlogList } from '../types'


@Component
export default class HotBlogs extends Vue {
  get blogs(): BlogList {
    return this.$store.state.blogBrief
  }
  to(blogId: number): void {
    this.$router.replace(`/blog/${blogId}`)
  }
}
</script>
