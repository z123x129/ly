import store from '../../src/store'
import { JSEncrypt  } from 'encryptlong'
import md5 from 'js-md5'

/**
 * 生成随机数
 * @param minNum
 * @param maxNum
 * @returns {number}
 */
function randomNum(minNum, maxNum) {
    let num = 0;
    switch (arguments.length) {
        case 1:num = parseInt(Math.random() * minNum + 1, 10);break;
        case 2:num =  parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);break;
        default:num =  0;break;
    }
    return num;
}
/**
 * 将json数据进行排序
 * @param {*jason} data
 */
function JsonSort(jsonData) {
    try {
        let tempJsonObj = {};
        let sdic = Object.keys(jsonData).sort();
        sdic.map((item, index) => {
            tempJsonObj[item] = jsonData[sdic[index]]
        })
        //console.log('将返回的数据进行输出',tempJsonObj);
        return tempJsonObj;
    } catch (e) {
        return jsonData;
    }
}
/**
 * 生成签名
 * @param  {[type]} data [json数组]
 * @param  {[type]} def [json数组]
 * @return {[type]}      [description]
 */
function signature_l(data ,def = '') {
    window.console.log('需要排序的参数data',data);
    data = JsonSort(data);
    let paramString = def;
    //生成以&符链接的key=value形式的字符串
    for (var v in data) {
        //alert(v + " " + data[v]);
        paramString += v + '=' + data[v] + '&';
    }
    paramString = paramString.substr(0, paramString.length - 1);
    var signature = md5(paramString).toUpperCase();
    return [signature, paramString];
}


