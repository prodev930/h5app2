
import storeChat from '@/store/chat'
import storeUser from '@/store'
import { CHAT_WEBSOCKET } from "@/config.js"
import io from 'socket.io-client'
class Service {
  constructor() {
    this.socket = null;
    this.socketNum = null;
    this.isConnected = false
  }
  init() {
    if (!this.socket) {
      const token = storeUser.state.token;
      const nologinid = storeChat.getters.getNologinid;
      const URL = CHAT_WEBSOCKET + '/support'
      const query = { nologinid }
      if (token) {
        query.auth = token
      }
      this.socket = io.connect(URL, {
        transports : ['websocket'],
        reconnectionDelayMax: 10000,
        query
      })
      this.socket.on('connect', () => {
        this.isConnected = true;
        storeChat.commit('setConnected', this.isConnected)
        console.log('连接成功')
      })

      this.socket.on('disconnect', () => {
        console.log('连接断开')
        this.isConnected = false
        storeChat.commit('setConnected', this.isConnected)
      })
      this.socket.on('receive', message => {
        console.log(message);
        const arr = message.data || [];
        storeChat.commit('setNewMessageList', arr)
        // if(arr.length!==1 || arr[0].direction ==='send'){
        //   storeChat.commit('setMessageList', arr)
        // }else{
        //   storeChat.commit('setNewMessageList', arr)
        // }
        // isfirst=false;
      })
    }
  }
  initNum() {
    if (!this.socketNum) {
      const token = storeUser.state.token;
      const nologinid = storeChat.getters.getNologinid;
      const URL = CHAT_WEBSOCKET + '/msgapi'
      const query = { nologinid }
      if (token) {
        query.auth = token
      }
      this.socketNum = io.connect(URL, {
        transports : ['websocket'],
        reconnectionDelayMax: 10000,
        query
      })
      this.socketNum.on('connect', () => {
        console.log('连接成功')
      })

      this.socketNum.on('disconnect', () => {
        console.log('连接断开')
      })
      this.socketNum.on('receive', message => {
        console.log(message);
        const num=message.data.num;
        storeChat.commit('setMessageNum', num)
        console.log('连接成功')
      })
    }
  }
  // 发送消息
  sendMessage(type, message) {
    console.log(message);
    if (!this.socket) {
      console.warn('Socket is not initialized.');
      return;
    }
    try {
      this.socket.emit(type, JSON.stringify(message));
    } catch (e) {
      console.error('Failed to send message', e);
      throw e;
    }
  }

  // 断开
  destroy() {
    this.isConnected = false;
    if (this.socket) {
      this.socket.off(); // 移除所有监听器
      this.socket.disconnect();
      this.socket = null;
    }
  }
  destroyNum() {
    if (this.socketNum) {
      this.socketNum.off(); // 移除所有监听器
      this.socketNum.disconnect();
      this.socketNum = null;
    }
  }
}
export const serviceChat = new Service()
