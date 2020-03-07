<!--柱形图-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart"  class="echarts"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        data(){
            return{
                chart: null
            }
        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            this.chart = echarts.init(this.$refs.chart);

            // 指定图表的配置项和数据
            var option = {
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                        ['product', '2015', '2016', '2017'],
                        ['Matcha Latte', 43.3, 85.8, 93.7],
                        ['Milk Tea', 83.1, 73.4, 55.1],
                        ['Cheese Cocoa', 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {type: 'bar'},
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            };


            // 使用刚指定的配置项和数据显示图表。
            this.chart.setOption(option);

            // 浏览器自适应
            window.addEventListener('resize', ()=> {
                this.chart.resize();
            })

            this.chart.on('click', function (params) {
                // 控制台打印数据的名称
                console.log(params);
            });
        },
        methods:{

        }
    }
</script>
<style scoped lang="less">
    .echarts{
        width: 100%;
        height: 100%;
    }
</style>
