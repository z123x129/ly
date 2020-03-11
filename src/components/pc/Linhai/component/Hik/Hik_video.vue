<template>
    <div>
        <div id="playWnd" :style="{height:dHeight + 'px', width:dWidth + 'px'}"></div>
    </div>
</template>

<script>
    // import "_pl/js/Hik/jsWebControl-1.0.0.min.js";
    import {JSEncrypt} from 'encryptlong'

    export default {
        inject:["app"],
        props:{
            appkey:{
                type:String,
                default:'24387968'
            },
            secret:{
                type:String,
                default:"DDZd1gZIBoEvwUKx0vVx"
            },
            ip:{
                type:String,
                default:"111.3.64.34"
            },
            port:{
                type:String,
                default:"446"
            },
            height:{
                type:Number,
                default:450
            },
            width:{
                type:Number,
                default:750
            },
            openOWebName:{
                type:String,
                default:"oWebControl",
                validator:function(value){
                    return  ["oWebControl", "aWebControl"].indexOf(value) == "-1" ?false:true;
                }
            }
        },
        data(){
            return{
                pubKey:"",
                show:true,
                dHeight:this.height,
                dWidth:this.width
            }
        },
        mounted() {

        },
        methods:{
            init(){
                let that = this;
                if(this.app[this.openOWebName] != '')
                {
                    window.console.log("窗口以初始化");
                    return;
                }
                this.app[this.openOWebName] = new WebControl({
                    szPluginContainer: "playWnd",
                    iServicePortStart: 15900,
                    iServicePortEnd: 15909,
                    cbConnectSuccess: function () {
                        //setCallbacks();
                        that.app[that.openOWebName].JS_StartService("window", {
                            dllPath: "./VideoPluginConnect.dll"
                            //dllPath: "./DllForTest-Win32.dll"
                        }).then(function () {
                            that.app[that.openOWebName].JS_CreateWnd("playWnd", that.width, that.height).then(function () {
                                window.console.log("JS_CreateWnd success");
                            });
                        }, function () {

                        });
                    },
                });
                window.console.log(that.app[that.openOWebName]);
            },
            initVideo(snapDir = "D:\\SnapDir", videoDir = "D:\\VideoDir", layoutm = "2x2"){
                this.checkWebC();
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
                        snapDir: snapDir,
                        videoDir: videoDir,
                        layout: layoutm,
                        enableHTTPS: enableHttps,
                        encryptedFields: encryptedFields
                    };
                    that.app[that.openOWebName].JS_RequestInterface({
                        funcName: "init",
                        argument: JSON.stringify(data)
                    })
                });
            },
            close(){
                this.checkWebC();
                if(this.show)
                    this.app[this.openOWebName].JS_HideWnd()
                else
                    this.app[this.openOWebName].JS_ShowWnd()
                this.show = !this.show;
                window.console.log(this.show);
            },
            showVideo(){
                this.checkWebC();
                if(this.show)
                    return;
                this.show = true;
                this.app[this.openOWebName].JS_ShowWnd();
            },
            hideVideo(){
                this.checkWebC();
                if(!this.show)
                    return;
                this.show = false;
                this.app[this.openOWebName].JS_HideWnd();
            },
            resizeWindow(height, width)
            {
                this.dWidth = width;
                this.dHeight = height;
                this.app[this.openOWebName].JS_Resize(width, height);
            },
            videoPlay(cameraIndexCode, callback = ()=>{}, wndId = 0, streamMode = 0, transMode = 1, gpuMode= 0){
                this.checkWebC();
                this.app[this.openOWebName].JS_RequestInterface({
                    funcName: "startPreview",
                    argument: JSON.stringify({
                        cameraIndexCode : cameraIndexCode , //摄像头编号
                        streamMode: streamMode, //主子码流标识， 默认0
                        transMode: transMode, //传输协议 0：UDP 1：TCP
                        gpuMode: gpuMode, //是否启用GPU硬解 0不启用，1启用
                        wndId: wndId    //窗口编号
                    })
                }).then(function(oData){
                    window.console.log(oData);
                    callback();
                })
            },
            //获取公钥  callback去初始化
            getPubKey (callback) {
                this.checkWebC();
                let that = this;
                this.app[this.openOWebName].JS_RequestInterface({
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
            },
            checkWebC(){

                if(this.app[this.openOWebName] == '')
                {
                    window.console.log("请先初始化视频插件");
                    return
                }
            }
        },
        beforeDestroy() {
            let that = this;
            if(this.app[this.openOWebName] != '')
            {
                this.app[this.openOWebName].JS_RequestInterface({
                    funcName: "uninit"
                }).then(function(data){
                    if(data.code == 0)
                    {
                        window.console.log(data);
                        that.app[that.openOWebName].JS_Disconnect();
                    }

                })
            }
            //this.app[this.openOWebName].JS_HideWnd();


        }

    }
</script>

<style scoped>

</style>
