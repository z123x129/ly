<template>
    <div id="i1" style="width: 100%">
        <div class="demo">
            <p>摄像点选择:</p>
            <el-input
                    style="padding:10px;"
                    size="small"
                    placeholder="输入关键字搜索"
                    v-model="filterText">
            </el-input>
            <el-tree
                    class="filter-tree"
                    :data="data"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @node-click="gotoMap"
                    ref="tree">
            </el-tree>
        </div>
        <div class="map_box">
            <div id="content" v-cloak>
                <div id="container" class="map"></div>
                <div id="xy" style="color: red;height: 80px;width: 160px;"></div>
            </div>
        </div>
        <videoDialog class="dialog" :visible.sync="videoVisible" @resize="resize" @cancel="hideVideo" >
            <div class="videobox">
                <div class="demo">
                    <p>摄像点选择:</p>
                    <el-input style="padding: 10px"
                              size="small"
                              placeholder="输入关键字搜索"
                              v-model="filterText2">
                    </el-input>
                    <el-tree
                            class="filter-tree"
                            :data="data2"
                            :props="defaultProps2"
                            :filter-node-method="filterNode2"
                            @node-click="playvideo"
                            ref="tree2">
                    </el-tree>
                </div>
                <Hikr class="videobox" ref="H1" :openOWebName="ddd"></Hikr>
            </div>
        </videoDialog>
    </div>
