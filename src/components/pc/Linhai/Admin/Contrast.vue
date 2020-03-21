<template>
    <div style="position: relative">
        <el-switch
                style="display: block;position: absolute;right: 20px;top: 20px;"
                v-model="value1"
                @change="getData"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="学校数据"
                inactive-text="区域数据">
        </el-switch>
        <div style="width: 100%">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item v-if="value1" label="选择区域:">
                    <el-select @change="getData" size="small" filterable clearable v-model="formInline.indexCode">
                        <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="!value1" style="height: 63px"></div>
            </el-form>
            <div class="header">
                <p v-if="value1">各个学校当月数据对比</p>
                <p v-if="!value1">各个区域当月数据对比</p>
                <Dataset @getDataset="getDataset" ref="Dataset" :type="2" :data="data" style="width: 100%;height: 100%"></Dataset>
            </div>
        </div>
        <el-switch
                style="float: right;margin-right: 20px;margin-top: 30px"
                v-model="value2"
                @change="getData"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="图表"
                inactive-text="列表">
        </el-switch>
        <div style="height: 20px;background: #fff;clear: both"></div>
        <div v-if="value2" style="height: 40vh;display: flex;justify-content: space-around;background: #fff;">
                <Dataset ref="Dataset1" :type="3" :data="data1" style="width: 30%;height: 100%"></Dataset>
                <Dataset ref="Dataset2" :type="4" :data="data2" style="width: 30%;height: 100%"></Dataset>
                <Dataset ref="Dataset3" :type="5" :data="data3" style="width: 30%;height: 100%"></Dataset>
        </div>
        <div v-if="!value2" style="background: #fff;">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="school_name"
                        label="学校"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="nor_ratio"
                        label="当月健康证未过期比例"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="last_ratio"
                        label="上月健康证未过期比例"
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
                        label="当月事件处理及时率"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="last_dis_pro"
                        label="上月事件处理及时率"
                        align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Switch,Table,TableColumn } from 'element-ui'
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
        },
        data(){
            return{
                value1:true,
                value2:true,
                regions:'',
                formInline: {
                    indexCode: ''
                },
                data:[],
                data1:[],
                data2:[],
                data3:[],
                tableData:[]
            }
        },
        mounted(){
            this.getAddress();
        },
        methods: {
            getAddress(){
                let params ={};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    if(this.value1 === true){
                        this.formInline.indexCode = res.regions[0].indexCode;
                        this.getData();
                    }
                })
            },
            changeValue1(){

            },
            onSubmit() {
                console.log('submit!');
            },
            getData(){
                if(this.value1 === true){
                    let params ={'indexCode':this.formInline.indexCode};
                    this.$https.fetchPost('/plugin/statistics/api_index/dataContrast',params).then((res) => {
                        console.log(res)
                        this.data = res.top_chart;
                        this.tableData = res.dir;
                        this.$nextTick(function () {
                            this.$refs.Dataset.init();
                            this.getDataset(res.top_chart[0][4])
                        })

                    })
                }else{
                    let params ={};
                    this.$https.fetchPost('/plugin/statistics/api_index/dataRegionsContrast',params).then((res) => {
                        this.data = res;
                        this.$nextTick(function () {
                            this.$refs.Dataset.init();
                            this.getDataset(res[0][4])
                        })
                    })
                }
            },
            getDataset(id){
                if(this.value1 === true){
                    let params ={'dir_id':id};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchoolHealth',params).then((res) => {
                        this.data1[0] = res[0];
                        this.data2[0] = res[1];
                        this.data3[0] = res[2];
                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.Dataset1.init();
                                that.$refs.Dataset2.init();
                                that.$refs.Dataset3.init();
                            },500)
                        })
                    })
                }else{
                    let params ={'indexCode':id};
                    this.$https.fetchPost('/plugin/statistics/api_index/getRegionsHealth',params).then((res) => {
                        this.data1[0] = res[0];
                        this.data2[0] = res[1];
                        this.data3[0] = res[2];
                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.Dataset1.init();
                                that.$refs.Dataset2.init();
                                that.$refs.Dataset3.init();
                            },500)
                        })
                    })
                }
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
    }
    .header p{
        padding-bottom: 10px;
        font-size: 16px;
        text-align: center;
    }
</style>
