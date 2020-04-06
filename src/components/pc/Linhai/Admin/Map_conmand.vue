<template>
    <div id="i1" style="width: 100%">
        <div class="demo">
            <p style="padding-bottom:10px">摄像点选择:</p>
            <CheckboxGroup v-model="value" @on-change="chageShow">
                <Checkbox label="单兵视频"></Checkbox>
                <Checkbox label="车载视频"></Checkbox>
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
        name:"Map_conmand",
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
                map:"",//地图
                markers:[],//点标记合集
                isPath:false,
                plines:[],//轨迹合集
                markerArr:[
                    {id:1,isSign:false,unit:0,text:'单',xy:[121.156569,28.86646],line:[[121.156569,28.86646],[121.140984,28.853966],[121.106308,28.859078]]},
                    {id:2,isSign:false,unit:0,text:'车',xy:[121.214848,28.871721],line:[[121.214848,28.871721],[121.193855,28.892148],[121.211365,28.921301]]},
                    {id:3,isSign:false,unit:0,text:'车',xy:[121.150561,28.830675],line:[[121.150561,28.830675],[121.151798,28.810491],[121.131027,28.815605]]}
                ],
                videoVisible:false,
                ddd:'aWebControl',
                value: [],
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
            this.winresize()//监听窗口大小变化
           
        },
        methods:{
            getname(){
                for(let i in this.data)
                {
                    for(let y in this.data[i]["children"]){
                        let _this = this
                        var startMarker = new AMap.Marker({
                            position:[this.data[i]["children"][y]["longitude"],this.data[i]["children"][y]["latitude"]],
                            icon: new AMap.Icon({
                            // 图标尺寸
                            size: new AMap.Size(25,40),
                            // 图标的取图地址
                            image: 'data:image/png;base64,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0p8zAAA7amlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjAtMDQtMDVUMTM6NDk6NTArMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wNC0wNVQxMzo1NDo1NCswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjAtMDQtMDVUMTM6NTQ6NTQrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxwaG90b3Nob3A6VGV4dExheWVycz4KICAgICAgICAgICAgPHJkZjpCYWc+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyTmFtZT7lraY8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PuWtpjwvcGhvdG9zaG9wOkxheWVyVGV4dD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkJhZz4KICAgICAgICAgPC9waG90b3Nob3A6VGV4dExheWVycz4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo2ZDg5NDFjMC0yMzhkLWJiNGQtODllMi1jNDIyNjU3ODI3NmI8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDplYzA4N2U2YS03NzAxLTExZWEtYWU0OC04YTI1YTEwODRjMWI8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpjMWNiODJjMC0xZTM5LWQ0NDUtYjE5MC0xMzk2MWY5MWQwMzA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6YzFjYjgyYzAtMWUzOS1kNDQ1LWIxOTAtMTM5NjFmOTFkMDMwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTA0LTA1VDEzOjQ5OjUwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjZkODk0MWMwLTIzOGQtYmI0ZC04OWUyLWM0MjI2NTc4Mjc2Yjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMC0wNC0wNVQxMzo1NDo1NCswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4wGNSMAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAhdSURBVHja1JtvjBRnHcc/z8zu7O3ucVyPK0Ws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',
                            // 图标所用图片大小
                            imageSize: new AMap.Size(25, 40),
                            // 图标取图偏移量
                            imageOffset: new AMap.Pixel(0,0)
                            }),
                            offset: new AMap.Pixel(-14, 0)
                        });
                        var info = JSON.stringify(this.data[i]["children"][y])
                        var img = 'https://cdn.pixabay.com/photo/2016/08/18/23/04/yale-university-1604159_960_720.jpg'
                        if(this.data[i]["children"][y].school_cover){
                            var img = this.data[i]["children"][y].school_cover
                        }
                        startMarker.content ='<div class="mapBox">'+
                            '<h3>'+this.data[i]["children"][y].dirName+'</h3>'+
                            '<div class="flex">'+
                                '<img src="'+img+'">'+
                                '<div class="text">'+
                                    '<p>联系人：'+this.data[i]["children"][y].personCharge+'</p>'+
                                    '<p>联系电话：'+this.data[i]["children"][y].personChargePhone+'</p>'+
                                    '<p>地址：'+this.data[i]["children"][y].street+'</p>'+
                                    '<a onclick=\'opvideo('+info+')\'>查看视频</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                        startMarker.on('click', this.dianji);
                        startMarker.setMap(this.map);
                    }
                   
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
                        if(this.data[key]["children"][child]["dirName"] == name)
                            {
                                // console.log(this.data[key]["children"][child]);
                                x =  this.data[key]["children"][child];
                                break;
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
            resize(){//拖动窗口时视频插件跟随移动
                this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);
            },
            winresize(){//监听窗口大小变化改变视频插件窗口大小
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
            getList:async function(){ //获取地区列表
                let params ={};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                await this.$https.fetchPost('/plugin/statistics/api_index/getSchoolDir').then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.data = res_data
                    if(this.$route.params.name){
                        var data = this.filterdata(this.$route.params.name)
                        this.redian(data)
                        this.map.setZoomAndCenter(17, [data.longitude,data.latitude]);
                    }
                    this.getname()
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
            chageShow(val){
                if(val.indexOf('单兵视频') > -1){
                    if(this.markers.length >0){
                        this.map.setZoomAndCenter(11,this.tzSite);
                        return
                    }else{
                        this.addsite()
                    }
                    
                }else if(val.indexOf('单兵视频') == -1){
                    this.delsite()
                }
                
            },
            //添加点标记,
            addsite: function () {
                let _this=this
                _this.markerArr.map((va,key) => {
                    // console.log(key)
                    let marker = new AMap.Marker({
                        position: va.xy,
                        map: _this.map,
                        offset: new AMap.Pixel(-13, -30)
                    });
                    marker.content = '<div class="mapBox2"><div style="width: 200px">选择操作</div><a class=\'btn btn-info\' onclick=\'opvideo()\' style="margin-left: 12px;margin-top: 10px">查看监控</a><a class=\'btn btn-info\' onclick=\'polyline('+key+')\' style="margin-left: 12px;margin-top: 10px">查看轨迹</a></div>';
                    marker.on('click', markerClick);
                    marker.setMap(_this.map);
                    _this.markers.push(marker)
                })
                _this.map.setZoomAndCenter(11,_this.tzSite);
            },
            //删除点标记
            delsite(){
                if (this.markers <1)return
                this.map.remove(this.markers);//删除点标记
                this.map.remove(this.plines);//删除轨迹
                this.markers =[]
                this.plines =[]
            },
            markerClick:function(e) {
                let _this=this
                _this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                _this.infoWindow.setContent(e.target.content);
                _this.infoWindow.open(_this.map, e.target.getPosition());
            },
            //轨迹
            polyline:function(key){
                let _this=this
                let line=_this.markerArr[key]
                let pline=new AMap.Polyline({
                    map: _this.map,
                    path: line.line,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
                _this.plines.push(pline)
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
                if(this.data2.length == 0){
                    this.data2 = this.data2.concat(data)
                }else{
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
            //绘制轨迹
            addpath: function () {
                marker.moveAlong(lineArr, 1000);
            }
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

           if(this.data.length == 0)
               this.getList();//获取地区列表
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
        // background: #000;
    }
    #content /deep/ .mapBox2{
        padding: 10px 18px 10px 10px;
    }
    #content /deep/ .amap-info{
        .amap-info-content{
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
               font-weight: ;
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
