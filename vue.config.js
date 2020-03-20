// vue.config.js
const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/public': {
                // target: 'http://192.168.1.88:19999',
                target: 'http://192.168.0.2/lhyd',
                // target: 'http://tp.300c.cn/zy_137/subsystem20190906',
                ws: true, //是否代理websockets
                changeOrigin: true // 设置同源  默认false，是否需要改变原始主机头为目标URL
            },
            '/plugin': {
                target: 'https://gl.300c.cn',
                ws: true, //是否代理websockets
                changeOrigin: true // 设置同源  默认false，是否需要改变原始主机头为目标URL
            }
        }
    },
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
            .set('_pl', resolve('public'))
    },
    configureWebpack: (config)=> {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue : 15, // 换算的基数
                        selectorBlackList : ['weui','mu'], // 忽略转换正则匹配项
                        propList : ['*'],
                    }),
                ]
            }
        }
    },
};
