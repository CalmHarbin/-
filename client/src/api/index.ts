import Taro from '@tarojs/taro'
import devConfig from '@/config/index.dev.js'
import prodConfig from '@/config/index.prod.js'

const baseURL =
    process.env.NODE_ENV === 'development'
        ? devConfig.serverUrl
        : prodConfig.serverUrl
//共用变量,请求异常时是否显示报错
let alert: boolean

//请求添加拦截器
Taro.addInterceptor(chain => {
    const requestParams = chain.requestParams //请求参数

    //固定写法,调用下一个拦截器或发起请求
    return chain.proceed(requestParams).then(res => {
        // 只要请求成功，不管返回什么状态码，都走这个回调
        switch (res.statusCode) {
            case 400:
                res.message = '请求错误'
                break

            case 401:
                res.message = '未授权，请登录'
                break

            case 403:
                res.message = '拒绝访问'
                break

            case 404:
                res.message = `请求地址出错: ${requestParams.url}`
                break

            case 408:
                res.message = '请求超时'
                break

            case 500:
                res.message = '服务器内部错误'
                break

            case 501:
                res.message = '服务未实现'
                break

            case 502:
                res.message = '网关错误'
                break

            case 503:
                res.message = '服务不可用'
                break

            case 504:
                res.message = '网关超时'
                break

            case 505:
                res.message = 'HTTP版本不受支持'
                break
            default:
        }
        //失败状态
        if (res.message) return Promise.reject(res)
        //成功状态
        return res.data
    })
})

class httpRequest {
    private http(method: string, payload) {
        const { url, data, options } = payload
        //默认显示报错
        alert = options ? options.alert && true : true

        Taro.request({
            url: baseURL + url,
            data,
            method,
            header: {
                'content-type': 'application/json; charset=UTF-8'
            },
            ...options
        })
    }
    public get(url: string, data, options) {
        this.http('get', { url, data, options })
    }
    public post(url: string, data, options) {
        this.http('post', { url, data, options })
    }
}

export default new httpRequest()
