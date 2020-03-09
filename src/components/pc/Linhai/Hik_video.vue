<template>
    <div>
        <span id="i1">1</span>
        <div id="playWnd" class="playWnd" style="left: 109px; top: 133px;"></div>
        {{pubKey}}
        <button @click="init()">点击</button>
        <button @click="videoPlay()">点击</button>
    </div>
</template>

<script>
    // import "_pl/js/Hik/jsWebControl-1.0.0.min.js";
    import {JSEncrypt} from 'encryptlong'
    export default {

        data(){
            return{
                oWebControl:"",
                pubKey:"",
                appkey:"24387968",
                secret:"DDZd1gZIBoEvwUKx0vVx",
                ip:"111.3.64.34",
                port:"446"
            }
        },
        created() {
            let that = this;
            this.oWebControl = new WebControl({
                szPluginContainer: "playWnd",
                iServicePortStart: 15900,
                iServicePortEnd: 15909,
                cbConnectSuccess: function () {
                    //setCallbacks();
                    that.oWebControl.JS_StartService("window", {
                        dllPath: "./VideoPluginConnect.dll"
                        //dllPath: "./DllForTest-Win32.dll"
                    }).then(function () {
                        that.oWebControl.JS_CreateWnd("playWnd", 700, 400).then(function () {
                            window.console.log("JS_CreateWnd success");
                        });
                    }, function () {

                    });
                },
            });
            window.console.log(that.oWebControl);
        },
        methods:{
            init(){
                let that = this;
                this.getPubKey(function () {
                    const secret = that.setEncrypt(that.secret);
                    let encryptedFields = ['secret'];
                    const port = parseInt(that.port);
                    const enableHttps = 1;
                    encryptedFields = encryptedFields.join(",");
                    const data = {
                        appkey: that.appkey,
                        secret: secret,
                        ip: that.ip,
                        playMode: 0, // 预览
                        port: port,
                        snapDir: "D:\\SnapDir",
                        videoDir: "D:\\VideoDir",
                        layout: "2x2",
                        enableHTTPS: enableHttps,
                        encryptedFields: encryptedFields
                    };
                    window.console.log(data);

                    that.oWebControl.JS_RequestInterface({
                        funcName: "init",
                        argument: JSON.stringify(data)
                    })
                });
            },
            videoPlay(){
                this.oWebControl.JS_RequestInterface({
                    funcName: "startPreview",
                    argument: JSON.stringify({
                        cameraIndexCode : "4902f249025a4df4a8d1ebd041ea8692" , //摄像头编号
                        streamMode: 0, //主子码流标识， 默认0
                        transMode: 1, //传输协议 0：UDP 1：TCP
                        gpuMode: 0, //是否启用GPU硬解 0不启用，1启用
                        wndId: 3    //窗口编号
                    })
                }).then(function(oData){
                    window.console.log(oData);
                })
            },












            //获取公钥  callback去初始化
            getPubKey (callback) {
                let that = this;
                this.oWebControl.JS_RequestInterface({
                    funcName: "getRSAPubKey",
                    argument: JSON.stringify({
                        keyLength: 1024
                    })
                }).then(function (oData) {
                    //window.console.log(oData);
                    if (oData.responseMsg.data) {
                        that.pubKey = oData.responseMsg.data;
                        callback()
                    }
                })
            },
            // RSA加密
            setEncrypt(value){
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(this.pubKey);
                return encrypt.encrypt(value);
            }
        }

    }
</script>

<style scoped>
    .playWnd {
        margin: 30px 0 0 400px;
        width: 700px;
        height: 400px;
        border: 1px solid red;
    }
</style>
