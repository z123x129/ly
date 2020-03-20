<template>
    <div style="position: relative">
        <el-switch
                style="display: block;position: absolute;right: 20px;top: 20px;"
                v-model="value1"
                @change="changeValue1"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="学校数据"
                inactive-text="区域数据">
        </el-switch>
        <div style="width: 100%">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item v-if="value1" label="选择学校:">
                    <el-select size="small" filterable clearable v-model="formInline.dir_id">
                        <el-option v-for="(item,index) in dir" :label="item.dirName" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!value1" label="选择区域:">
                    <el-select size="small" filterable clearable v-model="formInline.indexCode">
                        <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="header">
                <p>学校被拍陌生人数量排列柱状图</p>
                <Dataset @getDataset="getDataset" ref="Dataset" :data="data" style="width: 100%;height: 100%"></Dataset>
            </div>
        </div>

        <div style="height: 8vh;background: #fff;"></div>
        <div style="height: 40vh;display: flex;justify-content: space-around;background: #fff;">
            <Dataset @getDataset="getDataset" ref="Dataset1" :data="data" style="width: 33.3%;height: 100%"></Dataset>
            <Dataset @getDataset="getDataset" ref="Dataset2" :data="data" style="width: 33.3%;height: 100%"></Dataset>
            <Dataset @getDataset="getDataset" ref="Dataset3" :data="data" style="width: 33.3%;height: 100%"></Dataset>
        </div>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Switch } from 'element-ui'
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
        },
        data(){
            return{
                value1:true,
                regions:'',
                dir:'',
                formInline: {
                    dir_id: '',
                    indexCode: ''
                },

                data:[]
            }
        },
        mounted(){
            this.getData();
            this.getAddress();
        },
        methods: {
            getAddress(){
                let params ={};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    this.dir = res.dir;
                })
            },
            changeValue1(){

            },
            onSubmit() {
                console.log('submit!');
            },
            getDataset(){

            },
            getData(){
                let params ={'code':this.code,'num':this.num};
                this.$https.fetchPost('/plugin/statistics/api_index/schoolStrangerStat',params).then((res) => {
                    var arr = [];
                    this.data = [];
                    for (let i = 0; i < 5 ; i++) {
                        arr.push(res[i].school_name);
                        arr.push(3);
                        arr.push(5);
                        arr.push(10);
                        arr.push(res[i].indexCode);
                        this.data.push(arr);
                        arr = []
                    }
                    this.$nextTick(function () {
                        this.$refs.Dataset.init();
                        this.$refs.Dataset1.init();
                        this.$refs.Dataset2.init();
                        this.$refs.Dataset3.init();
                    })
                })
            },
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
