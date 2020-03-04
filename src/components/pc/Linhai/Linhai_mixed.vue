<!--柱形图and折线图(合并图)-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart" class="echarts"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        data(){
            return{
                chart: null
            }
        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            this.chart = echarts.init(this.$refs.chart);

            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        },
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff',  //更改坐标轴文字颜色
                            fontSize : 10      //更改坐标轴文字大小
                        }
                    },
                },
                legend: {
                    data: ['正常', '异常', '总数'],
                    top: "5%",
                    right: "5%",
                    textStyle: {
                        color: "#fff",
                        fontSize: 13,
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['古城街道', '大洋街道', '江南街道', '大田街道', '上盘镇', '尤溪镇', '尤溪镇', '尤溪镇', '尤溪镇'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff',  //更改坐标轴文字颜色
                                fontSize : 10      //更改坐标轴文字大小
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine:{
                            show: false,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 24,
                        interval: 4,
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
                        min: 10,
                        max: 40,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} %',
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
                        name: '正常',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: "#167FE1"
                            }
                        },
                        data: [2.0, 4.9, 7.0, 23.2, 20, 10,20,20,20]
                    },
                    {
                        name: '异常',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: "#2AA956"
                            }
                        },
                        data: [2.6, 5.9, 9.0, 24, 2, 21,20,20,20]
                    },
                    {
                        name: '总数',
                        type: 'line',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: "#178DFA"
                            }
                        },
                        data: [10, 20, 25, 26, 27, 28,20,20,20]
                    }
                ],
                dataZoom: [
                    {
                        show: false,
                        realtime: false,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        realtime: false,
                        start: 0,
                        end: 100,
                        textStyle:{
                            color:"#fff",
                        }
                    }
                ],
            };


            // 使用刚指定的配置项和数据显示图表。
            this.chart.setOption(option);

            // 浏览器自适应
            window.addEventListener('resize', ()=> {
                this.chart.resize();
            })
        }
    }
</script>
<style scoped lang="less">
    .echarts{
        width: 100%;
        height: 100%;
    }
</style>
