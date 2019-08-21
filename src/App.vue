<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  /*表格样式*/
  .el-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    font-size: 14px;
  }
  .el-table th {
    background-color: #eef1f6;
    color: #606266;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid #dfe6ec;
  }
  .el-table td, .el-table th {
    padding: 8px 0;
    border-bottom: 1px solid #dfe6ec;
  }
  .el-tag {
    height: unset;
    line-height: unset;
  }
  .el-button--mini, .el-button--mini.is-round {
    padding: 5px 10px;
  }

  /*dialog弹窗样式*/
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }
  .el-dialog__header {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-dialog__body {
    overflow: auto;
  }
  .el-dialog__footer {
    border-top: 1px solid #dfe6ec;
  }

  /*内容页样式*/
  .dashboard-container {
    background-color: #e3e3e3;
    min-height: 94vh;
    padding: 10px;
  }
  .row-content {
    background: #fff;
    padding: 20px;
  }
  .demonstration {
    color: #606266;
    font-size: 15px;
  }
</style>
