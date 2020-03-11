<template>
    <div id="i1">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择街道:">
                <el-cascader
                        v-model="formInline.cameraIndexCode"
                        size="small"
                        placeholder="所属街道"
                        :options="options"
                        clearable
                        filterable>
                </el-cascader>
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
                <el-form-item label="学校名称:" prop="name" :label-width="formLabelWidth">
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
                    <el-form-item label="违规选项:" prop="violation" :label-width="formLabelWidth">
                        <el-select style="width: 80%" size="small" v-model="form.violation" placeholder="请选择">
                            <el-option label="超市有熟食" value="超市有熟食"></el-option>
                            <el-option label="健康证过期" value="健康证过期"></el-option>
                            <el-option label="后厨不规范" value="后厨不规范"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上报标题:" prop="title" :label-width="formLabelWidth">
                        <el-input style="width: 80%" size="small" v-model="form.title" placeholder="请输入上报标题" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上报内容:" prop="content" :label-width="formLabelWidth">
                        <el-input type="textarea" style="width: 80%" size="small" v-model="form.content" placeholder="请输入上报内容" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="附件:" prop="file" :label-width="formLabelWidth">
                        <el-upload
                                class="upload-demo"
                                drag
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
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
        name:"School_list",
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
                    cameraIndexCode: [],
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
                    file:[]
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
                    violation: [
                        {required: true, message: '请选择违规选项', trigger: 'change'},
                    ],
                    title: [
                        {required: true, message: '上报标题不能为空', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '上报内容不能为空', trigger: 'blur'},
                    ],
                    file: [
                        {required: true, message: '请上传附件', trigger: 'change'},
                    ],
                }
            }
        },
        mounted(){
            this.getList();
            this.getCity();
        },
        methods: {
            getList(){ //获取学校列表
                let params ={'user_id':this.$store.state.route.uid,'page':this.page,'paginate':this.paginate,'dirName':this.formInline.dirName,'cameraIndexCode':this.formInline.cameraIndexCode[1]};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/index',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            getCity(){
                this.$https.fetchPost('/plugin/school/api_index/region_list').then((res) => {
                    this.options = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                })
            },
            dialogShow(type,res){
                this.type = type;
                this.form = this.deepClone(res);
                this.dialogFormVisible = true;
            },
            handleAvatarSuccess(res, file) {
                console.log(res, file)
                this.form.file = file.raw;
                console.log(this.form.file)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
                if (!isJPG) {
                    Message.error('附件只能上传图片!');
                }
                return isJPG;
            },
            deepClone(target) {  //深拷贝
                // 定义一个变量
                var result;
                // 如果当前需要深拷贝的是一个对象的话
                if (typeof target === 'object') {
                    // 如果是一个数组的话
                    if (Array.isArray(target)) {
                        result = []; // 将result赋值为一个数组，并且执行遍历
                        for (let i in target) {
                            // 递归克隆数组中的每一项
                            result.push(this.deepClone(target[i]))
                        }
                        // 判断如果当前的值是null的话；直接赋值为null
                    } else if(target===null) {
                        result = null;
                        // 判断如果当前的值是一个RegExp对象的话，直接赋值
                    } else if(target.constructor===RegExp){
                        result = target;
                    }else {
                        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
                        result = {};
                        for (let i in target) {
                            result[i] = this.deepClone(target[i]);
                        }
                    }
                    // 如果不是对象的话，就是基本数据类型，那么直接赋值
                } else {
                    result = target;
                }
                // 返回最终结果
                return result;
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    console.log(this.form)
                    if (valid) {
                        let arr = {'user_id':this.$store.state.route.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        if(this.type == 1){
                            this.$https.fetchPost('/plugin/school/api_index/school_edit',params).then((res) => {
                                this.getList();
                                Message.success('编辑成功');
                                this.dialogFormVisible = false;
                            })
                        }else if(this.type == 2){
                            this.$https.fetchPost('/plugin/school/api_index/report_school',params).then((res) => {
                                // this.getList();
                                Message.success('上传成功');
                                this.dialogFormVisible = false;
                            })
                        }
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
        background-color: #fff;
        padding:10px;
        // padding: 20px 10px 0;
        margin-bottom: 10px;
    }
    .el-form-item{
        margin-top: 0;
        margin-bottom: 0;
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
