// 常用工具类

// 压缩图片
export const _compressImg = (base64, multiple, fn) => {
  // , useImg, targetObj
  // 第一个参数就是需要加密的base65，
  // 第二个是压缩系数 0-1，
  // 第三个压缩后的回调 用来获取处理后的 base64
  if (!base64) {
    return
  }
  // const _this = this
  const length = base64.length / 1024
  // 压缩方法
  const newImage = new Image()
  let quality = 0.6 // 压缩系数0-1之间
  newImage.src = base64
  newImage.setAttribute('crossOrigin', 'Anonymous') // url为外域时需要
  let imgWidth
  let imgHeight
  let w
  newImage.onload = function () {
    // 这里面的 this 指向 newImage
    // 通过改变图片宽高来实现压缩
    w = this.width * multiple
    imgWidth = this.width
    imgHeight = this.height
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        // 等比例缩小
        canvas.height = w * (imgHeight / imgWidth)
      } else {
        canvas.height = w
        // 等比例缩小
        canvas.width = w * (imgWidth / imgHeight)
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
      // quality 设置转换为base64编码后图片的质量，取值范围为0-1  没什么压缩效果
      // 还是得通过设置 canvas 的宽高来压缩
      quality = 0.6
    }
    const size = Math.floor(base64.length / 1024)
    if (size < 50) {
      quality = 0.9
    } else if (size < 150) {
      quality = 0.8
    } else {
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height) //  // 这里面的 this 指向 newImage
    const smallBase64 = canvas.toDataURL('image/jpeg', quality) // 压缩语句
    // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
    // while (smallBase64.length / 1024 > 150) {
    // quality -= 0.01;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }
    // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
    // while (smallBase64.length / 1024 < 50) {
    // quality += 0.001;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }

    // 必须通过回调函数返回，否则无法及时拿到该值，回调函数异步执行
    // console.log(`压缩前：${length}KB`)
    // console.log(`压缩后：${smallBase64.length / 1024} KB`)
    fn(smallBase64)
    // return smallBase64
    // useImg(smallBase64, targetObj)
  }
}

// 转换为缩略图
export const _getSnapshotLine = data => {
  let str = ''
  const w = 69
  const h = 25
  let min = null
  let max = null
  data.map((item, index) => {
    if (min === null) {
      min = item.price
    }
    if (max === null) {
      max = item.price
    }
    if (item.price < min) {
      min = item.price
    }
    if (item.price > max) {
      max = item.price
    }
    str += `${index},${item.price} `
  })
  let _str = '' // 最终字符串
  const gap = max - min || min // 最大与最小值的间隙
  str.split(' ').map(item => {
    const _item = item.split(',')
    if (item.length) {
      _str += `${((_item[0] / 1) * (w / data.length)).toFixed(2)},${((_item[1] / 1 - min) * (h / gap)).toFixed(2)} `
    }
  })
  return _str.substring(0, _str.length - 1)
}

// 转换数字显示  带单位(K,M,B)
export const _formatNumber = (num, tail = 2) => {
  if (isNaN(num)) return ''
  num = Number(num)
  if (num >= 1.0e9) {
    return `${(num / 1.0e9).toFixed(tail)}B`
  }
  if (num >= 1.0e6) {
    return `${(num / 1.0e6).toFixed(tail)}M`
  }
  if (num >= 1.0e3) {
    return `${(num / 1.0e3).toFixed(tail)}K`
  }
  return num.toFixed(tail)
}

// 复制
export const _copyTxt = txt => {
  txt += ''
  if (txt == 'null' || txt == 'undefined' || txt == '') {
    return
  }
  if (document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea')
    textarea.value = txt
    textarea.readOnly = 'readOnly'
    document.body.appendChild(textarea)
    textarea.select() // 选中文本内容
    textarea.setSelectionRange(0, txt.length)
    document.execCommand('copy')
    textarea.remove()
  }
}

