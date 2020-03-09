<template>
    <div style="width: 100%">
        <div class="demo">
            <p>摄像点选择:</p>
            <el-input style="padding: 10px"
                    size="small"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <el-tree
                    class="filter-tree"
                    :data="data"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree">
            </el-tree>
        </div>
        <div class="map_box">
            <div id="content" v-cloak>
                <div id="container" class="map"></div>
                <div id="xy" style="color: red;height: 80px;width: 160px;"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Input,Tree } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    import 'iview/dist/styles/iview.css'
    export default {
        components:{
            [Input.name]:Input,
            [Tree.name]:Tree,
        },
        data(){
            return{
                filterText: '',
                data: [
                    {
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
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
                ]
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
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
        },
        methods:{
            filterNode(value, data) {
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
                    console.log(key)
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
                console.log(e)
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
            opvideo:function(){
                alert('监控视频');
                return false;
            },
            //显示热点
            redian:function(){
                let _this=this
                let placeSearch = new AMap.PlaceSearch();  //构造地点查询类
                let infoWindow = new AMap.InfoWindow({});//信息
                _this.map.on('hotspotclick', function (result) {
                    placeSearch.getDetails(result.id, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            let poiArr = result.poiList.pois;
                            let location = poiArr[0].location;
                            infoWindow.setContent(_this.createContent(poiArr[0]));
                            infoWindow.open(_this.map, location);
                        }
                    });
                });
            },
            createContent:function(e){
                let s = [];
                s.push('<div style="width: 200px">是否查看【' + e.name + '】视频？</div><a class=\'btn btn-info\' onclick=\'opvideo()\' style="margin-left: 12px;margin-top: 10px">查看视频</a>');
                s.push('<div>');
                return s.join("<br>");
            },
            //绘制轨迹
            addpath: function () {
                marker.moveAlong(lineArr, 1000);
            }
        }
    }
</script>
<style scoped lang="less">
    .demo{
        width: 16%;
        float: left;
        padding: 10px;
        box-sizing: border-box;
        height: 100vh;
        background: #fff;
    }
    .map_box{
        float: left;
        width: 84%;
        height: 100vh;
        background: skyblue;
    }
    .map{height:100vh;width:100%;float:left;}
    .info-content img{float:left;margin:3px;}
    .amap-info-combo .keyword-input{height:auto;}
    .btn-info{margin-left: 6px;}
    [v-cloak] {
        display: none;
    }
</style>
