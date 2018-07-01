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
import EditBlog from './components/EditBlog.vue'

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
      component: Profile,
      meta: {
        title: 'Profile'
      }
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
      meta: {
        title: 'Blog'
      }
    },
    {
      path: '/ballot',
      name: 'ballot',
      component: Ballot,
      meta: {
        title: 'Ballot'
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        title: 'Sign up'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'About'
      }
    },
    {
      path: '/edit-blog',
      name: 'edit-blog',
      component: EditBlog,
      meta: {
        title: 'Edit Blog'
      }
    }
  ]
})
