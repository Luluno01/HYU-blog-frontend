import Vue from 'vue'
import Vuex from 'vuex'
import User from './Lib/sdk/User'
import generateAvatar from './Lib/generateAvatar'
import { BlogList } from './types'

Vue.use(Vuex)

let defaultUser = new User({
  updatedAt: 0,
  createdAt: 0,
  id: 0,
  nickname: 'Login',
  isBlogger: false,
  isAdmin: false,
  avatar: require('@/assets/logo.png')
})

export default new Vuex.Store({
  state: {
    snackbar: {
      snackbar: false,
      timeout: 3000,
      text: ''
    },
    user: defaultUser,
    // {
    //   avatar: require('@/assets/logo.png'),
    //   id: 0,
    //   nickname: null,
    //   isBlogger: null
    // },
    blogBrief: [] as BlogList,
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
    blog: {
      id: 0,
      title: 'Title',
      text: '# rua\n\n* fasdf\n* piuoiuo',
      owner: {
        avatar: generateAvatar('Admin', 256),
        userId: 256,
        userName: 'Admin',
        extraInfo: 'Administrator of HYU-blog'
      },
      time: (new Date),
      comments: [
        {
          id: 2,
          owner: {
            avatar: generateAvatar('Admin', 256),
            userId: 256,
            userName: 'Admin',
            extraInfo: 'Administrator of HYU-blog'
          },
          text: 'echo rua\n\n* asdffasdf\n* plilkjk',
          time: new Date
        },
        {
          id: 3,
          owner: {
            avatar: generateAvatar('Test', 1),
            userId: 1,
            userName: 'Test',
            extraInfo: 'test'
          },
          text: 'echo rua\n\n* asdffasdf\n* plilkjk',
          time: new Date
        }
      ]
    }
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
        console.log('User logged in', user)
      }
    },
    setBlogBrief(state, blogBrief: BlogList): void {
      state.blogBrief = blogBrief
    },
    vote(state, votedOption: number) {
      Object.defineProperty(state.ballot, 'chosen', {
        value: votedOption,
        writable: true,
        configurable: true,
        enumerable: true
      })
    }
  },
  actions: {
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
    refreshBlogBrief({ commit }, onComplete?: () => void) {
      let res: BlogList = []
      for(let i = 0; i < 9; i++) {
        res.push({ title: 'Rua!', id: i, avatar: generateAvatar('Admin', i), author: 'Admin', uid: i, time: (new Date) })
        // res.push({ divider: true, inset: false })
      }
      setTimeout(() => {
        commit('setBlogBrief', res)
        if(typeof onComplete == 'function') onComplete()
      }, 3000)
    }
  }
})
