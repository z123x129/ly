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
  background: #001529;
  height: 100%;
  font-size: 13px;
}
.el-loading-spinner {
  font-size: 38px;
}
.el-tabs{
  background-color: #f0f0f0;
  /deep/ .el-tabs__header{
    padding: 10px 20px;
    background-color: #fff;
    margin: 0 !important;
  }
  /deep/ .el-tab-pane{

    >.demo-form-inline {
      padding:15px 20px;
      /*margin-bottom: 10px;*/
      background-color: #fff;
      .el-form-item{
        margin-top: 0;
        margin-bottom: 0;
      }
    }

  }
}
#i2 >div >.demo-form-inline {
    margin-top: 10px;
    background-color: #fff;
    padding:15px 20px;
    .el-form-item{
        margin-top: 0;
        margin-bottom: 0;
      }
}
  .headerRow{
    color: #333;
  }
</style>
