<template>
    <div>
        <div id="playWnd_2" style="height:100%;width:100%;"></div>
    </div>
</template>

<script>
    // import "_pl/js/Hik/jsWebControl-1.0.0.min.js";
    import Global from '../../js/Global'
    import {JSEncrypt} from 'encryptlong'
    import {Message,MessageBox} from "element-ui"

    export default {
        inject:["app"],
        props:{
            // appkey:{
            //     type:String,
            //     default:'24387968'
            // },
            // secret:{
            //     type:String,
            //     default:"DDZd1gZIBoEvwUKx0vVx"
            // },
            // ip:{
            //     type:String,
            //     default:"10.22.113.85"
            // },
            appkey:{
                type:String,
                default:'20307173'
            },
            secret:{
                type:String,
                default:"GcBtnm6uvyjiuKyvYne7"
            },
            ip:{
                type:String,
                default:"111.3.64.34"},
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
                dWidth:this.width,
                videoPath:Global.path2,
                imgPath:Global.path1,
                initCount :1
            }
        },
        mounted() {

        },
        methods:{
            init(callback = ()=>{}){
                let that = this;
                if(this.app[this.openOWebName] != '')
                {
                    return;
                }
                this.app[this.openOWebName] = new WebControl({
                    szPluginContainer: "playWnd_2",
                    iServicePortStart: 15900,
                    iServicePortEnd: 15909,
                    cbConnectSuccess: function () {
                        //setCallbacks();
                        that.app[that.openOWebName].JS_StartService("window", {
                            dllPath: "./VideoPluginConnect.dll"
                            //dllPath: "./DllForTest-Win32.dll"
                        }).then(function () {
                            that.app[that.openOWebName].JS_SetWindowControlCallback({   // 设置消息回调
                                cbIntegrationCallBack: that.cbIntegrationCallBack
                            });
                            that.app[that.openOWebName].JS_CreateWnd("playWnd_2", that.width, that.height).then(function () {

                                 callback();

                            });
                        }, function () {

                        });
                    },
                    cbConnectError: function () {
                        that.app[that.openOWebName] = "";
                        WebControl.JS_WakeUp("VideoWebPlugin://");
                        that.initCount ++;
                        if (that.initCount < 3) {
                            setTimeout(function () {
                                that.init();
                            }, 3000)
                        } else {
                            MessageBox.confirm('插件启动失败,是否下载插件?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                window.location.href="http://10.22.116.249:10000/VideoWebPlugin.exe"
                            }).catch(() => {
                                Message.error("插件启动失败！")
                            });
                        }
                    },
                });
            },
            cbIntegrationCallBack(){
            },
            initVideo(layoutm = "2x2"){//snapDir = "SnapDir", videoDir = "VideoDir",
                if(!this.checkWebC())
                    return;
                var timer = new Date().getFullYear() +''+ (new Date().getMonth()+1) + new Date().getDate()
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
                        snapDir: that.imgPath+'\\'+'SnapDir'+'\\'+timer,
                        videoDir: that.videoPath+'\\'+'VideoDir'+'\\'+timer,
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
                if(!this.checkWebC())
                    return;
                if(this.show)
                    this.app[this.openOWebName].JS_HideWnd()
                else
                    this.app[this.openOWebName].JS_ShowWnd()
                this.show = !this.show;
            },
            showVideo(){
                if(!this.checkWebC())
                    return;
                if(this.show)
                    return;
                this.show = true;
                this.app[this.openOWebName].JS_ShowWnd();
            },
            hideVideo(){
                if(!this.checkWebC())
                    return;
                if(!this.show)
                    return;
                this.show = false;
                this.app[this.openOWebName].JS_HideWnd();
            },
            resizeWindow(height, width)
            {
                // this.dWidth = width;
                // this.dHeight = height;
                this.app[this.openOWebName].JS_Resize(width, height);
            },
            videoPlay(cameraIndexCode, callback = ()=>{}, wndId = -1, streamMode = 0, transMode = 1, gpuMode= 0){
                if(!this.checkWebC())
                    return;
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
                    callback();
                })
            },
            //获取公钥  callback去初始化
            getPubKey (callback) {
                if(!this.checkWebC())
                    return;
                let that = this;
                this.app[this.openOWebName].JS_RequestInterface({
                    funcName: "getRSAPubKey",
                    argument: JSON.stringify({
                        keyLength: 1024
                    })
                }).then(function (oData) {
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
                    return false;
                }
                return true;
            },
            destroy(){
                if(!this.checkWebC())
                    return;
                this.app[this.openOWebName].JS_Disconnect();
            }
        },
        beforeDestroy(){
                this.destroy();
                this.app[this.openOWebName] = "";
        }
    }
</script>

<style scoped>

</style>
