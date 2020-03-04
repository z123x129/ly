/**
 * 配置文件
 */
import httpUrl from '../../http.json'
export default {
    baseUrl:{
        dev:"/public",  //调试地址
        pro:httpUrl.baseUrl  //正式环境地址
    },
    homeName: 'home',
}
