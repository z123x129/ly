<template>
    <div>
        <chartcard :list="list" ref="child"></chartcard>
    </div>
</template>
<script>
    export default {
        components:{
            chartcard:()=>import('./Linhai_chartcard'),
        },
        data(){
            return{
                list:[
                    {'num':102,'id':0,title:'健康证未到期数'},
                    {'num':4,'id':1,title:'7日内到期数'},
                    {'num':9,'id':2,title:'健康证过期数'},
                ],
            }
        },
        updated() {
            this.$refs.child.init();
        },
    }
</script>
<style scoped lang="less">

</style>
