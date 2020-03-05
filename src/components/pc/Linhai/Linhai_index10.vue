<template>
    <div>
        <chartcard style="background: #fff;padding: 20px 0" :list="list" ref="child"></chartcard>
        <div class="cont">
            <Doughnut :data="config1" style="width: 40%;height: 100%"></Doughnut>
            <Basic :data="config1" style="width: 60%;height: 100%"></Basic>
        </div>
    </div>
</template>
<script>
    export default {
        components:{
            chartcard:()=>import('./Linhai_chartcard'),
            Doughnut:()=>import('./Linhai_doughnut'),
            Basic:()=>import('./Linhai_basic'),
        },
        data(){
            return{
                list:[
                    {'num':102,'id':0,title:'健康证未到期数'},
                    {'num':4,'id':1,title:'7日内到期数'},
                    {'num':9,'id':2,title:'健康证过期数'},
                ],
                config1:[
                    {value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'},
                    {value: 234, name: '联盟广告'},
                    {value: 135, name: '视频广告'},
                    {value: 1548, name: '搜索引擎'}
                ]
            }
        },
        updated() {
            this.$refs.child.init();
        },
    }
</script>
<style scoped lang="less">
.cont{
    width: 100%;
    height: 50vh;
    display: flex;
    justify-content: space-around;
    background: #fff;
    margin: 15px 0;
}
</style>