// 隐藏手机号
export const _hiddenPhone = str => {
  if (!str) return '**'
  return `${str.substr(0, 3)}****${str.substr(str.length - 3, 3)}`
}
// 隐藏邮箱
export const _hiddenEmail = str => {
  if (!str) return '**'
  return `${str.substr(0, 1)}****${str.split('@')[1]}`
}
// 隐藏身份证
export const _hiddenIden = str => {
  if (!str) return '**'
  return `${str.substr(0, 4)}****${str.substr(str.length - 4, 4)}`
}
export function generateUUID() {
  // 生成一个32字符的UUID字符串，没有连字符
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
// 隐藏账号
export const _hiddenAccount = str => {
  if (!str) return '**'
  if (str.length > 8) {
    return `${str.substr(0, 3)}***${str.substr(str.length - 3, 3)}`
  }
  return `${str.substr(0, 2)}***${str.substr(str.length - 2, 2)}`
}
// 隐藏名字
export const _hiddenName = str => {
  if (!str) return '**'
  if (str.length > 2) {
    return `${str.substr(0, 1)}*${str.substr(str.length - 1, 1)}`
  }
  return `${str.substr(0, 1)}*`
}
// 随机文件名
export function randomFileName(originalName) {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 1000)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${randomNum}.${extension}`
}

// 文件转url展示
export const _getObjectURL = file => {
  let url = file
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function randomStringWithTimestamp(length) {
  const randomString = generateRandomString(length)
  const timestamp = Date.now()
  return `${randomString}${timestamp}`
}
// 时间转换
export const transferTime = time => {
  const date = new Date(time)
  const currentDate = new Date()
  const isToday = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

// 邮箱校验
export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailPattern.test(email)
}

// 国际区号
export const areaCode = [
  {
    en: 'Angola',
    cn: '安哥拉',
    code: '+244',
  },
  {
    en: 'Afghanistan',
    cn: '阿富汗',
    code: '+93',
  },
  {
    en: 'Alaska(U.S.A)',
    cn: '阿拉斯加',
    code: '+1907',
  },
  {
    en: 'Albania',
    cn: '阿尔巴尼亚',
    code: '+355',
  },
  {
    en: 'Algeria',
    cn: '阿尔及利亚',
    code: '+213',
  },
  {
    en: 'Andorra',
    cn: '安道尔共和国',
    code: '+376',
  },
  {
    en: 'Anguilla',
    cn: '安圭拉岛',
    code: '+1254',
  },
  {
    en: 'Antigua and Barbuda',
    cn: '安提瓜和巴布达',
    code: '+1268',
  },
  {
    en: 'Argentina',
    cn: '阿根廷',
    code: '+54',
  },
  {
    en: 'Armenia',
    cn: '亚美尼亚',
    code: '+374',
  },
  {
    en: 'Aruba',
    cn: '阿鲁巴岛',
    code: '+297',
  },
  {
    en: 'Ascension',
    cn: '阿森松',
    code: '+247',
  },
  {
    en: 'Australia',
    cn: '澳大利亚',
    code: '+61',
  },
  {
    en: 'Austria',
    cn: '奥地利',
    code: '+43',
  },
  {
    en: 'Azerbaijan',
    cn: '阿塞拜疆',
    code: '+994',
  },
  {
    en: 'Bahamas',
    cn: '巴哈马',
    code: '+1242',
  },
  {
    en: 'Bahrain',
    cn: '巴林',
    code: '+973',
  },
  {
    en: 'Bangladesh',
    cn: '孟加拉国',
    code: '+880',
  },
  {
    en: 'Barbados',
    cn: '巴巴多斯',
    code: '+1246',
  },
  {
    en: 'Belarus',
    cn: '白俄罗斯',
    code: '+375',
  },
  {
    en: 'Belgium',
    cn: '比利时',
    code: '+32',
  },
  {
    en: 'Belize',
    cn: '伯利兹',
    code: '+501',
  },
  {
    en: 'Benin',
    cn: '贝宁',
    code: '+229',
  },
  {
    en: 'Bermuda Is',
    cn: '百慕大群岛',
    code: '+1441',
  },
  {
    en: 'Bhutan',
    cn: '不丹',
    code: '+975',
  },
  {
    en: 'Bolivia',
    cn: '玻利维亚',
    code: '+591',
  },
  {
    en: 'Bosnia And Herzegovina',
    cn: '波斯尼亚和黑塞哥维那',
    code: '+387',
  },
  {
    en: 'Botswana',
    cn: '博茨瓦纳',
    code: '+267',
  },
  {
    en: 'Brazil',
    cn: '巴西',
    code: '+55',
  },
  {
    en: 'Brunei',
    cn: '文莱',
    code: '+673',
  },
  {
    en: 'Bulgaria',
    cn: '保加利亚',
    code: '+359',
  },
  {
    en: 'Burkina Faso',
    cn: '布基纳法索',
    code: '+226',
  },
  {
    en: 'Burma',
    cn: '缅甸',
    code: '+95',
  },
  {
    en: 'Burundi',
    cn: '布隆迪',
    code: '+257',
  },
  {
    en: 'Cameroon',
    cn: '喀麦隆',
    code: '+237',
  },
  {
    en: 'Canada',
    cn: '加拿大',
    code: '+1',
  },
  {
    en: 'Cape Verde',
    cn: '佛得角',
    code: '+238',
  },
  {
    en: 'Cayman Is',
    cn: '开曼群岛',
    code: '+1345',
  },
  {
    en: 'Central African Republic',
    cn: '中非共和国',
    code: '+236',
  },
  {
    en: 'Chad',
    cn: '乍得',
    code: '+235',
  },
  {
    en: 'Chile',
    cn: '智利',
    code: '+56',
  },
  {
    en: 'China',
    cn: '中国',
    code: '+86',
  },
  {
    en: 'Colombia',
    cn: '哥伦比亚',
    code: '+57',
  },
  {
    en: 'Congo',
    cn: '刚果',
    code: '+242',
  },
  {
    en: 'Cook Is',
    cn: '库克群岛',
    code: '+682',
  },
  {
    en: 'Costa Rica',
    cn: '哥斯达黎加',
    code: '+506',
  },
  {
    en: 'Cuba',
    cn: '古巴',
    code: '+53',
  },
  {
    en: 'Cyprus',
    cn: '塞浦路斯',
    code: '+357',
  },
  {
    en: 'Czech Republic',
    cn: '捷克',
    code: '+420',
  },
  {
    en: 'Republic of Croatia',
    cn: '克罗地亚共和国',
    code: '+385',
  },
  {
    en: 'Denmark',
    cn: '丹麦',
    code: '+45',
  },
  {
    en: 'Djibouti',
    cn: '吉布提',
    code: '+253',
  },
  {
    en: 'Dominica Rep',
    cn: '多米尼加共和国',
    code: '+1890',
  },
  {
    en: 'Ecuador',
    cn: '厄瓜多尔',
    code: '+593',
  },
  {
    en: 'Egypt',
    cn: '埃及',
    code: '+20',
  },
  {
    en: 'EI Salvador',
    cn: '萨尔瓦多',
    code: '+503',
  },
  {
    en: 'Estonia',
    cn: '爱沙尼亚',
    code: '+372',
  },
  {
    en: 'Ethiopia',
    cn: '埃塞俄比亚',
    code: '+251',
  },
  {
    en: 'Fiji',
    cn: '斐济',
    code: '+679',
  },
  {
    en: 'Finland',
    cn: '芬兰',
    code: '+358',
  },
  {
    en: 'France',
    cn: '法国',
    code: '+33',
  },
  {
    en: 'French Guiana',
    cn: '法属圭亚那',
    code: '+594',
  },
  {
    en: 'French Polynesia',
    cn: '法属玻利尼西亚',
    code: '+689',
  },
  {
    en: 'Gabon',
    cn: '加蓬',
    code: '+241',
  },
  {
    en: 'Gambia',
    cn: '冈比亚',
    code: '+220',
  },
  {
    en: 'Georgia',
    cn: '格鲁吉亚',
    code: '+995',
  },
  {
    en: 'Germany',
    cn: '德国',
    code: '+49',
  },
  {
    en: 'Ghana',
    cn: '加纳',
    code: '+233',
  },
  {
    en: 'Gibraltar',
    cn: '直布罗陀',
    code: '+350',
  },
  {
    en: 'Greece',
    cn: '希腊',
    code: '+30',
  },
  {
    en: 'Grenada',
    cn: '格林纳达',
    code: '+1809',
  },
  {
    en: 'Guam',
    cn: '关岛',
    code: '+1671',
  },
  {
    en: 'Guatemala',
    cn: '危地马拉',
    code: '+502',
  },
  {
    en: 'Guinea',
    cn: '几内亚',
    code: '+224',
  },
  {
    en: 'Guyana',
    cn: '圭亚那',
    code: '+592',
  },
  {
    en: 'Haiti',
    cn: '海地',
    code: '+509',
  },
  {
    en: 'Honduras',
    cn: '洪都拉斯',
    code: '+504',
  },
  {
    en: 'Hongkong',
    cn: '香港',
    code: '+852',
  },
  {
    en: 'Hungary',
    cn: '匈牙利',
    code: '+36',
  },
  {
    en: 'Iceland',
    cn: '冰岛',
    code: '+354',
  },
  {
    en: 'India',
    cn: '印度',
    code: '+91',
  },
  {
    en: 'Indonesia',
    cn: '印度尼西亚',
    code: '+62',
  },
  {
    en: 'Iran',
    cn: '伊朗',
    code: '+98',
  },
  {
    en: 'Iraq',
    cn: '伊拉克',
    code: '+964',
  },
  {
    en: 'Ireland',
    cn: '爱尔兰',
    code: '+353',
  },
  {
    en: 'Israel',
    cn: '以色列',
    code: '+972',
  },
  {
    en: 'Italy',
    cn: '意大利',
    code: '+39',
  },
  {
    en: 'Ivory Coast',
    cn: '科特迪瓦',
    code: '+225',
  },
  {
    en: 'Jamaica',
    cn: '牙买加',
    code: '+1876',
  },
  {
    en: 'Japan',
    cn: '日本',
    code: '+81',
  },
  {
    en: 'Jordan',
    cn: '约旦',
    code: '+962',
  },
  {
    en: 'Cambodia',
    cn: '柬埔寨',
    code: '+855',
  },
  {
    en: 'Kazakhstan',
    cn: '哈萨克斯坦',
    code: '+7',
  },
  {
    en: 'Kenya',
    cn: '肯尼亚',
    code: '+254',
  },
  {
    en: 'Korea',
    cn: '韩国',
    code: '+82',
  },
  {
    en: 'Kuwait',
    cn: '科威特',
    code: '+965',
  },
  {
    en: 'Kyrgyzstan',
    cn: '吉尔吉斯坦',
    code: '+331',
  },
  {
    en: 'Laos',
    cn: '老挝',
    code: '+856',
  },
  {
    en: 'Latvia',
    cn: '拉脱维亚',
    code: '+371',
  },
  {
    en: 'Lebanon',
    cn: '黎巴嫩',
    code: '+961',
  },
  {
    en: 'Lesotho',
    cn: '莱索托',
    code: '+266',
  },
  {
    en: 'Liberia',
    cn: '利比里亚',
    code: '+231',
  },
  {
    en: 'Libya',
    cn: '利比亚',
    code: '+218',
  },
  {
    en: 'Liechtenstein',
    cn: '列支敦士登',
    code: '+423',
  },
  {
    en: 'Lithuania',
    cn: '立陶宛',
    code: '+370',
  },
  {
    en: 'Luxembourg',
    cn: '卢森堡',
    code: '+352',
  },
  {
    en: 'Macao',
    cn: '澳门',
    code: '+853',
  },
  {
    en: 'Madagascar',
    cn: '马达加斯加',
    code: '+261',
  },
  {
    en: 'Malawi',
    cn: '马拉维',
    code: '+265',
  },
  {
    en: 'Malaysia',
    cn: '马来西亚',
    code: '+60',
  },
  {
    en: 'Maldives',
    cn: '马尔代夫',
    code: '+960',
  },
  {
    en: 'Mali',
    cn: '马里',
    code: '+223',
  },
  {
    en: 'Malta',
    cn: '马耳他',
    code: '+356',
  },
  {
    en: 'Mariana Is',
    cn: '马里亚那群岛',
    code: '+1670',
  },
  {
    en: 'Martinique',
    cn: '马提尼克',
    code: '+596',
  },
  {
    en: 'Mauritius',
    cn: '毛里求斯',
    code: '+230',
  },
  {
    en: 'Mexico',
    cn: '墨西哥',
    code: '+52',
  },
  {
    en: 'Moldova',
    cn: '摩尔多瓦',
    code: '+373',
  },
  {
    en: 'Monaco',
    cn: '摩纳哥',
    code: '+377',
  },
  {
    en: 'Mongolia',
    cn: '蒙古',
    code: '+976',
  },
  {
    en: 'Montserrat Is',
    cn: '蒙特塞拉特岛',
    code: '+1664',
  },
  {
    en: 'Morocco',
    cn: '摩洛哥',
    code: '+212',
  },
  {
    en: 'Mozambique',
    cn: '莫桑比克',
    code: '+258',
  },
  {
    en: 'Namibia',
    cn: '纳米比亚',
    code: '+264',
  },
  {
    en: 'Nauru',
    cn: '瑙鲁',
    code: '+674',
  },
  {
    en: 'Nepal',
    cn: '尼泊尔',
    code: '+977',
  },
  {
    en: 'Netheriands Antilles',
    cn: '荷属安的列斯',
    code: '+599',
  },
  {
    en: 'Netherlands',
    cn: '荷兰',
    code: '+31',
  },
  {
    en: 'New Zealand',
    cn: '新西兰',
    code: '+64',
  },
  {
    en: 'Nicaragua',
    cn: '尼加拉瓜',
    code: '+505',
  },
  {
    en: 'Niger',
    cn: '尼日尔',
    code: '+227',
  },
  {
    en: 'Nigeria',
    cn: '尼日利亚',
    code: '+234',
  },
  {
    en: 'North Korea',
    cn: '朝鲜',
    code: '+850',
  },
  {
    en: 'Norway',
    cn: '挪威',
    code: '+47',
  },
  {
    en: 'Oman',
    cn: '阿曼',
    code: '+968',
  },
  {
    en: 'Pakistan',
    cn: '巴基斯坦',
    code: '+92',
  },
  {
    en: 'Panama',
    cn: '巴拿马',
    code: '+507',
  },
  {
    en: 'Papua New Cuinea',
    cn: '巴布亚新几内亚',
    code: '+675',
  },
  {
    en: 'Paraguay',
    cn: '巴拉圭',
    code: '+595',
  },
  {
    en: 'Peru',
    cn: '秘鲁',
    code: '+51',
  },
  {
    en: 'Philippines',
    cn: '菲律宾',
    code: '+63',
  },
  {
    en: 'Poland',
    cn: '波兰',
    code: '+48',
  },
  {
    en: 'Portugal',
    cn: '葡萄牙',
    code: '+351',
  },
  {
    en: 'Puerto Rico',
    cn: '波多黎各',
    code: '+1787',
  },
  {
    en: 'Qatar',
    cn: '卡塔尔',
    code: '+974',
  },
  {
    en: 'Reunion',
    cn: '留尼旺',
    code: '+262',
  },
  {
    en: 'Romania',
    cn: '罗马尼亚',
    code: '+40',
  },
  {
    en: 'Russia',
    cn: '俄罗斯',
    code: '+7',
  },
  {
    en: 'Saint Vincent',
    cn: '圣文森特岛',
    code: '+1784',
  },
  {
    en: 'Samoa Eastern',
    cn: '东萨摩亚(美)',
    code: '+684',
  },
  {
    en: 'Samoa Western',
    cn: '西萨摩亚',
    code: '+685',
  },
  {
    en: 'San Marino',
    cn: '圣马力诺',
    code: '+378',
  },
  {
    en: 'Sao Tome and Principe',
    cn: '圣多美和普林西比',
    code: '+239',
  },
  {
    en: 'Saudi Arabia',
    cn: '沙特阿拉伯',
    code: '+966',
  },
  {
    en: 'Senegal',
    cn: '塞内加尔',
    code: '+221',
  },
  {
    en: 'Seychelles',
    cn: '塞舌尔',
    code: '+248',
  },
  {
    en: 'Sierra Leone',
    cn: '塞拉利昂',
    code: '+232',
  },
  {
    en: 'Singapore',
    cn: '新加坡',
    code: '+65',
  },
  {
    en: 'Slovakia',
    cn: '斯洛伐克',
    code: '+421',
  },
  {
    en: 'Slovenia',
    cn: '斯洛文尼亚',
    code: '+386',
  },
  {
    en: 'Solomon Is',
    cn: '所罗门群岛',
    code: '+677',
  },
  {
    en: 'Somali',
    cn: '索马里',
    code: '+252',
  },
  {
    en: 'South Africa',
    cn: '南非',
    code: '+27',
  },
  {
    en: 'Spain',
    cn: '西班牙',
    code: '+34',
  },
  {
    en: 'SriLanka',
    cn: '斯里兰卡',
    code: '+94',
  },
  {
    en: 'Saint Lucia',
    cn: '圣卢西亚',
    code: '+1758',
  },
  {
    en: 'St.Vincent',
    cn: '圣文森特',
    code: '+1784',
  },
  {
    en: 'Sudan',
    cn: '苏丹',
    code: '+249',
  },
  {
    en: 'Suriname',
    cn: '苏里南',
    code: '+597',
  },
  {
    en: 'Swaziland',
    cn: '斯威士兰',
    code: '+268',
  },
  {
    en: 'Sweden',
    cn: '瑞典',
    code: '+46',
  },
  {
    en: 'Switzerland',
    cn: '瑞士',
    code: '+41',
  },
  {
    en: 'Syria',
    cn: '叙利亚',
    code: '+963',
  },
  {
    en: 'Taiwan',
    cn: '台湾省',
    code: '+886',
  },
  {
    en: 'Tajikstan',
    cn: '塔吉克斯坦',
    code: '+992',
  },
  {
    en: 'Tanzania',
    cn: '坦桑尼亚',
    code: '+255',
  },
  {
    en: 'Thailand',
    cn: '泰国',
    code: '+66',
  },
  {
    en: 'Togo',
    cn: '多哥',
    code: '+228',
  },
  {
    en: 'Tonga',
    cn: '汤加',
    code: '+676',
  },
  {
    en: 'Trinidad and Tobago',
    cn: '特立尼达和多巴哥',
    code: '+1809',
  },
  {
    en: 'Tunisia',
    cn: '突尼斯',
    code: '+216',
  },
  {
    en: 'Turkey',
    cn: '土耳其',
    code: '+90',
  },
  {
    en: 'Turkmenistan',
    cn: '土库曼斯坦',
    code: '+993',
  },
  {
    en: 'Uganda',
    cn: '乌干达',
    code: '+256',
  },
  {
    en: 'Ukraine',
    cn: '乌克兰',
    code: '+380',
  },
  {
    en: 'United Arab Emirates',
    cn: '阿拉伯联合酋长国',
    code: '+971',
  },
  {
    en: 'United Kiongdom',
    cn: '英国',
    code: '+44',
  },
  {
    en: 'United States of America',
    cn: '美国',
    code: '+1',
  },
  {
    en: 'Uruguay',
    cn: '乌拉圭',
    code: '+598',
  },
  {
    en: 'Uzbekistan',
    cn: '乌兹别克斯坦',
    code: '+233',
  },
  {
    en: 'Venezuela',
    cn: '委内瑞拉',
    code: '+58',
  },
  {
    en: 'Vietnam',
    cn: '越南',
    code: '+84',
  },
  {
    en: 'Yemen',
    cn: '也门',
    code: '+967',
  },
  {
    en: 'Yugoslavia',
    cn: '南斯拉夫',
    code: '+381',
  },
  {
    en: 'Zimbabwe',
    cn: '津巴布韦',
    code: '+263',
  },
  {
    en: 'Zaire',
    cn: '扎伊尔',
    code: '+243',
  },
  {
    en: 'Zambia',
    cn: '赞比亚',
    code: '+260',
  },
]

export function throttle(func, wait) {
  let timeout = null
  let lastCallTime = 0

  const throttled = (...args) => {
    const now = Date.now()

    if (!lastCallTime) {
      func(...args)
      lastCallTime = now
      return
    }

    const remainingTime = wait - (now - lastCallTime)

    if (remainingTime <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      func(...args)
      lastCallTime = now
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args)
        lastCallTime = now + remainingTime
        timeout = null
      }, remainingTime)
    }
  }

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastCallTime = 0
  }

  return throttled
}
