// eventBus.js
import mitt from 'mitt';

// 创建一个事件总线实例
const eventBus = mitt();

export default eventBus;


// // 发送事件
// eventBus.emit('event-name', data);

// // 监听事件
// eventBus.on('event-name', (data) => {
//   // 处理事件
// });

// // 停止监听事件
// eventBus.off('event-name', callback);