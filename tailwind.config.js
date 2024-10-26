/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js}'],
  theme: {
    // 内边距
    padding: Array.from({ length: 667 }).reduce((map, _, index) => {
      map[index] = index ? `${(index * 4) / 50}rem` : 0
      return map
    }, {}),
    // 外边距
    spacing: Array.from({ length: 667 }).reduce((map, _, index) => {
      map[index] = index ? `${(index * 4) / 50}rem` : 0
      return map
    }, {}),

    extend: {
      backgroundColor: {
        'custom_green': '#18b762',
        'custom_red': '#e8503a',
        'custom_blue': '#7e99d6'
      },
      fontFamily : {
        'alibaba' : ['AlibabaPuHuiTi', 'sans-serif'],
      },
      // 宽度
      width: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${(index * 4) / 50}rem` : 0
        return map
      }, {}),
      // 高度
      height: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${(index * 4) / 50}rem` : 0
        return map
      }, {}),
      // 字体大小
      fontSize: {
        ...Array.from({ length: 50 }).reduce((map, _, index) => {
          map[index] = index ? `${index / 50}rem` : 0
          return map
        }, {}),
        xs: '0.24rem' /* 12px */,
        sm: '0.28rem' /* 14px */,
        base: '0.32rem' /* 16px */,
        lg: '0.36rem' /* 18px */,
        xl: '0.4rem' /* 20px */,
        '2xl': '0.48rem' /* 24px */,
        '3xl': '0.6rem' /* 30px */,
        '4xl': '0.72rem' /* 36px */,
        '5xl': '0.96rem' /* 48px */,
        '6xl': '1.2rem' /* 60px */,
        '7xl': '1.44rem' /* 72px */,
        '8xl': '1.92rem' /* 96px */,
        '9xl': '2.56rem' /* 128px */,
      },
      // 行高
      lineHeight: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${index / 50}rem` : 0
        return map
      }, {}),

      // 圆角
      borderRadius: {
        ...Array.from({ length: 60 }).reduce((map, _, index) => {
          map[index] = index ? `${(index * 4) / 50}rem` : 0
          return map
        }, {}),
        sm: '0.04rem' /* 2px */,
        // rounded: '0.08rem' /* 4px */,
        md: '0.12rem' /* 6px */,
        lg: '0.16rem' /* 8px */,
        xl: '0.24rem' /* 12px */,
        '2xl': '0.32rem' /* 16px */,
        '3xl': '0.48rem' /* 24px */,
      },
      colors: {
        my: 'var(--main-color)',
      },
    },
  },
  plugins: [],
}
