<template>
    <div>
        <el-tabs style="padding: 0 10px" v-model="activeName">
            <el-tab-pane label="被抓拍到的重点人员" name="first">
                <el-form :inline="true" :model="formInline2" class="demo-form-inline">
                    <el-form-item label="选择区域:">
                        <el-select @change="getSchool" size="small" filterable clearable v-model="formInline2.indexCode">
                            <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择学校:">
                        <el-select size="small" filterable clearable v-model="formInline2.dir_id">
                            <el-option v-for="(item,index) in dir" :label="item.dirName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抓拍时间段:">
                        <el-date-picker
                                v-model="formInline2.value"
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
                        <el-button size="small" type="primary" @click="getList2">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                        :data="tableData2"
                        border
                        style="width: 100%">
                    <el-table-column
                            align="center"
                            prop="id"
                            label="ID">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="user_name"
                            label="识别人姓名">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="name"
                            label="抓拍区域">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="dirName"
                            label="抓拍学校">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="人脸图">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.face_img[0]"
                                    :preview-src-list="scope.row.face_img">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="抓拍图片">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.faceUrl[0]"
                                    :preview-src-list="scope.row.faceUrl">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="faceTime"
                            label="抓拍时间">
                    </el-table-column>
                </el-table>
                <div style="padding: 15px;display: flex;justify-content: flex-end;">
                    <el-pagination
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="currentPage2"
                            :page-sizes="[paginates, paginates*2, paginates*3, paginates*4]"
                            :page-size="paginate"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total2">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="重点人员列表" name="second">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="姓名:">
                        <el-input size="small" v-model="formInline.user_name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证:">
                        <el-input size="small" v-model="formInline.id_card"></el-input>
                    </el-form-item>
                    <el-form-item label="添加时间:">
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
                        <el-button size="small" type="primary" @click="showAdd">添加重点人员</el-button>
                        <el-button size="small" type="primary" @click="delAll">批量删除</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%"
                        @selection-change="getSelect">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="id"
                            label="ID">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="user_name"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="id_card"
                            label="身份证号">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="人脸图">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.face_img[0]"
                                    :preview-src-list="scope.row.face_img">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="create_time"
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
                                    @onConfirm="delList(scope.row.id)"
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
                        <el-form-item label="姓名:" prop="user_name" :label-width="formLabelWidth">
                            <el-input size="small" style="width: 80%" v-model="form.user_name" placeholder="请输入姓名" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:" prop="id_card" :label-width="formLabelWidth">
                            <el-input size="small" style="width: 80%" v-model="form.id_card" placeholder="请输入身份证号" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="上传人物照片:" prop="face_img" :label-width="formLabelWidth">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/public/plugin/file_manage/api_index/upload_img"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="form.face_img" :src="form.face_img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,Popconfirm,
        TabPane,Table,TableColumn,Image,Pagination,Input,Dialog,Upload,Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
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
        },
        data(){
            return{
                activeName: 'first',
                formInline: {
                    user_name: '',
                    id_card: '',
                    timeStr:'',
                },
                formInline2: {
                    indexCode: '',
                    dir_id: '',
                    value: '',
                },
                regions:'',
                dir:'',
                dir_2:'',
                tableData: [],
                tableData2: [],
                currentPage: 1,
                currentPage2: 1,
                total:0,
                total2:0,
                page:1,
                page2:1,
                paginate:10,
                paginate2:10,
                paginates:10,
                dialogFormVisible: false,
                form: {
                    user_name: '',
                    id_card: '',
                    face_img: '',
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
                formLabelWidth: '120px',
                rules: {
                    user_name: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                    ],
                    id_card: [
                        {required: true, message: '身份证号不能为空', trigger: 'blur'},
                    ],
                    face_img: [
                        {required: true, message: '请上传人物照片', trigger: 'blur'},
                    ],
                },
                type: 1,
                ids:[],
            }
        },
        mounted(){
            this.getList2();
            this.getList();
            this.getAddress();
        },
        methods: {
            getList(){
                var time_start = '',time_end = '';
                if(this.formInline.timeStr){
                    time_start = this.formInline.timeStr[0];
                    time_end = this.formInline.timeStr[1];
                }
                let params ={'page':this.page,'paginate':this.paginate,
                    'user_name':this.formInline.user_name,
                    'id_card':this.formInline.id_card,
                    'start_time':time_start,
                    'end_time':time_end};
                this.$https.fetchPost('/plugin/statistics/api_index/manageEmphasis',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                })
            },
            getList2(){
                var time_start = '',time_end = '';
                if(this.formInline2.value){
                    time_start = this.formInline2.value[0];
                    time_end = this.formInline2.value[1];
                }
                let params ={'page':this.page2,'paginate':this.paginate2,
                    'indexCode':this.formInline2.indexCode,
                    'dir_id':this.formInline2.dir_id,
                    'start_time':time_start,
                    'end_time':time_end};
                this.$https.fetchPost('/plugin/statistics/api_index/comparisonEmphasis',params).then((res) => {
                    this.tableData2 = res.data;
                    this.currentPage2 = res.current_page;
                    this.total2 = res.total;
                })
            },
            getSelect(val) {
                this.ids = [];
                for (var i = 0; i < val.length ; i++) {
                    this.ids.push(val[i].id)
                }
            },
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                this.getList();
            },
            handleSizeChange2(val) {//分页器
                this.paginate2 = val;
                this.page2 = 1;
                this.getList2();
            },
            handleCurrentChange(val) {//分页器
                this.page = val;
                this.getList();
            },
            handleCurrentChange2(val) {//分页器
                this.page2 = val;
                this.getList2();
            },
            handleAvatarSuccess(res, file) {
                this.form.face_img = res.data.fileurl;
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
                        let params = this.form;
                        params = this.$secret_key.func(this.$store.state.on_off, params);
                        var add = '';
                        if(this.type == 1){
                            add = '/plugin/statistics/api_index/addEmphasisInfo'
                        }else{
                            add = '/plugin/statistics/api_index/updateEmphasis'
                        }
                        this.$https.fetchPost(add,params).then((res) => {
                            this.getList();
                            if(this.type == 1){
                                Message.success('添加成功');
                            }else{
                                Message.success('编辑成功');
                            }
                            this.form.face_img = '';
                            this.dialogFormVisible = false;
                            this.$refs.form.resetFields();
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleClose(){
                this.$refs.form.resetFields();
            },
            showAdd(){
                this.type = 1;
                this.form = {
                    user_name: '',
                    id_card: '',
                    face_img: '',
                };
                if(this.$refs.form != undefined){
                    this.$refs.form.resetFields();
                }
                this.dialogFormVisible = true;
            },
            showDialog(res){
                this.type = 2;
                this.form = this.deepClone(res);
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
            delList(id){
                let params ={'id':id};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/deleteEmphasis',params).then((res) => {
                    this.getList()
                })
            },
            delAll(){
                if(this.ids.length == 0){
                    Message.error('请选择删除项');
                    return false;
                }
                let params ={'arr':this.ids};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/deleteEmphasisArr',params).then((res) => {
                    this.getList()
                })
            },
            getAddress(){
                let params ={};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    this.dir = res.dir;
                    this.dir_2 = res.dir;
                })
            },
            getSchool(){
                this.dir = this.dir_2;
                this.formInline2.dir_id = '';
                if(this.formInline2.indexCode){
                    let params ={'indexCode':this.formInline2.indexCode};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchool',params).then((res) => {
                        this.dir = res;
                    })
                }
            },
        },
    }
</script>
<style scoped lang="less">
.demo-form-inline{
    padding: 0 10px;
}
.el-form-item{
    margin-top: 0;
    margin-bottom: 10px;
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
.el-image /deep/ .el-icon-circle-close{
    color: #fff;
}
</style>
