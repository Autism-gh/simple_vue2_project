'use strict'
const path = require('path')

const {
    defineConfig
} = require('@vue/cli-service')

const resolve = (dir) => {
    return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9420


const getIPAdress = () => {
    var interfaces = require('os').networkInterfaces()
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}

const defaultConfig = {
    transpileDependencies: true,

    lintOnSave: false,

    publicPath: '/',

    outputDir: 'dist',

    assetsDir: 'static',

    productionSourceMap: false,

    devServer: {
        host: getIPAdress(),
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
    },


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

    chainWebpack: (config) => {
        // 添加 vh 单位大屏兼容模式
        config.module
            .rule('scssvh')
            .test(/\.scss$/)
            .include.add(resolve('src/viewscreen')).end()
            .oneOf('vue')
            .resourceQuery(/verticalvh=true/)
            .use('postcss-loader')
                .loader('postcss-loader')
                .options({
                    config: {
                        path: path.join(__dirname, './config/verticalvh')
                    }
                })
                .end()

        // 添加 vw 单位大屏兼容模式
        config.module
            .rule('scssvw')
            .test(/\.scss$/)
            .include.add(resolve('src/viewscreen')).end()
            .oneOf('vue')
            .resourceQuery(/horizontalvw=true/)
            .use('postcss-loader')
                .loader('postcss-loader')
                .options({
                    config: {
                        path: path.join(__dirname, './config/horizontalvw')
                    }
                })
                .end()
    }

}

module.exports = defineConfig(defaultConfig)