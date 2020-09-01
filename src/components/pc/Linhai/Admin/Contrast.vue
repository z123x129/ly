<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="月数据对比" name="first">
                <month v-if="!show"></month>
            </el-tab-pane>
            <el-tab-pane label="年数据对比" name="second">
                <year v-if="show"></year>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {Tabs,TabPane} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
export default {
    components:{
        month:()=>import('./Contrast_month'),
        year:()=>import('./Contrast_year'),
        [Tabs.name]:Tabs,
        [TabPane.name]:TabPane,
    },
    data(){
        return{
            activeName:'first',
            show:false,
        }
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        if(this.activeName=="first"){
            this.show = false
        }else{
            this.show = true
        }
      }
    }
}
</script>