<template>
    <div id=i1>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="违规时间:">
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
            <el-form-item label="违规事件:" prop="violation">
                <el-select style="width: 80%" size="small" v-model="formInline.violation" placeholder="请选择">
                    <el-option label="超市有熟食" value="超市有熟食"></el-option>
                    <el-option label="健康证过期" value="健康证过期"></el-option>
                    <el-option label="后厨不规范" value="后厨不规范"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="处理状态:" prop="violation">
                <el-select style="width: 80%" size="small" v-model="formInline.status" placeholder="请选择">
                    <el-option label="未处理" value="0"></el-option>
                    <el-option label="已处理" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -2px">
                <el-button size="small" type="primary" @click="getList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="单位名称">
                            <span>{{ props.row.company }}</span>
                        </el-form-item>
                        <el-form-item label="学校地址">
                            <span>{{ props.row.street }}</span>
                        </el-form-item>
                        <el-form-item label="上报标题">
                            <span>{{ props.row.title }}</span>
                        </el-form-item>
                        <el-form-item label="上报内容">
                            <el-button @click="look(props.row.title,props.row.content)" type="text" size="small">查看</el-button>
                        </el-form-item>
                        <el-form-item label="附件">
                            <el-badge v-if="props.row.path.length>1" :value="props.row.path.length" class="item">
                                <el-image
                                        v-if="props.row.path.length>0"
                                        style="width: 100px; height: 100px"
                                        :src="props.row.path[0]"
                                        :preview-src-list="props.row.path">
                                </el-image>
                            </el-badge>
                            <el-image
                                    v-else-if="props.row.path.length == 1"
                                    style="width: 100px; height: 100px"
                                    :src="props.row.path[0]"
                                    :preview-src-list="props.row.path">
                            </el-image>
                            <span v-else>无</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="id"
                    label="违规序号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="违规学校名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="timeStr"
                    label="违规时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="violation"
                    label="违规事件">
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
                    label="处理状态">
                <template slot-scope="props">
                    <span v-if="props.row.status == 0">未处理</span>
                    <span v-else-if="props.row.status == 1">已处理</span>
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
        <el-dialog
                :title=title
                :visible.sync="dialogFormVisible"
                append-to-body>
            <span v-html="content"></span>
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Table,TableColumn,DatePicker,Pagination,Button,Image,Badge,Dialog } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        name:'Violation_list',
        components:{
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [DatePicker.name]:DatePicker,
            [Pagination.name]:Pagination,
            [Button.name]:Button,
            [Image.name]:Image,
            [Badge.name]:Badge,
            [Dialog.name]:Dialog,
        },
        props:['id'],
        data(){
            return{
                formInline: {
                    timeStr:'',
                    violation:'',
                    status:'',
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
                paginate:10,
                paginates:5,
                title: '',
                content: '',
                dialogFormVisible: false,
            }
        },
        watch:{
            'id'(){
                this.getList();
            }
        },
        methods: {
            getList(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.timeStr !== null){
                    timeStart = this.formInline.timeStr[0];
                    timeEnd = this.formInline.timeStr[1];
                }
                let params ={'id':this.id,
                    'page':this.page,'paginate':this.paginate,
                    'timeStart':timeStart,
                    'timeEnd':timeEnd,
                    'violation':this.formInline.violation,
                    'status':this.formInline.status};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/report_list',params).then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.tableData = res_data.data;
                    this.currentPage = res_data.current_page;
                    this.total = res_data.total;
                })
            },
            look(title,content){
                this.title = title;
                this.content = content;
                this.dialogFormVisible = true;
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
    .el-dialog__wrapper /deep/ .el-dialog{
        overflow: hidden;
    }
    .el-table /deep/ .demo-table-expand {
        font-size: 0;
    }
    .el-table /deep/ .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .el-table /deep/ .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
    .el-image /deep/ .el-icon-circle-close{
        color: #fff;
    }
</style>
