<template>
  <div class="dashboard-container">
    <!--搜索start-->
    <el-row class="row-content">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-row>
    <!--搜索end-->

    <!-- 表格start-->
    <el-row class="row-content" style="margin-top: 10px;min-height: 580px">
      <el-table :key='tables.tableKey' :data="tables.tableData" v-loading="tables.listLoading"
                border highlight-current-row style="width: 100%" height="580">
        <el-table-column type="index" label="序号"  width="50" align="center"></el-table-column>
        <el-table-column prop="user_name" label="名称" width="120"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
        <el-table-column prop="user_money" label="余额" width="80"></el-table-column>
        <el-table-column prop="head_img" label="头像" show-overflow-tooltip>
          <template slot-scope="scope">
            <img  :src="scope.row.head_img" height="80">
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.sex === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.sex == 0? '女':'男'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.status == 0? '禁用':'开启'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" show-overflow-tooltip></el-table-column>
        <el-table-column  label="操作" width="auto" fixed="right" min-width="151px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 10px;">
        <template>
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page="tables.currentPage"
              :total="tables.total">
            </el-pagination>
          </div>
        </template>
      </div>
    </el-row>
    <!--  表格end-->

    <!--    表单提交-->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.centerDialogVisible"
      :close-on-click-modal="false"
      @closed="resetForm"
      width="65%">

      <el-form ref="dataForm" :inline="true" :model="formData"  label-position="right" label-width="100px"
               style="padding-left: 40px;">
        <el-form-item label="昵称" prop="user_name" >
          <el-input v-model="formData.user_name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="手机号"  prop="mobile" >
          <el-input v-model="formData.mobile" style="width: 300px"></el-input>
        </el-form-item> <br>
        <el-form-item label="余额" prop="user_money"  >
          <el-input v-model="formData.user_money" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select class="filter-item" v-model="formData.sex" placeholder="新闻类型" style="width: 300px">
            <el-option :key="0" label="女" :value="0"></el-option>
            <el-option :key="1" label="男" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="formData.status" placeholder="是否显示" style="width: 300px">
            <el-option :key="1" label="开启" :value="1"></el-option>
            <el-option :key="0" label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="formData.birthday"
            value-format='yyyy-MM-dd'
            type="date"
            placeholder="选择日期"
            style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="头像" prop="head_img">
          <el-upload
            action="http://www.zhimei.com/index.php/api/upload/images"
            :show-file-list="false"
            :on-success="upload_img">
            <i class="el-icon-plus"></i>
            <img v-if="formData.head_img" :src="formData.head_img" class="avatar" width="200px">
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
         <el-button @click="resetForm">取 消</el-button>
         <el-button v-if="this.dialog.title == '编辑'" @click="edit">确定</el-button>
         <el-button v-if="this.dialog.title == '新增'" @click="add">添加</el-button>
    </span>
    </el-dialog>
    <!--    表单提交-->

  </div>
</template>

<script>
  import {getData,getDataById,edit,add,del} from '@/api/info/user'
  export default {
    name:'user',
    data() {
      return {
        tables: {
          tableKey: 0,
          listLoading: false,
          currentPage: 1,
          pageSize: 10,
          total: 1,
          tableData: []
        },
        dialog:{
          centerDialogVisible:false
        },
        formData:{
          id:'',
          mobile:'',
          user_name:'',
          user_money:'',
          head_img:'',
          sex:0,
          status:1,
          birthday:'',
        },
      }
    },
    methods: {
      getList() {
        this.tables.listLoading = true;
        let data = {
          pageSize:this.tables.pageSize,
          pageNum: this.tables.currentPage,
        };
        getData(data).then(res => {
          let {code, msg, data} = res;
          if (code == 200) {
            this.tables.tableData = data.lists;
            this.tables.pageSize = data.pageSize;
            this.tables.total = data.total;
            this.tables.currentPage = data.pageNum;
          } else {
            this.showTips(0, msg);
          }
          setTimeout(() => {
            this.tables.listLoading = false
          }, 0.3 * 1000);
        });
      },
      handleEdit(id) {
        this.dialog.title = '编辑';
        this.formData.id = id
        let data = {
          id:id
        }
        getDataById(data).then(res => {
          let {code, msg, data} = res;
          if (code == 200) {
            this.formData = data;
            this.dialog.centerDialogVisible = true;
          } else {
            this.showTips(0, msg);
          }
        });
      },

      edit(){
        let data = {
          id:this.formData.id,
          mobile:this.formData.mobile,
          user_name:this.formData.user_name,
          user_money:this.formData.user_money,
          head_img:this.formData.head_img,
          sex:this.formData.sex,
          status:this.formData.status,
          birthday:this.formData.birthday,
        }
        edit(data).then(res =>{
          let {code, msg, data} = res;
          if(code == 200){
            this.showTips(1,msg);
            this.resetForm();
            this.getList();
          }else {
            this.showTips(0, msg);
          }
        })
      },
      handleAdd(){
        this.dialog.title = '新增';
        this.dialog.centerDialogVisible = true;
      },
      add() {
        let data = {
          mobile:this.formData.mobile,
          user_name:this.formData.user_name,
          user_money:this.formData.user_money,
          head_img:this.formData.head_img,
          sex:this.formData.sex,
          status:this.formData.status,
          birthday:this.formData.birthday,
        }
        add(data).then(res =>{
          let {code, msg, data} = res;
          if(code == 200){
            this.showTips(1,msg);
            this.resetForm();
            this.getList();
          }else{
            this.showTips(0, msg);
          }
        })
      },
      handleDel(id){
        let data = {
          id:id,
        }
        del(data).then(res => {
          let {code, msg, data} = res;
          if (code == 200) {
            this.showTips(1, msg);
            this.getList();
          } else {
            this.showTips(0, msg);
          }
        });
      },

      resetForm() {
        this.formData = {};
        this.dialog.centerDialogVisible = false;
      },
      showTips(flag, msg) {
        let title = (flag ==1)? '成功':'失败';
        let type = (flag == 1)? 'success':'error';
        this.$notify ({
          title: title,
          message: msg,
          type: type,
          duration: 2000
        });
      },

      upload_img(file) {
        if(file.code == 200){
          this.formData.head_img = file.data;
        }
      },
      handleCurrentChange(val) {
        this.tables.currentPage = val;
        this.getList();
      },
    },
    created() {
      this.getList()
    }
  }
</script>
