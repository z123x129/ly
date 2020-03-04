<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div>
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
                <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit">查找位置</el-button>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="地图显示:">
                    <el-radio-group v-model="radio" size="small">
                        <el-radio label="1" border>单兵位置</el-radio>
                        <el-radio label="2" border>车载位置</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,RadioGroup,Radio } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            // Doughnut:()=>import('./Linhai_doughnut'),
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [RadioGroup.name]:RadioGroup,
            [Radio.name]:Radio,
        },
        data(){
            return{
                formInline: {
                    user: '',
                    region: ''
                },
                radio: '1',
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
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
}
.el-radio{
    margin-right: 0;
}
.el-form-item{
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
