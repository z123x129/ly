<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="工单编号:">
                <el-input size="small" v-model="formInline.question_sn"></el-input>
            </el-form-item>
            <el-form-item label="添加时间:">
                <el-date-picker
                        v-model="formInline.create_time"
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
<!--            <el-form-item label="审核时间:">-->
<!--                <el-date-picker-->
<!--                        v-model="formInline.reply_time"-->
<!--                        size="small"-->
<!--                        type="daterange"-->
<!--                        align="right"-->
<!--                        unlink-panels-->
<!--                        range-separator="至"-->
<!--                        start-placeholder="开始日期"-->
<!--                        end-placeholder="结束日期"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        :picker-options="pickerOptions">-->
<!--                </el-date-picker>-->
<!--            </el-form-item>-->
            <el-form-item style="margin-top: -2px">
                <el-button size="small" type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                stripe
                header-row-class-name="headerRow"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="question_sn"
                    label="工单编号">
            </el-table-column>
<!--            <el-table-column-->
<!--                    align="center"-->
<!--                    label="工单标题">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button  @click="look(scope.row.title,scope.row.content,scope.row.file)" type="text">{{scope.row.title}}</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column
                    align="center"
                    prop="create_time"
                    label="添加时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="create_time"
                    label="最新提问时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==1">待审核</span>
                    <span v-else-if="scope.row.status==0">待回复</span>
                    <span v-else>已完成</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="look(scope.row.id)" type="text" size="small">查看</el-button>
                    <el-button v-if="scope.row.status!=2" @click="showAdd(scope.row.id)" type="text" size="small">回复</el-button>
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
        <el-dialog title="回复" @closed="handleClose" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="标题:" prop="reply_title" :label-width="formLabelWidth">
                    <el-input style="width: 80%" v-model="form.reply_title" placeholder="请输入标题" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容:" prop="reply_content" :label-width="formLabelWidth">
                    <textarea  placeholder="请输入内容" id="demo" v-html="form.reply_content" style="display: none;"></textarea>
                </el-form-item>
                <el-form-item label="附件:" :label-width="formLabelWidth">
                    <el-upload ref="my-upload"
                               class="upload-demo"
                               drag
                               :action='url+"/plugin/file_manage/api_index/upload_img"'
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="removeFile"
                               multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item style="display: flex;justify-content: flex-end">
                    <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            title='工单审核'
            :visible.sync="show">
            <el-timeline>
                <el-timeline-item v-for="(item,index) in list" :key="index" :timestamp="item.msg_time+' '+item.send_name" placement="top">
                    <el-card>
                        <h4 style="text-align: center;font-size: 16px">{{item.title}}</h4>
                        <p v-html="item.content"></p>
                        <div class="demo-image__preview">
                            <el-image v-if="item.file"
                                      style="width: 80px; height: 80px;border-radius: 3px"
                                      :src="item.file[0]"
                                      :preview-src-list="item.file">
                            </el-image>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,Popconfirm,
        TabPane,Table,TableColumn,Image,Pagination,Input,Dialog,Upload,Message,
        Timeline,TimelineItem,Card} from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    var layedit,index;
    export default {
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [DatePicker.name]:DatePicker,
            [Tabs.name]:Tabs,
            [TabPane.name]:TabPane,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [Image.name]:Image,
            [Pagination.name]:Pagination,
            [Input.name]:Input,
            [Dialog.name]:Dialog,
            [Upload.name]:Upload,
            [Message.name]:Message,
            [Popconfirm.name]:Popconfirm,
            [Timeline.name]:Timeline,
            [TimelineItem.name]:TimelineItem,
            [Card.name]:Card,
        },
        data(){
            return{
                url:this.$store.state.route.http,
                form: {
                    id:'',
                    reply_title: '',
                    reply_content: '',
                    reply_file: [],
                },
                rules: {
                    reply_title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' },
                    ],
                    reply_content: [
                        { required: true, message: '内容不能为空', trigger: 'change' }
                    ]
                },
                formInline: {
                    question_sn: '',
                    create_time:'',
                },
                tableData: [],
                currentPage: 1,
                total:0,
                page:1,
                paginate:10,
                paginates:10,
                dialogFormVisible: false,
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
                formLabelWidth: '120px',
                type: 1,
                ids:[],
                options: [],
                list:[],
                show: false,
            }
        },
        mounted(){
            this.getList();
        },
        methods:{
            showAdd(id){
                this.form= {
                    id:id,
                    reply_title: '',
                    reply_content: '',
                    reply_file: [],
                };
                this.$nextTick(()=>{this.ds()});
                if(this.$refs['my-upload'] != undefined){
                    this.$refs['my-upload'].clearFiles();
                }
                if(this.$refs.form != undefined){
                    this.$refs.form.resetFields();
                }
                this.dialogFormVisible = true;
            },//添加工单
            handleClose(){
                this.$refs.form.resetFields();
            },
            ds(){
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
            },//富文本初始化
            handleAvatarSuccess(res, file) {
                this.form.reply_file.push(res.data.filepath);
            },//附件上传
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJPG) {
                    Message.error('附件只能上传jpg和png格式的图片!');
                }
                return isJPG;
            },//附件上传验证
            removeFile(file, fileList){
                for (let i = 0; i <this.form.reply_file.length ; i++) {
                    if(this.form.reply_file[i] == file.response.data.filepath){
                        this.form.reply_file.splice(i,1);
                    }
                }
            },//附件删除
            onSubmit(formName) {
                this.form.reply_content = layedit.getContent(index);
                if(this.form.reply_content == "")
                {
                    Message.error("请输入上传内容");
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.reply_file = String(this.form.reply_file);
                        let arr = {'uid':this.$store.state.user.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/statistics/api_index/replyQuestion',params).then((res) => {
                            Message.success("提交成功");
                            this.getList();
                            this.dialogFormVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
            },//表单提交
            search(){
                this.page = 1;
                this.getList();
            },//搜索
            getList(){
                var star_create_time = '',end_create_time = '';
                if(this.formInline.create_time){
                    star_create_time = this.formInline.create_time[0];
                    end_create_time = this.formInline.create_time[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'page':this.page,'paginate':this.paginate,
                    'question_sn':this.formInline.question_sn,
                    'star_create_time':star_create_time,
                    'end_create_time':end_create_time};
                this.$https.fetchPost('/plugin/statistics/api_index/lowQuestionList',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                })
            },//列表数据
            look(id){
                let params ={'uid':this.$store.state.user.uid,'id':id};
                this.$https.fetchPost('/plugin/statistics/api_index/getMsgList',params).then((res) => {
                    this.list=res;
                    this.show = true;
                })
            },//查看回复
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                this.getList();
            },//分页器
            handleCurrentChange(val) {//分页器
                this.page = val;
                this.getList();
            },//分页器
        }
    }
</script>
<style scoped>
    .el-image /deep/ .el-icon-circle-close{
        color: #fff;
    }
</style>
