<template>
    <div class="box">
        <div class="logo">
            <h1 class="border1">市场监督局指挥实时数据大屏</h1>
        </div>
        <div class="content">
            <div class="cont_flex">
                <div class="cont1">
                    <dv-border-box-12 style="padding: 30px;height: 42%" class="box1" ref="box1">
                        <h2>数据概览</h2>
                        <ul style="font-size: 12px">
                            <li v-for="(item,index) in list.general" :key="index">{{item.title}} {{item.value}}</li>
                        </ul>
                    </dv-border-box-12>
                    <dv-border-box-12 style="height: 58%;padding: 15px 10px 20px 5px" class="box1" ref="box2">
                        <h2 style="text-indent: 15px">健康证情况</h2>
                        <Mixed :data="list.area_health" ref="Mixed" style="width: 100%;height: 100%"></Mixed>
                    </dv-border-box-12>
                </div>
                <div style="position: relative" class="cont2">
                    <div @click="back" v-if="showBack">
                        <dv-decoration-9 ref="button_1" style="z-index:999;cursor: pointer;width:50px;height:50px;position: absolute;top: 20px;left: 20px;color: #7ec699;text-shadow: 0 0 3px #7acaec;">返回</dv-decoration-9>
                    </div>
                    <Map style="width: 100%;height: 100%" :address_info="address_info" ref="map" @showButton="showButton"  @getAreaInfo="getAreaInfo"></Map>
                    <ul>
                        <li>学校个数: <span>{{list.school}}</span></li>
                        <li>没有异常的学校: <span>{{list.yes_school}}</span></li>
                        <li>有异常的学校: <span>{{list.no_school}}</span></li>
                    </ul>
                </div>
                <div class="cont1">
                    <dv-border-box-12 class="box1" ref="box3">
                        <h2>健康证图表</h2>
                        <div style="display: flex;justify-content: space-around">
                            <ol>
                                <li>{{list.area_chart.all}}</li>
                                <li>健康证总数</li>
                            </ol>
                            <ol>
                                <li>{{list.area_chart.normal}}</li>
                                <li>正常常健康证数</li>
                            </ol>
                            <ol>
                                <li>{{list.area_chart.anomaly}}</li>
                                <li>异常健康证数</li>
                            </ol>
                        </div>
                        <Editor :normal="normal" :anomaly="anomaly" ref="Editor" style="width: 100%;height: 50%"></Editor>
                    </dv-border-box-12>
                    <dv-border-box-12 class="box1" ref="box4">
                        <h2>学校异常情况</h2>
                        <dv-scroll-board ref="srroll_1" @click="getWeigui" :config="config2" style="width:94%;height:82%;margin: 3%" />

                    </dv-border-box-12>
                </div>
            </div>
            <div class="cont_flex2">
                <div class="cont3">
                    <dv-border-box-12 class="box2" ref="box5">
                        <div style="display: flex;justify-content:flex-start">
                            <h2>当月重点人员陌生人员情况</h2>
                            <span style="margin-left: 20px;color: #7ec699;text-shadow: 0 0 3px #7acaec;">{{city_name}}</span>
                        </div>
                        <Dataset :data="regions_chart" :type="1" ref="Dataset" style="width: 100%;height: 100%"></Dataset>
                    </dv-border-box-12>
                </div>
                <div class="cont1">
                    <dv-border-box-12 class="box2" ref="box6">
                        <h2>实时警报数据</h2>
                        <dv-scroll-board @click="gotoStock" ref="srroll_2" :config="config" style="width:94%;height:82%;margin: 3%" />
                    </dv-border-box-12>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Select,Option} from 'element-ui'
    import bus from '../../../main.js'
    export default {
        name:'home',
        components:{
            Mixed:()=>import('./Linhai_mixed'),
            Editor:()=>import('./Linhai_editor'),
            Map:()=>import('./component/Map'),
            Dataset:()=>import('./Linhai_dataset'),
            [Select.name]:Select,
            [Option.name]:Option,
        },
        data(){
                return{
                    list:{
                        general:{},
                        area_chart:{
                            all:'',
                            normal:'',
                            anomaly:'',
                        },
                        area_health:[],
                    },
                    city_name:"杜桥镇",
                    regions_chart:[],
                    indexCode:'',
                    options:'',
                    normal:[''],
                    anomaly:[''],
                    showBack:false,
                address_info:[],
                config:{},
                config2:{},
                data:[],
                data2:[],
            }
        },
        methods:{
            getAddress(){
                let that = this;
                this.$https.fetchGet("/plugin/statistics/api_index/getAbbrArea", []).then(function(data){
                   that.address_info = data;
                   that.$nextTick(()=>{
                       setTimeout(()=> {
                           // that.$refs.map.init("LinHai");
                           that.init_child("map");
                       },800);

                   })
                })
            },
            back(){
                this.$refs.map.init("LinHai");
                this.showBack = false;
            },
            getAdd(){
                let params ={'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.getMen();
                    this.$nextTick(function () {
                        let that = this;
                        setTimeout(()=>{
                            that.options = res.regions;
                            that.indexCode = res.regions[0].indexCode;
                        },500)

                    })
                })
            },
            getList(){
                let params ={'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/indexStat',params).then((res) => {
                    this.list = res;
                    this.normal[0] = Math.round(res.area_chart.normal/res.area_chart.all*100);
                    this.anomaly[0] = Math.round(res.area_chart.anomaly/res.area_chart.all*100);

                    this.$nextTick(function () {
                        let that = this;
                        setTimeout(()=>{
                            that.init_child("Editor");
                            that.init_child("Mixed");
                            that.init_child("Dataset");
                        }, 500)
                    })
                })
            },
            getMen(indexCode){
                let params ={'indexCode':indexCode,'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/indexStatSchool',params).then((res) => {
                    this.regions_chart = res;
                    this.$nextTick(function () {
                        let that = this;
                        setTimeout(()=>{
                            that.init_child("Dataset");
                        },500)

                    })
                })
            },
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
            showButton(data){
                this.showBack = data;
            },
            getSchool(){
                let params ={'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/schoolViolation',params).then((res) => {
                    var arr = [];
                    for (let i = 0; i < res.length ; i++) {
                        arr.push(res[i].name);
                        arr.push(res[i].violation);
                        arr.push(String(res[i].num));
                        arr.push(String(res[i].code));
                        this.data2.push(arr);
                        arr = []
                    }
                    this.getConfig2();
                })
            },
            getConfig2(){
                this.config2 = {
                    header: ['学校','违规选项','违规次数','严重级别'],
                    data: this.data2,
                    index: true,
                    columnWidth: [40,120,100,90,90],
                    align: ['center','center','center','center','center'],
                };
            },
            getAreaInfo(city, indexCode, city_name){
                let that = this;
                let params = {indexCode:indexCode,'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/getMapSchool',params).then((res) => {
                    that.$refs.map.changeCityMap(city, res);
                });
                this.city_name = city_name;
                this.getMen(indexCode);
            },
            getWeigui(row){
                this.$router.push('/Intelligence/School_show')
            },
            getTime(){
                let params = {'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/indexAlarm',params).then((res) => {
                    var arr = [];
                    for (let i = 0; i < res.length ; i++) {
                        arr.push(res[i].dirName);
                        arr.push(res[i].type);
                        arr.push(res[i].faceTime);
                        this.data.push(arr);
                        arr = []
                    }
                    this.getConfig();
                });
            },
                getConfig(){
                this.config = {
                    header: ['学校','类型','时间'],
                    data: this.data,
                    index: true,
                    columnWidth: [40,120,100],
                    align: ['center','center','center','center']
                };
            },
            gotoStock(row){
                console.log(row);
                if(row.row[2]=='发现陌生人'){
                    this.$router.push('/Intelligence/Strange_people')
                }else{
                    this.$router.push('/Intelligence/Key_personnel')
                }
            }
        },
        mounted() {
            this.getAddress();
            this.getList();
            this.getAdd();
            this.getSchool();
            this.getTime();
            var that = this;
            bus.$on("outmes", function(mes) {
                let arr = [];
                arr.push(mes.content.dirName);
                arr.push(mes.describe);
                arr.push(mes.content.faceTime);
                that.data.unshift(arr);
                that.getConfig();
            });
            bus.$on("school", function(mes) {
                let arr = [];
                arr.push(mes.content.name);
                arr.push(mes.content.violation);
                arr.push(mes.content.num);
                arr.push(mes.content.code);
                that.data2.unshift(arr);
                that.getConfig2();
            });
        },
        activated() {
            if(this.$refs.hasOwnProperty("map"))
            {
                this.$refs.srroll_1.initWH();
                this.$refs.srroll_2.initWH();
                this.$refs.map.map_resize();
                this.$refs.Editor.Editor_resize();
                this.$refs.Dataset.Dataset_resize();
                this.$refs.Mixed.Mixed_resize();
                for(let i = 1; i<=6; i++)
                {
                    this.$refs["box"+i].initWH();
                }
            }
        }
    }
