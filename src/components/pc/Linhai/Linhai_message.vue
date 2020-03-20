<template>
    <el-table
            :data="tableData"
            stripe
            style="width: 100%">
        <el-table-column
                prop="cn"
                label="标题"
                width="180">
        </el-table-column>
        <el-table-column
                prop="faceUrl"
                label="抓拍图"
                width="180">
            <template slot-scope="scope">
                <img src="scope.row.faceTime" />
            </template>
        </el-table-column>
        <el-table-column
                prop="faceTime"
                label="时间">
        </el-table-column>
    </el-table>
</template>

<script>
    import {Table,TableColumn} from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            [Table.name]:Table,
            [TableColumn.name]:TableColumn,
        },
        data() {
            return {
                tableData: []
            }
        },
        mounted() {
            this.tableData = this.$store.state.route.messageList;
        }
    }
</script>
