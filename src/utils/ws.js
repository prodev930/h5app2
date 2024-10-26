import io from "socket.io-client";
import { BASE_SOCKET } from "../config"

let socket = null;
export const useSocket = () => {
  // const socket = ref(null);
  /**
   * 启动 socket
   * @param fn 回调函数
   * @returns
   */
  function startSocket(fn) {
    // 启动 socket
    if (!socket) {
      const WS_API = BASE_SOCKET + "/api";
      socket = io(WS_API, {
        transports: ["websocket"],
        transportOptions: {
          polling: {
            extraHeaders: {
              auth: "1cdbfe2addd74bc780ba7942d3c8395f"
            }
          }
        }
      });
      socket.on("connect", () => {
        console.log("socket connect...");
        if (typeof fn === "function") {
          fn();
        }
      });
      socket.on("disconnect", () => {
        console.log("socket disconnected...");
        setTimeout(() => { // 2秒后重连
          socket = null
          startSocket()
        }, 2000);
      });
    } else {
      setTimeout(() => { // 先返回 socket 再执行
        fn && fn()
      })
    }
    return socket;
  }

  /**
   *  断开连接
   */
  function disConnect() {
    socket.disconnect();
  }
  return {
    // socket,
    startSocket,
    disConnect
  };
};
