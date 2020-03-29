<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="网格员:">
                <el-input size="small" v-model="formInline.user_login"></el-input>
            </el-form-item>
            <el-form-item label="负责人:">
                <el-input size="small" v-model="formInline.personCharge"></el-input>
            </el-form-item>
            <el-form-item label="时间:">
                <el-date-picker
                        v-model="formInline.timeStr"
                        size="small"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -2px">
                <el-button size="small" type="primary" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="id"
                    label="ID">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="user_login"
                    label="网格员">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="violation"
                    label="违规选项">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="图片信息"
                    min-width="80">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.path.length>0"
                            style="width: 60px; height: 60px;"
                            :src="scope.row.path[0]"
                            :preview-src-list="scope.row.path">
                    </el-image>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="文本信息">
                <template slot-scope="scope">
                    <el-button @click="look(scope.row.title,scope.row.content)" type="text" size="small">{{scope.row.title}}</el-button>
                </template>
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
                    prop="timeStr"
                    label="日期">
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.describe" @click="showDialog(scope.row.id,scope.row.describe)" type="text" size="small">修改</el-button>
                    <el-button v-else @click="showDialog(scope.row.id)" type="text" size="small">处理信息</el-button>
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
        <el-dialog title="处理信息" :visible.sync="dialogFormVisible" @closed="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="内容:" prop="describe" :label-width="formLabelWidth">
                    <textarea v-model="form.describe" placeholder="请输入内容" id="demo" style="display: none;"></textarea>
                </el-form-item>
                <el-form-item label="附件:" :label-width="formLabelWidth">
                    <el-upload ref="my-upload"
                               class="upload-demo"
                               drag
                               :action='url+"/public/plugin/file_manage/api_index/upload_img"'
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="removeFile"
                               multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png/bmp文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                :title=title
                :visible.sync="dialogFormVisible2">
            <span v-html="content"></span>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,Table,TableColumn,DatePicker,Image,Pagination,Input,Dialog,Upload,Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    var layedit,index;
    export default {
        name:'Report_msg',
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
                url:this.$store.state.route.http,
                formInline: {
                    user_login: '',
                    personCharge: '',
                    timeStr:'',
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tableData: [],
                currentPage: 1,
                total:0,
                page:1,
                paginate:5,
                paginates:5,
                dialogFormVisible: false,
                dialogFormVisible2: false,
                form: {
                    id:'',
                    status:1,
                    describe:'',
                    re_path:[]
                },
                title:'',
                content:'',
                formLabelWidth: '60px',
                rules: {
                    describe: [
                        {required: true, message: '内容不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        mounted(){
            this.getList();
        },
        updated(){
            layui.use('layedit', function () {
                layedit = layui.layedit;
                index = layedit.build('demo', {
                    tool: ['strong' //加粗
                        ,'left' //左对齐
                        ,'center' //居中对齐
                        ,'right' //右对齐
                     ]
                });
            });
        },
        methods: {
            getList(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.timeStr){
                    timeStart = this.formInline.timeStr[0];
                    timeEnd = this.formInline.timeStr[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'page':this.page,'paginate':this.paginate,
                    'user_login':this.formInline.user_login,'personCharge':this.formInline.personCharge,
                    'timeStart':timeStart,
                    'timeEnd':timeEnd
                };
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/report_school_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            look(title,content){
                this.title = title;
                this.content = content;
                this.dialogFormVisible2 = true;
            },
            showDialog(id,content){
                this.form.id = id;
                this.form.describe ='';
                if(content){
                    this.form.describe =content;
                }
                if(this.$refs['my-upload'] != undefined){
                    this.$refs['my-upload'].clearFiles();
                }
                this.dialogFormVisible = true;
            },
            handleClose(){
                this.$refs.form.resetFields();
            },
            removeFile(file, fileList){
                for (let i = 0; i <this.form.re_path.length ; i++) {
                    if(this.form.re_path[i] == file.response.data.filepath){
                        this.form.re_path.splice(i,1);
                    }
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.re_path.push(res.data.filepath);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
                if (!isJPG) {
                    Message.error('附件只能上传图片!');
                }
                return isJPG;
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
                this.form.describe = layedit.getContent(index);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.re_path = String(this.form.re_path);
                        let params = this.form;
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/school/api_index/edit_report_message',params).then((res) => {
                            this.getList();
                                Message.success('操作成功');
                            this.dialogFormVisible = false;
                            this.$refs.form.resetFields();
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
    .el-image /deep/ .el-icon-circle-close{
        color: #fff;
    }
</style>
