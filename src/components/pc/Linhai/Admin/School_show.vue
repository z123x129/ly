<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="健康证清单" name="first">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="选择区域:">
                        <el-select @change="getSchool" size="small" filterable clearable v-model="formInline.indexCode">
                            <el-option v-for="(item,index) in regions" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择学校:">
                        <el-select size="small" filterable clearable v-model="formInline.dir_id">
                            <el-option v-for="(item,index) in dir" :label="item.dirName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="健康证到期时间:">
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
                        <el-button size="small" type="primary" @click="exports">导出excel</el-button>
                    </el-form-item>
                </el-form>
                <div style="width: 100%;height: 16px;background: #f0f2f5"></div>
                <el-table
                        :data="tableData"
                        border
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
                            prop="name"
                            label="所属地区">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="dirName"
                            label="所属学校">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="mobile"
                            label="联系方式">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="人脸照片">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 35px; height: 35px"
                                    :src="scope.row.face_thumb[0]"
                                    :preview-src-list="scope.row.face_thumb">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="健康证照片">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 35px; height: 35px"
                                    :src="scope.row.health_card[0]"
                                    :preview-src-list="scope.row.health_card">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="member_type"
                            label="人员类别">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="health_endtime"
                            label="健康证到期时间">
                    </el-table-column>
                </el-table>
                <div style="padding: 15px;display: flex;justify-content: flex-end;background-color:#fff">
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
            </el-tab-pane>
            <el-tab-pane label="抽查违规清单" name="second">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="选择区域:">
                        <el-select @change="getSchool2" size="small" filterable clearable v-model="formInline2.indexCode">
                            <el-option v-for="(item,index) in regions2" :label="item.name" :value="item.indexCode" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择学校:">
                        <el-select @change="getWgy" size="small" filterable clearable v-model="formInline2.dir_id">
                            <el-option v-for="(item,index) in dir2" :label="item.dirName" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择网格员:">
                        <el-select size="small" v-model="formInline2.user" placeholder="请优先选择学校">
                            <el-option v-for="(item,index) in user" :label="item.user_login" :value="item.user_id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-top: -2px">
                        <el-button size="small" type="primary" @click="search2">搜索</el-button>
                    </el-form-item>
                </el-form>
                <div style="width: 100%;height: 16px;background: #f0f2f5"></div>
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
                            prop="user_login"
                            label="网格员">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="name"
                            label="地区">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="dirName"
                            label="学校">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="violation"
                            label="违规选项">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="图片信息">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.enclosure[0]"
                                    :preview-src-list="scope.row.enclosure">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="time"
                            label="日期">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="上报信息">
                        <template slot-scope="scope">
                            <el-button @click="look(scope.row.title,scope.row.content)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="处理结果">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status==1" @click="look('处理结果',scope.row.describe,scope.row.re_path)" type="text" size="small">已处理</el-button>
                            <span v-else>未处理</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="padding: 15px;display: flex;justify-content: flex-end;">
                    <el-pagination
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="currentPage2"
                            :page-sizes="[paginates, paginates*2, paginates*3, paginates*4]"
                            :page-size="paginate2"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total2">
                    </el-pagination>
                </div>
                <el-dialog
                        :title=title
                        :visible.sync="dialogFormVisible">
                    <span v-html="content"></span>
                    <div class="demo-image__preview">
                        <el-image v-if="img"
                                style="width: 100px; height: 100px"
                                :src="img[0]"
                                :preview-src-list="img">
                        </el-image>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,TabPane,Table,TableColumn,Image,Pagination,Input,Dialog } from 'element-ui'
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
        },
        data(){
            return{
                activeName: 'first',
                formInline: {
                    indexCode: '',
                    dir_id: '',
                    timeStr:'',
                },
                formInline2: {
                    indexCode: '',
                    dir_id: '',
                    user:'',
                },
                regions:'',
                regions2:'',
                dir:'',
                dir2:'',
                dir_2:'',
                user:'',
                tableData: [],
                tableData2: [],
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
                title: '',
                content: '',
                img:'',
                dialogFormVisible:false,
                currentPage: 1,
                total:0,
                page:1,
                currentPage2: 1,
                total2:0,
                page2:1,
                paginate:10,
                paginate2:10,
                paginates:10,
            }
        },
        mounted(){
            this.getList();
            this.getList2();
            this.getAddress();
        },
        methods: {
            search(){
                this.page = 1;
                this.getList();
            },
            search2(){
                this.page2 = 1;
                this.getList2();
            },
            getList(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.timeStr !== null){
                    timeStart = this.formInline.timeStr[0];
                    timeEnd = this.formInline.timeStr[1];
                }
                let params ={'uid':this.$store.state.user.uid,'page':this.page,'paginate':this.paginate,
                    'indexCode':this.formInline.indexCode,'dir_id':this.formInline.dir_id,
                    'start_time':timeStart,'end_time':timeEnd};
                this.$https.fetchPost('/plugin/statistics/api_index/schoolList',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                })
            },
            exports(){
                var timeStart = '',timeEnd = '';
                if(this.formInline.timeStr !== null){
                    timeStart = this.formInline.timeStr[0];
                    timeEnd = this.formInline.timeStr[1];
                }
                let params ={'uid':this.$store.state.user.uid,
                    'indexCode':this.formInline.indexCode,'dir_id':this.formInline.dir_id,
                    'start_time':timeStart,'end_time':timeEnd};
                this.$https.fetchPost('/plugin/statistics/Excel/out_schoolList',params).then((res) => {
                    window.location.href=res;
                })
            },
            getList2(){
                let params ={'uid':this.$store.state.user.uid,'page':this.page2,'paginate':this.paginate2,
                    'indexCode':this.formInline2.indexCode,'dir_id':this.formInline2.dir_id};
                this.$https.fetchPost('/plugin/statistics/api_index/illegalSchool',params).then((res) => {
                    this.tableData2 = res.data;
                    this.currentPage2 = res.current_page;
                    this.total2 = res.total;
                })
            },
            getAddress(){
                let params ={};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    this.regions2 = res.regions;
                    this.dir = res.dir;
                    this.dir2 = res.dir;
                    this.dir_2 = res.dir;
                })
            },
            getSchool(){
                this.dir = this.dir_2;
                this.formInline.dir_id = '';
                if(this.formInline.indexCode){
                    let params ={'indexCode':this.formInline.indexCode};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchool',params).then((res) => {
                        this.dir = res;
                    })
                }
            },
            getSchool2(){
                this.dir2 = this.dir_2;
                this.formInline2.dir_id = '';
                if(this.formInline2.indexCode){
                    let params ={'indexCode':this.formInline2.indexCode};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchool',params).then((res) => {
                        this.dir2 = res;
                    })
                }
            },
            getWgy(){
                this.user = '';
                this.formInline2.user = '';
                if(this.formInline2.dir_id){
                    let params ={'dir_id':this.formInline2.dir_id};
                    this.$https.fetchPost('/plugin/statistics/api_index/getGridUser',params).then((res) => {
                        this.user = res;
                    })
                }
            },
            // exports(){
            //     let xlsCell = [["MIID","ID"],["nickname","姓名"],["name","所属地区"],["dirName","所属学校"],["mobile","联系方式"],
            //         ["face_thumb","人脸照片"],["health_card","健康证照片"],["member_type","人员类别"],["health_endtime","健康证到期时间"]];
            //     let xlsData = [];
            //     for (let i = 0; i <this.tableData.length ; i++) {
            //         xlsData.push({
            //             'MIID': this.tableData[i].MIID,
            //             'nickname': this.tableData[i].nickname,
            //             'name': this.tableData[i].name,
            //             'dirName': this.tableData[i].dirName,
            //             'mobile': this.tableData[i].mobile,
            //             'face_thumb': String(this.tableData[i].face_thumb),
            //             'health_card': String(this.tableData[i].health_card),
            //             'member_type': this.tableData[i].member_type,
            //             'health_endtime': this.tableData[i].health_endtime,
            //         })
            //     }
            //     let params ={'xlsName':'学校数据列表','isImg':'5,6','xlsCell':xlsCell,'xlsData':xlsData,};
            //     params = this.$secret_key.func(this.$store.state.on_off, params);
            //     this.$https.fetchPost('/plugin/school/api_index/out_excel',params).then((res) => {
            //         window.location.href=res;
            //     })
            // },
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                this.getList();
            },
            handleCurrentChange(val) {//分页器
                this.page = val;
                this.getList();
            },
            handleSizeChange2(val) {//分页器
                this.paginate2 = val;
                this.page2 = 1;
                this.getList2();
            },
            handleCurrentChange2(val) {//分页器
                this.page2 = val;
                this.getList2();
            },
            tableRowClassName({row, rowIndex}) {
                if (row.is_over === -1) {
                    return 'warning-row';
                } else if (row.is_over === 1) {
                    return 'jinggao-row';
                }
                return 'success-row';
            },
            look(title,content,img){
                this.title = title;
                this.content = content;
                if(img){
                    this.img = img;
                }else{
                    this.img = '';
                }
                this.dialogFormVisible = true;
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
.el-tabs /deep/ .el-tabs__header{
    margin: 0 1rem 1rem;
}
</style>
