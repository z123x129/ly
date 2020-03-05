<template>
    <div>
        <div class="header">
            <p>学校被拍陌生人数量排列柱状图</p>
            <Dataset style="width: 100%;height: 100%"></Dataset>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="选择区域:">
                <el-select size="small" v-model="formInline.user" placeholder="请选择学校">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择学校:">
                <el-select size="small" v-model="formInline.region" placeholder="请选择学校">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择时间:">
                <el-date-picker
                        size="small"
                        v-model="value1"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: 9px">
                <el-button size="small" type="primary" @click="onSubmit">搜索</el-button>
                <el-button size="small" type="primary" @click="onSubmit">导出excel</el-button>
                <el-button size="small" type="primary" @click="onSubmit">生成报表至网格员</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                style="width: 100%;">
            <el-table-column
                    align="center"
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    align="center"
                    type="index"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="address"
                    label="身份证号">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="人脸图">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="url"
                            :preview-src-list="srcList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="time"
                    label="添加时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small">提醒</el-button>
                    <el-button type="text" size="small">忽略</el-button>
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
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Table,TableColumn,Image,Pagination } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Dataset:()=>import('./Linhai_dataset'),
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
        },
        data(){
            return{
                formInline: {
                    user: '',
                    region: ''
                },
                value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                tableData: [{
                    id:'1',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    image1:'',
                    image2:'',
                    time: '2016-05-02',
                }, {
                    id:'2',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    image1:'',
                    image2:'',
                    time: '2016-05-02',
                }, {
                    id:'3',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    image1:'',
                    image2:'',
                    time: '2016-05-02',
                }, ],
                url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                srcList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ],
                currentPage: 1,
                total:0,
                page:1,
                paginate:5,
                paginates:5,
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleSizeChange(val) {//分页器
                this.paginate = val;
                this.page = 1;
                // this.getList();
            },
            handleCurrentChange(val) {//分页器
                this.page = val;
                // this.getList();
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
</style>
