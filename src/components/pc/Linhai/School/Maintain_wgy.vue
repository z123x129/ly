<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择学校:">
                <el-select clearable size="small" v-model="formInline.school_id" placeholder="请选择">
                    <el-option v-for="(item,index) in option" :key="index" :label="item.dirName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
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
                <el-button size="small" type="primary" @click="seach">搜索</el-button>
                <el-button size="small" type="primary" @click="exports">导出excel</el-button>
            </el-form-item>
        </el-form>
        <div style="width: 100%;height: 16px;background: #f0f2f5"></div>
        <el-table
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
                    school_id:'',
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
                type: 1,
                formLabelWidth: '140px',
                option:[]
            }
        },
        mounted(){
            this.getList();
            this.getSchool();
        },
        methods: {
            seach(){
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
                    'time_end':time_end,
                    'school_id':this.formInline.school_id,};
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
                    'time_end':time_end,
                    'school_id':this.formInline.school_id,};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/out_health_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    window.location.href=res_data;
                })
            },
            getSchool(){ //获取学校列表
                let params ={'user_id':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/schoolList',params).then((res) => {
                   this.option = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                })
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
