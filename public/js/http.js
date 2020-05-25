import axios from 'axios/index'
import qs from 'qs'
import { Toast } from 'vant';
import { Message,Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

var loadingInstance;
class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout:8000,
      // withCredentials:true,//携带cookie
      headers: {
        //
        "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
      // this.layerIndex.close();
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      if (config.method === 'post') {
        config.data = qs.stringify(config.data);
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        loadingInstance = Loading.service({
          lock: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0)'
        });
        // this.layerIndex = layer.load(1, {
        //   shade:[0.1, "#fff"]
        // })
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      loadingInstance.close();
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      loadingInstance.close();
      this.destroy(url)
      if(error.message.includes('timeout'))
      {
        Toast("连接超时，请检查网络")
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  fetchPost(url, params, options={}){
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, url)
    return new Promise((resolve, reject) => {
      instance.post(url, params, options)
          .then(response => {
            if(response.data.code == '200'){
              resolve(response.data.data);
            }else{
              if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {//移动端
                Toast(response.data.message);
              } else {
                Message.error(response.data.message);
              }

            }
          }, err => {
            reject(err);
          })
          .catch((error) => {
            reject(error)
          })
    })
  }
  fetchGet(url, params){
    const instance = axios.create();
    this.interceptors(instance, url)
    return new Promise((resolve, reject) => {
      instance.post(this.baseUrl+url, { params: params })//本地用url 线上用this.baseUrl+url 下同
          .then(response => {
            if(response.data.code == '200'){
              resolve(response.data.data);
            }else{
              if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {//移动端
                Toast(response.data.message);
              } else {
                Message.error(response.data.message);
              }
            }
          }, err => {
            reject(err);
          })
          .catch((error) => {
            reject(error)
          })
    })
  }
}
export default HttpRequest
