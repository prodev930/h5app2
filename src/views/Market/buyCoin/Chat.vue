<!-- 与商家的会话 -->
<template>
  <div class="buycoin-chat">
    <div ref="listRef" class="list">
      <div class="notice_msg">
        <div class="time">{{ list[0]?.time }}</div>
        <div class="content">{{ $t('您已经成功下单') }}，{{ $t('请耐心等候商家付款') }}</div>
      </div>
      <template v-for="item in list">
        <!-- 提示 -->
        <!-- <div class="notice_msg">
          <div class="time">2024-10-28 10:25:08</div>
          <div class="content">您已经成功下单，请耐心等候商家付款</div>
        </div> -->
        <template v-if="item.direction == 'send'">
          <!-- 我的文本 -->
          <div v-if="item.type == 'text'" :id="`a${item.msgid}`" class="my_text_box">
            <div class="van-popover__arrow" />
            <div class="my_text">{{ item.content }}</div>
            <!-- <div class="time">{{ item.time }}</div> -->
          </div>

          <!-- 我的富文本 -->
          <div v-if="item.type == 'html'" :id="`a${item.msgid}`" class="my_text_box">
            <div class="van-popover__arrow" />
            <div class="my_text" v-html="item.content" />
            <!-- <div class="time">{{ item.time }}</div> -->
          </div>

          <!-- 我的图片 -->
          <div v-if="item.type == 'img'" :id="`a${item.msgid}`" class="my_pic_box">
            <img class="my_pic" :src="item.content" alt="img" />
            <!-- <div class="time">{{ item.time }}</div> -->
          </div>
        </template>
        <template v-else>
          <!-- 对方文本 -->
          <div v-if="item.type == 'text'" :id="`a${item.msgid}`" class="op_text_box">
            <div class="avatar">
              <!-- <div class="pointer"></div> -->
              {{ props.currItem.merchant_name ? props.currItem.merchant_name.slice(0, 1) : '' }}
            </div>

            <div class="op_text">
              <div class="van-popover__arrow" />
              <div class="op_text_content">{{ item.content }}</div>
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>

          <!-- 对方富文本 -->
          <div v-if="item.type == 'html'" :id="`a${item.msgid}`" class="op_text_box">
            <div class="avatar">
              <!-- <div class="pointer"></div> -->
              {{ props.currItem.merchant_name ? props.currItem.merchant_name.slice(0, 1) : '' }}
            </div>

            <div class="op_text">
              <div class="van-popover__arrow" />
              <div class="op_text_content" v-html="item.content" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>

          <!-- 对方图片 -->
          <div v-if="item.type == 'img'" :id="`a${item.msgid}`" class="op_pic_box">
            <div class="avatar">
              <!-- <div class="pointer"></div> -->
              {{ props.currItem.merchant_name ? props.currItem.merchant_name.slice(0, 1) : '' }}
            </div>

            <div class="op_pic">
              <img class="op_pic_content" :src="item.content" alt="img" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="van-safe-area-bottom fixed inset-x-0 bottom-0 min-h-[1.64rem] bg-white">
      <div class="h-[0.02rem] w-full bg-[#EAEEF3]" />
      <div class="box item px-4">
        <div class="box_icon">
          <!-- <img src="/static/img/chat/file.png" alt="img" /> -->
          <IconSvg name="chatFile" class="text-30 text-my" />
          <input id="fileInput" class="file" type="file" accept="image/*" @change="uploadImg" />
        </div>
        <input v-model="text" type="text" class="ipt" placeholder="请输入..." />
        <div class="box_icon" @click="sendText">
          <IconSvg name="chatSend" class="text-30 text-my" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import io from 'socket.io-client'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { showToast } from 'vant'
import { CHAT_WEBSOCKET, UPLOAD_ADDRESS, UPLOAD_TOKEN } from '@/config'
import store from '@/store'
import { randomFileName, _compressImg } from '@/utils'
import { _fetchWithTimeout } from '@/api/upload'
import storeChat from '@/store/chat'
import { _c2cRead } from '@/api/api'
import IconSvg from '@/components/IconSvg.vue'

const props = defineProps({
  currItem: {
    type: Object,
    default: () => {},
  },
})
const { t } = useI18n()
const listRef = ref()
const { y } = useScroll(listRef, { throttle: 200, behavior: 'smooth', onScroll: scrollHandler })
//  聊天区域
let socket = null
const list = ref([])

// 发送文本消息
const text = ref('')

