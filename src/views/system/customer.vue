<template>
  <div class="app-container">
    <div class="filter-container">

      <!-- <el-select label-in-value="true" placeholder="用户状态" clearable v-model="listQuery.req.status" size="mini"
        style="width: 200px" class="filter-item" @change="changeStatus">
        <el-option v-for="(item,index) in userStatusList" :key="index" :label="item.title" :value="item.val" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFilter">检索
      </el-button> -->

    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit size="mini" highlight-current-row
      style="width: 100%">

      <el-table-column :label="$t('message.客户')" prop="username" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.昵称')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.电话')">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.地址')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roles}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.订单数')">
        <template slot-scope="{ row }">
          {{row.ordernum}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.入店时间')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row._createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.paging.page" :limit.sync="listQuery.paging.limit"
      @pagination="fetchList" />
  </div>
</template>

<script>
  import { list } from '@/api/customer'

  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination'
  import { Logger } from 'runjs/lib/common'
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return type
      },

    },
    data() {
      return {
        roles: this.$store.getters.roles,
        identity: '',
        parentShow: true,
        storenameShow: true,
        list:null,

        tableKey: 0,
        userlist: null,
        storelist: null,
        total: 0,
        listLoading: false,
        listQuery: {
          paging: {
            page: 1,
            limit: 10
          },
          req: {},
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
      }
    },
    created() {
      this.fetchList()

    },
    methods: {
      fetchList() {
        list(this.listQuery).then(response => {
          this.list = response.data.items
          console.log(this.list);
          
          this.total = response.data.total
        })
      },

      handleFilter() {
        this.listQuery.page = 1
        this.fetchUserList()
      },



    }
  }
</script>