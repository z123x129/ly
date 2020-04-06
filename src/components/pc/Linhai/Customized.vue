<!--立体饼图-->
<template>
    <div style="width: 100%;height: 100%;" >
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
            Customized_resize(){
                this.chart.resize();
            },
            init(){

                // 指定图表的配置项和数据
                var scale = 1;
                var echartData = [{
                    value: this.data.normal_health,
                    name: '正常健康证数',
                    itemStyle: {
                        normal: {//颜色渐变
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#1C93ED'},
                                    {offset: 1, color: '#4BF2D1'}
                                ]
                            )
                        }
                    }

                }, {
                    value: this.data.anomaly_health,
                    name: '异常健康证数',
                    itemStyle: {
                        normal: {//颜色渐变
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#220CCE'},
                                    {offset: 1, color: '#EF818E'}
                                ]
                            )
                        }
                    }

                }]
                var total_datas = 0;
                for (var i = 0; i < echartData.length; i++) {
                    total_datas += echartData[i].value
                }

                var rich = {
                        yellow: {
                            color: "#ffc72b",
                            fontSize: 15 * scale,
                            // padding: [21, 0],
                            align: 'center'
                        },
                        total: {
                            color: "#ffc72b",
                            fontSize: 40 * scale,
                            align: 'center'
                        },

                        blue: {
                            color: '#49dff0',
                            fontSize: 16 * scale,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#0b5263',
                            width: '100%',
                            borderWidth: 1,
                            height: 0,
                        }
                    },
                    option = {
                        title: {
                            text: '总数',
                            subtext: total_datas,
                            textStyle: {
                                color: '#f2f2f2',
                                fontSize: 16,
                                align: 'center'
                            },
                            subtextStyle: {
                                fontSize: 20,
                                color: ['#ff9d19']
                            },
                            x: 'center',
                            y: 'center',
                        },
                        legend: {
                            // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） | 'vertical'（垂直）
                            orient: 'vertical',
                            // x 设置水平安放位置，默认全图居中，可选值：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                            x: 'left',
                            // y 设置垂直安放位置，默认全图顶端，可选值：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
                            y: '20',
                            // itemWidth: 24,   // 设置图例图形的宽
                            // itemHeight: 18,  // 设置图例图形的高
                            textStyle: {
                                color: '#f2f2f2'  // 图例文字颜色
                            },
                            // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
                            // itemGap: 30,
                            data: ['正常健康证数', '异常健康证数']
                        },

                        series: [{
                            type: 'pie',
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    borderColor: '#0B1632'
                                }
                            },
                            radius: ['38%', '50%'],
                            hoverAnimation: false,
                            color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],
                            label: {
                                normal: {
                                    formatter: function(params, ticket, callback) {
                                        var total = 0; //考生总数量
                                        var percent = 0; //考生占比
                                        echartData.forEach(function(value, index, array) {
                                            total += value.value;
                                        });
                                        percent = ((params.value / total) * 100).toFixed(1);
                                        return '{yellow|' + params.value + '}\n{blue|' + percent + '%}';
                                    },
                                    rich: rich
                                },
                            },
                            labelLine: {
                                normal: {
                                    length: 55 * scale,
                                    length2: 10,
                                    lineStyle: {
                                        color: '#0b5263'
                                    }
                                }
                            },
                            data: echartData
                        }]
                    };
                // var option = {
                //     tooltip: {
                //         trigger: 'item',
                //         formatter: '{a} <br/>{b} : {c} ({d}%)'
                //     },
                //     // legend: {
                //     //     orient: 'vertical',
                //     //     left: 'left',
                //     //     data: ['正常健康证数', '异常健康证数']
                //     // },
                //     series: [
                //         {
                //             name: '健康证总数 : '+this.data.all_health,
                //             type: 'pie',
                //             radius: '55%',
                //             center: ['50%', '50%'],
                //             data: [
                //                 {value: this.data.normal_health, name: '正常健康证数'},
                //                 {value: this.data.anomaly_health, name: '异常健康证数'},
                //             ],
                //             color: ['#4997d7','#0db2b2'],
                //             emphasis: {
                //                 itemStyle: {
                //                     shadowBlur: 10,
                //                     shadowOffsetX: 0,
                //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
                //                 }
                //             }
                //         }
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
