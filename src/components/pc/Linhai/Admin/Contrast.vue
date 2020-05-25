<template>
    <div style="position: relative">
                <el-switch
                        style="display: block;position: absolute;right: 20px;top: 20px;z-index: 9"
                        v-model="value1"
                        @change="getData"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="学校数据"
                        inactive-text="区域数据">
                </el-switch>
                <div style="width: 100%;">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item v-if="value1" label="选择区域:">
                            <el-select style="z-index: 99" @change="getData" size="small" filterable v-model="formInline.indexCode">
                                <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-top: 9px;z-index: 99">
                            <el-button style="z-index: 99" size="small" type="primary" @click="exports">导出excel</el-button>
                        </el-form-item>
<!--                        <div v-if="!value1" style="height: 63px"></div>-->
                    </el-form>
                    <div class="header">
                        <p v-if="value1">各学校当月数据对比</p>
                        <p v-if="!value1">各区域当月数据对比</p>
                        <Dataset @getSet="getSet" ref="Dataset" :type="2" :data="data" style="width: 100%;height: 100%"></Dataset>
                    </div>
                </div>
                <div style="height: 10px"></div>
                <el-table
                        :data="tableData"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            fixed="left"
                            prop="school_name"
                            label="学校"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="nor_ratio"
                            label="当月健康证未过期比例(%)"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="last_ratio"
                            label="上月健康证未过期比例(%)"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="face_num"
                            label="当月人脸抓拍告警次数"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="last_face_num"
                            label="上月人脸抓拍告警次数"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="dis_pro"
                            label="当月事件处理及时率(%)"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="last_dis_pro"
                            label="上月事件处理及时率(%)"
                            align="center">
                    </el-table-column>
                </el-table>
            </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Switch,Table,TableColumn,RadioGroup,
        RadioButton } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Dataset:()=>import('../Linhai_dataset'),
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [DatePicker.name]:DatePicker,
            [Switch.name]:Switch,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [RadioButton.name]:RadioButton,
            [RadioGroup.name]:RadioGroup,
        },
        data(){
            return{
                value1:true,
                value2:true,
                regions:'',
                dir:'',
                dir_2:'',
                formInline: {
                    indexCode: '',
                    dir_id: '',
                },
                data:[],
                data1:'',
                tableData:[],
                code:'当月',
                ids:'',
                inx:'',
                activeName:'first',
                year:[],
            }
        },
        mounted(){
            this.getAddress();
        },
        methods: {
            getSet(id){
                this.ids= id;
                this.inx= id;
                this.getDataset();
            },
            getAddress(){
                let params ={'uid':this.$store.state.user.uid,};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    this.dir = res.dir;
                    this.dir_2 = res.dir;
                    if(this.value1 === true){
                        this.formInline.indexCode = res.regions[0].indexCode;
                        this.formInline.dir_id = res.dir[0].id;
                        this.ids = res.regions[0].indexCode;
                        this.getData();
                    }
                })
            },
            getData(){
                if(this.value1 === true){
                    let params ={'indexCode':this.formInline.indexCode,'uid':this.$store.state.user.uid,};
                    this.$https.fetchPost('/plugin/statistics/api_index/dataContrast',params).then((res) => {
                        this.data = res.top_chart;

                        this.ids = res.top_chart[0][4];
                        this.inx = res.top_chart[0][5]
                        this.tableData = res.dir;

                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.Dataset.init();
                                that.getDataset();
                            },500)
                        })
                    })
                }else{
                    let params ={'uid':this.$store.state.user.uid,};
                    this.$https.fetchPost('/plugin/statistics/api_index/dataRegionsContrast',params).then((res) => {
                        this.data = res;
                        this.ids = res[0][4];
                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.Dataset.init();
                                that.getDataset();
                            },500)
                        })
                    })
                }
            },
            getDataset(){
                if(this.value1 === false) {
                    let paramss = {'indexCode': this.ids, 'uid': this.$store.state.user.uid,};
                    this.$https.fetchPost('/plugin/statistics/api_index/dataContrast', paramss).then((res) => {
                        this.tableData = res.dir;
                    })
                }
            },
            exports(){
                let params = {'indexCode': this.inx, 'uid': this.$store.state.user.uid,};
                this.$https.fetchPost('/plugin/statistics/excel/dataContrast', params).then((res) => {
                    window.location.href=res;
                })
            }
        },
    }
</script>
<style scoped lang="less">
    .demo-form-inline{
        padding: 0 10px;
        background: #fff;
    }
    .el-form-item{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .header{
        width: 100%;
        height: 40vh;
        background: #fff;
        border-top: 1px solid #f0f2f5;
        padding-top: 10px;
    }
    .header p{
        width: 200px;
        padding-bottom: 10px;
        font-size: 16px;
        text-align: center;
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
</style>
