<template>
    <div id="i1">
        <Hik ref="H1" :openOWebName="ddd"></Hik>
        <div style="float: right">
            <Button @click="init_1">初始化框</Button>
            <Button @click="initVideo">连接</Button>
            <Button @click="connent">打开页面</Button>
            <Button @click="show">显示</Button>
            <Button @click="hide">隐藏</Button>
            <input v-model="height"/>
            <input v-model="width"/>
            <Button @click="resizeWindow">修改大小</Button>
        </div>
    </div>
</template>

<script>
    import Hik from "./component/Hik";
    export default {
        name: "showVideo",
        components:{
            Hik
        },
        data(){
          return{
              height:100,
              width:200,
              ddd:'oWebControl'
          }
        },
        methods:{
            init_1(){
                this.$refs.H1.init();
            },
            initVideo(){
                this.$refs.H1.initVideo();
            },
            connent(){
                this.$refs.H1.videoPlay();
            },
            show(){
                this.$refs.H1.showVideo();
            },
            hide(){
                this.$refs.H1.hideVideo();
            },
            resizeWindow(){
                this.$refs.H1.resizeWindow(this.height,this.width);
            }
        }
    }
</script>

<style scoped>

</style>
