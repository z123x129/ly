<template>
    <div>
        <el-form id="form" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="开始时间:" :label-width="formLabelWidth">
                <el-date-picker size="small" type="date" placeholder="年/月/日" v-model="formInline.date1"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:" :label-width="formLabelWidth">
                <el-date-picker size="small" type="date" placeholder="年/月/日" v-model="formInline.date2"></el-date-picker>
            </el-form-item>
            <el-form-item label="抓拍点:" :label-width="formLabelWidth">
                <el-select size="small" v-model="formInline.region" placeholder="请选择区域">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>o
                </el-select>
            </el-form-item>
            <el-form-item label="年龄段:" :label-width="formLabelWidth">
                <el-select size="small" v-model="formInline.region" placeholder="不限">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别:" :label-width="formLabelWidth">
                <el-select size="small" v-model="formInline.region" placeholder="不限">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否戴眼镜:" :label-width="formLabelWidth">
                <el-select size="small" v-model="formInline.region" placeholder="不限">
                    <el-option label="选择区域" value="shanghai"></el-option>
                    <el-option label="选择学校" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 3vw">
                <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
                <el-button size="small" type="primary" @click="onSubmit">重置</el-button>
                <el-button size="small" type="primary" @click="onSubmit">导出</el-button>
            </el-form-item>
            <el-form-item style="padding-left: 14vw">
                <el-radio-group @change="show = !show" v-model="radio" size="small">
                    <el-radio-button label="图标"></el-radio-button>
                    <el-radio-button label="列表"></el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div v-if="show == false" class="big_box">
            <div v-for="(item,index) in tableData" @click="dialogFormVisible = true" :key="index" class="box">
                <img src="" />
                <h5 v-text="item.name"></h5>
                <p v-text="item.date"></p>
            </div>
        </div>
        <el-table v-if="show == true"
                  :data="tableData"
                  stripe
                  style="width: 100%">
            <el-table-column
                    align="center"
                    prop="date"
                    label="抓拍时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="name"
                    label="抓拍点">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="dialogFormVisible = true" type="text" size="small">详情</el-button>
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
        <el-dialog title="识别详情" :visible.sync="dialogFormVisible">
            <el-tabs v-model="activeName">
                <el-tab-pane label="识别信息" name="first">
                    <div style="display: flex;justify-content: space-around">
                        <ul class="message">
                            <li>抓拍时间：2020年03月03日</li>
                            <li>抓拍点：测试小学后厨</li>
                            <li>年龄段：老年人</li>
                            <li>性别：男</li>
                            <li>是否戴眼镜：是</li>
                        </ul>
                        <div class="demo-image__preview">
                            <el-image
                                    style="width: 300px; height: 250px;"
                                    :src="url"
                                    fit="contain"
                                    :preview-src-list="srcList">
                            </el-image>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抓拍原图" name="second">
                    <div class="demo-image__preview">
                        <el-image
                                style="width: 300px; height: 250px;margin: 0 auto;display: block"
                                :src="url"
                                fit="contain"
                                :preview-src-list="srcList">
                        </el-image>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="上报信息" name="third">
                    <el-form :model="form">
                        <el-form-item label="上报标题:" :label-width="formLabelWidth">
                            <el-input style="width: 80%" v-model="form.name" placeholder="请输入标题" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="上报内容:" :label-width="formLabelWidth">
                            <el-input type="textarea" style="width: 80%" v-model="form.region" placeholder="请输入内容" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="附件:" :label-width="formLabelWidth">
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
                        <el-form-item style="display: flex;justify-content: flex-end">
                            <el-button type="primary" @click="onSubmit">上报</el-button>
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
    export default {
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
                formInline: {
                    date1:'',
                    date2:'',
                    user: '',
                    region: 'shanghai'
                },
                formLabelWidth: '100px',
                radio: '图标',
                show:false,
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                }],
                currentPage: 1,
                total:0,
                page:1,
                paginate:5,
                paginates:5,
                dialogFormVisible:false,
                activeName: 'first',
                form: {
                    name: '',
                    region: '',
                    imageUrl: '',
                },
                url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                srcList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
                ]
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
        background: #fff;
    }
    #form .el-form-item{
        width: 25vw;
        margin: 10px 0;
    }
    .big_box{
        width: 100vw;
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
        background: skyblue;
    }
    .box h5{
        text-indent: 10px;
        line-height: 25px;
    }
    .box p{
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
</style>

