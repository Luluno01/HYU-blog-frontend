<template>
  <v-card>
    <v-card-title v-if="title">
      <span>{{ title }}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-text-field
        name="input-1"
        label="使用Ctrl+C复制"
        textarea
        :value="text"
        readonly="readonly"
        :id="id"
      ></v-text-field>
    </v-card-text>
    <slot name="activator">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.stop="info = false">关闭</v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Clipboard from 'clipboard-polyfill'


export default {
  props: {
    title: {
    type: String,
    default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: 'info-textarea',
      textarea: null
    }
  },
  beforeMount () {
    this.id = `info-textarea-${Date.now()}-${Math.random()}`
  },
  mounted() {
    this.select(false)
  },
  methods: {
    select(copy) {
      if(copy) {
        Clipboard.writeText(this.text)
          .then(() => {
            Vue.Snackbar.show({
              content: '信息已复制到剪贴板'
            })
          })
          .catch(e => {
            console.warn('%c clipboard.js %c is not supported by your browser', 'background:#35495e ; padding: 1px; border-radius: 3px;  color: #fff', 'background:transparent')
            Vue.Snackbar.show({
              content: '您的浏览器不支持clipboard.js，请手动复制'
            })
          })
      }
      this.$nextTick(function() {
        this.textarea = document.getElementById(this.id)
        this.textarea.select()
      })
    }
  }
}
</script>
