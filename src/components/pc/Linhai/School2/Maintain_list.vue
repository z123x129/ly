<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="姓名:">
                    <el-input size="small" v-model="formInline.nickname"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                    <el-input size="small" v-model="formInline.id_card"></el-input>
            </el-form-item>
            <el-form-item label="健康证号:">
                    <el-input size="small" v-model="formInline.health_id_card"></el-input>
            </el-form-item>
            <el-form-item label="到期时间:">
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
                <el-button size="small" type="primary" @click="search">搜索</el-button>
                <el-button size="small" type="primary" @click="showAdd">添加新人员</el-button>
                <el-button size="small" type="primary" @click="exports">导出excel</el-button>
            </el-form-item>
        </el-form>
        <div style="width: 100%;height: 16px;background: #f0f2f5"></div>
        <el-table
                border
                stripe
                header-row-class-name="headerRow"
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="MIID"
                    label="ID">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="nickname"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="company"
                    label="单位名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="id_card"
                    label="身份证号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="health_id_card"
                    label="健康证号">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="人脸照片"
                    min-width="80">
                <template slot-scope="scope">
                    <el-image
                            style="width: 60px; height: 60px;"
                            :src="scope.row.faceThumbPath[0]"
                            :preview-src-list="scope.row.faceThumbPath">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="健康证照片"
                    min-width="80">
                <template slot-scope="scope">
                    <el-image
                            style="width: 60px; height: 60px"
                            :src="scope.row.healthCardPath[0]"
                            :preview-src-list="scope.row.healthCardPath">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="health_endtime"
                    label="健康证到期时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="member_type"
                    label="人员类别">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="timeStr"
                    label="添加时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="showDialog(scope.row)" type="text" size="small">编辑</el-button>
                    <el-popconfirm
                            title="确定删除该人员吗？"
                            @onConfirm="delList(scope.row.MIID)"
                    >
                        <el-button style="margin-left: 10px" slot="reference" type="text" size="mini">删除</el-button>
                    </el-popconfirm>
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
        <el-dialog :title="type==1?'添加人员' : '编辑人员' " :visible.sync="dialogFormVisible" @closed="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="姓名:" prop="nickname" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.nickname" placeholder="请输入姓名" autocomplete="off"></el-input>
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
                    <el-input v-if="type == 1" style="width: 80%" size="small" v-model="form.id_card" placeholder="请输入身份证" autocomplete="off"></el-input>
                    <el-input v-else-if="type == 2" style="width: 80%" size="small" v-model="form.id_card" disabled="disabled" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="健康证号:" prop="health_id_card" :label-width="formLabelWidth">
                    <el-input style="width: 80%" size="small" v-model="form.health_id_card" placeholder="请输入健康证" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="人脸照片:" prop="face" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action='url+"/public/plugin/file_manage/api_index/upload_img"'
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.face" :src="form.face" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="健康证照片:" prop="health" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action='url+"/public/plugin/file_manage/api_index/upload_img"'
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="form.health" :src="form.health" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="健康证到期时间:" prop="health_endtime" :label-width="formLabelWidth">
                    <el-date-picker
                            size="small"
                            v-model="form.health_endtime"
                            type="date"
                            value-format="yyyy-MM-dd"
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
    import { Form,FormItem,Select,Option,Button,Table,TableColumn,DatePicker,Image,Pagination,Input,Dialog,Upload,Message,Popconfirm } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        name:'Maintain_list',
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
            [Popconfirm.name]:Popconfirm,
        },
        data(){
            return{
                url:this.$store.state.route.http,
                formInline: {
                    nickname: '',
                    id_card: '',
                    health_id_card:'',
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
                form: {
                    nickname: '',
                    member_type: '',
                    mobile: '',
                    id_card: '',
                    health_id_card: '',
                    face: '',
                    face_thumb: '',
                    health: '',
                    health_card: '',
                    health_endtime: '',
                },
                type: 1,
                formLabelWidth: '140px',
                rules: {
                    nickname: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
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
                    face: [
                        {required: true, message: '请上传人脸照片', trigger: 'blur'},
                    ],
                    health: [
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
            search(){
                this.page = 1;
                this.getList()
            },
            getList(){
                var time_start = '',time_end = '';
                if(this.formInline.timeStr){
                    time_start = this.formInline.timeStr[0];
                    time_end = this.formInline.timeStr[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'page':this.page,'paginate':this.paginate,
                    'nickname':this.formInline.nickname,
                    'id_card':this.formInline.id_card,
                    'health_id_card':this.formInline.health_id_card,
                    'time_start':time_start,
                    'time_end':time_end};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/health_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            exports(){
                var time_start = '',time_end = '';
                if(this.formInline.timeStr){
                    time_start = this.formInline.timeStr[0];
                    time_end = this.formInline.timeStr[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'nickname':this.formInline.nickname,
                    'id_card':this.formInline.id_card,
                    'health_id_card':this.formInline.health_id_card,
                    'time_start':time_start,
                    'time_end':time_end};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/out_health_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    window.location.href=res_data;
                })
            },
            delList(id){
                let params ={'id':id};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/del_health',params).then((res) => {
                    this.getList()
                })
            },
            showDialog(res){
                this.type = 2;
                this.form = this.deepClone(res);
                this.form.face = res.faceThumbPath;
                this.form.face_thumb = res.face_thumb;
                this.form.health = res.healthCardPath;
                this.form.health_card = res.health_card;
                this.dialogFormVisible = true;
            },
            deepClone(target) {
                //深拷贝
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
            showAdd(){
                this.type = 1;
                this.form = {
                    nickname: '',
                    member_type: '',
                    mobile: '',
                    id_card: '',
                    health_id_card: '',
                    face: '',
                    face_thumb: '',
                    health: '',
                    health_card: '',
                    health_endtime: '',
                };
                if(this.$refs.form != undefined){
                    this.$refs.form.resetFields();
                }
                this.dialogFormVisible = true;
            },
            handleClose(){
                this.$refs.form.resetFields();
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
            tableRowClassName({row, rowIndex}) {
                if (row.is_over === -1) {
                    return 'warning-row';
                } else if (row.is_over === 1) {
                    return 'jinggao-row';
                }
                return 'success-row';
            },
            handleAvatarSuccess(res, file) {
                this.form.face = res.data.fileurl;
                this.form.face_thumb = res.data.filepath;
                this.$forceUpdate();
            },
            handleAvatarSuccess2(res, file) {
                this.form.health = res.data.fileurl;
                this.form.health_card = res.data.filepath;
                this.$forceUpdate();
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
                        let arr = {'uid':this.$store.state.user.uid};
                        let params = Object.assign(this.form,arr);
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        this.$https.fetchPost('/plugin/school/api_index/add_health_person',params).then((res) => {
                            this.getList();
                            if(this.type == 1){
                                Message.success('添加成功');
                            }else{
                                Message.success('编辑成功');
                            }
                            this.form.face_thumb = '';
                            this.form.health_card = '';
                            this.dialogFormVisible = false;
                            this.$refs.form.resetFields();
                        })
                    } else {
                        return false;
                    }
                });
            },
            // exports(){
            //     let xlsCell = [["MIID","ID"],["nickname","姓名"],["company","单位名称"],["mobile","手机号"],
            //                   ["id_card","身份证号"],["health_id_card","健康证号"],["face_thumb","人脸照片"],
            //                   ["health_card","健康证照片"],["health_endtime","健康证到期时间"],["member_type","人员类型"],
            //                   ["timeStr","添加时间"]];
            //     let xlsData = [];
            //     for (let i = 0; i <this.tableData.length ; i++) {
            //         xlsData.push({
            //             'MIID': this.tableData[i].MIID,
            //             'nickname': this.tableData[i].nickname,
            //             'company': this.tableData[i].company,
            //             'mobile': this.tableData[i].mobile,
            //             'id_card': this.tableData[i].id_card,
            //             'health_id_card': this.tableData[i].health_id_card,
            //             'face_thumb': this.tableData[i].face_thumb,
            //             'health_card': this.tableData[i].health_card,
            //             'health_endtime': this.tableData[i].health_endtime,
            //             'member_type': this.tableData[i].member_type,
            //             'timeStr': this.tableData[i].timeStr,
            //         })
            //     }
            //     let params ={'xlsName':'健康证人员列表','isImg':'6,7','xlsCell':xlsCell,'xlsData':xlsData,};
            //     params = this.$secret_key.func(this.$store.state.on_off, params);
            //     this.$https.fetchPost('/plugin/school/api_index/out_excel',params).then((res) => {
            //         window.location.href=res;
            //     })
            // },
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
.el-table /deep/ .warning-row td:nth-child(9) {
    color: #F56C6C;
    background: rgba(245,108,108,0.35);
}
.el-table /deep/ .jinggao-row td:nth-child(9){
    color: #E6A23C;
    background: rgba(230,162,60,0.35);
}
.el-table /deep/ .success-row td:nth-child(9){
    color: #67C23A;
    background: rgba(103,194,58,0.35);
}
.el-image /deep/ .el-icon-circle-close{
    color: #fff;
}
</style>
