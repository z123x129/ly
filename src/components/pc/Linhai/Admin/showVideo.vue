<template>
    <div id="i1" style="width: 100%">
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
                    :filter-node-method="filterNode"
                    @node-click="getvideo"
                    ref="tree">
            </el-tree>
        </div>
        <Hik class="videobox" ref="H1" :openOWebName="ddd"></Hik>
    </div>
</template>

<script>
    import { Input,Tree } from 'element-ui'
    import Hik from "./component/Hik";

    export default {
        name: "showVideo",
        components:{
            [Input.name]:Input,
            [Tree.name]:Tree,
            Hik
        },
        data(){
            return{

                filterText: '',
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                ddd:'oWebControl',

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
            this.resize()
        },
        methods:{
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
                    this.$refs.H1.videoPlay(data.cameraIndexCode);//传入摄像头编码
                    // console.log(data.cameraIndexCode)
                }
            },
            videoinit(){//初始化视频插件
                this.$refs.H1.init(()=>{
                    this.$refs.H1.initVideo()
                    this.$refs.H1.resizeWindow(this.$refs.H1.$el.offsetHeight,this.$refs.H1.$el.offsetWidth);//初始化大小
                });//初始化

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            resize(){
                if(this.$refs.H1.checkWebC()) return//如果插件未初始化
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
                    // that.$refs.H1.resizeWindow(that.$refs.H1.$el.offsetHeight,that.$refs.H1.$el.offsetWidth);
                    // console.log('高度',that.$refs.H1.$el.offsetHeight)
                    // console.log('宽度',that.$refs.H1.$el.offsetWidth)
                }
            },

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
        // min-width: 200px;
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        background: #fff;
        overflow: auto;
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
