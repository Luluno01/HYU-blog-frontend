import Vue from 'vue'
import Vuex from 'vuex'
import User from './Lib/sdk/User'
import generateAvatar from './Lib/generateAvatar'
import Blog from './Lib/sdk/Blog'
import Comment from '@/Lib/sdk/Comment';

Vue.use(Vuex)

let defaultUser = new User({
  updatedAt: Date.now(),
  createdAt: Date.now(),
  id: 0,
  nickname: 'Login',
  isBlogger: false,
  isAdmin: false,
  avatar: generateAvatar('HYU-blog', 0) // require('@/assets/logo.png')
})

let defaultBlog = new Blog({
  updatedAt: Date.now(),
  createdAt: Date.now(),
  id: 0,
  title: 'Dummy Blog',
  text: '# Dummy Blog\n\nThis is a **dummy** blog.\n',
  published: true,
  owner: defaultUser,
  comments: [
    new Comment({
      id: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      text: '**Dummy** comment',
      owner: defaultUser
    })
  ]
})

export default new Vuex.Store({
  state: {
    snackbar: {
      snackbar: false,
      timeout: 3000,
      text: ''
    },
    user: defaultUser,
    profileUser: defaultUser,
    // {
    //   avatar: require('@/assets/logo.png'),
    //   id: 0,
    //   nickname: null,
    //   isBlogger: null
    // },
    hotBlogsPage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    hotBlogs: [] as Blog[],
    profilePage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    profileBlogs: [] as Blog[],
    ballot: {
      id: 1,
      title: 'Ballot Title',
      text: '# rua\n\n* fasdf\n* piuoiuo',
      owner: {
        avatar: generateAvatar('Admin', 256),
        userId: 256,
        userName: 'Admin',
        extraInfo: 'Administrator of HYU-blog'
      },
      time: (new Date),
      options: [
        { id: 1, title: 'Option A', votes: 50 },
        { id: 5, title: 'Option B', votes: 20 },
        { id: 3, title: 'Option C', votes: 12 },
        { id: 4, title: 'Option D', votes: 23 }
      ],
      // chosen: 5
    },
    blog: defaultBlog,
    edit: false
  },
  mutations: {
    snackbar(state, conf: { timeout?: number; text: string }): void {
      state.snackbar.timeout = conf.timeout || 3000
      state.snackbar.text = conf.text
      state.snackbar.snackbar = true
    },
    snackbarVisible(state, visible: boolean) {
      state.snackbar.snackbar = visible
    },
    setUser(state, user: User | null): void {
      if(!user) {
        state.user = defaultUser
      } else {
        user.loggedIn = true
        if(!user.avatar || user.avatar == 'default') user.avatar = generateAvatar(user.nickname, user.id)
        state.user = new User(user)
        console.log('User logged in', state.user)
      }
    },
    setHotBlogs(state, hotBlogs: Blog[]): void {
      state.hotBlogs = hotBlogs
    },
    appendHotBlogs(state, blogs: Blog[]) {
      state.hotBlogs = state.hotBlogs.concat(blogs)
    },
    vote(state, votedOption: number) {
      Object.defineProperty(state.ballot, 'chosen', {
        value: votedOption,
        writable: true,
        configurable: true,
        enumerable: true
      })
    },
    setPageNum(state, pageNum: number) {
      state.hotBlogsPage.pageNum = pageNum
    },
    setPageSize(state, pageSize: number) {
      state.hotBlogsPage.pageSize = pageSize
    },
    setCount(state, count: number) {
      state.hotBlogsPage.count = count
    },
    setAscend(state, ascend: boolean) {
      state.hotBlogsPage.ascend = !!ascend
    },

    setProfileUser(state, user: User) {
      state.profileUser = new User(user)
    },
    setProfileBlogs(state, blogs: Blog[]) {
      state.profileBlogs = blogs
    },
    appendProfileBlogs(state, blogs: Blog[]) {
      state.profileBlogs = state.profileBlogs.concat(blogs)
    },
    setProfilePageNum(state, pageNum: number) {
      state.profilePage.pageNum = pageNum
    },
    setProfilePageSize(state, pageSize: number) {
      state.profilePage.pageSize = pageSize
    },
    setProfileCount(state, count: number) {
      state.profilePage.count = count
    },
    setProfileAscend(state, ascend: boolean) {
      state.profilePage.ascend = !!ascend
    },

    // Blog
    setBlog(state, blog: Blog) {
      state.blog = blog
    },

    // Edit blog
    setEdit(state, edit: boolean) {
      state.edit = edit
    },
    setTitle(state, title: string) {
      state.blog.title = title
    },
    setText(state, text: string) {
      state.blog.text = text
    }
  },
  actions: {
    // User
    signup({ commit }, opt: { username: string; nickname: string; password: string, onComplete?: (err?) => void }): void {
      let onComplete = opt.onComplete
      User.signup(opt)
      .then(() => {
        console.log(`User signed up (${opt.username})`)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },
    login({ commit }, opt: { username: string; password: string; onComplete?: (err?) => void }): void {
      let onComplete = opt.onComplete
      User.login(opt)
      .then(user => {
        commit('setUser', user)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },
    logout(context, onComplete?: (err?) => void): void {
      context.state.user.logout()
      .then(() => {
        context.commit('setUser', null)
        if(typeof onComplete == 'function') onComplete()
        console.log('User logged out')
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },
    updateLoginState({ commit }, onComplete?: () => void): void {
      User.state()
      .then(user => {
        commit('setUser', user)
        if(typeof onComplete == 'function') onComplete()
      })
    },

    // Hot blogs
    refreshHotBlogs({ commit, state }, onComplete?: (err?) => void) {
      Blog.getHotBlogs(state.hotBlogsPage.pageNum, state.hotBlogsPage.pageSize, state.hotBlogsPage.ascend)
      .then(([blogs, count]) => {
        commit('setHotBlogs', blogs)
        commit('setCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },

    appendHotBlogs({ commit, state }, onComplete: (err?) => void) {
      Blog.getHotBlogs(state.hotBlogsPage.pageNum, state.hotBlogsPage.pageSize, state.hotBlogsPage.ascend)
      .then(([blogs, count]) => {
        commit('appendHotBlogs', blogs)
        commit('setCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },

    // Profile
    setProfileUser({ commit, dispatch }, opt: { id: number; onComplete?: (err?) => void }) {
      User.get(opt.id)
      .then(user => {
        commit('setProfileUser', user)
        console.log('User found', user)
        dispatch('refreshProfileBlogs', opt.onComplete)
      })
      .catch(err => {
        console.error(err)
        if(typeof opt.onComplete == 'function') opt.onComplete(err)
      })
    },
    refreshProfileBlogs({ commit, state }, onComplete?: (err?) => void) {
      state.profileUser.getBlogs(state.profilePage.pageNum, state.profilePage.pageSize, state.profilePage.ascend)
      .then(([blogs, count]) => {
        console.log('User\'s blog list get', blogs)
        commit('setProfileBlogs', blogs)
        commit('setProfileCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },

    appendProfileBlogs({ commit, state }, onComplete: (err?) => void) {
      state.profileUser.getBlogs(state.profilePage.pageNum, state.profilePage.pageSize, state.profilePage.ascend)
      .then(([blogs, count]) => {
        console.log('User\'s blog list get', blogs)
        commit('appendProfileBlogs', blogs)
        commit('setProfileCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },

    // Blog
    getBlog({ commit }, opt: { id: number; onComplete: (err?) => void }) {
      Blog.get(opt.id)
      .then(blog => {
        console.log('Blog get', blog)
        commit('setBlog', blog)
        if(typeof opt.onComplete == 'function') opt.onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof opt.onComplete == 'function') opt.onComplete(err)
      })
    },

    deleteBlog({ commit, state }, onComplete: (err?) => void) {
      state.blog.delete()
      .then(msg => {
        console.log('Blog deleted', state.blog)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    }
  }
})
