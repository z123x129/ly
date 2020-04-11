<template>
    <div style="padding: 15px 0 15px 15px;">
        <chartcard style="background: #fff;padding: 20px" :list="list" ref="child"></chartcard>
        <div class="cont">
            <Doughnut ref="Doughnut" :data="config1" style="width: 40%;height: 100%"></Doughnut>
            <Basic :data="config1" style="width: 60%;height: 100%"></Basic>
        </div>
    </div>
</template>
<script>
    export default {
        name:'home',
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
                        let that = this;
                        setTimeout(() => {
                            that.init_child("Doughnut");
                        }, 500);
                })
            })
        },
        methods:{
            init_child(name){
                let that = this;
                if(this.$refs.hasOwnProperty(name))
                {
                    this.$refs[name].init();
                }
                else
                {
                    setTimeout(function(){that.init_child(name)},500)
                }
            },
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
}
</style>
