<template>
    <div class="body">
        <div class="header">
            <div style="display: flex;justify-content: space-between;padding-right: 80px;padding-top: 10px">
                <p>后厨违规进入数量图表</p>
                <div style="display: flex;justify-content: space-between;">
                    <el-select style="margin-right: 10px" @change="getData" size="small" v-model="code" placeholder="请选择">
                        <el-option label="今天" value="day"></el-option>
                        <el-option label="一周" value="week"></el-option>
                        <el-option label="当月" value="month"></el-option>
                    </el-select>
                    <el-radio-group @change="getData" v-model="num" size="small">
                        <el-radio label="10" border>前10</el-radio>
                        <el-radio label="20" border>前20</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <Dataset @getDataset="getDataset" ref="Dataset" :data="data" style="width: 95%;height: 95%"></Dataset>
        </div>
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
            <el-form-item label="选择时间:">
                <el-date-picker
                        v-model="formInline.value"
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
            <el-form-item>
                <el-button size="small" type="primary" @click="search">搜索</el-button>
                <el-button size="small" type="primary" @click="exports">导出excel</el-button>
<!--                <el-button size="small" type="primary">生成报表至网格员</el-button>-->
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                stripe
                header-row-class-name="headerRow"
                style="width: 100%;">
            <el-table-column
                    align="center"
                    prop="id"
                    label="ID"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="抓拍区域"
                    min-width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="cameraName"
                    label="抓拍地点"
                    min-width="150">
            </el-table-column>
<!--            <el-table-column-->
<!--                    align="center"-->
<!--                    label="背景图">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-image-->
<!--                            style="width: 100px; height: 100px"-->
<!--                            :src="scope.row.bkgUrl[0]"-->
<!--                            :preview-src-list="scope.row.bkgUrl">-->
<!--                    </el-image>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column
                    align="center"
                    label="抓拍图片"
                    width="100">
                <template slot-scope="scope">
                    <el-image
                            style="width: 35px; height: 35px"
                            :src="scope.row.faceUrl[0]"
                            :preview-src-list="scope.row.faceUrl">
                    </el-image>
                </template>
            </el-table-column>
