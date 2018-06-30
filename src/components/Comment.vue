<template>
  <v-slide-y-transition mode="out-in">
    <div>
      <v-container fluid mx-0 px-0>
        <v-divider></v-divider>
        <!-- Author -->
        <v-container fluid  mx-0 px-0>
          <v-layout row wrap align-center>
            <img :src="comment.owner.avatar" alt="avatar" width="32px">
            <v-layout column wrap class="ml-3" justify-center>
              <span class="body-2">{{ comment.owner.nickname }}</span>
              <span class="body-1">{{ new Date(comment.createdAt).toLocaleString() }}</span>
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
import Com from '../Lib/sdk/Comment'
import VueMarkdown from 'vue-markdown'

@Component({
  components: {
    VueMarkdown
  }
})
export default class Comment extends Vue {
  @Prop(Com)
  comment!: Com
}
</script>

