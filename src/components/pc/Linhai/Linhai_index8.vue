<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择学校:">
                <el-select size="small" v-model="formInline.region" placeholder="请选择学校">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: 9px">
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
        <div class="header">
            <p>学校被拍陌生人数量排列柱状图</p>
            <Dataset style="width: 100%;height: 100%"></Dataset>
        </div>
        <div style="height: 8vh;background: #fff;"></div>
        <div style="height: 40vh;display: flex;justify-content: space-around;background: #fff;">
            <Dataset style="width: 33.3%;height: 100%"></Dataset>
            <Dataset style="width: 33.3%;height: 100%"></Dataset>
            <Dataset style="width: 33.3%;height: 100%"></Dataset>
        </div>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Dataset:()=>import('./Linhai_dataset'),
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [DatePicker.name]:DatePicker,
        },
        data(){
            return{
                formInline: {
                    region: ''
                },
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
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