</template>
<script>
    import { Input,Tree} from 'element-ui'//,DatePicker
    import 'element-ui/lib/theme-chalk/index.css'
    import 'iview/dist/styles/iview.css'
    import Hikr from "../component/Hik/Hik_video"
    import videoDialog from './videoDialog'
    export default {
        inject:["app"],
        components:{
            [Input.name]:Input,
            [Tree.name]:Tree,
            Hikr,
            videoDialog
        },
        data(){
            return{
                filterText: '',
                filterText2: '',
                data: [],
                data2: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                defaultProps2: {
                    children: 'last_child',
                    label: 'label'
                },
                lineArr:[[121.434756, 28.666385], [121.437235, 28.660603], [121.435004, 28.657439], [121.426592, 28.638458], [121.425734, 28.636499], [121.411658, 28.637253], [121.412001, 28.664971], [121.397067, 28.664218], [121.395865, 28.643882]],
                tzSite:[121.15923,28.861499],//台州的坐标
                map:{},//地图
                marker:{},//点标记
                isPath:false,
                pline:{},
                markerArr:[
                    {id:1,isSign:false,unit:0,text:'单',xy:[121.156569,28.86646],line:[[121.156569,28.86646],[121.140984,28.853966],[121.106308,28.859078]]},
                    {id:2,isSign:false,unit:0,text:'车',xy:[121.214848,28.871721],line:[[121.214848,28.871721],[121.193855,28.892148],[121.211365,28.921301]]},
                    {id:3,isSign:false,unit:0,text:'车',xy:[121.150561,28.830675],line:[[121.150561,28.830675],[121.151798,28.810491],[121.131027,28.815605]]}
                ],
                videoVisible:false,
                ddd:'aWebControl',
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            filterText2(val) {
                this.$refs.tree2.filter(val);
            }
        },
        created:function(){
            let _this=this
            window. markerHint= _this.markerHint
            window. opvideo= _this.opvideo
            window. polyline= _this.polyline
            window.markerClick=_this.markerClick
        },
        mounted: function () {
            this.startMap();//地图
            this.getxy();//经纬度
            this.redian();//热点
            this.addsite();//标点
            this.getList()//获取地区列表
            this.winresize()//监听窗口大小变化
        },
        methods:{
            videoinit(){//初始化视频插件
                this.$refs.H1.init(()=>{
                    this.$refs.H1.initVideo()
                    this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);//初始化大小
                });
            },
            hideVideo(){//隐藏视频插件
                this.app[this.ddd].JS_HideWnd();
            },
            resize(){//拖动窗口时视频插件跟随移动
                this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);
            },
            winresize(){
                if(this.$refs.H1.checkWebC()) return//如果插件未初始化

                const that = this
                window.onresize = () => {
                    var target = this;
                    if (target.resizeFlag) {
                        clearTimeout(target.resizeFlag);
                    }
                    target.resizeFlag = setTimeout(function() {
                        that.$refs.H1.resizeWindow(that.$refs.H1.$el.offsetHeight,that.$refs.H1.$el.offsetWidth);
                        target.resizeFlag = null;
                    }, 200);
                }

            },
            getList(){ //获取地区列表
                let params ={};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/getSchoolDir').then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.data = res_data
                })
            },
            gotoMap(data){//地图跳转
                let _this=this
                if(data.parentIndexCode){
                    _this.map.setZoomAndCenter(12, [data.longitude,data.latitude]);
                }else if(!data.children){
                    _this.map.setZoomAndCenter(17, [data.longitude,data.latitude]);
                    // console.log(data.longitude,data.latitude)
                    _this.redian(data.longitude,data.latitude,data.dirName,data)

                }
            },
            playvideo(data){//地图跳转
                let _this=this
                if(!data.last_child){
                    this.$refs.H1.videoPlay(data.cameraIndexCode)
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            filterNode2(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //地图
            startMap:function(){
                let _this=this
                _this.map = new AMap.Map('container', {
                    resizeEnable: true,//监听尺寸变化
                    center: _this.tzSite,
                    zoom: 12,
                    isHotspot: true//是否开启地图热点和标注效果
                });
            },
            //点击经纬度
            getxy:function(){
                let _this=this
                _this.map.on('click', function (e) {
                    $("#xy").text(e.lnglat.getLng() + ',' + e.lnglat.getLat())
                });
            },
            //添加点标记,
            addsite: function () {
                let _this=this
                _this.markerArr.map((va,key) => {
                    // console.log(key)
                    _this.marker = new AMap.Marker({
                        position: va.xy,
                        map: _this.map,
                        offset: new AMap.Pixel(-13, -30)
                    });
                    _this.marker.content = '<div style="width: 200px">选择操作</div><a class=\'btn btn-info\' onclick=\'opvideo()\' style="margin-left: 12px;margin-top: 10px">查看监控</a><a class=\'btn btn-info\' onclick=\'polyline('+key+')\' style="margin-left: 12px;margin-top: 10px">查看轨迹</a></div>';
                    _this.marker.on('click', markerClick);
                    _this.marker.emit('click', {target: _this.marker});
                    _this.marker.setMap(_this.map);
                })
            },
            markerClick:function(e) {
                // console.log(e)console
                let _this=this
                _this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                _this.infoWindow.setContent(e.target.content);
                _this.infoWindow.open(_this.map, e.target.getPosition());
            },
            //轨迹
            polyline:function(key){
                let _this=this
                let line=_this.markerArr[key]
                _this.pline=new AMap.Polyline({
                    map: _this.map,
                    path: line.line,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
            },
            //查看监控
            opvideo:function(data){
                this.videoVisible = true

                if(this.$refs.H1.checkWebC()){
                    this.app[this.ddd].JS_ShowWnd();
                }else{
                    setTimeout(() => {
                        this.videoinit()
                    }, 100);
                }
                // console.log(data.label)
                if(this.data2 == 0){
                    this.data2 = this.data2.concat(data)
                }else{
                    this.data2.forEach( v=>{
                        if(v.label == data.label)return
                        this.data2 = this.data2.concat(data)
                    })
                }




            },
            //显示热点
            redian:function(x,y,name,data){//x,y,name
                let _this=this
                // let placeSearch = new AMap.PlaceSearch();  //构造地点查询类
                let infoWindow = new AMap.InfoWindow({});//信息
                infoWindow.setContent(_this.createContent(name,data));
                infoWindow.open(_this.map, [x,y]);
                // _this.map.on('hotspotclick', function (result) {
                //     placeSearch.getDetails(result.id, function (status, result) {
                //         if (status === 'complete' && result.info === 'OK') {
                //             let poiArr = result.poiList.pois;
                //             let location = poiArr[0].location;
                //             let code=[];
                //             console.log('lng:'+location.lng,'lat:'+location.lat)
                //             code[0]=poiArr[0].name.indexOf("学校");
                //             code[1]=poiArr[0].name.indexOf("幼儿园");
                //             code[2]=poiArr[0].name.indexOf("中学");
                //             code[3]=poiArr[0].name.indexOf("小学");
                //             code[4]=poiArr[0].name.indexOf("中心校");
                //             if(code[0]>0||code[1]>0||code[2]>0||code[3]>0||code[4]>0){
                //                 infoWindow.setContent(_this.createContent(poiArr[0]));
                //                 infoWindow.open(_this.map, location);
                //             }

                //         }
                //     });
                // });
            },
            createContent:function(e,data){
                var data = JSON.stringify(data)
                return '<div style="width: 200px">是否查看【' + e + '】视频？</div><a class=\'btn btn-info\' onclick=\'opvideo(' + data + ')\' style="margin-left: 12px;margin-top: 10px">查看视频</a>';
            },
            //绘制轨迹
            addpath: function () {
                marker.moveAlong(lineArr, 1000);
            }
        }
    }
</script>
<style scoped lang="less">
    #i1{
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .videobox{
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .demo{
        // width: 18%;
        // float: left;
        // min-width: 200px;
        // max-width:20vw;
        // min-width:20vw;
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        background: #fff;
        overflow: auto;
        // transition: all .8s ease;
        // .el-date-editor{
        //     max-width: calc(~'100% - 20px');
        //     margin:0 10px;
        // }
    }
    .map_box{
        // float: left;
        // width: 82%;
        flex: 1;
        height: 100%;
        // max-width: calc(~'100% - 200px');
    }
    .videobox{
        width: 100%;
        height: 100%;
    }
    .map{height:100vh;width:100%;float:left;}
    .info-content img{float:left;margin:3px;}
    .amap-info-combo .keyword-input{height:auto;}
    .btn-info{margin-left: 6px;}
    [v-cloak] {
        display: none;
    }
    .el-tree /deep/ .el-tree-node{
        &:focus{
            &>.el-tree-node__content{
                background-color: #f0f0f0
            }
        }
        .el-tree-node__content{
            height: auto;
            &>.el-tree-node__label{
                line-height: 2.2rem;
            }
            &:hover{
                background-color: #f0f0f0
            }
        }
        .el-tree-node__children{
            .el-tree-node{
                .el-tree-node__content{
                    .el-tree-node__expand-icon{padding: 0;}
                    .el-tree-node__label{font-size: 0.9rem;color:#666;}
                }
            }
        }
    }

    .tree_input{
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        padding-top: 10px;
        .el-input{flex: 1;}
        button{
            margin-left: 5px;
            font-size: 12px;
        }
    }
</style>
