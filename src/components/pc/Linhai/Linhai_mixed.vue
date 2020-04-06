<!--堆叠柱状图-->
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
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['正常', '异常'],
                        top: "5%",
                        right: "5%",
                        textStyle: {
                            color: "#fff",
                            fontSize: 13,
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff',  //更改坐标轴文字颜色
                                    fontSize : 10      //更改坐标轴文字大小
                                }
                            },
                            // axisLine:{
                            //     lineStyle:{
                            //         color:'#fff' //更改坐标轴颜色
                            //     }
                            // },
                            data: this.data[0]
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}',
                                show: true,
                                textStyle: {
                                    show:false,
                                    color: '#fff',  //更改坐标轴文字颜色
                                    fontSize : 10      //更改坐标轴文字大小
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            // axisLine:{
                            //     lineStyle:{
                            //         color:'#fff' //更改坐标轴颜色
                            //     }
                            // }
                        },
                        {
                            type: 'value',
                            // min: 10,
                            // max: 40,
                            // interval: 5,
                            axisLabel: {
                                formatter: '{value}',
                                show: true,
                                textStyle: {
                                    color: '#fff',  //更改坐标轴文字颜色
                                    fontSize : 10      //更改坐标轴文字大小
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            // axisLine:{
                            //     lineStyle:{
                            //         color:'#fff' //更改坐标轴颜色
                            //     }
                            // }
                        }
                    ],
                    series: [
                        {
                            name: '异常',
                            type: 'bar',
                            stack: '广告',
                            itemStyle: {
                                normal: {
                                    color: { type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#f87b83' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#150ca3' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }

                                }
                            },
                            data: this.data[2]
                        },
                        {
                            name: '正常',
                            type: 'bar',
                            stack: '广告',
                            itemStyle: {
                                normal: {
                                    color: { type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#44f8d5' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#2182f5' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                         }
                                }
                            },
                            data: this.data[1]
                        },

                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
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
