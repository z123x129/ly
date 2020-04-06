<!--双环饼图-->
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
                    series: [
                        {
                            name: this.data.data2[1].name,
                            type: 'pie',
                            radius: ['60%', '80%'],
                            center: ['15%', '50%'],
                            startAngle: 225,
                            color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FDFF5C'
                            }, {
                                offset: 1,
                                color: '#FFDB5C'
                            }]), "transparent"],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    position: 'center'
                                }
                            },
                            data: [{
                                value: 75,
                                name: this.data.data2[1].name,
                                label: {
                                    normal: {
                                        formatter: this.data.data2[1].name,
                                        textStyle: {
                                            color: '#555',
                                            fontSize: 16

                                        }
                                    }
                                }
                            }, {
                                value: 25,
                                name: '%',
                                label: {
                                    normal: {
                                        formatter: '\n\n'+this.data.data2[1].value,
                                        textStyle: {
                                            color: '#007ac6',
                                            fontSize: 30

                                        }
                                    }
                                }
                            },
                                {
                                    value: 0,
                                    name: '%',
                                    label: {
                                        normal: {
                                            formatter: '',
                                            textStyle: {
                                                color: '#fff',
                                                fontSize: 16

                                            }
                                        }
                                    }
                                }]
                        },
                        {
                            name: this.data.data1[1].name,
                            type: 'pie',
                            radius: ['60%', '80%'],
                            center: ['50%', '50%'],
                            startAngle: 225,
                            color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#9FE6B8'
                            }, {
                                offset: 1,
                                color: '#32C5E9'
                            }]), "transparent"],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    position: 'center'
                                }
                            },
                            data: [{
                                value: 75,
                                name: this.data.data1[1].name,
                                label: {
                                    normal: {
                                        formatter: this.data.data1[1].name,
                                        textStyle: {
                                            color: '#555',
                                            fontSize: 16

                                        }
                                    }
                                }
                            }, {
                                value: 25,
                                name: '%',
                                label: {
                                    normal: {
                                        formatter: '\n\n'+this.data.data1[1].value,
                                        textStyle: {
                                            color: '#007ac6',
                                            fontSize: 30

                                        }
                                    }
                                }
                            },
                                {
                                    value: 0,
                                    name: '%',
                                    label: {
                                        normal: {
                                            formatter: '',
                                            textStyle: {
                                                color: '#fff',
                                                fontSize: 16

                                            }
                                        }
                                    }
                                }]
                        },
                        {
                            name: this.data.data2[3].name,
                            type: 'pie',
                            radius: ['60%', '80%'],
                            center: ['85%', '50%'],
                            startAngle: 225,
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    position: 'center'
                                }
                            },
                            data: [{
                                value: 75,
                                "itemStyle": {
                                    "normal": {
                                        "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            "offset": 0,
                                            "color": '#FF9F7F'
                                        }, {
                                            "offset": 1,
                                            "color": '#FB7293'
                                        }]),
                                    }
                                },
                                name: this.data.data2[3].name,
                                label: {
                                    normal: {
                                        formatter: this.data.data2[3].name,
                                        textStyle: {
                                            color: '#555',
                                            fontSize: 16

                                        }
                                    }
                                }
                            }, {
                                value: 25,
                                name: '%',
                                label: {
                                    normal: {
                                        formatter: '\n\n'+this.data.data2[3].value,
                                        textStyle: {
                                            color: '#f125ff',
                                            fontSize: 30

                                        }
                                    }
                                }
                            },
                                {
                                    value: 0,
                                    name: '%',
                                    label: {
                                        normal: {
                                            formatter: '',
                                            textStyle: {
                                                color: '#fff',
                                                fontSize: 16

                                            }
                                        }
                                    }
                                }]
                        }
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
