<template>
    <div id="i1" style="width: 100%">
        <div class="demo">
            <p>摄像点选择:</p>
            <el-input size="small"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <DatePicker type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        placement="bottom-end"
                        placeholder="选择需要查看的时段"
                        separator=" ~ "
                        :value="videotime"
                        :split-panels="true"
                        @on-change = "changeData"
            >
            </DatePicker>
            <el-tree
                    class="filter-tree"
                    :data="data"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @node-click="getvideo"
                    ref="tree">
           </el-tree> <!-- @node-click="gotoMap" -->
        </div>
        <Hikr class="videobox" ref="H1" id="Hik" :openOWebName="ddd"></Hikr>
    </div>
</template>

<script>
    import { Input,Tree ,Message} from 'element-ui'
    import Hikr from "../component/Hik/Hik_revideo"
    import elementResizeDetectorMaker from "element-resize-detector"
    export default {
        name: "reVideo",
        components:{
            [Input.name]:Input,
            [Tree.name]:Tree,
            [ Message.name]: Message,
            Hikr,

        },
        data(){
          return{
            erd :elementResizeDetectorMaker(),
            filterText: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf:"leaf"
            },
            ddd:'bWebControl',
            videotime:[new Date(new Date().setDate(new Date().getDate()-1)),new Date()]

          }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted: function () {
            this.videoinit()
            this.getList()//获取地区列表
            this.resize_window();
        },
        methods:{
            loadNode(node, resolve) {
                switch (node.level) {
                    case 1:
                        if(node.data.spec_type == 1)
                        {
                            let params ={'indexCode':node.data.indexCode};
                            params = this.$secret_key.func(this.$store.state.on_off, params);
                            this.$https.fetchPost('/plugin/statistics/api_index/schoolOnline',params).then((res) => {
                                var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                                resolve(res_data);
                            })
                        }
                        else
                            resolve(node.data.children);
                        break;
                    case 2:
                        if(node.data.spec_type == 2)
                        {
                            let params ={'indexCode':node.data.indexCode};
                            params = this.$secret_key.func(this.$store.state.on_off, params);
                            this.$https.fetchPost('/plugin/statistics/api_index/schoolOnline',params).then((res) => {
                                var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                                resolve(res_data);
                            })
                        }
                        else
                            resolve(node.data.children);
                        resolve(node.data.children);
                        break;
                    case 3:
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
            getList(){ //获取地区列表
                let params ={};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/getRegionCatalog').then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.data = res_data
                })
            },
            getvideo(data){//选择摄像头
                let _this=this
                if(!data.children){
                    let startTime =Math.floor((this.videotime[0].getTime()) / 1000)
                    let endTime =Math.floor((this.videotime[1].getTime()) / 1000)
                    if(isNaN(startTime) || isNaN(endTime))
                    {
                        Message.error("请选择查看录像的时段");
                        return ;
                    }
                    // var endTime = Math.floor((new Date(new Date().toLocaleDateString()).getTime()) / 1000)//当天零点
                        // this.$refs.H1.videoPlay(data.cameraIndexCode);//传入摄像头编码
                        // console.log(data.cameraIndexCode)
                    this.$https.fetchPost('/plugin/statistics/api_index/camerasOnline',{indexCode:data.cameraIndexCode}).then((res) => {
                        if (res.is_online == 1) {
                            this.$refs.H1.videoPlay(data.cameraIndexCode);//传入摄像头编码
                        }else{//如果摄像头离线
                            Message.error({
                                message:'该摄像头处于离线状态',
                                duration:600
                            });
                        }
                    })

                    // console.log(data.cameraIndexCode)
                        // if (data.value == 1) {
                        //     this.$refs.H1.videoPlay(data.cameraIndexCode,function(){},null,null,null,null,startTime,endTime);//传入摄像头编码
                        // }else{//如果摄像头离线
                        //     Message.error({
                        //         message:'该摄像头处于离线状态',
                        //         duration:600
                        //     });
                        // }
                }
            },
            videoinit(){//初始化视频插件
                this.$refs.H1.init(()=>{
                    this.$refs.H1.initVideo()
                    this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);//初始化大小
                });//初始化

            },
            changeData(data){
                this.videotime[0] = new Date(data[0].replace('-', '/').replace('-', '/'))
                this.videotime[1] = new Date(data[1].replace('-', '/').replace('-', '/'))
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            resize(){
                if(!this.$refs.H1.checkWebC()) return//如果插件未初始化
                const that = this
                window.onresize = () => {
                    var target = this;
                    if (target.resizeFlag) {
                        clearTimeout(target.resizeFlag);
                    }
                    target.resizeFlag = setTimeout(function() {
                        // console.log(that.$refs.H1.$el.offsetHeight)
                        that.$refs.H1.resizeWindow(that.$refs.H1.$el.offsetHeight,that.$refs.H1.$el.offsetWidth);
                        target.resizeFlag = null;
                    }, 200);
                }
            },
            resize_window(){
                let that = this;
                this.erd.listenTo(document.getElementById("Hik"), function (element) {
                    var width = element.offsetWidth
                    var height = element.offsetHeight
                    that.$nextTick(()=>{
                        that.$refs.H1.resizeWindow(height,width);
                    })

                })
            }
        },
        activated(){
            this.resize();
        }
    }
</script>

<style scoped lang='less'>
    #i1{
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .demo{
        // width: 18%;
        // float: left;
        max-width: 300px;
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        background: #fff;
        overflow: auto;
        .el-input{
            width:100%;
            padding: 10px 0;
        }
        .ivu-date-picker{
            width:100%;
            margin-bottom:5px;
        }
    }
    .videobox{
        // float: left;
        // width: 82%;
        flex: 1;
        // max-width: calc(~'100% - 200px');
        height: 100%;
    }
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
</style>
