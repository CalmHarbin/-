export default {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    mini: {},
    h5: {
        devServer: {
            //请求代理
            // proxy: {
            //     '/api': {
            //         target: 'http://wxtest.hnu.edu.cn:8080/api',
            //         ws: true,
            //         changeOrigin: true,
            //         pathRewrite: {
            //             '^/api': ''
            //         }
            //     }
            // },
            port: 8080
        }
    }
}
