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
            init(){
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data: ['正常健康证数', '异常健康证数']
                    // },
                    series: [
                        {
                            name: '健康证总数 : '+this.data.all_health,
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: this.data.normal_health, name: '正常健康证数'},
                                {value: this.data.anomaly_health, name: '异常健康证数'},
                            ],
                            color: ['#2AA956','#f44336'],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
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
