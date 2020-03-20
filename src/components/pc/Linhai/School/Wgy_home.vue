<template>
    <div>
        <chartcard style="background: #fff;padding: 20px 0" :list="list" ref="child"></chartcard>
        <div class="cont">
            <Doughnut ref="Doughnut" :data="config1" style="width: 40%;height: 100%"></Doughnut>
            <Basic :data="config1" style="width: 60%;height: 100%"></Basic>
        </div>
    </div>
</template>
<script>
    export default {
        name:'Wgy_home',
        components:{
            chartcard:()=>import('../Linhai_chartcard'),
            Doughnut:()=>import('../Linhai_doughnut'),
            Basic:()=>import('../Linhai_basic'),
        },
        data(){
            return{
                list:[],
                config1:[]
            }
        },
        updated() {
            this.$refs.child.init();
        },
        mounted(){
            let params ={'uid':this.$store.state.user.uid};
            params = this.$secret_key.func(this.$store.state.on_off, params);
            this.$https.fetchPost('/plugin/school/api_index/wgy_index',params).then((res) => {
                var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                this.config1 = res_data.chart_Count;
                this.list = res_data.allCount;
                this.$nextTick(function () {
                    this.$refs.Doughnut.init();
                })
            })
        }
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