<!--            <el-table-column-->
<!--                    align="center"-->
<!--                    prop="gender"-->
<!--                    label="性别"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    align="center"-->
<!--                    prop="ageGroup"-->
<!--                    label="年龄段"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    align="center"-->
<!--                    prop="glass"-->
<!--                    label="是否戴眼镜"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
            <el-table-column
                    align="center"
                    prop="faceTime"
                    label="抓拍时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="stranger_status"
                    label="当前状态"
                    width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.stranger_status==0">未处理</span>
                    <span v-if="scope.row.stranger_status==1">已处理</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.stranger_status==0" @click="imgshowBtn(scope.row.bkgUrl)" type="text" size="small">查看原图</el-button>
                    <el-button v-if="scope.row.stranger_status==0" @click="remind(scope.row.id)" type="text" size="small">提醒</el-button>
                    <el-popconfirm v-if="scope.row.stranger_status==0"
                            title="是否确定忽略？"
                            @onConfirm="delList(scope.row.id)"
                    >
                        <el-button style="margin-left: 10px" slot="reference" type="text" size="small">忽略</el-button>
                    </el-popconfirm>

                    <el-button v-if="scope.row.stranger_status==1" @click="look(scope.row.id)" type="text" size="small">查看反馈</el-button>
                </template>
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
        <el-dialog
                :title=content.examine_title
                :visible.sync="dialogFormVisible">
            <span v-html="content.examine_content"></span>
            <div class="demo-image__preview">
                <el-image v-if="content.examine_img"
                          style="width: 100px; height: 100px"
                          :src="content.examine_img[0]"
                          :preview-src-list="content.examine_img">
                </el-image>
            </div>
        </el-dialog>
        <el-dialog width="80%" title="抓拍原图" :visible.sync="imgshow">
            <img width="100%" :src="img" />
        </el-dialog>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Table,TableColumn,Image,Pagination,
        Message,Popconfirm,RadioGroup,Radio,Dialog } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Dataset:()=>import('../Linhai_dataset'),
            [Form.name]:Form,
            [FormItem.name]:FormItem,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [DatePicker.name]:DatePicker,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [Image.name]:Image,
            [Pagination.name]:Pagination,
            [Message.name]:Message,
            [Popconfirm.name]:Popconfirm,
            [RadioGroup.name]:RadioGroup,
            [Radio.name]:Radio,
            [Dialog.name]:Dialog,
        },
        data(){
            return{
                imgshow:false,
                img:'',
                formInline: {
                    indexCode: '',
                    dir_id: '',
                    value: '',
                },
                num: '10',
                code:'day',
                regions:'',
                dir:'',
                dir_2:'',
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
                paginates:10,
                data:[],
                dialogFormVisible:false,
                content:'',
            }
        },
        mounted(){
            this.getData();
            this.getList();
            this.getAddress();
        },
        methods: {
            imgshowBtn(img){
                this.img = img[0];
                this.imgshow = true;
            },
            search(){
                this.page = 1;
                this.getList();
            },
            getDataset(name){
                this.formInline.indexCode = name;
                this.dir = this.dir_2;
                this.formInline.dir_id = name;
            },
            getAddress(){
                let params ={'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/getmapselectdir',params).then((res) => {
                    this.regions = res.regions;
                    this.dir = res.dir;
                    this.dir_2 = res.dir;
                })
            },
            getSchool(){
                this.dir = this.dir_2;
                this.formInline.dir_id = '';
                if(this.formInline.indexCode){
                    let params ={'indexCode':this.formInline.indexCode,'uid':this.$store.state.user.uid};
                    this.$https.fetchPost('/plugin/statistics/api_index/getSchool',params).then((res) => {
                        this.dir = res;
                    })
                }
            },
            getList(){ //获取学校列表
                var timeStart = '',timeEnd = '';
                if(this.formInline.timeStr !== null){
                    timeStart = this.formInline.value[0];
                    timeEnd = this.formInline.value[1];
                }
                let params ={'uid':this.$store.state.user.uid,'page':this.page,'paginate':this.paginate,
                    'indexCode':this.formInline.indexCode,'dir_id':this.formInline.dir_id,
                    'start_time':timeStart,'end_time':timeEnd};
                this.$https.fetchPost('/plugin/statistics/api_index/manageStranger',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
                })
            },
            getData(){
                let params ={'code':this.code,'num':this.num,'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/schoolStrangerStat',params).then((res) => {
                    var arr = [];
                    this.data = [];
                    for (let i = 0; i < res.length ; i++) {
                        arr.push(res[i].school_name);
                        arr.push(res[i].day);
                        arr.push(res[i].week);
                        arr.push(res[i].month);
                        arr.push(res[i].indexCode);
                        this.data.push(arr);
                        arr = []
                    }
                    this.$nextTick(function () {
                        let that = this;
                        setTimeout(()=>{
                            that.$refs.Dataset.init();
                        },500)
                    })
                })
            },
            delList(id){
                let params ={'id':id,'uid':this.$store.state.user.uid};
                this.$https.fetchPost('/plugin/statistics/api_index/overStranger',params).then(() => {
                    this.getList();
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
            exports(){
                let xlsCell = [["id","ID"],["name","抓拍区域"],["cameraName","抓拍地点"],["bkgUrl","背景图"],
                    ["faceUrl","抓拍图片"],["faceTime","抓拍时间"],["stranger_status","当前状态"]];
                let xlsData = [];
                for (let i = 0; i <this.tableData.length ; i++) {
                    var text = '已处理';
                    if(this.tableData[i].stranger_status==0){
                        text = '未处理';
                    }
                    xlsData.push({
                        'id': this.tableData[i].id,
                        'name': this.tableData[i].name,
                        'cameraName': this.tableData[i].cameraName,
                        'bkgUrl': String(this.tableData[i].bkgUrl),
                        'faceUrl': String(this.tableData[i].faceUrl),
                        'faceTime': this.tableData[i].faceTime,
                        'stranger_status': text,
                    })
                }
                let params ={'uid':this.$store.state.user.uid};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/excel/out_manageStranger',params).then((res) => {
                    window.location.href=res;
                })
            },
            remind(id){
                let params ={'uid':this.$store.state.user.uid,'id':id};
                this.$https.fetchPost('/plugin/statistics/api_index/reShoolStranger',params).then((res) => {
                    Message.success('已提醒');
                })
            },
            look(id){
                let params ={'uid':this.$store.state.user.uid,'id':id};
                this.$https.fetchPost('/plugin/statistics/api_index/getIdStrangerAlarm',params).then((res) => {
                    this.content = res;
                    this.dialogFormVisible = true;
                })
            },
        },
    }
</script>
<style scoped lang="less">
.demo-form-inline{
    padding: 0 10px;
    background: #fff;
}
.el-form-item{
    margin-top: 10px;
    margin-bottom: 10px;
}
.header{
    width: 100%;
    height: 40vh;
    background: #fff;
    padding-top: 10px;
}
.header p{
    font-size: 16px;
    text-indent: 20px;
}
.el-radio{
    margin: 0;
}
.el-image /deep/ .el-icon-circle-close{
    color: #fff;
}
/*.body >.demo-form-inline {*/
/*    margin: 10px 0;*/
/*}*/
</style>
