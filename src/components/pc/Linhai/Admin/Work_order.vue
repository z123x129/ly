<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="工单编号:">
                <el-input size="small" v-model="formInline.question_sn"></el-input>
            </el-form-item>
            <el-form-item label="接受人:">
                <el-input size="small" v-model="formInline.user_login"></el-input>
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
            <el-form-item label="最新回复时间:">
                <el-date-picker
                        v-model="formInline.reply_time"
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
                <el-button size="small" type="primary" @click="search">搜索</el-button>
                <el-button size="small" type="primary" @click="showAdd('1')">添加工单</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                stripe
                header-row-class-name="headerRow"
                style="width: 100%"
                @selection-change="getSelect">
            <el-table-column
                    align="center"
                    type="selection"
                    :selectable="selectable"
                    width="50">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="question_sn"
                    label="工单编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="user_login"
                    label="接收人">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="add_time"
                    label="添加时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="最新回复时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.reply_time">{{scope.row.reply_time}}</span>
                    <span v-else>暂无回复</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">待回复</span>
                    <span v-else-if="scope.row.status==1">已回复</span>
                    <span v-else>已完成</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="look(scope.row.id)" type="text" size="small">查看</el-button>
                    <el-button v-if="scope.row.status!==2" @click="showAdd('2',scope.row.id)" type="text" size="small">提问</el-button>
                    <el-popconfirm
                            v-if="scope.row.status!==2"
                            title="确定关闭该条工单吗？"
                            @onConfirm="delList(scope.row.id)"
                    >
                        <el-button style="margin-left: 10px" slot="reference" type="text" size="mini">关闭</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 15px;display: flex;justify-content: space-between;">
            <div>
                <el-button size="small" type="primary" @click="tiwenAll">批量提问</el-button>
                <el-button size="small" type="primary" @click="delAll">批量关闭</el-button>
            </div>
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
        <el-dialog :title="type==1?'添加工单':'提问'" @closed="handleClose" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item v-if="type==1" label="接收人:" prop="id_str" :label-width="formLabelWidth">
                    <el-cascader
                            v-model="form.id_str"
                            style="width: 80%"
                            placeholder="试试搜索：杜桥中学"
                            :show-all-levels="false"
                            collapse-tags
                            :options="options"
                            :props="{ multiple: true }"
                            filterable></el-cascader>
                </el-form-item>
                <el-form-item label="标题:" prop="title" :label-width="formLabelWidth">
                    <el-input style="width: 80%" v-model="form.title" placeholder="请输入标题" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容:" prop="content" :label-width="formLabelWidth">
                    <textarea  placeholder="请输入内容" id="demo" v-html="form.content" style="display: none;"></textarea>
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
            title='工单回复'
            :visible.sync="show">
            <el-timeline>
                <el-timeline-item v-for="(item,index) in list" :key="index" :timestamp="item.flow==0?item.msg_time+' '+item.send_name:item.msg_time +' '+ item.rec_name" placement="top">
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
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,Popconfirm,Cascader,
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
            [Cascader.name]:Cascader,
            [Timeline.name]:Timeline,
            [TimelineItem.name]:TimelineItem,
            [Card.name]:Card,
        },
        data(){
            return{
                url:this.$store.state.route.http,
                form: {
                    id_str:'',
                    title: '',
                    content: '',
                    file: [],
                },
                rules: {
                    id_str: [
                        { required: true, message: '请选择接收人', trigger: 'blur' },
                    ],
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: '内容不能为空', trigger: 'change' }
                    ]
                },
                formInline: {
                    question_sn: '',
                    user_login: '',
                    create_time:'',
                    reply_time:'',
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
            this.getAddress();
        },
        methods:{
            getAddress(){
                let params = {'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/userList',params).then((res) => {
                    this.options = res;
                })
            },
            showAdd(type,id){
                this.type = type;
                this.form = {
                    id_str:'',
                    title: '',
                    content: '',
                    file: [],
                };
                if(id){
                    this.form.id_str = id;
                }
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
            ds(){//富文本初始化
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
            handleAvatarSuccess(res, file) {
                this.form.file.push(res.data.filepath);
            },//附件上传
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJPG) {
                    Message.error('附件只能上传jpg和png格式的图片!');
                }
                return isJPG;
            },//附件上传验证
            removeFile(file, fileList){
                for (let i = 0; i <this.form.file.length ; i++) {
                    if(this.form.file[i] == file.response.data.filepath){
                        this.form.file.splice(i,1);
                    }
                }
            },//附件删除
            onSubmit(formName) {
                this.form.content = layedit.getContent(index);
                if(this.form.content == "")
                {
                    Message.error("请输入上传内容");
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid && this.type==1) {
                        this.form.file = String(this.form.file);
                        var id_str = []
                        this.form.id_str.forEach((item)=>{
                            id_str.push(item[2])
                        })
                        this.form.id_str = String(id_str);
                        let arr = {'uid':this.$store.state.user.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/statistics/api_index/upQuestion',params).then((res) => {
                            Message.success("提交成功");
                            this.getList();
                            this.dialogFormVisible = false;
                        })
                    } else if(valid && this.type==2){
                        this.form.file = String(this.form.file);
                        let arr = {'uid':this.$store.state.user.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/statistics/api_index/repetitionQuestion',params).then((res) => {
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
                var star_add_time = '',end_add_time = '',star_reply_time = '',end_reply_time = '';
                if(this.formInline.create_time){
                    star_add_time = this.formInline.create_time[0];
                    end_add_time = this.formInline.create_time[1];
                }
                if(this.formInline.reply_time){
                    star_reply_time = this.formInline.reply_time[0];
                    end_reply_time = this.formInline.reply_time[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'page':this.page,'paginate':this.paginate,
                    'question_sn':this.formInline.question_sn,
                    'user_login':this.formInline.user_login,
                    'star_add_time':star_add_time,
                    'end_add_time':end_add_time,
                    'star_reply_time':star_reply_time,
                    'end_reply_time':end_reply_time};
                this.$https.fetchPost('/plugin/statistics/api_index/adminQuestionList',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                })
            },//列表数据
            look(id){//查看回复
                let params ={'uid':this.$store.state.user.uid,'id':id};
                this.$https.fetchPost('/plugin/statistics/api_index/getMsgList',params).then((res) => {
                    this.list=res;
                    this.show = true;
                })
            },
            getSelect(val) {//多选获取id
                this.ids = [];
                for (var i = 0; i < val.length ; i++) {
                    this.ids.push(val[i].id)
                }
            },//列表多选
            delList(id){
                let params ={'id_str':id,'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/closeQuestion',params).then(() => {
                    this.getList()
                })
            },//关闭工单
            delAll(){
                if(this.ids.length == 0){
                    Message.error('请选择删除项');
                    return false;
                }
                let params ={'id_str':String(this.ids),'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/closeQuestion',params).then(() => {
                    this.getList()
                })
            },//批量关闭
            tiwenAll(){
                if(this.ids.length == 0){
                    Message.error('请选择提问项');
                    return false;
                }
                this.showAdd('2',String(this.ids));
            },//批量提问
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                this.getList();
            },//分页器
            handleCurrentChange(val) {//分页器
                this.page = val;
                this.getList();
            },//分页器
            selectable(row){
                if(row.status==2){
                    return false
                }else{
                    return true
                }
            }//禁用复选框
        }
    }
</script>
<style scoped>
    .el-image /deep/ .el-icon-circle-close{
        color: #fff;
    }
</style>
