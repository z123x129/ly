<template>
    <div>
        <el-tabs style="padding: 0 10px" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="学校数据展示" name="first">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="选择区域:">
                        <el-select size="small" v-model="formInline.user" placeholder="请选择区域">
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
                    <el-form-item label="健康证到期时间:">
                        <el-date-picker
                                size="small"
                                v-model="value1"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-top: -2px">
                        <el-button size="small" type="primary" @click="onSubmit">搜索</el-button>
                        <el-button size="small" type="primary" @click="onSubmit">导出excel</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                        :data="tableData"
                        border
                        :row-class-name="tableRowClassName"
                        style="width: 100%">
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
                            label="所属地区">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="所属学校">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="联系方式">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="人脸照片">
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
                            label="健康证照片">
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
                            prop="address"
                            label="人员类别">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="time"
                            label="健康证到期时间">
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
            </el-tab-pane>
            <el-tab-pane label="违规数据" name="second">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="选择区域:">
                        <el-select size="small" v-model="formInline.user" placeholder="请选择区域">
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
                    <el-form-item label="选择网格员:">
                        <el-select size="small" v-model="formInline.region" placeholder="请选择网格员">
                            <el-option label="选择区域" value="shanghai"></el-option>
                            <el-option label="选择学校" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
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
                            label="网格员">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="地区">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="学校">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="违规选项">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="图片信息">
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
                            label="日期">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="文字描述">
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
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,TabPane,Table,TableColumn,Image,Pagination,Input } from 'element-ui'
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
        },
        data(){
            return{
                activeName: 'first',
                formInline: {
                    user: '',
                    region: '',
                    name:'',
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
                window.console.log('submit!');
            },
            handleClick(tab, event) {
                window.console.log(tab, event);
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
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            }
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
.el-table /deep/ .warning-row {
    background: oldlace;
}

.el-table /deep/ .success-row {
    background: #f0f9eb;
}
</style>
