<template>
    <div>
        <el-form id="form" :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
            <el-form-item prop="date" label="抓拍时间:" :label-width="formLabelWidth">
                <el-date-picker
                        v-model="formInline.date"
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
            <el-form-item prop="encodeDevIndexCode" label="抓拍点:" :label-width="formLabelWidth">
                <el-select clearable size="small" v-model="formInline.encodeDevIndexCode" placeholder="请选择抓拍点">
                    <el-option v-for="(item,index) in option" :key="index" :label="item.cameraName" :value="item.encodeDevIndexCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="ageGroup" label="年龄段:" :label-width="formLabelWidth">
                <el-select clearable size="small" v-model="formInline.ageGroup" placeholder="不限">
                    <el-option label="未知" value="unknown"></el-option>
                    <el-option label="婴幼儿" value="infant"></el-option>
                    <el-option label="儿童" value="kid"></el-option>
                    <el-option label="少年" value="child"></el-option>
                    <el-option label="青少年" value="teenager"></el-option>
                    <el-option label="青年" value="young"></el-option>
                    <el-option label="壮年" value="frime"></el-option>
                    <el-option label="中年" value="middle"></el-option>
                    <el-option label="中老年" value="middleaged"></el-option>
                    <el-option label="老年" value="old"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="gender" label="性别:" :label-width="formLabelWidth">
                <el-select clearable size="small" v-model="formInline.gender" placeholder="不限">
                    <el-option label="未知" value="unknown"></el-option>
                    <el-option label="男" value="male"></el-option>
                    <el-option label="女" value="female"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="glass" label="是否戴眼镜:" :label-width="formLabelWidth">
                <el-select clearable size="small" v-model="formInline.glass" placeholder="不限">
                    <el-option label="未知" value="unknown"></el-option>
                    <el-option label="是" value="yes"></el-option>
                    <el-option label="否" value="no"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 40px">
                <el-button size="small" type="primary" @click="search">查询</el-button>
                <el-button size="small" type="primary" @click="resetForm('formInline')">重置</el-button>
                <el-button size="small" type="primary" @click="exports">导出</el-button>
            </el-form-item>
            <el-form-item style="float: right;padding-right: 50px">
                <el-radio-group @change="show = !show" v-model="radio" size="small">
                    <el-radio-button label="图标"></el-radio-button>
                    <el-radio-button label="列表"></el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div v-if="show == false" class="big_box">
            <div v-for="(item,index) in tableData" @click="openLoak(item)" :key="index" class="box">
                <img :src="item.faceUrl[0]" />
                <div style="display: flex;justify-content: space-between;align-items: center;padding-right: 10px">
                    <h5 v-text="item.gender+','+item.ageGroup"></h5>
                    <span v-if="item.stranger_status == 0">未处理</span>
                    <span style="color: #409EFF;" v-if="item.stranger_status == 1">已处理</span>
                    <span v-if="item.stranger_status == 2">已忽略</span>
                </div>
                <p v-text="item.faceTime"></p>
            </div>
        </div>
        <el-table v-if="show == true"
                  :data="tableData"
                  border
                  stripe
                  header-row-class-name="headerRow"
                  style="width: 100%">
            <el-table-column
                    align="center"
                    prop="faceTime"
                    label="抓拍时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="cameraName"
                    label="抓拍点">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.stranger_status == 0">未处理</span>
                    <el-button v-if="scope.row.stranger_status==1" @click="openLoak(scope.row)" type="text" size="small">已处理</el-button>
                    <span v-if="scope.row.stranger_status == 2">已忽略</span>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="openLoak(scope.row)" type="text" size="small">详情</el-button>
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
        <el-dialog @closed="handleClose" v-if="list" title="识别详情" :visible.sync="dialogFormVisible">
            <el-tabs v-model="activeName">
                <el-tab-pane label="识别信息" name="first">
                    <div style="display: flex;justify-content: space-around">
                        <ul class="message">
                            <li>抓拍时间：{{list.faceTime}}</li>
                            <li>抓拍点：{{list.cameraName}}</li>
                            <li>年龄段：{{list.ageGroup}}</li>
                            <li>性别：{{list.gender}}</li>
                            <li>是否戴眼镜：{{list.glass}}</li>
                        </ul>
                        <div class="demo-image__preview">
                            <el-image
                                    style="width: 300px; height: 250px;"
                                    :src="list.faceUrl[0]"
                                    fit="contain"
                                    :preview-src-list="list.faceUrl">
                            </el-image>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抓拍原图" name="second">
                    <div class="demo-image__preview">
                        <el-image
                                style="width: 300px; height: 250px;margin: 0 auto;display: block"
                                :src="list.bkgUrl[0]"
                                fit="contain"
                                :preview-src-list="list.bkgUrl">
                        </el-image>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="上报信息" name="third">
                    <el-form :model="form" :rules="rules" ref="form">
                        <el-form-item label="上报标题:" prop="examine_title" :label-width="formLabelWidth">
                            <el-input style="width: 80%" v-model="form.examine_title" placeholder="请输入标题" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="上报内容:" prop="examine_content" :label-width="formLabelWidth">
                            <textarea  placeholder="请输入上报内容" id="demo" v-html="form.examine_content" style="display: none;"></textarea>
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
                            <el-button type="primary" @click="onSubmit('form')">上报</el-button>
                            <el-button @click="dialogFormVisible = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,RadioGroup,RadioButton,
        DatePicker,Table,TableColumn,Pagination,Dialog,
        Tabs,TabPane,Input,Upload,Message,Image} from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    var layedit,index;
    export default {
        name:'Alert_monitor',
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [RadioGroup.name]:RadioGroup,
            [RadioButton.name]:RadioButton,
            [DatePicker.name]:DatePicker,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [Pagination.name]:Pagination,
            [Dialog.name]:Dialog,
            [Tabs.name]:Tabs,
            [TabPane.name]:TabPane,
            [Input.name]:Input,
            [Upload.name]:Upload,
            [Message.name]:Message,
            [Image.name]:Image,
        },
        data(){
            return{
                url:this.$store.state.route.http,
                option:[],
                formInline: {
                    encodeDevIndexCode:'',
                    date:'',
                    ageGroup: '',
                    gender: '',
                    glass: '',
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
                formLabelWidth: '100px',
                radio: '图标',
                show:false,
                tableData: [],
                currentPage: 1,
                total:0,
                page:1,
                paginate:10,
                paginates:10,
                dialogFormVisible:false,
                activeName: 'first',
                list:'',
                form: {
                    examine_title: '',
                    examine_content: '',
                    examine_img: [],
                },
                rules: {
                    examine_title: [
                        { required: true, message: '上报标题不能为空', trigger: 'blur' },
                    ],
                    examine_content: [
                        { required: true, message: '上报内容不能为空', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            this.getList();
            this.getAddress();
        },
        methods: {
            search(){
                this.page = 1;
                this.getList()
            },
            getList(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.date !== null){
                    timeStart = this.formInline.date[0];
                    timeEnd = this.formInline.date[1];
                }
                let params ={'uid':this.$store.state.user.uid,'page':this.page,'paginate':this.paginate,
                'encodeDevIndexCode':this.formInline.encodeDevIndexCode,
                'start_time':timeStart,
                'end_time':timeEnd,
                'ageGroup':this.formInline.ageGroup,
                'gender':this.formInline.gender,
                'glass':this.formInline.glass,
                };
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/getStrangerAlarm',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            exports(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.date !== null){
                    timeStart = this.formInline.date[0];
                    timeEnd = this.formInline.date[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                'encodeDevIndexCode':this.formInline.encodeDevIndexCode,
                'start_time':timeStart,
                'end_time':timeEnd,
                'ageGroup':this.formInline.ageGroup,
                'gender':this.formInline.gender,
                'glass':this.formInline.glass,
                };
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/Excel/out_strangerAlarm',params).then((res) => {
                    window.location.href=res;
                })
            },
            getAddress(){
                let params ={'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/getSchoolTake',params).then((res) => {
                    this.option = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                })
            },
            openLoak(res){
                this.list = res;
                this.form.examine_title = res.examine_title;
                this.form.examine_content = res.examine_content;
                this.$nextTick(()=>{this.ds(res.examine_content)});
                if(this.$refs['my-upload'] != undefined){
                    this.$refs['my-upload'].clearFiles();
                }
                this.dialogFormVisible = true;
            },
            handleClose(){
                this.$refs.form.resetFields();
            },
            onSubmit(formName) {
                this.form.examine_content = layedit.getContent(index);
                if(this.form.examine_content == "")
                {
                    Message.error("请输入上传内容");
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.examine_img = String(this.form.examine_img);
                        let arr = {'uid':this.$store.state.user.uid,'id':this.list.id};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/statistics/api_index/upStrangerAlarm',params).then((res) => {
                            Message.success("上报成功");
                            this.getList();
                            this.dialogFormVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
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
            removeFile(file, fileList){
                for (let i = 0; i <this.form.examine_img.length ; i++) {
                    if(this.form.examine_img[i] == file.response.data.filepath){
                        this.form.examine_img.splice(i,1);
                    }
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.examine_img.push(res.data.filepath);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJPG) {
                    Message.error('附件只能上传jpg和png格式的图片!');
                }
                return isJPG;
            },
            ds(res){
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // exports(){
            //     let xlsCell = [["id","ID"],["gender","性别"],["ageGroup","年龄段"],["glass","是否戴眼镜"],["cameraName","抓拍地点"],["bkgUrl","背景图"],
            //         ["faceUrl","抓拍图片"],["faceTime","抓拍时间"],["stranger_status","当前状态"]];
            //     let xlsData = [];
            //     for (let i = 0; i <this.tableData.length ; i++) {
            //         var text = '已处理';
            //         if(this.tableData[i].stranger_status==0){
            //             text = '未处理';
            //         }
            //         xlsData.push({
            //             'id': this.tableData[i].id,
            //             'gender': this.tableData[i].gender,
            //             'ageGroup': this.tableData[i].ageGroup,
            //             'glass': this.tableData[i].glass,
            //             'cameraName': this.tableData[i].cameraName,
            //             'bkgUrl': String(this.tableData[i].bkgUrl),
            //             'faceUrl': String(this.tableData[i].faceUrl),
            //             'faceTime': this.tableData[i].faceTime,
            //             'stranger_status': text,
            //         })
            //     }
            //     let params ={'xlsName':' 陌生人脸抓拍清单','isImg':'5,6','out_img':'5,6','xlsCell':xlsCell,'xlsData':xlsData,};
            //     params = this.$secret_key.func(this.$store.state.on_off, params);
            //     this.$https.fetchPost('/plugin/statistics/api_index/out_excel',params).then((res) => {
            //         window.location.href=res;
            //     })
            // },
        },
    }
</script>
<style scoped lang="less">
    .demo-form-inline{
        background: #fff;
    }
    #form .el-form-item{
        /*width: 25vw;*/
        margin: 10px 0;
    }
    .big_box{
        clear: both;
        width: 100%;
        padding: 20px 50px;
        background: #fff;
    }
    .box{
        display: inline-block;
        width: 130px;
        height: 180px;
        background: #f9f9f9;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        margin-right: 15px;
        margin-bottom: 15px;
        transition: .3s;
    }
    .box:hover{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .box img{
        width: 100%;
        height: 130px;
    }
    .box h5{
        text-indent: 10px;
        line-height: 25px;
    }
    .box p{
        font-size: 12px;
        text-indent: 10px;
        color: #999;
    }
    .el-dialog__wrapper /deep/ .el-dialog__body{
        padding-top: 0;
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
    .message li{
        line-height: 30px;
    }
    .el-image /deep/ .el-icon-circle-close{
        color: #fff;
    }
</style>

