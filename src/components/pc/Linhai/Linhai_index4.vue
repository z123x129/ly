<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div>
                <p>摄像点选择:</p>
                <el-form-item style="margin-top: 2px">
                    <el-select size="mini" v-model="formInline.region" placeholder="请选择学校">
                        <el-option label="选择区域" value="shanghai"></el-option>
                        <el-option label="选择学校" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="onSubmit">搜索</el-button>
                </el-form-item>
            </div>
            <div>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </el-form>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,Tree } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            // Doughnut:()=>import('./Linhai_doughnut'),
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [Tree.name]:Tree,
        },
        data(){
            return{
                formInline: {
                    region: ''
                },
                radio: '1',
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleNodeClick(data) {
                console.log(data);
            }
        },
    }
</script>
<style scoped lang="less">
    .demo-form-inline{
        display: inline-block;
        padding: 10px;
        height: 100vh;
        background: #fff;
    }
</style>
