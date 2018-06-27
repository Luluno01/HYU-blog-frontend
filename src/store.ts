import Vue from 'vue'
import Vuex from 'vuex'
import generateAvatar from './Lib/generateAvatar'
import { BlogList } from './types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blogBrief: [] as BlogList
  },
  mutations: {
    setBlogBrief(state, blogBrief: BlogList) {
      state.blogBrief = blogBrief
    }
  },
  actions: {
    refreshBlogBrief({ commit }, onComplete: () => void) {
      let res: BlogList = [{ header: 'Hot blogs' }]
      for(let i = 0; i < 9; i++) {
        res.push({ title: 'Rua!', id: i, avatar: generateAvatar('Admin', i), author: 'Admin', uid: i, subtitle: 'asdf' })
        res.push({ divider: true, inset: false })
      }
      setTimeout(() => {
        commit('setBlogBrief', res)
        onComplete()
      }, 3000)
    }
  }
})