</script>
<style scoped lang="less">
    .box{
        width: 100%;
        height: 100vh;
        background: url("./images/u10.png") no-repeat;
        background-size: 100% 100%;
    }
    .logo{
        display: flex;
        justify-content: space-around;
        width: 85%;
        margin: 0 auto;
        padding-top: 10px;
        color: #fff;
    }
    .border1{
        width: 100%;
        height: 12vh;
        line-height: 8vh;
        background: url("./images/u11.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 25px;
    }
    .content{
        width: 100%;
        height: 88vh;
        padding: 0 20px 20px;
    }
    .cont_flex{
        width: 100%;
        height: 66.6%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    .cont_flex2{
        width: 100%;
        height: 33.3%;
        display: flex;
        justify-content: space-between;
        padding-top: 5px;
    }
    .cont1{
        width: 25%;
        height: 100%;
    }
    .cont1 ul{
        color: #fff;
    }
    .cont1 ul li{
        text-indent: 10px;
        width: 50%;
        display: inline-block;
        line-height: 25px;
    }
    .cont1 ol{
        margin-top: 10%;
        color: #fff;
    }
    .cont1 ol:nth-child(1) li:first-child{
        color: rgb(0,255,255);
    }
    .cont1 ol:nth-child(2) li:first-child{
        color: rgb(149,242,4);
    }
    .cont1 ol:nth-child(3) li:first-child{
        color: rgb(217,0,27);
    }
    .cont1 ol li{
        text-align: center;
        font-size: 28px;
    }
    .cont1 ol li:last-child{
        font-size: 12px;
    }
    .cont2{
        width: 50%;
        height: 100%;
        margin: 0 5px;
        position: relative;
    }
    .cont2 ul{
        position: absolute;
        right: 5%;
        bottom: 2%;
        color: #1989fa;
    }
    .cont2 ul li{
        line-height: 28px;
    }
    .cont2 ul span{
        color: #fff;
    }
    .cont3{
        width: 75%;
        height: 100%;
        padding-right: 5px;
    }
    .box1{
        padding: 15px;
        width: 100%;
        height: 50%;
        margin-bottom: 5px;
    }
    .box2{
        padding: 15px;
        width: 100%;
        height: 100%;
    }
    h2{
        font-size: 14px;
        color: #5986DF;
    }
    tr,th{
        text-align: center;
    }
    .cont_long{
        padding: 2% 0;
        width: 103%;
        height: 100%;
        display: -webkit-box;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    /* 隐藏下方的滚动条 */
    .cont_long::-webkit-scrollbar {
        background-color: transparent;
    }
    .cont_long {
        -ms-overflow-style: none;
    }
    .cont_long {
        overflow: -moz-scrollbars-none;
    }
    .dv-scroll-board /deep/ .header{
        font-size: 14px;
    }
    .dv-scroll-board /deep/ .rows .row-item{
        font-size: 12px;
    }
</style>
