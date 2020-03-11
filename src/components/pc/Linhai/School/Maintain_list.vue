<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
                <el-select size="small" v-model="formInline.user" placeholder="筛选条件">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                    <el-input size="small" v-model="formInline.region"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -2px">
                <el-button size="small" type="primary" @click="onSubmit">搜索</el-button>
                <el-button size="small" type="primary" @click="dialogFormVisible = true">添加新人员</el-button>
                <el-button size="small" type="primary" @click="onSubmit">导出excel</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column
                    align="center"
                    type="index"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="单位名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="身份证号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="健康证号">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="人脸照片">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="url"
                            :preview-src-list="srcList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="健康证照片">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="url"
                            :preview-src-list="srcList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="time"
                    label="健康证到期时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="人员类别">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="time"
                    label="添加时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 15px;display: flex;justify-content: flex-end;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[paginates, paginates*2, paginates*3, paginates*4]"
                        :page-size="paginate"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        <el-dialog title="添加人员" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="姓名:" prop="nickname" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.nickname" placeholder="请输入姓名" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位名称:" prop="user" :label-width="formLabelWidth">
                    <el-select style="width: 80%" size="small" v-model="form.user" placeholder="请选择">
                        <el-option label="选择区域" value="shanghai"></el-option>
                        <el-option label="选择学校" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员类别:" prop="member_type" :label-width="formLabelWidth">
                    <el-select style="width: 80%" size="small" v-model="form.member_type" placeholder="请选择">
                        <el-option label="食品安全管理员" value="食品安全管理员"></el-option>
                        <el-option label="后厨人员" value="后厨人员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码:" prop="mobile" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.mobile" placeholder="请输入手机号" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号:" prop="id_card" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.id_card" placeholder="请输入身份证" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="健康证号:" prop="health_id_card" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.health_id_card" placeholder="请输入健康证" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="人脸照片:" prop="face_thumb" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            action="/plugin/file_manage/api_index/upload_img"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.face_thumb" :src="form.face_thumb" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="健康证照片:" prop="health_card" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            action="/plugin/file_manage/api_index/upload_img"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.health_card" :src="form.health_card" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="健康证到期时间:" prop="health_endtime" :label-width="formLabelWidth">
                    <el-date-picker
                            size="small"
                            v-model="form.health_endtime"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,Table,TableColumn,DatePicker,Image,Pagination,Input,Dialog,Upload,Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [DatePicker.name]:DatePicker,
            [Image.name]:Image,
            [Pagination.name]:Pagination,
            [Input.name]:Input,
            [Dialog.name]:Dialog,
            [Upload.name]:Upload,
            [Message.name]:Message,
        },
        data(){
            return{
                formInline: {
                    user: '',
                    region: '',
                    name:'',
                },
                tableData: [],
                url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                srcList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ],
                currentPage: 1,
                total:0,
                page:1,
                paginate:5,
                paginates:5,
                dialogFormVisible: false,
                form: {
                    nickname: '',
                    user: '',
                    member_type: '',
                    mobile: '',
                    id_card: '',
                    health_id_card: '',
                    face_thumb: '',
                    health_card: '',
                    health_endtime: '',
                },
                formLabelWidth: '140px',
                rules: {
                    nickname: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
                    ],
                    user: [
                        {required: true, message: '请选择单位', trigger: 'change'},
                    ],
                    member_type: [
                        {required: true, message: '请选择人员类别', trigger: 'change'},
                    ],
                    mobile: [
                        {required: true, message: '手机号码不能为空', trigger: 'blur'},
                    ],
                    id_card: [
                        {required: true, message: '身份证号码不能为空', trigger: 'blur'},
                    ],
                    health_id_card: [
                        {required: true, message: '健康证号码不能为空', trigger: 'blur'},
                    ],
                    face_thumb: [
                        {required: true, message: '请上传人脸照片', trigger: 'blur'},
                    ],
                    health_card: [
                        {required: true, message: '请上传健康证照片', trigger: 'blur'},
                    ],
                    health_endtime: [
                        {required: true, message: '请选择到期时间', trigger: 'change'},
                    ],
                }
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){
                let params ={'uid':this.$store.state.route.uid,'page':this.page,'paginate':this.paginate};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/health_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            onSubmit() {
                window.console.log('submit!');
            },
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                // this.getList();
            },
            handleCurrentChange(val) {//分页器
                this.page = val;
                // this.getList();
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            handleAvatarSuccess(res, file) {
                this.form.face_thumb = URL.createObjectURL(file.raw);
            },
            handleAvatarSuccess2(res, file) {
                this.form.health_card = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
                if (!isJPG) {
                    Message.error('只能上传图片!');
                }
                return isJPG;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Message.success('submit!');
                        this.dialogFormVisible = false;
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>
<style scoped lang="less">
.demo-form-inline{
    padding: 20px 10px 0;
}
.el-form-item{
    margin-top: 0;
}
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
.el-table /deep/ .warning-row {
    background: oldlace;
}

.el-table /deep/ .success-row {
    background: #f0f9eb;
}
</style>
