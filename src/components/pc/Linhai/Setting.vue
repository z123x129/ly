<template>
    <div class="body">
        <h3 class="title">修改保存路径</h3>
        <div class="form">
            <div class="input">
                <span>实时视频保存位置：</span>
                <el-input
                    size="small"
                    placeholder="保存路径"
                    v-model="text1">
                </el-input>
            </div>
            <div class="input">
                <span>实时截图保存位置：</span>
                <el-input
                    size="small"
                    placeholder="保存路径"
                    v-model="text2">
                </el-input>
            </div>
        </div>
        <div class="form">
            <!-- <div class="input">
                <span>录像视频保存位置：</span>
                <el-input
                    size="small"
                    placeholder="保存路径"
                    v-model="text3">
                </el-input>
            </div> -->
            <div class="input">
                <span>录像截图保存位置：</span>
                <el-input
                    size="small"
                    placeholder="保存路径"
                    v-model="text4">
                </el-input>
            </div>
        </div>
        <div class="button">
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>

<script>
    import { Input,Button,Message} from 'element-ui'//,DatePicker
    import 'element-ui/lib/theme-chalk/index.css'
    import Global from './js/Global'
    export default{
        components:{
            [Input.name]:Input,
            [Button.name]:Button,
            [Message.name]:Message,
        },
        data(){
            return{
                text1:Global.path1,
                text2:Global.path2,
                text3:Global.path3,
                text4:Global.path4,
                // data1:Global.path1,
            }
        },
        methods: {
            save(){
                Global.path1 = this.text1
                Global.path2 = this.text2
                Global.path4 = this.text4
                Message.success('修改成功');
            }
        }
    }

</script>
<style lang='less' scoped>
    .body{
        padding: 15px;;
        h3.title{
            font-size: 18px;
            padding-bottom: 10px;
            font-weight: 700;
        }
        .form{
            padding-bottom: 20px;
            .input{
                span{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 35px;
                }
                padding-bottom: 10px;
                &:last-of-type{
                    padding-bottom: 0;
                }
            }
        }
    }
</style>