// 已读回执
const readLoading = ref(false)
const c2cLasttime = computed(() => store.state.c2cLasttime || {})
const startSocket = () => {
  const WS_API = `${CHAT_WEBSOCKET}/c2cmsg`
  const query = {
    auth: store.state.token,
  }
  console.error(WS_API)
  socket = io(WS_API, {
    transports: ['websocket'],
    reconnectionDelayMax: 10000,
    query,
  })
  socket.on('connect', () => {
    setTimeout(() => {
      console.log('seller connect...', props.currItem.order_no)
      socket.emit('subscribe', props.currItem.order_no)
    }, 500)
    // setTimeout(() => {
    //     console.error('发送消息')
    //     socket.emit('apisend', JSON.stringify({
    //         order_no: props.currItem.order_no,
    //         type: 'text',
    //         content: '我是消息'
    //     }))
    // }, 2000)
  })
  socket.on('receive', res => {
    console.error('---消息', res.data)
    list.value.push(...(res.data || []))
    setTimeout(() => {
      // console.log('listRef', listRef.value)
      if (res.data && res.data.length > 1) {
        // 首次收到消息
        // 滚动到已读位置
        const t = c2cLasttime.value[props.currItem.order_no]
        const target = list.value.find(item => {
          return Date.parse(new Date(item.time)) == t
        })
        if (target) {
          const element = document.querySelector(`#a${target.msgid}`)
          element.scrollIntoView({ behavior: 'smooth' })
        } else {
          scrollToBottom()
        }
        // console.log('222', 222)
        // scrollToBottom()
      }
    }, 1000)
  })
}

const sendText = () => {
  if (text.value !== '') {
    socket.emit(
      'apisend',
      JSON.stringify({
        order_no: props.currItem.order_no,
        type: 'text',
        content: text.value,
      })
    )
    scrollToBottom()
    setTimeout(() => {
      text.value = ''
    }, 50)
  }
}
// 发送
const sendMessage = url => {
  if (url) {
    socket.emit(
      'apisend',
      JSON.stringify({
        order_no: props.currItem.order_no,
        type: 'img',
        content: url,
      })
    )
    scrollToBottom()
  }
}
const uploadImg = event => {
  const file = event.target.files[0]
  const fileName = randomFileName(file.name)
  const path = `images/${fileName}`
  const apiUrl = `${UPLOAD_ADDRESS}${path}`
  const reader = new FileReader()
  reader.onloadend = function () {
    let ratio = 0.5
    const size = file.size / 1024
    if (size < 50) {
      ratio = 1
    } else if (size < 150) {
      ratio = 0.9
    } else {
      ratio = 0.5
    }
    _compressImg(reader.result, ratio, base64Img => {
      const base64result = base64Img.substr(base64Img.indexOf(',') + 1)
      _fetchWithTimeout(`${apiUrl}`, {
        method: 'PUT',
        headers: {
          Authorization: UPLOAD_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: storeChat.getters.getNologinid,
          content: base64result,
          branch: 'main',
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.content && data.content.download_url) {
            sendMessage(data.content.download_url)
          } else {
            showToast(t('上传失败'))
            console.error('上传失败:', data)
          }
        })
        .catch(error => {
          showToast(t('上传出错'))
          console.error('上传出错:', error)
        })
    })
  }
  reader.readAsDataURL(file)
}

const scrollToBottom = () => {
  let onl
  const { pause } = useIntervalFn(() => {
    if (onl !== listRef.value.scrollHeight) {
      onl = listRef.value.scrollHeight
      y.value = listRef.value.scrollHeight
    } else {
      pause()
    }
  }, 500)
}
function scrollHandler() {
  // 当前滚动位置 + 可视区域高度
  const div = listRef.value
  const { scrollTop } = div
  const { clientHeight } = div
  // 内容的总高度
  const { scrollHeight } = div

  // 判断是否滚动到底部
  if (scrollTop + clientHeight >= scrollHeight) {
    if (readLoading.value) return
    readLoading.value = true
    setTimeout(() => {
      readLoading.value = false
    }, 2000)
    const t = Date.parse(new Date(list.value[list.value.length - 1].time))
    _c2cRead({
      order_no: props.currItem.order_no,
      lasttime: t,
    })
    c2cLasttime.value[props.currItem.order_no] = t
    store.commit('setC2cLasttime', c2cLasttime.value)
  }
}

onMounted(() => {
  console.error('开始连接')
  startSocket()
  // setTimeout(() => {
  //   listRef.value.addEventListener('scroll', scrollHandler)
  // }, 500)
})
onBeforeUnmount(() => {
  // listRef.value && listRef.value.removeEventListener('scroll', scrollHandler)
  if (socket) {
    socket.disconnect()
    console.error('断开连接')
  }
})
</script>

