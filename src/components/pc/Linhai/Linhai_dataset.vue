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
                that.$emit('getDataset',params.data[4])
            });
        },
        methods:{
            init(){
                // 指定图表的配置项和数据
                var option = {};
                if(this.type){
                    option = {
                        legend: {
                            textStyle: {
                                color: "#fff",
                                fontSize: 13,
                            },
                        },
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product', '重点人员', '陌生人员'],
                            ],
                        },
                        xAxis: {type: 'category',
                            axisLabel: {
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
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value}',
                                    show: true,
                                    textStyle: {
                                        color: '#fff',  //更改坐标轴文字颜色
                                        fontSize : 10      //更改坐标轴文字大小
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                            }
                        ],
                        series: [
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#2AA956"
                                    }
                                },},
                            {type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: "#167FE1"
                                    }
                                },},
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
                        legend: {},
                        tooltip: {},
                        dataset: {
                            source: [
                                ['product', '今天', '一周'],
                            ],
                        },
                        xAxis: {type: 'category',name:'学校'},
                        yAxis:{name:'数量(个)'},
                        // Declare several bar series, each will be mapped
                        // to a column of dataset.source by default.
                        series: [
                            {type: 'bar'},
                            {type: 'bar'},
                        ]
                    };
                }
                option.dataset.source = option.dataset.source.concat(this.data);
                console.log(option.dataset.source)
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
