<template>
  <v-slide-y-transition mode="out-in">
    <div>
      <v-container mx-0 px-0>
        <v-divider></v-divider>
        <!-- Author -->
        <v-container mx-0 px-0>
          <v-layout row wrap align-center>
            <img :src="avatar" alt="avatar" width="32px">
            <v-layout column wrap class="ml-3" justify-center>
              <span class="body-2">{{ comment.owner.userName }}</span>
              <span class="body-1">{{ comment.time.toLocaleString() }}</span>
            </v-layout>
          </v-layout>
        </v-container>
      </v-container>
      <!-- Text -->
      <v-container mx-0 px-0 py-0>
        <vue-markdown>{{ comment.text }}</vue-markdown>
      </v-container>
    </div>
  </v-slide-y-transition>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from 'vue-property-decorator'
import generateAvatar from '../Lib/generateAvatar'
import VueMarkdown from 'vue-markdown'

@Component({
  components: {
    VueMarkdown
  },
  props: {
    comment: {
      type: Object
    }
  }
})
export default class Comment extends Vue {
  get avatar(): string {
    let _avatar: any = (this as any).comment.owner.avatar
    if(_avatar && _avatar != 'default') return _avatar
    return generateAvatar((this as any).comment.owner.userName, (this as any).comment.owner.userId)
  }
}
</script>

