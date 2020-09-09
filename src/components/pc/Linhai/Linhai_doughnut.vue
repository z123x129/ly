<!--饼图-->
<template>
    <div style="width: 100%;height: 100%;" >
        <div ref="chart" class="echarts"></div>
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

            this.chart.on('legendselectchanged', function(params) {
                let option = this.getOption();
                let select_key = Object.keys(params.selected);
                let select_value = Object.values(params.selected);
                let n = 0;
                select_value.map(res => {
                    if (!res) {
                        n++;
                    }
                });
                // console.log('n', n);
                // console.log(select_value);

                let dataName = [];
                let total = 0;
                option.series[0].data.forEach((res,i) => {
                    if(select_value[i] == true){
                        dataName.push(res.name);
                        total += parseFloat(res.value) * 10000;
                    }
                });
                total = total / 10000;
                // console.log(option.series[0].data);
                let text = [
                    '{value|' + total + '}',
                    '{name|总数}',
                ].join('\n');
                option.title[0].text = text;
                this.setOption(option);
            })

            // 浏览器自适应
            window.addEventListener('resize', ()=> {
                this.chart.resize();
            })
        },
        methods:{
            Customized_resize(){
                this.chart.resize();
            },
            init(){
                let dataName = [];
                let total = 0;
                this.data.forEach((res) => {
                    dataName.push(res.name);
                    total += parseFloat(res.value) * 10000;
                });
                total = total / 10000;

                // 指定图表的配置项和数据
                var option = {};
                if(this.type==1){
                    option = {
                        title: {
                            zlevel: 0,
                            x: 'center',
                            y: 'center',
                            text: [
                                '{value|' + total + '}',
                                '{name|健康证总数}',
                            ].join('\n'),
                            textStyle: {
                                rich: {
                                    value: {
                                        color: '#fff',
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        lineHeight: 25,
                                    },
                                    name: {
                                        fontSize: 16,
                                        color: '#d4d4d4',
                                        lineHeight: 25
                                    },
                                },
                            },
                        },
                        color: ['#95bb42','#23adb0'],
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '健康证信息',
                                type: 'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                zlevel: 1,
                                label: {
                                    normal: {
                                        padding: [30, 30, 30, 30],
                                        backgroundColor: '#fff',
                                        show: false,
                                        position: 'center'
                                    },
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: this.data
                            }
                        ]
                    };
                }else if(this.type==2){
                    option = {
                        title: {
                            zlevel: 0,
                            x: 'center',
                            y: 'center',
                            text: [
                                '{value|' + total + '}',
                                '{name|学校个数}',
                            ].join('\n'),
                            textStyle: {
                                rich: {
                                    value: {
                                        color: '#fff',
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        lineHeight: 25,
                                    },
                                    name: {
                                        fontSize: 16,
                                        color: '#d4d4d4',
                                        lineHeight: 25
                                    },
                                },
                            },
                        },
                        color: ['#de5d3d','#fab847'],
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '学校信息',
                                type: 'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                zlevel: 1,
                                label: {
                                    normal: {
                                        padding: [30, 30, 30, 30],
                                        backgroundColor: '#fff',
                                        show: false,
                                        position: 'center'
                                    },
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: this.data
                            }
                        ]
                    };
                }else{
                    option = {
                        title: {
                            zlevel: 0,
                            x: 'center',
                            y: 'center',
                            text: [
                                '{value|' + total + '}',
                                '{name|总数}',
                            ].join('\n'),
                            textStyle: {
                                rich: {
                                    value: {
                                        color: '#333',
                                        fontSize: 22,
                                        fontWeight: 'bold',
                                        lineHeight: 25,
                                    },
                                    name: {
                                        fontSize: 16,
                                        color: '#999',
                                        lineHeight: 25
                                    },
                                },
                            },
                        },
                        color: ['#ff4d4f','#ffa940','#ffec3d', '#73d13d','#40a9ff','#9254de'],
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        legend: {
                            orient: 'vertical',
                            right: 10,
                            data: ["健康证过期数", "健康证未到期数"]
                        },
                        series: [
                            {
                                name: '健康证信息',
                                type: 'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                zlevel: 1,
                                label: {
                                    normal: {
                                        padding: [30, 30, 30, 30],
                                        backgroundColor: '#fff',
                                        show: false,
                                        position: 'center'
                                    },
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: this.data
                            }
                        ]
                    };
                }
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
