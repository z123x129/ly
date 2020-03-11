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
          oWebControl:"",
          aWebControl:""
        }
      }
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
