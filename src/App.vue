<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import "./assets/css/reset.css"


  export default {
    provide(){
      return {
        app:this
      }
    },
    data(){
        return {
          oWebControl:"",//视频预览
          aWebControl:"",//指挥中心
          bWebControl:"",//录像回放
        }
      },
  }
</script>

<style lang="less">
#app {
  background: #fff;
  height: 100%;
  font-size: 13px;
}
.el-loading-spinner {
  font-size: 38px;
}
</style>
