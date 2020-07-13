<template>
<div> 
    <div>
        <el-button style="margin-left:50px;margin-top:50px">新建分组
    </el-button>
    <span>按自定义规则分组</span>
    </div>
    
  <el-table :data="tableData" style="width: 100%;margin-left:50px">
    <el-table-column  label="分类名称" ></el-table-column>
    <el-table-column  label="操作" ></el-table-column>
    
  </el-table>
  </div>
</template>

  <script>
export default {
  data() {
    return {
      tableData: [
      ]
    }
  }
}
</script>

<style scoped>
 
</style>