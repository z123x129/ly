<!--柱形图-->
<template>
    <div style="width: 100%;height: 100%;">
        <div ref="chart"  class="echarts"></div>
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
                var option = {
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '今天', '一周', '当月'],
                        ],
                    },
                    xAxis: {type: 'category',name:'学校'},
                    yAxis:{name:'数量(个)'},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };
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
