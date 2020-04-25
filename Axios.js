import axios from 'axios';
import qs from "qs"


/**
 * 设置地址
 */
switch (process.env.NODE_ENV) {
    case "production":
        axios.defaults.baseURL = "http://localhost:3000"
        break
    case "test":
        axios.defaults.baseURL = "http://localhost:3000"
        break
    default:
        axios.defaults.baseURL = "http://localhost:3000"
}

/**
 * 设置超时时间和跨域是否允许携带凭证
 */

axios.defaults.timeout = 10000
// axios.defaults.withCredentials = true

/**
 * 设置请求传递数据的格式
 * xxx=xxx&xxx=xxx
 */
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded"
axios.defaults.transformRequest = data => qs.stringify(data)

/**
 * 设置拦截器
 * Token校验，接收服务器返回的token，存储到vuex/本地储存
 * 每一次向服务器发送请求，我们应该把token带上
 */

axios.interceptors.request.use(config => {
    let token = localStorage.getItem("token")
    token && (config.headers.Authorization = token)
    return config
}, error => {
    return Promise.reject(error)
})


/**
 * 响应拦截器
 * 服务器返回信息 => [拦截的统一处理]  => 客户端js获取到信息
 * 自定义响应成功的状态码
 */

axios.defaults.validateStatus = status => status >= 200 && status < 300

axios.interceptors.response.use(response => {
    return response.data
}, error => {
    let { response } = error
    if (response) {
        switch (response.status) {
            case 401:  //一般是未登录
                break
            case 403: //一般是token过期
                break
            case 404: //找不到页面
                break
        }
    } else {
        if (!window.navigator.onLine) {
            /**
             * 断网处理
             */
            return
        }
        return Promise.reject(error)
    }
})


export default axios