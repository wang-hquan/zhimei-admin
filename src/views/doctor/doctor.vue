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
        <el-table-column prop="doctor_name" label="名称" width="120"></el-table-column>
        <el-table-column prop="type" label="职位称呼" width="120"></el-table-column>
        <el-table-column prop="img" label="头像" show-overflow-tooltip>
          <template slot-scope="scope">
            <img  :src="scope.row.img" height="80">
          </template>
        </el-table-column>
        <el-table-column prop="brief" label="简介" width="180"></el-table-column>
        <el-table-column prop="doctor_item" label="擅长方向" width="180"></el-table-column>
        <el-table-column prop="desc" label="详细描述" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.status == 0? '禁用':'开启'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="新增时间" show-overflow-tooltip></el-table-column>
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
        <el-form-item label="医生名称" prop="doctor_name" >
          <el-input v-model="formData.doctor_name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="职位称呼"  prop="type" >
          <el-input v-model="formData.type" style="width: 300px"></el-input>
        </el-form-item> <br>
        <el-form-item label="简介" prop="brief"  >
          <el-input v-model="formData.brief" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="擅长方向" prop="doctor_item"  >
          <el-input v-model="formData.doctor_item" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="formData.status" placeholder="是否显示" style="width: 300px">
            <el-option :key="1" label="开启" :value="1"></el-option>
            <el-option :key="0" label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload
            action="http://www.zhimei.com/index.php/api/upload/images"
            :show-file-list="false"
            :on-success="upload_img">
            <i class="el-icon-plus"></i>
            <img v-if="formData.img" :src="formData.img" class="avatar" width="200px">
          </el-upload>
        </el-form-item>
        <el-form-item label="医生详情">
          <div class="edit_container">
            <quill-editor
              v-model="formData.desc"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
              @change="onEditorChange($event)">
            </quill-editor>
          </div>
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
  import {getData,getDataById,edit,add,del} from '@/api/doctor/doctor'
  export default {
    name:'doctor',
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
          doctor_name:'',
          type:'',
          img:'',
          brief:'',
          doctor_item:'',
          desc:'',
          status:1,
        },

        editorOption: {
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
              [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
              [{ 'direction': 'rtl' }],             // 文本方向
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              [{ 'font': [] }],     //字体
              [{ 'align': [] }],    //对齐方式
              ['clean'],    //清除字体样式
              ['image','video']    //上传图片、上传视频
            ]
          },
          theme:'snow'
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
          doctor_name:this.formData.doctor_name,
          type:this.formData.type,
          img:this.formData.img,
          brief:this.formData.brief,
          doctor_item:this.formData.doctor_item,
          desc:this.formData.desc,
          status:this.formData.status,
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
          doctor_name:this.formData.doctor_name,
          type:this.formData.type,
          img:this.formData.img,
          brief:this.formData.brief,
          doctor_item:this.formData.doctor_item,
          desc:this.formData.desc,
          status:this.formData.status,
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
          this.formData.img = file.data;
        }
      },
      handleCurrentChange(val) {
        this.tables.currentPage = val;
        this.getList();
      },
      onEditorReady(editor) { // 准备编辑器
      },
      onEditorBlur(){}, // 失去焦点事件
      onEditorFocus(){}, // 获得焦点事件
      onEditorChange(){}, // 内容改变事件
      saveHtml:function(event){
        alert(this.content);
      },
    },
    created() {
      this.getList()
    }
  }
</script>
