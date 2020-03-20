<!--条状百分比-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart" class="echarts"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props:['normal','anomaly'],
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
            init(){
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        show:false,
                        type: 'value'
                    },
                    yAxis: {
                        show:false,
                        type: 'category',
                    },
                    series: [
                        {
                            name: '正常健康证数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: '{c}%'
                            },
                            itemStyle: {
                                normal: {
                                    color: "#95F204"
                                }
                            },
                            data: this.normal
                        },
                        {
                            name: '异常健康证数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight',
                                formatter: '{c}%'
                            },
                            itemStyle: {
                                normal: {
                                    color: "#D9001B"
                                }
                            },
                            data: this.anomaly
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
