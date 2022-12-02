'use strict'
const path = require('path')

const {
  defineConfig
} = require('@vue/cli-service')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9420

module.exports = defineConfig({
  transpileDependencies: true,

  lintOnSave: false,

  outputDir: 'dist',

  assetsDir: 'static',

  productionSourceMap: false,

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      },
      fallback: {
        path: require.resolve('path-browserify')
      }
    }
  },

  devServer: {
    port: port,
    open: true,
    
    proxy: {
      '/appapi': {
        // target: 'http://admin.wuchuang.com:8088/',
        target: 'http://admin.feiji.com:5080/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/appapi': '/'
        }
      },

      '/api': {
        target: 'http://10.33.0.55:5012/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
        
      '/phpapi': {
        // target: 'http://api.wuchuang.com:8088/',
        target: 'http://admin.feiji.com:5080/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/phpapi': '/'
        }
      }
    }
  }
})