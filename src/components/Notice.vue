<template>
  <v-container fill-height>
    <v-layout column>
      <v-jumbotron height="200px">
        <v-container fill-height>
          <v-layout align-center>
            <v-flex>
              <h3 class="display-3">Notice</h3>

              <span class="subheading">Some important notices that you will not want to miss</span>

              <v-divider class="my-3"></v-divider>
            </v-flex>
          </v-layout>
        </v-container>
      </v-jumbotron>

      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(notice, i) in notices"
          :key="i"
        >
          <div slot="header">{{ notice.title }}</div>
          <v-card>
            <v-card-text>{{ notice.text }}</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-layout>
  </v-container>
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


@Component
export default class Notice extends Vue {
  notices = (num => {
    let res: any = []
    for(let i = 0; i < num; i++) {
      res.push({
        title: 'Notice ' + i,
        text: 'Notice text ' + i
      })
    }
    return res
  })(5)
}
</script>
