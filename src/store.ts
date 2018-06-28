import Vue from 'vue'
import Vuex from 'vuex'
import generateAvatar from './Lib/generateAvatar'
import { BlogList } from './types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blogBrief: [] as BlogList,
    blog: {
      id: 0,
      title: 'Title',
      text: '# rua\n\n* fasdf\n* piuoiuo',
      owner: {
        avatar: '',
        userId: 256,
        userName: 'Admin',
        extraInfo: 'Administrator of HYU-blog'
      },
      time: (new Date),
      comments: [
        {
          id: 2,
          owner: {
            avatar: '',
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
            avatar: '',
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
    setBlogBrief(state, blogBrief: BlogList) {
      state.blogBrief = blogBrief
    }
  },
  actions: {
    refreshBlogBrief({ commit }, onComplete: () => void) {
      let res: BlogList = []
      for(let i = 0; i < 9; i++) {
        res.push({ title: 'Rua!', id: i, avatar: generateAvatar('Admin', i), author: 'Admin', uid: i, time: (new Date) })
        // res.push({ divider: true, inset: false })
      }
      setTimeout(() => {
        commit('setBlogBrief', res)
        onComplete()
      }, 3000)
    }
  }
})
