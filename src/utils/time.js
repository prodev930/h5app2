
// 时间转换为 yyyy-mm-dd hh:mm:ss 格式
// key==2  返回 hh:mm:ss
// key==1  返回 yyyy-mm-dd
export function getTimestr(timestamp, key) {
  if (!timestamp) return " ";
  if (isNaN(Number(timestamp))) return timestamp;
  timestamp = Number(timestamp); // 原始时间戳
  // 获取本地时区的偏移量
  const localTimeZoneOffset =
    new Date(timestamp).getTimezoneOffset() * 60 * 1000;
  // 获取目标时区的偏移量（东8区）
  const targetTimeZoneOffset = -8 * 60 * 60 * 1000;
  // 获取目标时区的时间戳
  const time = timestamp - localTimeZoneOffset + targetTimeZoneOffset;

  const currentDate = new Date(time);
  // 获取年、月、日、小时、分钟和秒
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且补0
  const day = String(currentDate.getDate()).padStart(2, "0"); // 补0
  const hours = String(currentDate.getHours()).padStart(2, "0"); // 补0
  const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // 补0
  const seconds = String(currentDate.getSeconds()).padStart(2, "0"); // 补0

  if (key == 1) return `${year}-${month}-${day}`;
  if (key == 2) return `${hours}:${minutes}:${seconds}`
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// 时间字符转换  20240622105805 ->yyyy-mm-dd hh:mm:ss
export function strTime2Str(str) {
  if (!str) return str
  // 将时间戳分割为各部分
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hour = str.slice(8, 10);
  const minute = str.slice(10, 12);
  const second = str.slice(12, 14);

  // 组合成所需的格式
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 秒 转换成  xx时xx分xx秒
export function formatSec(seconds) {
  if (seconds < 0) return '--'
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return `${days}天${hours}时${minutes}分`;
}

// 秒 转换成 hh:mm:ss
export function formatSec2(seconds,zeroFill=false) {
  if (seconds < 0) return '--'
  let hours = Math.floor(seconds / 3600);
  if(zeroFill && hours < 10){
    hours = '0'+hours
  }
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  if(zeroFill && minutes < 10){
    minutes = '0'+minutes
  }
  let sec = seconds % 60
  if(zeroFill && sec < 10){
    sec = '0'+sec
  }
  return `${hours}:${minutes}:${sec}`;
}

// 时间戳和时区 转换成 时间
export function formatTimestamp(timestamp, timezone) {
  try {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 使用24小时制
      timeZone: timezone,
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);

    const formattedDate = parts.reduce((acc, part) => {
      switch (part.type) {
        case 'year':
          acc[0] = part.value;
          break;
        case 'month':
          acc[1] = part.value;
          break;
        case 'day':
          acc[2] = part.value;
          break;
        case 'hour':
          acc[3] = part.value;
          break;
        case 'minute':
          acc[4] = part.value;
          break;
        case 'second':
          acc[5] = part.value;
          break;
        default:
          break;
      }
      return acc;
    }, ['', '', '', '', '', '']);

    return `${formattedDate[0]}-${formattedDate[1]}-${formattedDate[2]} ${formattedDate[3]}:${formattedDate[4]}:${formattedDate[5]}`;
  } catch {
    console.error(`-- format error --  timestamp:${timestamp}  timezone:${timezone}`)
    return getTimestr(timestamp)
  }

}