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
                var that = this;
                let ddd = this.data[1].map(function(v, i) {

                    return v + that.data[2][i];

                });
                // 指定图表的配置项和数据
                var option = {
                    // title: {
                    //     text: '增量设备贯通情况-单位',
                    //     x: 'center',
                    //     y: 0,
                    //     textStyle:{
                    //         color:'#B4B4B4',
                    //         fontSize:16,
                    //         fontWeight:'normal',
                    //     },
                    //
                    // },
                    // backgroundColor: '#191E40',
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor:'rgba(255,255,255,0.1)',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                backgroundColor: '#7B7DDC'
                            }
                        }
                    },
                    legend: {
                        data:this.data[0],
                        textStyle: {
                            color: '#B4B4B4'
                        },
                        top:'7%',
                    },
                    grid:{
                        x:'12%',
                        width:'82%',
                        y:'12%',
                    },
                    xAxis: {
                        data: this.data[0],
                        // axisLine: {
                        //     lineStyle: {
                        //         color: '#B4B4B4'
                        //     }
                        // },
                        axisTick:{
                            show:false,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#b4b4b4',  //更改坐标轴文字颜色
                                fontSize : 10      //更改坐标轴文字大小
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#b4b4b4' //更改坐标轴颜色
                            }
                        },
                    },
                    yAxis: [{

                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#b4b4b4',
                            }
                        },

                        axisLabel:{
                            formatter:'{value} ',
                        }
                    },
                        {

                            splitLine: {show: false},
                            axisLine: {
                                lineStyle: {
                                    color: '#b4b4b4',
                                }
                            },
                            axisLabel:{
                                formatter:'{value} ',
                            }
                        }],

                    series: [
                        {
                            name: '正常',
                            type: 'bar',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#956FD4'},
                                            {offset: 1, color: '#3EACE5'}
                                        ]
                                    )
                                }
                            },
                            data: this.data[1]
                        },

                        {
                            name: '总数',
                            type: 'bar',
                            barGap: '-100%',
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: 'rgba(156,107,211,0.5)'},
                                            {offset: 0.2, color: 'rgba(156,107,211,0.3)'},
                                            {offset: 1, color: 'rgba(156,107,211,0)'}
                                        ]
                                    )
                                }
                            },
                            z: -12,

                            data: ddd
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
