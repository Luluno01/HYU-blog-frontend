import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import About from './views/About.vue'
import Splash from './components/Splash.vue'
import HotBlogs from './components/HotBlogs.vue'
import Blog from './components/Blog.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'loading',
          name: 'loading',
          component: Splash
        },
        {
          path: 'blogs',
          name: 'blogs',
          component: HotBlogs
        }
      ]
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
