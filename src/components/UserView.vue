<template>
  <v-layout>
    <v-flex xs12 @click="$emit('click')">
      <v-card flat color="">
        <!-- <v-toolbar dark color="primary">
          <v-toolbar-title>{{ userId }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <slot></slot>
        </v-toolbar> -->
        <v-container fluid grid-list-lg>
          <v-layout row justify-center align-center py-2>
            <v-flex>
              <v-layout justify-center align-center>
                <v-avatar
                  :tile="false"
                  :size="miniVariant ? 24 : 125"
                  color="grey lighten-4"
                  class="justify-center align-center"
                >
                  <img :src="userInfo.avatar || defaultAvatar" alt="avatar">
                </v-avatar>
              </v-layout>
              <!-- <v-card-media
                :src="userInfo.avatar || defaultAvatar"
                :height="miniVariant ? '24px' : '125px'"
                contain
              ></v-card-media> -->
            </v-flex>
            <v-flex xs7 v-show="!miniVariant">
              <v-layout align-center justify-left fill-height pl-2>
                <div>
                  <div class="headline">{{ userInfo.nickname }}</div>
                  <div class="subheading" v-if="userInfo.id">UID: {{ userInfo.id }}</div>
                  <div v-if="userInfo.isBlogger">{{ userInfo.isBlogger ? 'Blogger' : 'Visitor' }}</div>
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
    let nickname: string = (this as any).userInfo.nickname
    let id: string = (this as any).userInfo.id.toString()
    return generateAvatar(nickname, id)
  }
}
</script>