<style lang="less" scoped>
.buycoin-chat {
  padding: 0.2rem 0;
  display: flex;
  flex-direction: column;
  position: relative;
  // overflow: hidden;
  // .van-popover__arrow {
  //   top: 0.32rem;
  //   margin-left: calc(var(--van-popover-arrow-size) * -1);
  //   border-left-width: 0;
  //   border-right-color: #f6f8fe;
  //   color: #f6f8fe;
  // }
  .list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    color: #333;
    padding-bottom: 1.64rem;

    .op_pic_box {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 0.4rem;

      .avatar {
        width: 0.64rem;
        height: 0.64rem;
        position: relative;
        border-radius: 50%;
        background-color: #014cfa;
        margin-right: 0.2rem;
        top: 0.05rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .pointer {
          width: 0.16rem;
          height: 0.16rem;
          position: absolute;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background-color: #30bf87;
        }
      }

      .op_pic {
        .op_pic_content {
          display: inline-block;
          max-width: 4rem;
          height: auto;
          background-color: #eee;
          border-radius: 0.12rem;
          margin-bottom: 0.1rem;
        }

        .time {
          font-size: 0.24rem;
          color: #aeaeae;
        }
      }
    }

    .op_text_box {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 0.4rem;

      .avatar {
        width: 0.64rem;
        height: 0.64rem;
        position: relative;
        border-radius: 50%;
        background-color: #014cfa;
        margin-right: 0.2rem;
        top: 0.05rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .pointer {
          width: 0.16rem;
          height: 0.16rem;
          position: absolute;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background-color: #30bf87;
        }
      }

      .op_text {
        position: relative;
        .van-popover__arrow {
          top: 0.2rem;
          margin-left: calc(var(--van-popover-arrow-size) * -1);
          border-left-width: 0;
          border-right-color: #f6f8fe;
          color: #f6f8fe;
        }
        .op_text_content {
          display: inline-block;
          // padding: 0.3rem 0.24rem;
          padding: 0.2rem 0.4rem;
          line-height: 0.4rem;
          background-color: #f6f8fe;
          color: #333;
          text-align: left;
          border-radius: 0.12rem;
          // border-top-right-radius: 0.24rem;
          // border-bottom-left-radius: 0.24rem;
          // border-bottom-right-radius: 0.24rem;
          margin-bottom: 0.1rem;
        }

        .time {
          font-size: 0.24rem;
          color: #aeaeae;
        }
      }
    }

    .my_pic_box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;
      margin-top: 0.4rem;

      .my_pic {
        display: inline-block;
        max-width: 4rem;
        height: auto;
        background-color: #eee;
        border-radius: 0.12rem;
        margin-bottom: 0.1rem;
      }

      .time {
        font-size: 0.24rem;
        color: #aeaeae;
      }
    }

    .my_text_box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;
      margin-top: 0.4rem;
      padding-right: 0.12rem;
      position: relative;
      .van-popover__arrow {
        top: 0.2rem;
        border-left-color: #3d65f9;
        border-right-width: 0;
        right: -0.12rem;
        color: #3d65f9;
        border-width: 0.12rem;
      }
      .my_text {
        display: inline-block;
        padding: 0.2rem 0.4rem;
        line-height: 0.4rem;
        background-color: #3d65f9;
        color: #fff;
        text-align: left;
        max-width: 84%;
        border-radius: 0.12rem;
        // border-top-left-radius: 0.24rem;
        // border-bottom-left-radius: 0.24rem;
        // border-bottom-right-radius: 0.24rem;
        margin-bottom: 0.1rem;
      }

      .time {
        font-size: 0.24rem;
        color: #aeaeae;
      }
    }

    .notice_msg {
      text-align: center;
      margin: 0.1rem 0.64rem 0.32rem 0.64rem;

      .time {
        font-size: 0.28rem;
        color: #8f92a1;
        margin-bottom: 0.26rem;
      }
      .content {
        // width: 5.22rem;
        // height: 0.6rem;
        border-radius: 1rem;
        background: var(--F5F7FC, #f5f7fc);
        color: var(--666D80, #666d80);
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.6rem; /* 133.333% */
        padding: 0 0.18rem;
      }
    }
  }

  .box {
    height: 1.34rem;
    width: 100%;
    border-radius: 0.04rem;
    // margin-top: 5px;
    padding-top: 0.2rem;
    display: flex;
    align-items: center;
    // border-top: 1px solid #d0d8e2;
    // padding: 0 0.32rem;

    .ipt {
      height: 0.96rem;
      padding: 0 0.24rem;
      border: 0.02rem solid #d0d8e2;
      flex: 1;
      margin: 0 0.3rem;
      border-radius: 0.32rem;
    }

    .box_icon {
      width: 0.6rem;
      height: 0.6rem;
      position: relative;

      .file {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        // border: 1px solid red;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
}
</style>
