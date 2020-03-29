<template>
    <div style="background: #fff">
        <el-form style="width: 60%;margin: 0 auto;padding: 30px 0" ref="form" :model="form" label-width="140px">
            <el-form-item label="学校Logo：">
                <el-upload
                        class="avatar-uploader"
                        :action='url+"/public/plugin/file_manage/api_index/upload_img"'
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="form.school_cover" :src="form.school_cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="学校名称：">
                <el-input :readonly="true" size="small" v-model="form.dirName"></el-input>
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
            <el-form-item label="学生就餐人数：">
                <el-input size="small" v-model="form.student_num"></el-input>
            </el-form-item>
            <el-form-item label="教职工就餐人数：">
                <el-input size="small" v-model="form.teacher_num"></el-input>
            </el-form-item>
            <el-form-item label="学校食堂员工数：">
                <el-input size="small" v-model="form.canteen_num"></el-input>
            </el-form-item>
            <el-button style="display:block;margin: 0 auto" type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form>
    </div>
</template>
<script>
    import { Form,FormItem,Button,Input,Message,Upload } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        name:'Message_edit',
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Button.name]:Button,
            [Input.name]:Input,
            [Message.name]:Message,
            [Upload.name]:Upload,
        },
        data(){
            return{
                form: {},
                url:this.$store.state.route.http,
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                let params ={'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/school_detail',params).then((res) => {
                    this.form = res;
                })
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let arr = {'user_id':this.$store.state.user.uid};
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
            },
            handleAvatarSuccess(res, file) {
                this.form.school_cover = res.data.fileurl;
                this.$forceUpdate();
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
                if (!isJPG) {
                    Message.error('只能上传图片!');
                }
                return isJPG;
            },
        }
    }
</script>
<style scoped lang="less">
    .avatar-uploader /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader /deep/ .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
