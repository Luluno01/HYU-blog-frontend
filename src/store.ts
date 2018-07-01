import Vue from 'vue'
import Vuex from 'vuex'
import User from './Lib/sdk/User'
import generateAvatar from './Lib/generateAvatar'
import Blog from './Lib/sdk/Blog'
import Comment from './Lib/sdk/Comment';
import Ballot from './Lib/sdk/Ballot';
import Option from './Lib/sdk/Option';

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

let defaultBallot = new Ballot({
  updatedAt: Date.now(),
  createdAt: Date.now(),
  id: 0,
  title: 'Dummy Ballot',
  text: '# Dummy Ballot\n\nThis is a **dummy** ballot.\n',
  published: true,
  owner: defaultUser,
  options: [
    new Option({
      id: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: '**Dummy** option A',
      votes: 5
    }),
    new Option({
      id: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: '**Dummy** option B',
      votes: 10
    }),
    new Option({
      id: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: '**Dummy** option C',
      votes: 51
    }),
    new Option({
      id: 4,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: '**Dummy** option D',
      votes: 26
    })
  ]
})

export default new Vuex.Store({
  state: {
    home: 'blogs',
    snackbar: {
      snackbar: false,
      timeout: 3000,
      text: ''
    },
    user: defaultUser,
    profileUser: defaultUser,
    hotBlogsPage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    hotBlogs: [] as Blog[],
    hotBallotsPage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    hotBallots: [] as Ballot[],
    ballot: defaultBallot,
    searchWord: '',
    profilePage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    ballotProfilePage: {
      pageNum: 1,
      pageSize: 25,
      count: 0,
      ascend: false
    },
    profileBallots: [] as Ballot[],
    profileBlogs: [] as Blog[],
    blog: defaultBlog,
    edit: false
  },
  mutations: {
    setHome(state, name: string) {
      state.home = name
    },
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
    setSearchWord(state, str: string) {
      state.searchWord = str
    },
    setHotBallots(state, hotBallots: Ballot[]) {
      state.hotBallots = hotBallots
    },
    appendHotBallots(state, hotBallots: Ballot[]) {
      state.hotBallots = state.hotBallots.concat(hotBallots)
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

    setBallotPageNum(state, pageNum: number) {
      state.hotBallotsPage.pageNum = pageNum
    },
    setBallotPageSize(state, pageSize: number) {
      state.hotBallotsPage.pageSize = pageSize
    },
    setBallotCount(state, count: number) {
      state.hotBallotsPage.count = count
    },
    setBallotAscend(state, ascend: boolean) {
      state.hotBallotsPage.ascend = !!ascend
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
    
    setProfileBallots(state, ballots: Ballot[]) {
      state.profileBallots = ballots
    },
    appendProfileBallots(state, ballots: Ballot[]) {
      state.profileBallots = state.profileBallots.concat(ballots)
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

    setBallotProfilePageNum(state, pageNum: number) {
      state.ballotProfilePage.pageNum = pageNum
    },
    setBallotProfilePageSize(state, pageSize: number) {
      state.ballotProfilePage.pageSize = pageSize
    },
    setBallotProfileCount(state, count: number) {
      state.ballotProfilePage.count = count
    },
    setBallotProfileAscend(state, ascend: boolean) {
      state.ballotProfilePage.ascend = !!ascend
    },

    // Blog
    setBlog(state, blog: Blog) {
      state.blog = blog
    },

    // Ballot
    setBallot(state, ballot: Ballot) {
      state.ballot = ballot
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
    },

    // Edit ballot
    setBallotTitle(state, title: string) {
      state.ballot.title = title
    },
    setBallotText(state, text: string) {
      state.ballot.text = text
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
      Blog.getHotBlogs({ ...state.hotBlogsPage as any, search: state.searchWord })
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
      Blog.getHotBlogs({ ...state.hotBlogsPage as any, search: state.searchWord })
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

    // Hot ballots
    refreshHotBallots({ commit, state }, onComplete?: (err?) => void) {
      Ballot.getHotBallots({ ...state.hotBallotsPage as any, search: state.searchWord })
      .then(([ballots, count]) => {
        commit('setHotBallots', ballots)
        commit('setBallotCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },

    appendHotBallots({ commit, state }, onComplete: (err?) => void) {
      Ballot.getHotBallots({ ...state.hotBallotsPage as any, search: state.searchWord })
      .then(([ballots, count]) => {
        commit('appendHotBallots', ballots)
        commit('setBallotCount', count)
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
      state.profileUser.getBlogs(state.profilePage)
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
      state.profileUser.getBlogs(state.profilePage)
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

    // Ballats in profile
    refreshProfileBallots({ commit, state }, onComplete?: (err?) => void) {
      state.profileUser.getBallots(state.ballotProfilePage)
      .then(([ballots, count]) => {
        console.log('User\'s ballot list get', ballots)
        commit('setProfileBallots', ballots)
        commit('setBallotProfileCount', count)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },
    appendProfileBallots({ commit, state }, onComplete: (err?) => void) {
      state.profileUser.getBallots(state.ballotProfilePage)
      .then(([ballots, count]) => {
        console.log('User\'s ballot list get', ballots)
        commit('appendProfileBallots', ballots)
        commit('setBallotProfileCount', count)
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
    },

    // Ballot
    getBallot({ commit }, opt: { id: number; onComplete: (err?) => void }) {
      Ballot.get(opt.id)
      .then(ballot => {
        console.log('Ballot get', ballot)
        commit('setBallot', ballot)
        if(typeof opt.onComplete == 'function') opt.onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof opt.onComplete == 'function') opt.onComplete(err)
      })
    },
    deleteBallot({ commit, state }, onComplete: (err?) => void) {
      state.ballot.delete()
      .then(msg => {
        console.log('Ballot deleted', state.ballot)
        if(typeof onComplete == 'function') onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof onComplete == 'function') onComplete(err)
      })
    },
    vote({ commit, state }, opt: { id: number, onComplete?: (err?) => void }) {
      state.ballot.vote({
        id: opt.id,
        owner: state.user.id
      })
      .then(() => {
        commit('vote', opt.id)
        if(typeof opt.onComplete == 'function') opt.onComplete()
      })
      .catch(err => {
        console.error(err)
        if(typeof opt.onComplete == 'function') opt.onComplete(err)
      })
    }
  }
})
