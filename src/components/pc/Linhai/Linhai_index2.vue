<template>
    <dv-full-screen-container>
        <div style="display: flex;align-items: center;padding: 0 20px;justify-content: space-between" class="box">
            <el-select size="small" v-model="region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-row>
                <el-button size="small" type="primary">运维概况</el-button>
                <el-button size="small" type="primary" plain>一键运维</el-button>
            </el-row>
        </div>
        <div class="box" style="display: flex;justify-content: flex-start">
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
        </div>
        <div class="box">
            <Dataset style="width: 100%;height: 100%"></Dataset>
        </div>
        <div class="box" style="display: flex;justify-content: flex-start">
            <Stacked style="width: 50%;height: 100%"></Stacked>
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
            <Doughnut :data="config1" style="width: 25%;height: 100%"></Doughnut>
        </div>
    </dv-full-screen-container>
</template>
<script>
    import { Select,Option,Row,Button } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Doughnut:()=>import('./Linhai_doughnut'),
            Dataset:()=>import('./Linhai_dataset'),
            Stacked:()=>import('./Linhai_stacked'),
            [Select.name]:Select,
            [Option.name]:Option,
            [Row.name]:Row,
            [Button.name]:Button,
        },
        data(){
            return{
                region:'',
                config1:[
                    {value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'},
                    {value: 234, name: '联盟广告'},
                    {value: 135, name: '视频广告'},
                    {value: 1548, name: '搜索引擎'}
                ]
            }
        }
    }
</script>
<style scoped lang="less">
    .box{
        width: 100%;
        height: 30.3vh;
        background: #fff;
        margin-bottom: 3vh;
    }
    .box:nth-child(1){
        height: 8vh;
    }
    .box:nth-child(2){
        height: 22.3vh;
    }
    .box:last-child{
        margin-bottom: 0;
    }
</style>
