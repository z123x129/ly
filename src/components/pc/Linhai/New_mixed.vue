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
                var option = {
                    dataset: {
                        source: [
                            ['score', 'amount', 'product'],
                        ]
                    },
                    grid: {containLabel: true,top:'3%',bottom:'5%',right:'15%',left:'5%'},
                    tooltip: {
                        trigger: 'item',
                        formatter: function (val) {
                            return `异常健康证占比：${val.data[1]}%`
                        }
                    },
                    xAxis: {name: 'amount',show:false},
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            formatter: '{value}',
                            show: true,
                            textStyle: {
                                show:false,
                                color: '#fff',  //更改坐标轴文字颜色
                                fontSize : 13    //更改坐标轴文字大小
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    // visualMap: {
                    //     show: false,
                    //     orient: 'horizontal',
                    //     left: 'center',
                    //     min: 1,
                    //     max: 100,
                    //     text: ['High Score', 'Low Score'],
                    //     // Map the score column to color
                    //     dimension: 0,
                    //     inRange: {
                    //         color: ['#ff1900', '#009be9']
                    //     }
                    // },
                    series: [
                        {
                            type: 'bar',
                            encode: {
                                // Map the "amount" column to X axis.
                                x: 'amount',
                                // Map the "product" column to Y axis
                                y: 'product'
                            },
                            label: {
                                formatter: function (val) {
                                    return `${val.data[1]}%`
                                },
                                show: true,
                                position: 'right',
                                color: '#fff',
                                fontSize: 12,
                            },
                            itemStyle: {
                                normal: {
                                    color: (params) => {
                                        let colors = ['#eb2f96', '#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a',
                                            '#a0d911', '#fadb14', '#faad14', '#fa8c16', '#fa541c', '#f5222d','#eb2f96',
                                            '#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a','#a0d911', '#fadb14',
                                            '#faad14', '#fa8c16', '#fa541c', '#f5222d',];
                                        return colors[params.dataIndex]
                                    }
                                }
                            },
                        }
                    ],
                    dataZoom: [
                        {
                            type: 'inside',
                            yAxisIndex: [0],
                            start: 60,
                            end: 100
                        }
                    ],
                };
                option.dataset.source = option.dataset.source.concat(this.data);
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
