import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VCard,
  VDivider,
  VSubheader,
  VProgressCircular
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

let conf = {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VCard,
    VDivider,
    VSubheader,
    VProgressCircular
  },
  theme: {
    primary: '#00838F',
    secondary: '#0097A7',
    accent: '#00796B',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }
}

Vue.use(Vuetify, conf)

export default conf