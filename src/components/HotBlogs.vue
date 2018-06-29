<template>
  <v-container fluid class="mx-0 my-0 px-0 py-0">
    <!-- PC -->
    <v-slide-y-transition mode="out-in">
      <v-container fluid class="hidden-sm-and-down mt-0">
        <v-layout column align-center>
          <v-data-table
            :headers="profile ? profileHeaders : headers"
            :items="blogs"
            :rows-per-page-items="[25, 10, 15, 20]"
            class="mx-auto"
            style="min-width: 60%"
          >
            <template slot="items" slot-scope="props">
              <td v-if="!profile">
                <v-layout row align-center>
                  <v-avatar
                    :tile="false"
                    :size="25"
                    color="grey lighten-4"
                  >
                    <img :src="props.item.avatar" alt="avatar">
                  </v-avatar>
                  <!-- <img :src="props.item.avatar" height="25px"/> -->
                  <span class="pl-2">{{ props.item.author }}</span>
                </v-layout>
              </td>
              <td class="text-xs-left"><router-link to="blog">{{ props.item.title }}</router-link></td>
              <td class="text-xs-right">{{ props.item.time.toLocaleString() }}</td>
            </template>
            <template slot="no-data">
              <v-alert :value="true" type="warning" color="error" outline icon="warning">
                Sorry, nothing to display here :(
              </v-alert>
            </template>
          </v-data-table>
        </v-layout>
      </v-container>
    </v-slide-y-transition>
    <!-- Mobile -->
    <v-slide-y-transition mode="out-in">
      <v-list fluid class="hidden-md-and-up">
        <template v-for="(blog, index) in blogList">
          <v-subheader v-if="blog.header" :key="blog.header">{{ blog.header }}</v-subheader>
          <v-divider v-else-if="blog.divider" :inset="blog.inset" :key="index"></v-divider>
          <v-list-tile v-else-if="!profile" :key="index" avatar @click="to(blog.id)">
            <v-list-tile-avatar>
              <img :src="blog.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="blog.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="blog.time.toLocaleString()"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-else :key="index" @click="to(blog.id)">
            <v-list-tile-content>
              <v-list-tile-title v-html="blog.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="blog.time.toLocaleString()"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-slide-y-transition>
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
import { BlogList } from '../types'


@Component({
  props: {
    profile: {
      type: Boolean
    }
  }
})
export default class HotBlogs extends Vue {
  headers = [
    {
      text: 'Author',
      align: 'left',
      sortable: false,
      value: 'author'
    },
    {
      text: 'Title',
      align: 'left',
      sortable: false,
      value: 'title'
    },
    {
      text: 'Date',
      align: 'right',
      sortable: true,
      value: 'date'
    }
  ]
  profileHeaders = [
    {
      text: 'Title',
      align: 'left',
      sortable: false,
      value: 'title'
    },
    {
      text: 'Date',
      align: 'right',
      sortable: true,
      value: 'date'
    }
  ]
  get blogList(): BlogList {
    let list: BlogList = [{ header: (this as any).profile ? 'Blog list' : 'Hot blogs' }]
    let _list = this.$store.state.blogBrief
    for(let blog of _list) {
      list.push(blog)
      list.push({ divider: true, inset: false })
    }
    return list
  }
  get blogs(): BlogList {
    return this.$store.state.blogBrief
  }
  to(blogId: number): void {
    this.$router.replace(`/blog/${blogId}`)
  }
}
</script>
