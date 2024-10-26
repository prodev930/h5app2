import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { generateUUID } from '@/utils'
import { getList } from "@/api/chat";
import storeChat from "@/store/chat"
export default createStore({
  state: {
    nologinid: null,
    isConnected: false,
    readMessageTime: new Date().valueOf(),
    messageNum: 0,
    hasNewMessage: [],
    messageList: []
  },
  getters: {
    getMessageList(state) {
      return state.messageList
    },
    getNologinid(state) {
      if (!state.nologinid) {
        state.nologinid = generateUUID();
      }
      return state.nologinid
    }
  },
  mutations: {
    setMessageNum(state, payload) {
      state.messageNum = payload;
    },
    setConnected(state, payload) {
      state.isConnected = payload;
    },
    setToken(state, token) {
      state.token = token;
    },
    setNewMessageList(state, arr) {
      if (arr.length === 1) {
        // 点击发送 所有的都已读
        const all_not_read = state.hasNewMessage.concat(arr);
        if (arr[0].direction === 'send') {
          state.messageList = state.messageList.concat(all_not_read)
          state.hasNewMessage = [];
        } else {
          state.hasNewMessage = all_not_read;
        }
      } else {
        let readed = [];
        let notRead = []
        arr.forEach(item => {
          if (item.time > state.readMessageTime) {
            notRead.push(item)
          } else {
            readed.push(item)
          }
        });
        state.hasNewMessage = notRead;
        state.messageList = readed;
      }
    },
    setreadMessageTime(state, time) {
      state.readMessageTime = time;
    },
    // 历史消息
    setHistoryMsg(state, item) {
      state.messageList = item.reverse();
    },
  },
  actions: {
    updateMessage({ commit }) {
      // 更新sessionToken
      return new Promise((resolve) => {
        getList({
          nologinid: storeChat.getters.getNologinid,
          lasttime: Date.now()
        }).then((res) => {
          if (res.code == 200 && res.data) {
            commit("setHistoryMsg", res.data || '');
            resolve(res.data);
          } else {
            resolve(false);
          }
        })
          .catch(() => resolve(false));
      });
    },
  },
  plugins: [createPersistedState({
    paths: ['nologinid', 'messageNum']
  })],
});
