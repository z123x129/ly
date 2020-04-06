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
                // import echarts from 'echarts'
                var charts = { // 按顺序排列从大到小
                    cityList: this.data[0],
                    cityData: this.data[1]
                }
                var top10CityList = charts.cityList
                var top10CityData = charts.cityData
                var color = ['rgba(248,195,248', 'rgba(100,255,249', 'rgba(135,183,255', 'rgba(248,195,248', 'rgba(100,255,249']

                let lineY = []
                for (var i = 0; i < charts.cityList.length; i++) {
                    var x = i
                    if (x > color.length - 1) {
                        x = color.length - 1
                    }
                    var data = {
                        name: charts.cityList[i],
                        color: color[x] + ')',
                        value: top10CityData[i],
                        itemStyle: {
                            normal: {
                                show: true,
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: color[x] + ', 0.3)'
                                }, {
                                    offset: 1,
                                    color: color[x] + ', 1)'
                                }], false),
                                barBorderRadius: 10
                            },
                            emphasis: {
                                shadowBlur: 15,
                                shadowColor: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    }
                    lineY.push(data)
                }

                var option= {
                    title: {
                        show: false
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (val) {
                            return `异常健康证占比：${val.data.value}%`
                        }
                    },
                    grid: {
                        borderWidth: 0,
                        top: '10%',
                        left: '5%',
                        right: '15%',
                        bottom: '3%'
                    },
                    color: color,
                    yAxis: [{
                        type: 'category',
                        inverse: true,
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            inside: false
                        },
                        data: top10CityList
                    }, {
                        type: 'category',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            inside: false,
                            textStyle: {
                                color: '#b3ccf8',
                                fontSize: '13',
                                fontFamily: 'PingFangSC-Regular'
                            },
                            formatter: function (val) {
                                return `${val}%`
                            }
                        },
                        splitArea: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        data: top10CityData.reverse()
                    }],
                    xAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        }
                    },
                    series: [{
                        name: '',
                        type: 'bar',
                        zlevel: 2,
                        barWidth: '10px',
                        data: lineY,
                        animationDuration: 1500,
                        label: {
                            normal: {
                                color: '#b3ccf8',
                                show: true,
                                position: [0, '-24px'],
                                textStyle: {
                                    fontSize: 13
                                },
                                formatter: function (a, b) {
                                    return a.name
                                }
                            }
                        }
                    }],
                    animationEasing: 'cubicOut'
                }


                // var option = {
                //     tooltip: {
                //         trigger: 'axis',
                //         backgroundColor:'rgba(255,255,255,0.1)',
                //         axisPointer: {
                //             type: 'shadow',
                //             label: {
                //                 show: true,
                //                 backgroundColor: '#7B7DDC'
                //             }
                //         }
                //     },
                //     legend: {
                //         data:this.data[0],
                //         textStyle: {
                //             color: '#B4B4B4'
                //         },
                //         top:'7%',
                //     },
                //     grid:{
                //         x:'12%',
                //         width:'82%',
                //         y:'12%',
                //     },
                //     xAxis: {
                //         data: this.data[0],
                //         // axisLine: {
                //         //     lineStyle: {
                //         //         color: '#B4B4B4'
                //         //     }
                //         // },
                //         axisTick:{
                //             show:false,
                //         },
                //         axisLabel: {
                //             show: true,
                //             textStyle: {
                //                 color: '#b4b4b4',  //更改坐标轴文字颜色
                //                 fontSize : 10      //更改坐标轴文字大小
                //             }
                //         },
                //         axisLine:{
                //             lineStyle:{
                //                 color:'#b4b4b4' //更改坐标轴颜色
                //             }
                //         },
                //     },
                //     yAxis: [{
                //
                //         splitLine: {show: false},
                //         axisLine: {
                //             lineStyle: {
                //                 color: '#b4b4b4',
                //             }
                //         },
                //
                //         axisLabel:{
                //             formatter:'{value} ',
                //         }
                //     },
                //         {
                //
                //             splitLine: {show: false},
                //             axisLine: {
                //                 lineStyle: {
                //                     color: '#b4b4b4',
                //                 }
                //             },
                //             axisLabel:{
                //                 formatter:'{value} ',
                //             }
                //         }],
                //
                //     series: [
                //         {
                //             name: '正常',
                //             type: 'bar',
                //             barWidth: 10,
                //             itemStyle: {
                //                 normal: {
                //                     barBorderRadius: 5,
                //                     color: new echarts.graphic.LinearGradient(
                //                         0, 0, 0, 1,
                //                         [
                //                             {offset: 0, color: '#956FD4'},
                //                             {offset: 1, color: '#3EACE5'}
                //                         ]
                //                     )
                //                 }
                //             },
                //             data: this.data[1]
                //         },
                //
                //         {
                //             name: '总数',
                //             type: 'bar',
                //             barGap: '-100%',
                //             barWidth: 10,
                //             itemStyle: {
                //                 normal: {
                //                     barBorderRadius: 5,
                //                     color: new echarts.graphic.LinearGradient(
                //                         0, 0, 0, 1,
                //                         [
                //                             {offset: 0, color: 'rgba(156,107,211,0.5)'},
                //                             {offset: 0.2, color: 'rgba(156,107,211,0.3)'},
                //                             {offset: 1, color: 'rgba(156,107,211,0)'}
                //                         ]
                //                     )
                //                 }
                //             },
                //             z: -12,
                //
                //             data: ddd
                //         },
                //     ]
                // };
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
