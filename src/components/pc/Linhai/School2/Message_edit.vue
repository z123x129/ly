<template>
    <div>
        <el-form style="width: 60%;margin: 0 auto;padding: 30px 0" ref="form" :model="form" label-width="140px">
            <el-form-item label="学校名称：">
                <el-input disabled="true" size="small" v-model="form.dirName"></el-input>
            </el-form-item>
            <el-form-item label="单位名称：">
                <el-input size="small" v-model="form.company"></el-input>
            </el-form-item>
            <el-form-item label="负责人：">
                <el-input size="small" v-model="form.personCharge"></el-input>
            </el-form-item>
            <el-form-item label="负责人联系方式：">
                <el-input size="small" v-model="form.personChargePhone"></el-input>
            </el-form-item>
            <el-form-item label="学校地址：">
                <el-input size="small" v-model="form.street"></el-input>
            </el-form-item>
            <el-form-item label="用餐人数：">
                <el-input size="small" v-model="form.meals"></el-input>
            </el-form-item>
            <el-button style="display:block;margin: 0 auto" type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form>
    </div>
</template>
<script>
    import { Form,FormItem,Button,Input,Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Button.name]:Button,
            [Input.name]:Input,
            [Message.name]:Message,
        },
        data(){
            return{
                form: {}
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                let params ={'uid':this.$store.state.route.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/school_detail',params).then((res) => {
                    this.form = res;
                })
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let arr = {'user_id':this.$store.state.route.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/school/api_index/school_edit',params).then((res) => {
                            this.getList();
                            Message.success('编辑成功');
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style scoped lang="less">

</style>
