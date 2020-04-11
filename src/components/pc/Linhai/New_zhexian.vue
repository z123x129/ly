<!--双单位折线图-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart" class="echarts"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props:['data'],
        data(){
            return{
                chart: null
            }
        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            this.chart = echarts.init(this.$refs.chart);

            // 浏览器自适应
            window.addEventListener('resize', ()=> {
                this.chart.resize();
            })
        },
        methods:{
            Mixed_resize(){
                this.chart.resize();
            },
            init(){
                // 指定图表的配置项和数据
                var option = {
                    legend: {
                        data: ['人脸抓拍告警次数','事件处理及时率']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer:{
                            type: 'cross',
                            label: {
                                show: true
                            }
                        }
                    },
                    xAxis: {
                        type:'category',//类目
                        boundaryGap:true,//x坐标两边留白策略
                        data: this.data[0],
                        axisTick:{//坐标刻度
                            show:true,
                            alignWithLabel:false,
                        },
                    },
                    yAxis: [{
                        boundaryGap:false,
                        axisLine:{
                            show:true,
                            lineStyle:{
                                opacity:0,
                                // color:'#ffc303'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} 次'
                        },
                        axisTick:{//坐标刻度
                            show:false,
                        },
                        splitLine:{show: false},
                        // splitArea : {show : true},
                        name:'人脸抓拍告警次数',
                    },{
                        boundaryGap:false,
                        axisLine:{
                            show:true,
                            lineStyle:{
                                opacity:0,
                                // color:'#02bf8a'
                            }
                        },
                        axisTick:{//坐标刻度
                            show:false,
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        },
                        splitLine:{show: false},
                        splitArea : {show : true},
                        min:0,//起始值
                        interval:10,//步长
                        max:100,//结束
                        name:'事件处理及时率',
                    },],


                    series: [
                        {
                        //下方折线
                        name:'人脸抓拍告警次数',
                        type: 'line',
                        data:this.data[1],
                        z:100,
                        lineStyle:{
                            color: '#ffc303',
                        },
                        markPoint: {
                            symbol:'roundRect',//标注样式
                            symbolKeepAspect:'true',//支持缩放
                            symbolSize:[40,30],//标注大小
                            symbolOffset:['0','-80%'],//标注偏移位置
                            z:-100,
                            data: [{
                                type: 'max',
                                name: '最大值'
                            }]
                        },
                    },
                        {//上方折线
                            name:'事件处理及时率',
                            type: 'line',
                            data:this.data[2],
                            z:100,//数值大的在上层
                            lineStyle:{
                                color:'#02bf8a',
                            },
                            yAxisIndex:1,
                            markPoint: {
                                symbol:'roundRect',//标注样式
                                symbolKeepAspect:'true',//支持缩放
                                symbolSize:[40,30],
                                symbolOffset:['0','-80%'],//标注偏移位置
                                z:-100,
                                data: [{
                                    type: 'max',
                                    name: '最大值'

                                }]
                            },
                        }]
                };
                this.chart.setOption(option);
            }
        }
    }
</script>
<style scoped lang="less">
    .echarts{
        width: 100%;
        height: 100%;
    }
</style>
