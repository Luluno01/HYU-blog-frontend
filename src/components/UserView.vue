<template>
  <v-layout>
    <v-flex xs12>
      <v-card flat color="">
        <!-- <v-toolbar dark color="primary">
          <v-toolbar-title>{{ userId }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <slot></slot>
        </v-toolbar> -->
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex>
              <v-card-media
                :src="userInfo.avatar || defaultAvatar"
                :height="miniVariant ? '24px' : '125px'"
                contain
              ></v-card-media>
            </v-flex>
            <v-flex xs7 v-show="!miniVariant">
              <v-layout align-center justify-left fill-height pl-1>
                <div>
                  <div class="headline">{{ userInfo.userName }}</div>
                  <div class="subheading" v-show="userInfo.userId">UID: {{ userInfo.userId }}</div>
                  <div>{{ userInfo.extraInfo }}</div>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
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
import vuetifyConf from '../plugins/vuetify'


@Component({
  props: {
    userInfo: {
      type: Object,
      default: {
        avatar: require('@/assets/logo.png'),
        userId: '',
        userName: '',
        extraInfo: ''
      }
    },
    miniVariant: {
      type: Boolean,
      default: false
    }
    // avatar: {
    //   type: String,
    //   defulat: "logo.png"
    // },
    // userId: {
    //   type: String,
    //   default: ''
    // },
    // userName: {
    //   type: String,
    //   default: ''
    // },
    // extraInfo: {
    //   type: String,
    //   default: ''
    // }
  }
})
export default class UserView extends Vue {
  // get defaultAvatar(): string {
  //   let userName: string = (this as any).userInfo.userName
  //   let userId: string = (this as any).userInfo.userId.toString()
  //   let hashName: number = parseInt(md5(userName).toString().slice(26, 33), 16)
  //   if(hashName > 0xBFFFFF) hashName = Math.floor(hashName * 0.7)
  //   let hashId: number = parseInt(md5(userId).toString().slice(26, 33), 16)
  //   let i: number = 1
  //   while(Math.abs(((hashId * ++i) & 0xFFFFFF) - hashName) < 0x666666) {}
  //   hashId = (hashId * i) & 0xFFFFFF
  //   if(hashId > 0xBFFFFF) hashId = Math.floor(hashId * 0.7)
  //   let forground: string = hashId.toString(16)
  //   for(let i = 0, length = forground.length; i < 6 - length; i++) {
  //     forground = '0' + forground
  //   }
  //   let background: string = hashName.toString(16)
  //   for(let i = 0, length = background.length; i < 6 - length; i++) {
  //     background = '0' + background
  //   }
  //   return generateAvatar(
  //     (this as any).userInfo.userName && (this as any).userInfo.userName[0] || require('@/assets/logo.png'),
  //     '#' + forground,
  //     '#' + background
  //   )
  // }
  get defaultAvatar(): string {
    let userName: string = (this as any).userInfo.userName
    let userId: string = (this as any).userInfo.userId.toString()
    return generateAvatar(userName, userId)
  }
}
</script>
