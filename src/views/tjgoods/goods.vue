<template>
  <div class="dashboard-container">
    <!--搜索start-->
    <el-row class="row-content">
      <span class="demonstration" style="margin-left: 5px">商品分类</span>
      <el-select  v-model="sParams.cate_id" placeholder="请选择分类" style="width: 150px" filterable clearable>
        <el-option
          v-for="item in category_list"
          :key="item.id"
          :label="item.cat_name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </el-row>
    <!--搜索end-->

    <!-- 表格start-->
    <el-row class="row-content" style="margin-top: 10px;min-height: 580px">
      <el-table :key='tables.tableKey' :data="tables.tableData" v-loading="tables.listLoading"
                border highlight-current-row style="width: 100%" height="580">
        <el-table-column type="index" label="序号"  width="50" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="商品类型" width="120">
          <template slot-scope="scope">
            <div  v-for="item in category_list" v-if="item.id == scope.row.type">{{item.cat_name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="商品图片" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_price" label="商品单价" width="120"></el-table-column>
        <el-table-column prop="goods_brief" label="商品简介" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_item" label="体检项目" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_matters" label="注意事项" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_desc" label="商品详情" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="is_tuijian" label="推荐" width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_tuijian === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.is_tuijian == 0? '禁用':'开启'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_on_sale" label="上架" width="80" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_on_sale === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.is_on_sale == 0? '禁用':'开启'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" show-overflow-tooltip></el-table-column>
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
        <el-form-item label="商品名称" prop="goods_name" >
          <el-input v-model="formData.goods_name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="type" >
          <el-select  v-model="formData.type" placeholder="请选择分类" style="width: 150px" filterable clearable>
            <el-option
              v-for="item in category_list"
              :key="item.id"
              :label="item.cat_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="img" >
          <el-upload
            :show-file-list="false"
            :on-success="changeInputData"
            action="http://www.zhimei.com/index.php/api/upload/images"
            accept="image/gif,image/jpeg,image/jpg,image/png"
            list-type="picture"
            multiple
          >
            <el-button slot="trigger" size="small" type="primary"  >选取文件</el-button>
            <div slot="tip" class="el-upload__tip" style="margin-top: 5px;line-height: 15px;">只能上传jpg/png/gif/jpeg文件,且不超过1M</div>
          </el-upload>
          <div v-for="(item, key) in formData.img " style="border:1px solid gray;margin-bottom:5px ">
            <img  :src="item" alt="" height="80px" @click="delImg(key)">
          </div>
        </el-form-item>
        <br>
        <el-form-item label="商品单价" prop="goods_price" >
          <el-input v-model="formData.goods_price" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="商品简介" prop="goods_brief" >
          <el-input v-model="formData.goods_brief" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="体检项目" prop="goods_item" >
          <el-input v-model="formData.goods_item" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="注意事项" prop="goods_matters" >
          <el-input v-model="formData.goods_matters" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="is_on_sale">
          <el-select class="filter-item" v-model="formData.is_on_sale" placeholder="是否显示" style="width: 300px">
            <el-option :key="1" label="开启" :value="1"></el-option>
            <el-option :key="0" label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" prop="is_tuijian">
          <el-select class="filter-item" v-model="formData.is_tuijian" placeholder="是否显示" style="width: 300px">
            <el-option :key="1" label="开启" :value="1"></el-option>
            <el-option :key="0" label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情" prop="goods_desc" >
          <div class="edit_container">
            <quill-editor
              v-model="formData.goods_desc"
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
  import {getData,getDataById,edit,add,del,getCategory} from '@/api/tjgoods/goods'
  export default {
    name:'goods',
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
          goods_name:'',
          type:'',
          img:[],
          goods_price:'',
          goods_brief:'',
          goods_item:'',
          goods_matters:'',
          goods_desc:'',
          is_on_sale:1,
          is_tuijian:0,
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
        category_list:[],
        sParams:{
          cate_id:''
        }
      }
    },
    methods: {
      getList() {
        this.tables.listLoading = true;
        let data = {
          type:this.sParams.cate_id,
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
          goods_name:this.formData.goods_name,
          type:this.formData.type,
          img:this.formData.img,
          goods_price:this.formData.goods_price,
          goods_brief:this.formData.goods_brief,
          goods_item:this.formData.goods_item,
          goods_matters:this.formData.goods_matters,
          goods_desc:this.formData.goods_desc,
          is_on_sale:this.formData.is_on_sale,
          is_tuijian:this.formData.is_tuijian,
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
          goods_name:this.formData.goods_name,
          type:this.formData.type,
          img:this.formData.img,
          goods_price:this.formData.goods_price,
          goods_brief:this.formData.goods_brief,
          goods_item:this.formData.goods_item,
          goods_matters:this.formData.goods_matters,
          goods_desc:this.formData.goods_desc,
          is_on_sale:this.formData.is_on_sale,
          is_tuijian:this.formData.is_tuijian,
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
      handleSearch(){
        this.tables.currentPage = 1;
        this.getList();
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

      getCategoryList(){
        getCategory().then(res => {
            let {code, msg, data} = res;
            if(code == 200){
              this.category_list = data
            }
        })
      },

      //图片上传
      changeInputData(response, file, fileList) {
        let {code, msg, data} = response;
        if(code == 200){
          this.formData.img.push(response.data)
        }

      },
      delImg(data){
        this.formData.img.splice(data,1);
      }
    },
    created() {
      this.getList();
      this.getCategoryList();
    }
  }
</script>
