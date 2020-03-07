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
        justify-content: space-around;
    }
    .div-flex > .flex{
        overflow: hidden;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        width: calc(100% / 6 - 0.833333rem);
        margin-right: 1rem;
        border-radius: 6px;
        box-shadow: 0 2px 2px rgba(204,197,185,.5);
        background-color: #fff;
        color: #252422;
    }
    .div-flex > .flex:nth-child(6n){margin-right: 0}
    .div-flex > .flex .iconfont{
        font-size: 30px;
        width: 80px;
        line-height: 80px;
        text-align: center;
        color: #fff;
    }
    .div-flex > .flex:nth-child(1) .iconfont{background-color: #f3bb45}
    .div-flex > .flex:nth-child(2) .iconfont{background-color: #7ac29a}
    .div-flex > .flex:nth-child(3) .iconfont{background-color: #eb5e28}
    .div-flex > .flex:nth-child(4) .iconfont{background-color: #68b3c8}
    .div-flex > .flex:nth-child(5) .iconfont{background-color: #eb6828}
    .div-flex > .flex:nth-child(6) .iconfont{background-color: #69b3c8}
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
