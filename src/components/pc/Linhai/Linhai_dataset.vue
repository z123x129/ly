<!--柱形图-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart"  class="echarts"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props:['data','type'],
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
            var that = this;
            this.chart.on('click', function (params) {
                // 控制台打印数据的名称
                that.$emit('getSet',params.data[4])
            });
        },
        methods:{
            Dataset_resize(){
                this.chart.resize();
            },
            init(){
                // 指定图表的配置项和数据
                var option = {};
                if(this.type===1){
                    option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer:{
                                type: 'shadow',
                                label: {
                                    show: true
                                }
                            }
                        },
                        dataset: {
                            source: [
                                ['陌生人员'],
                            ],
                        },
                        grid:{
                            top:'10%',
                        },
                        xAxis: {type: 'category',
                            axisLabel: {
                                rotate: 0, interval: 0,
                                show: true,
                                textStyle: {
                                    color: '#fff',  //更改坐标轴文字颜色
                                    fontSize : 10      //更改坐标轴文字大小
                                }
                            },
                        },
                        yAxis:[
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
                            },
                        ],
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#3ca5e7'
                                        }]),
                                        opacity: 1,
                                    }
                                }
                            },
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
                }else if(this.type===2){
                    option = {
                        legend: {},
                        tooltip: {
                            trigger: 'axis',
                            axisPointer:{
                                type: 'shadow',
                                label: {
                                    show: true
                                }
                            }
                        },
                        dataset: {
                            source: [
                                ['product','健康证过期比例','事件处理及时率','人脸抓拍告警次数'],
                            ],
                        },
                        xAxis: {type: 'category',},
                        yAxis:[

                            {
                                type: 'value',
                                name: '单位：%',
                                min: 0,
                                max: 100,
                                interval: 10,
                                splitLine:{show: false},
                                splitArea : {show : true},
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            },
                            {
                            type: 'value',
                            name: '单位：次',
                            interval: 10,
                            splitLine:{show: false},
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },],
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#d4414f"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#feac5f"
                                    }
                                },
                            },
                            {type: 'bar',
                                yAxisIndex: 1,
                                itemStyle: {
                                    normal: {
                                        color: "#f57051"
                                    }
                                },
                            },
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
                }else if(this.type===3){
                    option = {
                        legend: {},
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product','当月健康证未过期比例','上月健康证未过期比例'],
                            ],
                        },
                        xAxis: {type: 'category'},
                        yAxis:{name:'比例(%)'},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#2AA956"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#167FE1"
                                    }
                                },
                            },
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
                }else if(this.type===4){
                    option = {
                        legend: {},
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product','当月人脸抓拍告警次数','上月人脸抓拍告警次数'],
                            ],
                        },
                        xAxis: {type: 'category'},
                        yAxis:{name:'次数(次)'},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#2AA956"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#167FE1"
                                    }
                                },
                            },
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
                }else if(this.type===5){
                    option = {
                        legend: {},
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product','当月时间处理及时率','上月时间处理及时率'],
                            ],
                        },
                        xAxis: {type: 'category'},
                        yAxis:{name:'比例(%)'},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#2AA956"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#167FE1"
                                    }
                                },
                            },
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
                }else{
                    option = {
                        legend: {
                            top:'5%',
                        },
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product', '今天', '一周','当月'],
                            ],
                        },
                        xAxis: {type: 'category',name:'学校'},
                        yAxis:{name:'数量(人)'},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#D87C7C"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#919E8B"
                                    }
                                },
                            },
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#D7AB82"
                                    }
                                },
                            },
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
                }
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
