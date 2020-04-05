<template>
    <div>
        <div class="headerSearch">
            <div>
                <el-input size="small" placeholder="请输入内容" v-model="input" class="input-with-select">
                    <el-select style="width: 110px" v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="学校名称" value="dirName"></el-option>
                        <el-option label="单位名称" value="company"></el-option>
                        <el-option label="负责人" value="personCharge"></el-option>
                        <el-option label="学校地址" value="street"></el-option>
                    </el-select>
                    <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            
        </div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column
                    label="学校Logo"
                    align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.school_cover" style="border-radius: 100%" width="80px" height="80px" :src="scope.row.school_cover" />
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dirName"
                    label="学校名称"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="company"
                    label="单位名称"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="personCharge"
                    label="负责人"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="personChargePhone"
                    label="负责人联系方式"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="street"
                    label="学校地址"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="student_num"
                    label="学生就餐人数"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="teacher_num"
                    label="教职工就餐人数"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="canteen_num"
                    label="学校食堂员工数"
                    align="center">
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
    </div>
</template>
<script>
    import {Input,Select,Option,Button,Table,TableColumn,Pagination} from 'element-ui'
    export default {
        components:{
            [Input.name]:Input,
            [Select.name]:Select,
            [Option.name]:Option,
            [Button.name]:Button,
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
            [Pagination.name]:Pagination,
        },
        data() {
            return {
                input: '',
                select: 'dirName',
                tableData:[],
                currentPage: 1,
                total:0,
                page:1,
                paginate:10,
                paginates:10,
            }
        },
        mounted() {
            this.getList();
        },
        methods:{
            getList(){
                let params ={'uid':this.$store.state.user.uid,'page':this.page,'paginate':this.paginate,
                    [this.select]:this.input};
                this.$https.fetchPost('/plugin/statistics/api_index/getSchoolList',params).then((res) => {
                    this.tableData = res.data;
                    this.currentPage = res.current_page;
                    this.total = res.total;
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
        }
    }
</script>
<style scoped lang="less">
    .headerSearch{
        background-color: #fff;
        padding: 10px;
        margin-bottom: 10px;
        >div{
            width: 40%;
            margin: auto;
        }
    }
</style>
