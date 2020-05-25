<template>
    <div id="i1" style="width: 100%">
        <div class="demo">
            <p style="padding-bottom:10px">摄像点选择:</p>
            <CheckboxGroup v-model="value" @on-change="chageShow">
                <Checkbox label="学校"></Checkbox>
                <Checkbox label="单兵"></Checkbox>
                <Checkbox label="车载"></Checkbox>
            </CheckboxGroup>
            <el-input
                    style="padding:10px 0;"
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
            </div>
            <div v-if="show" class="block_show">
                <el-date-picker
                        ref="input"
                        v-model="time"
                        type="date"
                        @change="changeTime"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                </el-date-picker>
            </div>
        </div>

        <videoDialog class="dialog" :visible.sync="videoVisible" @resize="resize" @resize_1="resize_1" @showvideo="showvideo" @cancel="hideVideo" >

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
                            :load="loadNode"
                            lazy
                            :props="defaultProps2"
                            :filter-node-method="filterNode2"
                            @node-click="playvideo"
                            ref="tree2">
                    </el-tree>
                </div>
                <Hikr class="videobox" ref="H1" :openOWebName="ddd" id="Hik"></Hikr>
            </div>
        </videoDialog>


    </div>
</template>
<script>
    import { Input,Tree,Message,DatePicker } from 'element-ui'//,DatePicker
    import 'element-ui/lib/theme-chalk/index.css'
    import 'iview/dist/styles/iview.css'
    import Hikr from "../component/Hik/Hik_video"
    import videoDialog from './videoDialog'
    import marker1 from '@/assets/images/marker1.png'
    import marker2 from '@/assets/images/marker2.png'
    import marker3 from '@/assets/images/marker3.png'
    import elementResizeDetectorMaker from "element-resize-detector"
    export default {
        name:"Map_conmand",
        inject:["app"],
        components:{
            [Input.name]:Input,
            [DatePicker.name]:DatePicker,
            [Tree.name]:Tree,
            Hikr,
            videoDialog,
        },
        data(){
            return{
                erd :elementResizeDetectorMaker(),
                marker1,
                marker2,
                marker3,
                filterText: '',
                filterText2: '',
                data: [],
                data2: [],
                defaultProps: {
                    children: 'children',
                    label: 'label',
                },
                defaultProps2: {
                    children: 'last_child',
                    label: 'label',
                    isLeaf:"leaf"
                },
                tzSite:[121.15923,28.861499],//台州的坐标
                map:"",//地图
                markers:[],//点标记合集
                schoolmarkers:[],//学习点标记合集
                carmarkers:[],//学习点标记合集
                isPath:false,
                plines:[],//轨迹合集
                markerArr:[],
                markerArr2:[
                    {id:1,isSign:false,unit:0,text:'单',xy:[121.156147,28.856789]},
                    {id:2,isSign:false,unit:0,text:'车',xy:[121.214258,28.881456]},
                    {id:3,isSign:false,unit:0,text:'车',xy:[121.150369,28.900123]}
                ],
                videoVisible:false,
                ddd:'aWebControl',
                value: ['学校'],
                time:'',
                show:false,
                cameraIndexCode:'',
                historyArr:[],
                showBtn:true,
            }
        },
        computed: {
            // 监听vuex中的CoordinateList
            listenStoreMsg () {
                return this.$store.state.route.CoordinateList
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            filterText2(val) {
                this.$refs.tree2.filter(val);
            },
            listenStoreMsg () {
                this.value.forEach(step=>{
                    if(step == '单兵'){
                        let res = this.$store.state.route.CoordinateList;

                        this.markerArr.forEach((item,index)=>{
                            if(item.cameraIndexCode == res.cameraIndexCode){
                                this.map.remove(this.markers[index]);
                                this.markerArr[index].xy.push(res.xy);
                                this.getTouxiang(index);
                                if(this.markerArr[index].start===false){
                                    this.polylines(index);
                                }return;
                            }
                        })
                    }return;
                })

            },
        },
        created:function(){
            let _this=this
            window. markerHint= _this.markerHint
            window. opvideo= _this.opvideo
            window. polyline= _this.polyline
            window. repolyline= _this.repolyline
            window.markerClick=_this.markerClick
        },
        mounted: function () {
            this.startMap();//地图

            if(this.data.length == 0)
                this.getList();//获取地区列表

            this.getDanbing();
        },
        methods:{
            loadNode(node, resolve) {
                switch (node.level) {
                    case 1:
                        let params ={'indexCode':node.data.indexCode};
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/statistics/api_index/schoolOnline',params).then((res) => {
                            var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                            resolve(res_data);
                        })
                        break;
                    default:
                        resolve([]);
                        break;
                }
            },
            dianji(e){
                let infoWindow = new AMap.InfoWindow();
                infoWindow.setContent(e.target.content);
                infoWindow.open(this.map, e.target.getPosition());
            },
            filterdata(name) {
                let x = {};
                for(let key in this.data)
                {
                    for(let child in this.data[key]["children"])
                    {
                        for(let child_1 in this.data[key]["children"][child]["children"]) {
                            if (this.data[key]["children"][child]["children"][child_1]["label"] == name) {
                                x = this.data[key]["children"][child]["children"][child_1];
                                break;
                            }
                        }
                    }
                }
                return x;
            },
            videoinit(){//初始化视频插件
                this.$refs.H1.init(()=>{
                    this.$refs.H1.initVideo()
                    this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);//初始化大小
                });
            },
            hideVideo(){//隐藏视频插件
                this.app[this.ddd].JS_HideWnd();
            },
            showvideo(){//显示视频插件
                this.app[this.ddd].JS_ShowWnd();
            },
            resize_1(){//拖动窗口时视频插件跟随移动
                this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);
            },
            resize(){
                let that = this;
                this.erd.listenTo(document.getElementById("Hik"), function (element) {
                    var width = element.offsetWidth
                    var height = element.offsetHeight
                    that.$nextTick(()=>{
                        that.$refs.H1.resizeWindow(height,width);
                    })

                })
            },
            getList:async function(){ //获取地区列表
                await this.$https.fetchPost('/plugin/statistics/api_index/getSchoolDir').then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.data = res_data
                    if(this.$route.params.name){
                        var data = this.filterdata(this.$route.params.name)
                        this.redian(data)
                        this.map.setZoomAndCenter(17, [data.longitude,data.latitude]);
                    }
                    this.addsite(1)
                })

            },
            gotoMap(data){//地图跳转

                if(data.parentIndexCode){
                    this.map.setZoomAndCenter(12, [data.longitude,data.latitude]);
                }else if(!data.children){
                    this.map.setZoomAndCenter(17, [data.longitude,data.latitude]);
                    this.redian(data)
                }
            },
            playvideo(data){//地图跳转
                let _this=this
                if(!data.last_child){
                    if (data.value == 1) {
                        this.$refs.H1.videoPlay(data.cameraIndexCode);//传入摄像头编码
                    }else{//如果摄像头离线
                        Message.error({
                            message:'该摄像头处于离线状态',
                            duration:600
                        });
                    }
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
            getDanbing(){
                let params ={'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/getDayCoordinate',params).then((res) => {
                    this.markerArr = res;
                    res.forEach(item=>{
                        this.historyArr.push({
                            'cameraIndexCode':item.cameraIndexCode,
                            'xy':'',
                            'pline':'',
                            'start': false,
                        });
                    })
                })
            },
            chageShow(val){
                if(val.indexOf('单兵') > -1){
                    if(this.markers.length >0){
                        this.map.setZoomAndCenter(11,this.tzSite);
                    }else{
                        this.addsite(2)
                    }

                }else if(val.indexOf('单兵') == -1){
                    this.delsite(2)
                }

                if(val.indexOf('学校') > -1){
                    if(this.schoolmarkers.length >0){
                        this.map.setZoomAndCenter(11,this.tzSite);
                    }else{
                        this.addsite(1)
                    }

                }else if(val.indexOf('学校') == -1){
                    this.delsite(1)
                }

                if(val.indexOf('车载') > -1){
                    if(this.carmarkers.length >0){
                        this.map.setZoomAndCenter(11,this.tzSite);
                    }else{
                        this.addsite(3)
                    }

                }else if(val.indexOf('车载') == -1){
                    this.delsite(3)
                }

            },
            //添加点标记,
            addsite(type) {
                if(type == 1){
                    for(let i in this.data){
                        for(let x in this.data[i]["children"])
                        {
                            for(let y in this.data[i]["children"][x]["children"]){
                                if(this.data[i]["children"][x]["children"][y]["longitude"] == null)
                                    continue;
                                var schoolMarker = new AMap.Marker({
                                    position:[this.data[i]["children"][x]["children"][y]["longitude"],this.data[i]["children"][x]["children"][y]["latitude"]],
                                    icon: new AMap.Icon({
                                        // 图标尺寸
                                        size: new AMap.Size(35,35),
                                        // 图标的取图地址
                                        image: this.marker1,
                                        // 图标所用图片大小
                                        imageSize: new AMap.Size(35, 35),
                                        // 图标取图偏移量
                                        imageOffset: new AMap.Pixel(0,0)
                                    }),
                                    offset: new AMap.Pixel(-15, 0)
                                });
                                var info = JSON.stringify(this.data[i]["children"][x]["children"][y])

                                var img = 'https://cdn.pixabay.com/photo/2016/08/18/23/04/yale-university-1604159_960_720.jpg'
                                // if(this.data[i]["children"][y].school_cover != null && this.data[i]["children"][y].school_cover){
                                //     var img = this.data[i]["children"][x]["children"][y].school_cover
                                // }
                                schoolMarker.content ='<div class="mapBox">'+
                                    '<h3>'+this.data[i]["children"][x]["children"][y].dirName+'</h3>'+
                                    '<div class="flex">'+
                                    '<img src="'+img+'">'+
                                    '<div class="text">'+
                                    '<p>联系人：'+this.data[i]["children"][x]["children"][y].personCharge+'</p>'+
                                    '<p>联系电话：'+this.data[i]["children"][x]["children"][y].personChargePhone+'</p>'+
                                    '<p>地址：'+this.data[i]["children"][x]["children"][y].street+'</p>'+
                                    '<a onclick=\'opvideo('+info+')\'>查看视频</a>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'
                                schoolMarker.on('click', this.dianji);
                                schoolMarker.on('mousemove', this.dianji);
                                schoolMarker.setMap(this.map);
                                this.schoolmarkers.push(schoolMarker);
                            }
                        }

                    }
                }else if(type == 2){
                    var that = this;
                    this.markerArr.map((va,key) => {
                        let length = va.xy.length - 1;
                        let marker = new AMap.Marker({
                            isCustom:true,
                            position: va.xy[length],
                            icon: new AMap.Icon({
                                // 图标尺寸
                                size: new AMap.Size(30,30),
                                // 图标的取图地址
                                image: this.marker2,
                                // 图标所用图片大小
                                imageSize: new AMap.Size(30, 30),
                                // 图标取图偏移量
                                imageOffset: new AMap.Pixel(0,0)
                            }),
                            offset: new AMap.Pixel(-15, -25),

                            // map: _this.map,
                            // offset: new AMap.Pixel(-13, -30)
                        });
                        var contextMenu = new AMap.ContextMenu();
                        contextMenu.addItem("查看监控", function () {
                            that.opvideo('',va);
                        }, 0);
                        contextMenu.addItem("实时轨迹", function () {
                            that.polyline(key)
                        }, 1);
                        contextMenu.addItem("历史轨迹", function () {
                            that.repolyline(key)
                        }, 1);                        //绑定鼠标右击事件——弹出右键菜单
                        marker.on('mousemove', function (e) {
                            contextMenu.open(that.map, e.lnglat);
                        });

                        marker.content = '';
                        // marker.on('click', markerClick);
                        marker.setMap(this.map);
                        this.markers.push(marker);
                    })
                    this.map.setZoomAndCenter(11,this.tzSite);
                }else if(type == 3){
                    this.markerArr2.map((va,key) => {
                        let marker = new AMap.Marker({

                            position: va.xy,
                            icon: new AMap.Icon({
                                // 图标尺寸
                                size: new AMap.Size(30,30),
                                // 图标的取图地址
                                image: this.marker3,
                                // 图标所用图片大小
                                imageSize: new AMap.Size(30, 30),
                                // 图标取图偏移量
                                imageOffset: new AMap.Pixel(0,0)
                            }),
                           offset: new AMap.Pixel(-15, -25),


                            // map: _this.map,
                            // offset: new AMap.Pixel(-13, -30)
                        });
                        marker.content = '<div class="mapBox2"><div style="width: 200px">选择操作</div><a class=\'btn btn-info\' onclick=\'opvideo()\' style="margin-left: 12px;margin-top: 10px">查看监控</a><a class=\'btn btn-info\' onclick=\'polyline('+key+')\' style="margin-left: 12px;margin-top: 10px">查看轨迹</a></div>';
                        marker.on('click', markerClick);
                        marker.setMap(this.map);
                        this.carmarkers.push(marker)
                    })
                    this.map.setZoomAndCenter(11,this.tzSite);
                }

            },
            getTouxiang(key){
                    var that = this;
                    let va = this.markerArr[key];
                    let length = va.xy.length - 1;
                    console.log(va.xy[length])
                    let marker = new AMap.Marker({
                        position: va.xy[length],
                        icon: new AMap.Icon({
                            // 图标尺寸
                            size: new AMap.Size(30,30),
                            // 图标的取图地址
                            image: this.marker2,
                            // 图标所用图片大小
                            imageSize: new AMap.Size(30, 30),
                            // 图标取图偏移量
                            imageOffset: new AMap.Pixel(0,0)
                        }),
                        offset: new AMap.Pixel(-15, -25),

                        // map: _this.map,
                        // offset: new AMap.Pixel(-13, -30)
                    });
                    var contextMenu = new AMap.ContextMenu();
                    contextMenu.addItem("查看监控", function () {
                        that.opvideo('',va);
                    }, 0);
                    contextMenu.addItem("实时轨迹", function () {
                        that.polyline(key)
                    }, 1);
                    contextMenu.addItem("历史轨迹", function () {
                        that.repolyline(key)
                    }, 1);                        //绑定鼠标右击事件——弹出右键菜单
                    marker.on('mousemove', function (e) {
                        contextMenu.open(that.map, e.lnglat);
                    });

                    marker.content = '';
                    // marker.on('click', markerClick);
                    marker.setMap(this.map);
                    this.markers[key] = marker;
                // this.map.setZoomAndCenter(11,this.tzSite);
            },
            //删除点标记
            delsite(type){
                if(type == 1){
                    if (this.schoolmarkers <1)return
                    this.map.remove(this.schoolmarkers);//删除点标记
                    this.schoolmarkers =[]
                }else if(type == 2){
                    if (this.markers <1)return
                    this.map.remove(this.markers);//删除点标记
                    this.map.remove(this.plines);//删除轨迹
                    this.markers =[]
                    this.plines =[]
                }else if(type == 3){
                    if (this.carmarkers <1)return
                    this.map.remove(this.carmarkers);//删除点标记
                    this.carmarkers =[]
                }

            },
            markerClick:function(e) {
                this.showBtn = !this.showBtn;
                let _this=this
                _this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                _this.infoWindow.setContent(e.target.content);
                _this.infoWindow.open(_this.map, e.target.getPosition());
                _this.infoWindow.on('close',_this.showInfoClose)
            },
            showInfoClose(){
              this.show = false;
            },
            //实时轨迹
            polyline:function(key){
                if(this.markerArr[key].start==undefined || this.markerArr[key].start==true){
                    // let params ={'uid':this.$store.state.user.uid,'cameraIndexCode':this.markerArr[key].cameraIndexCode,'key':2};
                    // this.$https.fetchPost('/plugin/statistics/api_index/switchCoordinate',params).then(() => {
                        this.markerArr[key].start = false;
                        this.polylines(key);
                    // })
                }else{
                    // let params ={'uid':this.$store.state.user.uid,'cameraIndexCode':this.markerArr[key].cameraIndexCode,'key':1};
                    // this.$https.fetchPost('/plugin/statistics/api_index/switchCoordinate',params).then(() => {
                        this.markerArr[key].start = true;
                        this.markerArr[key].pline.setMap(null);
                    // })
                }
            },
            //描绘实时轨迹
            polylines:function(key){
                if(this.markerArr[key].pline){
                    this.markerArr[key].pline.setMap(null);
                }
                let _this=this
                console.log(_this.markerArr[key].xy)
                let pline=new AMap.Polyline({
                    map: _this.map,
                    path: _this.markerArr[key].xy,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
                _this.markerArr[key].pline = pline;
            },
            //历史轨迹
            repolyline:function(key){
                if(this.historyArr[key].start==true && this.historyArr[key].pline.setMap){
                    this.historyArr[key].start = false;
                    this.historyArr[key].pline.setMap(null);
                }else{
                    this.time = '';
                    this.show = true;
                    this.$nextTick(x=>{
                        this.$refs.input.focus();
                    });
                    this.cameraIndexCode = this.markerArr[key].cameraIndexCode;
                    this.historyArr[key].start = true;
                }
            },
            //描绘历史轨迹
            hispolyline:function(index){
                let _this=this
                let pline=new AMap.Polyline({
                    map: _this.map,
                    path: _this.historyArr[index].xy,
                    showDir: true,
                    strokeColor: "#ff009c",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
                _this.historyArr[index].pline = pline;
            },
            //时间选择
            changeTime(){
                if(this.time){
                let params ={'uid':this.$store.state.user.uid,'time':this.time,'cameraIndexCode':this.cameraIndexCode};
                this.$https.fetchPost('/plugin/statistics/api_index/getHistoryCoordinate',params).then((res) => {
                    if(res.xy){
                        this.historyArr.forEach((item,index)=>{
                            if(item.cameraIndexCode == res.cameraIndexCode){
                                this.historyArr[index].xy = res.xy;
                                this.hispolyline(index);
                            }
                        })
                    }else{
                        Message.error('该时间无轨迹');
                    }
                })
                }
            },
            //查看监控
            opvideo:function(data,step){
                this.videoVisible = true
                if(this.$refs.H1.checkWebC()){
                    this.app[this.ddd].JS_ShowWnd();
                }else{
                    setTimeout(() => {
                        this.videoinit()
                    }, 100);
                }
                if(this.data2.length == 0){
                    if(step){
                        step.label = step.cameraName;
                        step.leaf = true;
                        this.data2 = this.data2.concat(step);
                        return;
                    }
                    this.data2 = this.data2.concat(data)
                }else{
                    if(step){
                        step.label = step.cameraName;
                        step.leaf = true;
                        for(let i in this.data2)
                        {
                            if(this.data2[i].label == step.label)
                                return;
                        }
                        this.data2 = this.data2.concat(step);
                        return;
                    }
                    for(let i in this.data2)
                    {
                        if(this.data2[i].label == data.label)
                            return;
                    }
                    this.data2 = this.data2.concat(data)
                }
            },
            //显示热点
            redian:function(data){
                let _this=this
                var info = JSON.stringify(data)
                var img = 'https://cdn.pixabay.com/photo/2016/08/18/23/04/yale-university-1604159_960_720.jpg'
                if(data.school_cover){
                    var img = data.school_cover
                }
                var content ='<div class="mapBox">'+
                            '<h3>'+data.dirName+'</h3>'+
                            '<div class="flex">'+
                                '<img src="'+img+'">'+
                                '<div class="text">'+
                                    '<p>联系人：'+data.personCharge+'</p>'+
                                    '<p>联系电话：'+data.personChargePhone+'</p>'+
                                    '<p>地址：'+data.street+'</p>'+
                                    '<a onclick=\'opvideo('+info+')\'>查看视频</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                let infoWindow = new AMap.InfoWindow();//信息
                infoWindow.setContent(content);
                infoWindow.open(_this.map, [data.longitude,data.latitude]);
                // _this.map.on('hotspotclick', function (result) {
                //     placeSearch.getDetails(result.id, function (status, result) {
                //         if (status === 'complete' && result.info === 'OK') {
                //             let poiArr = result.poiList.pois;
                //             let location = poiArr[0].location;
                //             let code=[];
                //             code[0]=poiArr[0].name.indexOf("学校");
                //             code[1]=poiArr[0].name.indexOf("幼儿园");
                //             code[2]=poiArr[0].name.indexOf("中学");
                //             code[3]=poiArr[0].name.indexOf("小学");
                //             code[4]=poiArr[0].name.indexOf("中心校");
                //             if(code[0]>0||code[1]>0||code[2]>0||code[3]>0||code[4]>0){
                //                 infoWindow.setContent(_this.createContent(poiArr[0]));
                //                 infoWindow.open(_this.map, location);
                //             }
                //
                //         }
                //     });
                // });
            },
            // createContent:function(data){
            //     var data = JSON.stringify(data)
            //     data = eval('(' + data + ')');
            //     console.log(data)
            //     // return '<div class="mapBox" style="width: 200px">是否查看【' + e + '】视频？</div><a class=\'btn btn-info\' onclick=\'opvideo(' + data + ')\' style="margin-left: 12px;margin-top: 10px">查看视频</a>';
            //     return '<div class="mapBox">'+
            //                 '<h3>'+data+'</h3>'+
            //                 '<div class="flex">'+
            //                     '<img src="http://tpc.googlesyndication.com/simgad/5843493769827749134">'+
            //                     '<div class="text">'+
            //                         '<p>联系人：张三</p>'+
            //                         '<p>联系电话：18012341234</p>'+
            //                         '<p>地址：临海市嵩山路65号往北200米</p>'+
            //                         '<a onclick=\'opvideo()\'>查看视频</a>'+
            //                     '</div>'+
            //                 '</div>'+
            //             '</div>'

            // },
        },
        activated(){
            if(this.map == "")
            {
                this.startMap();
            }//地图
            if(this.videoVisible)
            {
                if(this.$refs.H1.checkWebC())
                    this.app[this.ddd].JS_ShowWnd();
            }


            else if(  this.$route.params.name)
           {
               var data = this.filterdata(this.$route.params.name)
               this.redian(data)
               this.map.setZoomAndCenter(17, [data.longitude,data.latitude]);
           }
        }
    }
</script>
<style scoped lang="less">
    #content /deep/ .mapBox{
        background: #fff;
        h3{
            padding: 0 80px 0 20px;
            height: 42px;
            line-height: 42px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
            color: #333;
            overflow: hidden;
            background-color: #F8F8F8;
            border-radius: 2px 2px 0 0;
            font-weight: 700;
        }
        .flex{
            display: flex;
            align-items: center;
            padding: 10px;
            img{
                width: 100px;
                height: 100px;
                object-fit: cover;
            }
            .text{
                padding-left: 10px;
                p{
                    color: #666;
                    padding-bottom: 5px;
                }
                button{

                }
            }
        }
    }
    #content /deep/ .mapBox2{
        padding: 10px 18px 10px 10px;
    }
    #content /deep/ .amap-info{
        .amap-info-content{
            background: transparent;
            padding: 0;
            .amap-info-close{top:14px}
        }
    }
    // 学校点标记
    #content /deep/ .schoolMarker{
        // width: 80px;
        // height: 80px;
        box-shadow: 0 1px 6px rgba(0,0,0,0.1);
        padding: 10px;
        background-color: #fff;
        border-radius: 100px;
        display: flex;
        align-items: center;
        img{
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
        }
        .text{
           padding-left: 10px;
           h3{
               font-size: 16px;
           }
           p{
               font-size: 15px;
               color: #666;
           }
        }
    }
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
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        background: #fff;
        overflow: auto;
    }
    .map_box{
        position: relative;
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
    .block_show{
        position: absolute;
        top: 20px;
        right: 20px;
    }
    .block_show /deep/ .el-input__inner{
        background: rgba(255,255,255,0.8);
    }

    .reset{
        width: 32px;
        height: 32px;
        position: relative;
    }
    /*.reset li {*/
    /*    width: 32px;*/
    /*    height: 32px;*/
    /*    display: inline-block;*/
    /*}*/
    .li1{
        z-index: 9;
        position: absolute;
        top: 0;
        left: 0;
    }
    .li2{
        position: absolute;
        transition: 1s;
        opacity: 0;
        top: 0;
        left: 0;
    }
    .li3{
        position: absolute;
        transition: 1s;
        opacity: 0;
        top: 0;
        left: 0;
    }
    .li4{
        position: absolute;
        transition: 1s;
        opacity: 0;
        bottom: 0;
        left: 0;
    }
    .li5{
        position: absolute;
        transition: 1s;
        opacity: 0;
        bottom: 0;
        left: 0;
    }
    #li2hover{
        transition: 1s;
        position: absolute;
        opacity: 1;
        top: -40px;
        left: 0;
    }
    #li3hover{
        transition: 1s;
        position: absolute;
        opacity: 1;
        top: -20px;
        left: 40px;
    }
    #li4hover{
        transition: 1s;
        position: absolute;
        opacity: 1;
        bottom: -20px;
        left: 40px;
    }
    .li5hover{
        transition: 1s;
        position: absolute;
        opacity: 1;
        bottom: -40px;
        left: 0;
    }


</style>