function lock_first(Obj) {
    //获取当前时间时间戳
    let timestamp=new Date().getTime();
    //生成随机数
    let noncestr = randomNum(1, 999999); //设置随机数范围

    window.console.log('传进来的参数',Obj);
    let appid = '123456';
    let jsapi_ticket = store.state.jsapi_ticket;
    let data = {
        appid: appid,
        timestamp: timestamp,
        noncestr: noncestr,
        jsapi_ticket:jsapi_ticket,
        // uid: uid,
        // field: field,
    };
    data = Object.assign(data,Obj);
    let [signature, paramString] = signature_l(data);
    window.console.log('排序结果', paramString);
    //加密
    return paramString + '&signature='+ signature;

}
function lock_second(mm)
{
    var rsa_public_key= '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPTwOT15xFv3Klf/zAO7qP/1DC\n' +
        'UNns5bzh3sDltxQM/B6fpIVlHnrzRiAyAwWSXh21ILXBsJATVU+wy+XbbP+yS2tb\n' +
        '/JzsdpHJeWT98TVB/hRaJY916dT9jMwo8QUxCOuXudx8vHJOf38XeKgLyPYGkq5F\n' +
        'fCYySAohIYv5TxC2ywIDAQAB\n' +
        '-----END PUBLIC KEY-----';
    // var rsa_public_key2='-----BEGIN PUBLIC KEY-----\n' +
    //     'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCU5NCXrdQcVpZzB30bgKu7yaxP\n' +
    //     'VGqJ7gnXqBXKR2JuOJvWQi3iyiEfRTFNw0b3rHlUuOsR11JCoBZ+Ygv6+tv0FkRw\n' +
    //     'i8lzyVLSgrxY5iKtc+/qOU3gzq1Cd80ZmkeiwSLH+mSuRCmA8wuU73nG+wJcxW4v\n' +
    //     'L/MTPmvDYnpto+tbMQIDAQAB\n' +
    //     '-----END PUBLIC KEY-----';
    window.console.log('完整排序', mm)
    // console.log('rsa_public_key', rsa_public_key);
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(rsa_public_key); //密钥
    var encrypted = encrypt.encryptLong(mm);   //加密后
    window.console.log('加密后', encrypted);
    return encrypted
}
function plain(res_key) {
    var rsa_private_key2='-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICWwIBAAKBgQCU5NCXrdQcVpZzB30bgKu7yaxPVGqJ7gnXqBXKR2JuOJvWQi3i\n' +
        'yiEfRTFNw0b3rHlUuOsR11JCoBZ+Ygv6+tv0FkRwi8lzyVLSgrxY5iKtc+/qOU3g\n' +
        'zq1Cd80ZmkeiwSLH+mSuRCmA8wuU73nG+wJcxW4vL/MTPmvDYnpto+tbMQIDAQAB\n' +
        'AoGAAyQV7q/Ao6IgzMeMr5FdP4ilWPpvS750e3iweStzv/X/QN6vqodbNATr28ZB\n' +
        'yx1x/G+22N2d8zItT0y4EEyNgZZMoxhDHTJWHZJzqQsDCvpLsgJxto2zQ4KKCl4l\n' +
        'dGvsLF8gHbeULKDLgEwPhD/6KwcVWA89nP/S4y9/ji3bec0CQQDfkcdsv1Y+7dTc\n' +
        '0/rPfyans3+yLG1lPzzFGyJAcz5eUsfgItXmJEzPgib0ePgOk5e/JTimzqXkQlaa\n' +
        '+BwtgfdFAkEAqn33T4GzL+pZrVa3aKx1aukQKSQ8uR/CCdu1o+vt/kgu/vWwpWog\n' +
        '7MH16HyzQkG7CsC5Ul80CHf6EUImTyPM/QJAOZxfP26u0tiGmcEmSIIDfAONTGSW\n' +
        'bBi3mDM9yE3qLHQ4fVF8vSltgauQTj897MOrvt3gk1t89C0EFDsLR87N4QJAfmUI\n' +
        'lc7n0twAQ7uIGXfRTMMgEgAlbHEY30odLTtZoyxMewQWQ2ucoSlib0sTcklcqyoZ\n' +
        'ufGOl8CqiWTrFbzK2QJAOgDhwA013TF4P9qaLNscJ1O5gV+rDUR/g3CGaYl4lKVI\n' +
        '99rdyEWxmpch9/HnAGAIlDOTsIM78fA/hFZHpoULrQ==\n' +
        '-----END RSA PRIVATE KEY-----';
    // var rsa_private_key2='-----BEGIN RSA PRIVATE KEY-----\n' +
    //     'MIIBOgIBAAJBAJkcLM58EgJjnF4MXVGiNFTEyeHOw4JgEaCYPuXQS5uIUcrSONfK\n' +
    //     'jQ+RaQxdSJIvmZoJ4m3xslMW2g1DsXM851MCAwEAAQJABdcxTl8lQLoUCPJnzOln\n' +
    //     'HaS0Hs0IYDzR71Jfc9zSRYiKPS8rgaXjInaL8EIzLQUlQMJOUHDF8HBowByflJNK\n' +
    //     'QQIhAPbG3mDyKU5HpVDl46chVuWEESE9Y0tjdqpkxMyJgl/pAiEAntUdJGiPJIfa\n' +
    //     'PFFDnxAl4pXP47l0w2Gp5Q7BR+nYI9sCIQCaOMxvL8fKqRHSjekI4NgKlc+Sw2eT\n' +
    //     'jLRzZohq/yDgSQIgWU2ZxQ7E7NU1bxSB4L1Dj9KLwI5ViEUxMQjKw5RHYmECIHy7\n' +
    //     'cS7gFNak3jTS9RYC6bMwTi19BfkPZap8A+GTole+\n' +
    //     '-----END RSA PRIVATE KEY-----';
    // 解密
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(rsa_private_key2);
    var uncrypted = decrypt.decryptLong(res_key); //这里慢
    window.console.log('解密成功',uncrypted);
    if(uncrypted != null)
    {
        try{
            return JSON.parse(uncrypted);
        }
        catch (e) {
            return uncrypted
        }
    }
    else
        return '-200';
    // return res_key;
}
export function func(on_off, data, type="lock" ){
    var retData = [];
    if(on_off)
    {
        switch (type) {
            case "lock":
                retData["sign"] = lock_first(data);
                break;
            case "important":
                var mm = lock_first(data);
                retData["data"] = lock_second(mm);
                break;
            case "key":
                retData = data;
                break;
            case "plain":
                retData = plain(data);
                break;
        }
    }
    else{
        retData = data;
    }
    return retData;
}
export default {
    func
}
