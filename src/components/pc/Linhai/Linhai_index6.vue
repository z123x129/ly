<template>
    <div id="i1">
        <el-tabs style="padding: 0 10px" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="被抓拍到的重点人员" name="first">
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
                    <el-form-item label="抓拍时间段:">
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
                    </el-form-item>
                </el-form>
                <el-table
                        :data="tableData"
                        border
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
                            label="识别人姓名">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="抓拍点">
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
                            label="抓拍图片">
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
                            label="抓拍时间">
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
            <el-tab-pane label="重点人员列表" name="second">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="姓名:">
                        <el-input size="small" v-model="formInline.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证:">
                        <el-input size="small" v-model="formInline.name"></el-input>
                    </el-form-item>
                    <el-form-item label="添加时间:">
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
                        <el-button size="small" type="primary" @click="dialogFormVisible = true">添加重点人员</el-button>
                        <el-button size="small" type="primary" @click="onSubmit">批量删除</el-button>
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
                            <el-button type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small">删除</el-button>
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
                <el-dialog title="添加重点人员" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item label="姓名:" :label-width="formLabelWidth">
                            <el-input style="width: 80%" v-model="form.name" placeholder="请输入姓名" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:" :label-width="formLabelWidth">
                            <el-input style="width: 80%" v-model="form.region" placeholder="请输入身份证号" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="上传人物照片:" :label-width="formLabelWidth">
                            <el-upload
                                    class="avatar-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { Form,FormItem,Select,Option,Button,DatePicker,Tabs,TabPane,Table,TableColumn,Image,Pagination,Input,Dialog,Upload,Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            // Doughnut:()=>import('./Linhai_doughnut'),
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
                dialogFormVisible: false,
                form: {
                    name: '',
                    region: '',
                    imageUrl: '',
                },
                formLabelWidth: '120px',
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
            handleAvatarSuccess(res, file) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    Message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    Message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
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
.el-image /deep/ .el-icon-circle-close{
    color: #fff;
}
</style>
