<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择区域:">
                <el-select size="small" v-model="formInline.user" placeholder="请选择学校">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择学校:">
                <el-select size="small" v-model="formInline.region" placeholder="请选择学校">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
                <el-date-picker
                        size="small"
                        v-model="value1"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: 9px">
                <el-button size="small" type="primary" @click="onSubmit">搜索</el-button>
                <el-button size="small" type="primary" @click="onSubmit">批量下载</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            // Doughnut:()=>import('./Linhai_doughnut'),
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
                    user: '',
                    region: ''
                },
                value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
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
</style>
