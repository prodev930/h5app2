const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin')
const { default: AutoImport } = require('unplugin-auto-import/webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240, // 文件大小大于等于 10kb 时启用压缩
        minRatio: 0.8, // 压缩比例达到 0.8 时启用压缩
      }),
      new RetryChunkLoadPlugin({
        retryDelay: 1000, // 重试延迟时间（毫秒）
        maxRetries: 3, // 最大重试次数
        lastResortScript: 'fallback.js', // 备用脚本，当重试次数用尽时加载
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'vuex', 'vue-i18n', '@vueuse/core'],
        // eslintrc: {
        //   enabled: true,
        //   filepath: './.eslintrc-auto-import.json',
        // },
      }),
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = options.compilerOptions || {}
        options.compilerOptions.isCustomElement = tag => tag === 'iconpark-icon'
        return options
      })
  },
  publicPath: '/',
  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 3000,
    hot: true, // 开启HMR功能(只能用于开发环境，生产环境不需要)
    proxy: {
      '/api': {
        target: 'http://146.70.86.141:8000',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
