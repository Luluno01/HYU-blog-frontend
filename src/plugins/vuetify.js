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
  VProgressCircular,
  VDataTable,
  VAvatar,
  VAlert,
  VRadioGroup,
  VDialog,
  VSnackbar,
  VForm,
  VTextField,
  VSpeedDial,
  VTabs,
  VJumbotron,
  VExpansionPanel
} from 'vuetify'
import { Scroll } from 'vuetify/es5/directives'
import 'vuetify/src/stylus/app.styl'

Vue.directive('scroll', Scroll)

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
    VProgressCircular,
    VDataTable,
    VAvatar,
    VAlert,
    VRadioGroup,
    VDialog,
    VSnackbar,
    VForm,
    VTextField,
    VSpeedDial,
    VTabs,
    VJumbotron,
    VExpansionPanel
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