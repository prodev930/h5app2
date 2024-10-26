<template>
  <div class="msg-content">
    <div v-if="!messageList || !messageList.length">
      <p class="no-message">--------- 暂无消息 ---------</p>
    </div>
    <template v-else>
      <div class="msg-item" v-for="item in messageList" :key="item.msgid" :class="item.direction">
        <small v-show="false"> {{ storeChat.state.readMessageTime }}****{{ item.time }}***{{
          storeChat.state.readMessageTime > item.time }}</small>
        <!-- <div class="avatar" v-if="item.direction === 'receive'"><img :src="avatar" :alt="item.msgid"></div> -->
        <div class="msg-item-con"

        >
          <div class="user-box"
            v-if="item.direction !== 'receive'"
          >
            <div class="con" :class="item.type">
              <template v-if="item.type !== 'img'">
                {{ item.content }}
              </template>
              <van-image v-else class="send-conimg" radius="6" Lazyload :src="item.content" fit="scale-down">
                <template v-slot:loading>
                  <Loaidng type="spinner" size="20" />
                </template>
              </van-image>

            </div>
            <div class="user-icon" v-if="item.direction !== 'receive' && item.type !== 'img'"></div>
            <div class="user-avatar" v-if="item.direction !== 'receive'">
              <img class="user-avatar-img" src="/static/img/user/user-block.png" alt="img">
            </div>
          </div>
          <div class="receive-box"
            v-if="item.direction === 'receive'"
          >
            <div class="user-avatar">
              <img class="receive-avatar-img" :src="avatar" :alt="item.msgid">
            </div>
            <div class="user-icon"></div>
            <div class="con receive-text" :class="item.type">
              <template v-if="item.type !== 'img'">
                {{ item.content }}
              </template>
              <van-image v-else class="send-conimg" radius="6" Lazyload :src="item.content" fit="scale-down">
                <template v-slot:loading>
                  <Loaidng type="spinner" size="20" />
                </template>
              </van-image>
            </div>
          </div>
          <!-- <div class="time">{{ transferTime(item.time) }}</div> -->
        </div>
        <!-- <div class="avatar" v-if="item.direction === 'send'"><img :src="avatarMy" :alt="item.msgid"></div> -->
      </div>
      <div id="hasNewMessage" v-if="hasNewMessage.length">{{ hasNewMessage.length }}条未读消息</div>
      <div class="msg-item" v-for="item in hasNewMessage" :key="item.msgid" :class="item.direction">
        <div class="avatar" v-if="item.direction === 'receive'"><img :src="avatar" :alt="item.msgid"></div>
        <div class="msg-item-con">
          <div class="con" :class="item.type">
            <template v-if="item.type !== 'img'">
              {{ item.content }}
            </template>
            <van-image v-else class="send-conimg" :src="item.content1" fit="scale-down">
              <template v-slot:error>加载失败</template>
            </van-image>
          </div>
          <div class="time">{{ transferTime(item.time) }}</div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Lazyload, Image as VanImage } from 'vant';
import { transferTime } from '@/utils'
import storeChat from "@/store/chat"
import avatar from '@/assets/avatar.png'
import Loaidng from "@/components/Loaidng.vue"
// import avatarMy from '@/assets/avatar-my.png'
const messageList = computed(() => storeChat.getters.getMessageList)
const hasNewMessage = computed(() => storeChat.state.hasNewMessage)
</script>

<style lang="less" scoped>
.msg-content {
  padding: 0 16px;
  .msg-item {
    display: flex;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      margin-left: 16px;
      img {
        max-width: 40px;
        max-height: 40px;
      }
    }

    .msg-item-con {
      .con {
        padding: 12px 12px;
        min-height: 30px;
        line-height: 22px;
        font-size: 15px;
        border-radius: 6px;
        // border-top-right-radius: 0;
        position: relative;
        // box-shadow: 0 2px 3px #d4d4d4;
        // max-width: 80%;
        flex: 1;

        :deep(p) {
          margin: 0 !important;
          padding: 0 !important;
        }
        &.receive-text{
          margin-left: -9px;
        }
        &.img{
          padding: 0 !important;
          margin-right: 6px;
        }
      }
      .user-box{
        display: flex;
        justify-content: flex-end;
        .user-avatar{
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin-left: 7px;
          .user-avatar-img{
            width: 0.8rem !important;
            height: 0.8rem !important;
          }
        }
        .user-icon{
          width: 0;
          height: 0;
          border-left: 15px solid #014CFA;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          margin-left: -9px;
          margin-top: 8px;
        }
      }
      .time {
        font-size: 12px;
        padding: 5px 0 0 10px;
        color: #666;
      }
      .receive-box{
        display: flex;
        .user-icon{
          width: 0;
          height: 0;
          border-right: 15px solid #EFF3F8;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          margin-left: 7px;
          margin-top: 8px;
        }
        .user-avatar{
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin-left: 7px;
          .receive-avatar-img{
            width: 0.8rem !important;
            height: 0.8rem !important;
          }
        }
      }
    }
    &.receive{
      .con {
        background: #EFF3F8;
        color: #061023;
        &.img{
          padding: 0 !important;
          margin-left: 6px;
        }
      }
    }
    &.send {
      justify-content: flex-end;

      .msg-item-con {
        margin: 0 5px 30px 5px;
        text-align: right;

      }

      .con {
        background: #014CFA;
        color: #fff;

        &.img {
          box-shadow: none !important;
          background: transparent !important;
        }

        // &::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   right: -15px;
        //   border: 8px solid transparent;
        //   border-left: 8px solid #449742;
        // }
      }
    }

    &.receive {
      .msg-item-con {
        margin: 0 5px 30px 0;
        text-align: left;
      }

      // .con::before {
      //   content: "";
      //   position: absolute;
      //   top: 15px;
      //   left: -15px;
      //   border: 8px solid transparent;
      //   border-right: 8px solid #f2f2f2;
      // }
    }

    .send-conimg {
      max-height: 10rem;
      max-width: 10rem;
    }
    .van-image__img{
      display: block;
      border-radius: 6px !important;
    }
  }

  #hasNewMessage {
    text-align: center;
    background: #f5f5f5;
    padding: 10px 0;
    margin-bottom: 10px;
    color: #959494;
  }

  .no-message {
    text-align: center;
    color: #999;
  }
}
</style>
