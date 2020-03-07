<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择街道:">
                <el-cascader
                        size="small"
                        placeholder="所属街道"
                        :options="options"
                        filterable></el-cascader>
            </el-form-item>
            <el-form-item label="所属学校:">
                    <el-input size="small" v-model="formInline.dirName" ></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -2px">
                <el-button size="small" type="primary" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="id"
                    label="学校编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="dirName"
                    label="学校名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="company"
                    label="单位名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="street"
                    label="所属街道">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="personCharge"
                    label="负责人">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="personChargePhone"
                    label="负责人联系方式">
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="dialogShow(2,scope.row)" type="text" size="small">上传报告</el-button>
                    <el-button  type="text" size="small">查看违规</el-button>
                    <el-button @click="dialogShow(1,scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 15px;display: flex;justify-content: flex-end;background: #fff">
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
        <el-dialog :title="type == 1 ? '学校信息' : '上传报告'" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="学校名称:" prop="dirName" :label-width="formLabelWidth">
                    <el-input disabled="disabled" style="width: 80%" size="small" v-model="form.dirName" placeholder="请输入学校名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位名称:" prop="company" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.company" placeholder="请输入单位名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="负责人:" prop="personCharge" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.personCharge" placeholder="请输入负责人" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="负责人联系方式:" prop="personChargePhone" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.personChargePhone" placeholder="请输入负责人联系方式" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学校地址:" prop="street" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.street" placeholder="请输入学校地址" autocomplete="off"></el-input>
                </el-form-item>
                <div v-if="type == 2">
                    <el-form-item label="违规选项:" prop="user" :label-width="formLabelWidth">
                        <el-select style="width: 80%" size="small" v-model="form.user" placeholder="请选择">
                            <el-option label="选择区域" value="shanghai"></el-option>
                            <el-option label="选择学校" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上报标题:" prop="region" :label-width="formLabelWidth">
                        <el-input style="width: 80%" size="small" v-model="form.region" placeholder="请输入手机号" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上报内容:" prop="region" :label-width="formLabelWidth">
                        <el-input type="textarea" style="width: 80%" size="small" v-model="form.region" placeholder="请输入手机号" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="附件:" prop="imageUrl" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,Table,TableColumn,DatePicker,Pagination,Input,Dialog,Upload,Message,Cascader } from 'element-ui'
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
            [Pagination.name]:Pagination,
            [Input.name]:Input,
            [Dialog.name]:Dialog,
            [Upload.name]:Upload,
            [Message.name]:Message,
            [Cascader.name]:Cascader,
        },
        data(){
            return{
                formInline: {
                    dirName: '',
                    name:'',
                },
                options: [],
                tableData: [],
                currentPage: 1,
                total:0,
                page:1,
                paginate:10,
                paginates:5,
                dialogFormVisible: false,
                type: 1,
                form: {
                    personChargePhone:''
                },
                formLabelWidth: '140px',
                rules: {
                    dirName: [
                        {required: true, message: '学校名称不能为空', trigger: 'blur'},
                    ],
                    company: [
                        {required: true, message: '单位名称不能为空', trigger: 'blur'},
                    ],
                    personCharge: [
                        {required: true, message: '负责人不能为空', trigger: 'blur'},
                    ],
                    personChargePhone: [
                        {required: true, message: '负责人联系方式不能为空', trigger: 'blur'},
                    ],
                    street: [
                        {required: true, message: '学校地址不能为空', trigger: 'blur'},
                    ],
                    imageUrl: [
                        {required: true, message: '请上传人脸照片', trigger: 'change'},
                    ],
                    imageUrl2: [
                        {required: true, message: '请上传健康证照片', trigger: 'change'},
                    ],
                    value1: [
                        {required: true, message: '请选择到期时间', trigger: 'change'},
                    ],
                }
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getList(){ //获取学校列表
                let params ={'page':this.page,'paginate':this.paginate,'dirName':this.formInline.dirName};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/index',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            dialogShow(type,res){
                this.type = type;
                this.form = res;
                // console.log(this.form.personChargePhone)
                this.dialogFormVisible = true;
                // this.$refs['form'].resetFields();
            },
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                this.getList();
            },
            handleCurrentChange(val) {//分页器
                this.page = val;
                this.getList();
            },
            handleAvatarSuccess(res, file) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    Message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    Message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = this.form;
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/school/api_index/school_edit',params).then((res) => {
                            Message.success('编辑成功');
                            this.dialogFormVisible = false;
                        })
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
