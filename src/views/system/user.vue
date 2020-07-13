<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-select
        v-model="listQuery.importance"
        placeholder="商城选择"
        clearable
        size="mini"
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in storelist" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>-->

      <!-- <el-input
        v-model="listQuery.title"
        placeholder="用户名过滤"
        style="width: 200px"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />-->
      <el-select
        label-in-value="true"
        :placeholder="$t('message.用户状态')"
        clearable
        v-model="listQuery.req.status"
        size="mini"
        style="width: 200px"
        class="filter-item"
        @change="changeStatus"
      >
        <el-option
          v-for="(item,index) in userStatusList"
          :key="index"
          :label="item.title"
          :value="item.val"
        />
      </el-select>
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="handleFilter"
      >检索</el-button>-->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="handleCreate"
      >{{$t('message.新增')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="userlist"
      border
      fit
      size="mini"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column :label="$t('message.上级商城')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.parent }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.商城')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.storename }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.用户名')" prop="username" align="center" width="80">
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
          <!-- <el-input type="text" v-model="row.tel" /> -->
          <span class="link-type">{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.角色')" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{row.roles}}</span> -->
          <span v-if="row.roles">{{ rolesFilter(row.roles)}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('message.创建日期')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row._createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.状态')">
        <template slot-scope="{ row }">
          <el-switch
            :disabled="row.username == $store.getters.name"
            active-value="active"
            inactive-value="disactive"
            @change="statusChange(row)"
            v-model="row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
          />
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="保存信息" placement="top-start">
            <el-button
              round
              size="mini"
              @click="handleSave(row)"
              content="保存"
              icon="el-icon-success"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改信息" placement="top-start">
            <el-button round size="mini" @click="handleEdit(row)" icon="el-icon-edit-outline" />
          </el-tooltip>
        </template>
      </el-table-column>-->
    </el-table>

    <el-dialog :title="$t('message.新增用户')" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item :label="$t('message.语言选择')">
          <el-select v-model="temp.language" :placeholder="$t('message.请选择')">
            <el-option
              v-for="item in userLanguage"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('message.用户角色')" prop="region">
          <el-select v-model="temp.roles" :placeholder="$t('message.请选择用户角色')">
            <el-option
              v-for="(item,index) in rolesOptionsList"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>

        <div v-if="temp.roles.indexOf('o') == -1 ">
          <el-form-item :label="$t('message.上级单位')">
            <el-input v-model="temp.parent" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('message.品牌名称')" prop="storename">      
            <el-input type="text" v-model="temp.storename" />
          </el-form-item>
        </div>
        <div v-else>  
          <el-form-item :label="$t('message.用户名')" prop="username">
            <el-input v-model="temp.username" />
          </el-form-item>
        </div>

        <el-form-item :label="$t('message.电话')" prop="tel">
          <el-input v-model="temp.tel" type="number" />
        </el-form-item>

        <el-form-item :label="$t('message.昵称')">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item :label="$t('message.备注')">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('message.取消')}}</el-button>
        <el-button type="primary" @click="saveUserData()">{{$t('message.确定')}}</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.paging.page"
      :limit.sync="listQuery.paging.limit"
      @pagination="fetchUserList"
    />
  </div>
</template>

<script>
import { listuser, save as saveuser } from '@/api/user'
import { list as storelist, save as storesave } from '@/api/store'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { Logger } from 'runjs/lib/common'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    // rolesFilter(roles) {
    //   // console.log(roles)
    //   if (roles.indexOf('admin') != -1) {
    //     return this.$t('message.管理员')
    //   } else if (roles.indexOf('B') != -1) {
    //     return this.$t('message.批发商')
    //   } else if (roles.indexOf('b') != -1) {
    //     return this.$t('message.商户')
    //   } else {
    //     return this.$t('message.员工')
    //   }
    // }
  },
  data() {
    return {
      userLanguage: [
        {
          value: 'ru',
          label: 'ru'
        },
        {
          value: 'cn',
          label: 'cn'
        }
      ],
      // curRoles: this.$store.getters.roles,
      userStatusList: [
        { title: this.$t('message.激活'), val: 'active' },
        { title: this.$t('message.禁用'), val: 'disactive' }
      ],
      rolesOptionsList: [
        {
          value: ['B'],
          label: this.$t('message.批发商'),
          disabled: false
        },
        {
          value: ['b'],
          label: this.$t('message.商户'),
          disabled: false
        },
        {
          value: ['o'],
          label: this.$t('message.员工'),
          disabled: false
        }
      ],

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
        sort: 'parent,storename,username'
      },

      temp: {
        storename: '',
        roles: [],
        remark: '',
        nickname: '',
        tel: '',
        username: '',
        language: ''
      },
      dialogFormVisible: false,

      dialogPvVisible: false,
      pvData: [],
      rules: {
        region: [{ message: this.$t('message.请选择身份'), trigger: 'change' }],
        storename: [
          { required: true, message: 'type is required', trigger: 'blur' },
          {
            min: 3,
            message: this.$t('message.长度不能少于3个字符'),
            trigger: 'change'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t('message.请输入用户名'),
            trigger: 'blur'
          },
          {
            min: 3,
            message: this.$t('message.长度不能少于3个字符'),
            trigger: 'blur'
          }
        ],
        tel: [
          { required: true, trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: this.$t('message.号码格式不正确'),
            trigger: 'change'
          }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.fetchUserList()
    // this.fetchStoreList()
  },

  methods: {
    rolesFilter(roles) {
      // console.log(roles)
      if (roles.indexOf('admin') != -1) {
        return this.$t('message.管理员')
      } else if (roles.indexOf('B') != -1) {
        return this.$t('message.批发商')
      } else if (roles.indexOf('b') != -1) {
        return this.$t('message.商户')
      } else {
        return this.$t('message.员工')
      }
    },
    // handleSave(userData) {
    //   saveuser(userData).then(res => {
    //     console.log(res)
    //     this.$message('已保存')
    //   })
    //   this.showUser = ''
    // },
    // handleEdit(userData) {
    //   this.showUser = userData.username
    // },
    // showStorename() {
    //   // console.log(this.roles);

    //   if (this.roles.indexOf('b') != -1) {
    //     this.storenameShow = false
    //   } else {
    //     this.storenameShow = true
    //   }
    // },
    // rolesChange(e) {

    //   // if (e == 'operator') {
    //   //   //this.temp.parent = this.$store.getters.storename
    //   //   this.temp.storename = this.$store.getters.storename
    //   //   this.storenameShow = false
    //   // } else {
    //   //   this.temp.parent = this.$store.getters.storename
    //   //   this.temp.storename = ""
    //   //   this.storenameShow = true
    //   // }
    // },
    changeStatus() {
      this.fetchUserList()
    },
    statusChange(userData) {
      saveuser(userData).then(res => {
        this.$message(this.$t('message.状态已改变'))
      })
    },
    fetchUserList() {
      listuser(this.listQuery).then(response => {
        console.log(response)
        this.userlist = response.data.items
        this.total = response.data.total
      })
    },
    // fetchStoreList() {
    //   storelist().then(res => {
    //     this.storelist = res.data.items
    //   })
    // },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchUserList()
    },
    resetTemp() {
      this.temp = {
        storename: '',
        roles: '',
        remark: '',
        nickname: '',
        tel: '',
        username: '',
        language: ''
      }
      if (this.$store.getters.roles.indexOf('admin') != -1) {
        this.temp.parent = this.$t('message.海方弘景')
        this.rolesOptionsList[1].disabled = true
      }
      if (this.$store.getters.roles.indexOf('B') != -1) {
        this.temp.parent = this.$store.getters.storename
        this.rolesOptionsList[0].disabled = true
      }
      if (this.$store.getters.roles.indexOf('b') != -1) {
        this.temp.parent = this.$store.getters.storename
        this.temp.storename = this.$store.getters.storename
        this.rolesOptionsList[0].disabled = true
        // 商户创建新的用户时只能创建员工
        this.rolesOptionsList[1].disabled = true
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    saveUserData() {
      //批发商 和商户的用户名和店铺一致
      if (this.temp.roles.indexOf('o') == -1) {
        this.temp.username = this.temp.storename
      }
      if (this.temp.nickname == '') {
        this.temp.nickname = this.temp.username
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.password = 'Hfhj@2020'
          // this.dialogFormVisible = false
          // console.log(this.temp)
          // return
          saveuser(this.temp).then(res => {
            if (res.code == 0) {
              this.dialogFormVisible = false
              this.fetchUserList()
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>