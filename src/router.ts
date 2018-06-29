import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import About from './views/About.vue'
import Splash from './components/Splash.vue'
import HotBlogs from './components/HotBlogs.vue'
import Blog from './components/Blog.vue'
import Ballot from './components/Ballot.vue'
import Profile from './components/Profile.vue'
import Signup from './components/Signup.vue'
import Login from './components/Login.vue'

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
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    },
    {
      path: '/ballot',
      name: 'ballot',
      component: Ballot
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
