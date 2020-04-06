<!--双单位柱形图-->
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
            var that = this;
            this.chart.on('click', function (params) {
                // 控制台打印数据的名称
                that.$emit('getSet',params.data[4])
            });
        },
        methods:{
            Mixed_resize(){
                this.chart.resize();
            },
            init(){
                console.log(this.data)
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    // toolbox: {
                    //     feature: {
                    //         dataView: {show: true, readOnly: false},
                    //         magicType: {show: true, type: ['line', 'bar']},
                    //         restore: {show: true},
                    //         saveAsImage: {show: true}
                    //     }
                    // },
                    legend: {
                        data:['健康证过期比例','人脸抓拍告警次数','事件处理及时率']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.data[0],
                            axisPointer: {
                                type: 'shadow'
                            },
                            // axisLabel:{
                            //     interval:0,//横轴信息全部显示
                            //     rotate:30,//度角倾斜显示
                            // }
                        }
                    ],
                    yAxis: [

                        {
                            type: 'value',
                            name: '单位：%',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '单位：次',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '单位：%',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    series: [
                        {
                            name:'健康证过期比例',
                            type:'bar',
                            itemStyle: {
                                normal: {
                                    color: "#D87C7C"
                                }
                            },
                            data:this.data[1]
                        },
                        {
                            name:'人脸抓拍告警次数',
                            type:'bar',
                            itemStyle: {
                                normal: {
                                    color: "#919E8B"
                                }
                            },
                            data:this.data[2]
                        },

                        {
                            name:'事件处理及时率',
                            type:'bar',
                            itemStyle: {
                                normal: {
                                    color: "#D7AB82"
                                }
                            },
                            data:this.data[3]
                        }
                    ]
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
