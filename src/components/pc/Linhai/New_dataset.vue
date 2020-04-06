<!--柱形图-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart"  class="echarts"></div>
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
            });
        },
        methods:{
            Dataset_resize(){
                this.chart.resize();
            },
            init(){
                // 指定图表的配置项和数据

                var option = {
                    // grid: {
                    //     left: '12%',
                    //     top: '5%',
                    //     bottom: '12%',
                    //     right: '8%'
                    // },
                    xAxis: {
                        data: ['驯鹿', '火箭', '飞机', '高铁', '轮船', '汽车', '跑步', '步行', ],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255, 129, 109, 0.1)',
                                width: 1 //这里是为了突出显示加上的
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        }
                    },
                    yAxis: [{
                        splitNumber: 2,
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255, 129, 109, 0.1)',
                                width: 1 //这里是为了突出显示加上的
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: 'rgba(255,255,255,.5)'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(255, 129, 109, 0.1)',
                                width: 0.5,
                                type: 'dashed'
                            }
                        }
                    }
                    ],
                    series: [{
                        name: 'hill',
                        type: 'pictorialBar',
                        barCategoryGap: '0%',
                        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                        label: {
                            show: true,
                            position: 'top',
                            distance: 15,
                            color: '#DB5E6A',
                            fontWeight: 'bolder',
                            fontSize: 20,
                        },
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(232, 94, 106, .8)' //  0%  处的颜色
                                    },
                                        {
                                            offset: 1,
                                            color: 'rgba(232, 94, 106, .1)' //  100%  处的颜色
                                        }
                                    ],
                                    global: false //  缺省为  false
                                }
                            },
                            emphasis: {
                                opacity: 1
                            }
                        },
                        data: [123, 60, 25, 18, 12, 9, 2, 1],
                        z: 10
                    }]
                };
                // option.dataset.source = option.dataset.source.concat(this.data);
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
