<template>
    <div style="position: relative">
        <el-switch
                style="display: block;position: absolute;right: 20px;top: 20px;z-index: 9"
                v-model="value1"
                @change="getYear"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="学校数据"
                inactive-text="区域数据">
        </el-switch>
        <div style="width: 100%;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="选择区域:">
                    <el-select style="z-index: 99" @change="getSchool" size="small" filterable v-model="formInline.indexCode">
                        <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="value1" label="选择学校:">
                    <el-select style="z-index: 99" @change="getYear" size="small" filterable v-model="formInline.dir_id">
                        <el-option v-for="(item,index) in dir" :label="item.dirName" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="height:60vh;" class="header">
                <p v-if="value1">各学校年数据对比</p>
                <p v-if="!value1">各区域年数据对比</p>
                <New_zhexian ref="New_zhexian" :data="year" style="width: 100%;height: 100%"></New_zhexian>
            </div>
        </div>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Switch,Table,TableColumn,RadioGroup,
        RadioButton } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            New_zhexian:()=>import('../New_zhexian'),
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
                activeName:'first',
                year:[],
            }
        },
        mounted(){
            this.getAddress();
        },
        methods: {
            getAddress(){
                let params ={'uid':this.$store.state.user.uid,};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    if(this.value1 === true){
                        this.formInline.indexCode = res.regions[0].indexCode;
                        this.ids = res.regions[0].indexCode;
                        this.getSchool();
                    }
                })
            },
            getSchool(){
                this.formInline.dir_id = '';
                if(this.formInline.indexCode){
                    let params ={'indexCode':this.formInline.indexCode,'uid':this.$store.state.user.uid};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchool',params).then((res) => {
                        this.dir = res;
                        this.formInline.dir_id = res[0].id;
                        this.getYear();
                    })
                }
            },
            getYear(){
                if(this.value1 === true){
                    let params ={'dir_id':this.formInline.dir_id,'uid':this.$store.state.user.uid,};
                    this.$https.fetchPost('/plugin/statistics/api_index/schoolLineChart',params).then((res) => {;
                        this.year = res;
                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.New_zhexian.init();
                                that.$refs.New_zhexian.Mixed_resize();
                            },500)
                        })
                    })

                }else{
                    let params ={'indexCode':this.formInline.indexCode,'uid':this.$store.state.user.uid,};
                    this.$https.fetchPost('/plugin/statistics/api_index/regionsLineChart',params).then((res) => {
                        this.year = res;
                        this.$nextTick(function () {
                            let that = this;
                            setTimeout(()=>{
                                that.$refs.New_zhexian.init();
                                that.$refs.New_zhexian.Mixed_resize();
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
        border-top: 1px solid #f0f2f5;
        padding-top: 10px;
    }
    .header p{
        padding-bottom: 10px;
        font-size: 16px;
        text-align: center;
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
    }
</style>
