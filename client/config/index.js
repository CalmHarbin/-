import devConfig from './dev'
import prodConfig from './prod'

const path = require('path') // eslint-disable-line

const config = {
    projectName: '我爱记工资',
    date: '2020-5-26',
    designWidth: 750,
    deviceRatio: {
        '640': 2.34 / 2,
        '750': 1,
        '828': 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    babel: {
        sourceMap: true,
        presets: [
            [
                'env',
                {
                    modules: false
                }
            ]
        ],
        plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-object-rest-spread',
            [
                'transform-runtime',
                {
                    helpers: false,
                    polyfill: false,
                    regenerator: true,
                    moduleName: 'babel-runtime'
                }
            ]
        ]
    },
    defineConstants: {},
    //vant文件需要手动copy的文件
    copy: {
        patterns: [
            {
                from: 'src/wxcomponents/vant-weapp/wxs',
                to: 'dist/wxcomponents/vant-weapp/wxs'
            },
            {
                from: 'src/wxcomponents/vant-weapp/field/index.wxs',
                to: 'dist/wxcomponents/vant-weapp/field/index.wxs'
            },
            {
                from: 'src/wxcomponents/vant-weapp/picker-column/index.wxs',
                to: 'dist/wxcomponents/vant-weapp/picker-column/index.wxs'
            }
        ],
        options: {}
    },
    //别名
    alias: {
        '@/api': path.resolve(__dirname, '..', 'src/api/'),
        '@/assets': path.resolve(__dirname, '..', 'src/assets/'),
        '@/components': path.resolve(__dirname, '..', 'src/components/'),
        '@/wxcomponents': path.resolve(__dirname, '..', 'src/wxcomponents/'),
        '@/config': path.resolve(__dirname, '..', 'src/config/'),
        '@/store': path.resolve(__dirname, '..', 'src/store/'),
        '@/views': path.resolve(__dirname, '..', 'src/views/'),
        '@/units': path.resolve(__dirname, '..', 'src/units/'),
        '@/package': path.resolve(__dirname, '..', 'package.json'),
        '@/project': path.resolve(__dirname, '..', 'project.config.json')
    },
    mini: {
        postcss: {
            autoprefixer: {
                enable: true,
                config: {
                    browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
                }
            },
            pxtransform: {
                enable: true,
                config: {
                    selectorBlackList: [/^\.van/] //vant组件样式忽略,https://nervjs.github.io/taro/docs/size/
                }
            },
            url: {
                enable: true,
                config: {
                    limit: 10240 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        postcss: {
            autoprefixer: {
                enable: true,
                config: {
                    browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
                }
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    }
}

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, devConfig)
    }
    return merge({}, config, prodConfig)
}
