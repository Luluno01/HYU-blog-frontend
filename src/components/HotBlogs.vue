<template>
  <v-container fluid class="mx-0 my-0 px-0 py-0">
    <!-- PC -->
    <v-slide-y-transition mode="out-in">
      <v-container fluid class="hidden-sm-and-down mt-0">
        <v-layout column align-center>
          <v-data-table
            :headers="profile ? profileHeaders : headers"
            :items="blogs"
            :rows-per-page-items="[15, 10, 20, 25, 30]"
            :pagination.sync="pagination"
            :loading="loading"
            :total-items="count"
            :disable-initial-sort="true"
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
                    <img :src="props.item.owner.avatar" alt="avatar" @click="showProfile(props.item.owner.id)">
                  </v-avatar>
                  <!-- <img :src="props.item.avatar" height="25px"/> -->
                  <a class="pl-2" href="#" @click="showProfile(props.item.owner.id)">{{ props.item.owner.nickname }}</a>
                </v-layout>
              </td>
              <td class="text-xs-left"><a href="#" @click="to(props.item.id)">{{ props.item.title }}</a></td>
              <td class="text-xs-right">{{ new Date(props.item.updatedAt).toLocaleString() }}</td>
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
      <v-list fluid class="hidden-md-and-up" ref="mobile" v-scroll="onScroll">
        <template v-for="(blog, index) in blogList">
          <v-fade-transition :key="index">
            <v-subheader v-if="blog.header" :key="blog.header">{{ blog.header }}</v-subheader>
            <v-divider v-else-if="blog.divider" :inset="blog.inset" :key="index"></v-divider>
            <v-list-tile v-else-if="!profile" :key="index" avatar @click="to(blog.id)">
              <v-list-tile-avatar>
                <img :src="blog.owner.avatar" @click="showProfile(props.item.owner.id)">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="blog.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="new Date(blog.updatedAt).toLocaleString()"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-else :key="index" @click="to(blog.id)">
              <v-list-tile-content>
                <v-list-tile-title v-html="blog.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="new Date(blog.updatedAt).toLocaleString()"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-fade-transition>
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
import getScroll from '../Lib/getScroll'
import { BlogList } from '../types'


@Component
export default class HotBlogs extends Vue {
  @Prop(Boolean) profile!: boolean

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
      text: 'Last Edit',
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
      text: 'Last Edit',
      align: 'right',
      sortable: true,
      value: 'date'
    }
  ]
  loading: boolean = true
  pagination: any = {
    descending: true
  }
  
  get count(): number {
    return this.profile ? this.$store.state.profilePage.count : this.$store.state.hotBlogsPage.count
  }

  get snackbar() {
    return this.$store.state.snackbar
  }

  set snackbarVisible(s: boolean) {
    this.$store.commit('snackbarVisible', s)
  }

  get snackbarVisible(): boolean {
    return this.snackbar.snackbar
  }

  onScroll(): void {
    if(getScroll.reachedBottom && (this.$refs.mobile as any).$el.clientHeight) {
      console.log('Loading more')
      let oldNum: number = this.blogs.length
      this.$store.commit(this.profile ? 'setProfilePageNum' : 'setPageNum', (this.profile ? this.$store.state.profilePage.pageNum : this.$store.state.hotBlogsPage.pageNum) + 1)
      this.$store.dispatch(this.profile ? 'appendProfileBlogs' : 'appendHotBlogs', err => {
        if(err) {
          this.snackbarVisible = true
          this.snackbar.text = err.message || 'Unable to get blog list : ('
          this.$store.commit(this.profile ? 'setProfilePageNum' : 'setPageNum', (this.profile ? this.$store.state.profilePage.pageNum : this.$store.state.hotBlogsPage.pageNum) - 1)
        } else {
          if(this.blogs.length == oldNum) {
            this.snackbarVisible = true
            this.snackbar.text = 'No more blogs'
            this.$store.commit(this.profile ? 'setProfilePageNum' : 'setPageNum', (this.profile ? this.$store.state.profilePage.pageNum : this.$store.state.hotBlogsPage.pageNum) - 1)
          }
        }
      })
    }
  }

  mounted() {
    this.$store.commit('setProfilePageNum', 1)
    this.$store.commit('setProfilePageSize', 15)
    this.$store.commit('setPageNum', 1)
    this.$store.commit('setPageSize', 15)
    this.$store.commit('setSearchWord', '')
  }

  @Watch('$route')
  resetPage(to, from) {
    if(to.name == 'blogs') {
      this.$store.commit('setProfilePageNum', 1)
      this.$store.commit('setProfilePageSize', 15)
      this.$store.commit('setPageNum', 1)
      this.$store.commit('setPageSize', 15)
      this.$store.commit('setSearchWord', '')
    }
  }

  showProfile(id: number): void {
    this.$store.commit('setProfilePageNum', 1)
    this.$store.commit('setProfilePageSize', 15)
    this.$store.dispatch('setProfileUser', {
      id,
      onComplete: (err?) => {
        if(err) {
          this.snackbarVisible = true
          this.snackbar.text = err.message || 'Unable to show user\'s profile'
        } else {
          this.$router.replace('/profile')
        }
      }
    })
  }

  @Watch('pagination', { deep: true })
  onPaginationChange() {
    this.loading = true
    this.$store.commit(this.profile ? 'setProfilePageNum' : 'setPageNum', this.pagination.page)
    this.$store.commit(this.profile ? 'setProfilePageSize' : 'setPageSize', this.pagination.rowsPerPage)
    this.$store.commit(this.profile ? 'setProfileAscend' : 'setAscend', !this.pagination.descending)
    this.$store.dispatch(this.profile ? 'refreshProfileBlogs' : 'refreshHotBlogs', err => {
      this.loading = false
      if(err) {
        this.snackbarVisible = true
        this.snackbar.text = err.message || 'Unable to get blog list : ('
      }
    })
  }

  get blogList(): BlogList {
    let list: BlogList = [{ header: this.profile ? 'Blog list' : 'Hot blogs' }]
    let _list = this.blogs
    for(let blog of _list) {
      list.push(blog)
      list.push({ divider: true, inset: false })
    }
    return list
  }
  get blogs(): BlogList {
    return this.profile ? this.$store.state.profileBlogs : this.$store.state.hotBlogs
  }
  to(id: number): void {
    this.$store.dispatch('getBlog', {
      id,
      onComplete: (err?) => {
        if(err) {
          this.snackbarVisible = true
          this.snackbar.text = err.message || 'Unable to get blog details : ('
        } else {
          this.$router.replace('/blog')
        }
      }
    })
  }
}
</script>
