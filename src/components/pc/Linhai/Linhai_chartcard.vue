<template>
    <div>
        <div class="div-flex">
            <div v-for="(item,index) in list" :key="index" class="flex">
                <div class="iconfont"><i class="el-icon-share"></i></div>
                <div class="text">
                    <p>{{item.title}}</p>
                    <h3><span :id="'ddc'+index">{{item.num}}</span></h3>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {CountUp} from './js/countUP'
    export default {
        props:['list'],
        data(){
            return{}
        },
        mounted() {
        },
        methods:{
            init:function () {
                for (var i = 0; i < this.list.length ; i++) {
                    var demo = new CountUp("ddc"+i, 0, this.list[i].num, 0, 2.5);
                    demo.start();
                }
            }
        }
    }
</script>
<style scoped lang="less">
    *{box-sizing: border-box;}
    .div-flex{
        display: flex;
        display: -webkit-flex;
        align-items: center;
        // justify-content: space-around;
    }
    .div-flex > .flex{
        overflow: hidden;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        width: calc(100% / 4 - 1.6rem);
        margin-right: 1.2rem;
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0,0,0,0.1);
        background-color: #fff;
        color: #252422;
        padding: 20px;;
    }
    .div-flex > .flex:nth-child(4n){margin-right: 0}
    .div-flex > .flex .iconfont{
        font-size: 25px;
        width: 50px;
        line-height: 50px;
        border-radius: 50%;
        text-align: center;
        color: #fff;
    }
    .div-flex > .flex:nth-child(1) .iconfont{background-color: #f3bb4580}
    .div-flex > .flex:nth-child(2) .iconfont{background-color: #7ac29a80}
    .div-flex > .flex:nth-child(3) .iconfont{background-color: #eb5e2880}
    .div-flex > .flex:nth-child(4) .iconfont{background-color: #68b3c880}
    .div-flex > .flex:nth-child(5) .iconfont{background-color: #eb682880}
    .div-flex > .flex:nth-child(6) .iconfont{background-color: #69b3c880}
    .div-flex > .flex .text{
        text-align: right;
        flex: 1;
        padding-left: 5px;
        padding-right: 12px;
    }
    .div-flex > .flex .text p{
        font-size: 13px;
        margin: 0;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .div-flex > .flex .text h3{
        font-size: 14px;
        margin: 0;
    }
    .div-flex > .flex .text h3 span{
        font-size: 25px;
    }

    @media (max-width: 1200px) {
        .div-flex{
            flex-wrap:wrap ;
        }
        .div-flex > .flex{
            width: calc(100% / 3 - 1.5rem);
            margin-bottom: 1rem;
        }
        .div-flex > .flex:nth-child(3n){margin-right: 0}
    }
</style>
