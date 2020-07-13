<template>
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never"> -->
    <!-- <div>
        <i class="el-icon-search"></i>
        <el-button style="float: right" @click="Reset()" size="small">重置</el-button>
        <el-button style="float: right;margin-right:20px" @click="query()" type="primary" size="small">查询结果</el-button>
    </div>-->

    <div style="margin: 3px">
      <el-form :inline="true" :model="listQuery" label-width="100px" size="mini">
        <el-form-item>
          <el-input
            style="width: 203px"
            v-model="productname"
            :placeholder="$t('message.商品名称')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 203px"
            v-model="productSn"
            :placeholder="$t('message.商品货号')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-cascader
            v-model="selectCategoryID"
            :options="productCateOptions"
            clearable
            :placeholder="$t('message.商品品类')"
            :props="{ label: 'name', children: 'items', value: 'id' }"
            style="width: 200px"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select v-model="screenPublishStatus" :placeholder="$t('message.上架状态')" clearable>
            <el-option
              v-for="item in publishStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button @click="Reset()" size="small">重置</el-button> -->
        <el-button @click="query()" size="mini">{{$t('message.查询')}}</el-button>
        <el-button
          type="primary"
          @click="handleQuickImport()"
          size="mini"
          :disabled="selectProductIndex.length ==0 "
          v-if="currole == 'b' && listType == 'public'"
        >{{$t('message.一键代理')}}</el-button>
      </el-form>
    </div>
    <!-- </el-card> -->
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        v-loading="listLoading"
        border
        size="mini"
        @selection-change="onSelect"
      >
        <el-table-column type="selection" width="60" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column :label="$t('message.商品主图：')" width="100" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="imgurl(scope.row.albumPics[0])" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.批发价/零售价')" width="180" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.bradePrice">{{ scope.row.bradePrice }} ₽</p>
            <p v-else>---</p>
            <p>{{ scope.row.price }} ₽</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.货号')" width="120" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.发货地')" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.storelocation }}</p>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.上架')"
          width="60"
          align="center"
          v-if="listType =='public'"
        >
          <template slot-scope="scope">
            <el-switch
              @change="handlePublishStatusChange(scope.row.publishStatus,scope.row)"
              :active-value="'yes'"
              :inactive-value="'no'"
              :disabled="storename != scope.row.sid"
              v-model="scope.row.publishStatus"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.云库存/本地库存')"
          align="center"
          v-if="currole == 'b'  && listType =='my'"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.stockcloud }}</p>
            <p v-if="scope.row.stock">{{ scope.row.stock }}</p>
            <p v-else>0</p>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.销量/总库存')"
          width="100"
          align="center"
          v-if="currole == 'b'  && listType =='my'"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.sale">{{ scope.row.sale }}</p>
            <p v-else>0</p>
            <p>{{ stockSum(scope.row)}}</p>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.销量/库存')"
          width="100"
          align="center"
          v-if="currole != 'b' ||   listType =='public'"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.sale">{{ scope.row.sale }}</p>
            <p v-else>0</p>
            <p>{{ scope.row.stock}}</p>
          </template>
        </el-table-column>

        <!-- <el-table-column label="已代理商户" width="100" align="center" v-if="currole == 'B'">
          <template slot-scope="scope">
            <span v-if="scope.row.exportsidlist">{{scope.row.exportsidlist}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>-->

        <!-- <el-table-column label="供应商" width="100" align="center" v-if="currole == 'b'"> -->

        <el-table-column :label="$t('message.供应商')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.parentstore">{{scope.row.parentstore}}</span>
            <span v-else>{{scope.row.sid}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.上架')" width="70" align="center" v-if="listType =='my'">
          <template slot-scope="scope">
            <el-switch
              @change="handlePublishStatusChange(scope.row.publishStatus,scope.row)"
              :active-value="'yes'"
              :inactive-value="'no'"
              v-model="scope.row.publishStatus"
              v-if="currole == 'B'"
            ></el-switch>
            <!-- 如果是代理的 上级下架后就不能修改上下架状态 卖完自动下架 -->
            <el-switch
              @change="handlePublishStatusChange(scope.row.publishStatus,scope.row)"
              :active-value="'yes'"
              :inactive-value="'no'"
              :disabled="scope.row.parentstore && scope.row.importstatus !='yes'"
              v-model="scope.row.publishStatus"
              v-else
            ></el-switch>
            <!-- 代理的商品 -->
            <p
              v-if="scope.row.parentstore && scope.row.importstatus !='yes' "
              style="color: brown;"
            >{{$t('message.批发商已下架')}}</p>
          </template>
        </el-table-column>
        <!-- 活动配置  重点-->
        <el-table-column :label="$t('message.活动配置')" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.actives"
              multiple
              :placeholder="$t('message.请选择')"
              size="mini"
              @change="changeActives(scope.row)"
            >
              <el-option v-for="item in actives" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.活动配置')" width="200" align="center">
          <template slot-scope="scope">
            <!-- 不是自己的只能查看 -->
            <el-tooltip v-if="storename != scope.row.sid " :content="$t('message.查看')" placement="top-start">
              <el-button
                round
                size="mini"
                icon="el-icon-view"
                @click="handleViewProduct(scope.$index, scope.row)"
              />
            </el-tooltip>

            <!-- 是自己的可以编辑 -->
            <el-tooltip
              v-if="storename == scope.row.sid "
              :content="$t('message.编辑')"
              placement="top-start"
            >
              <el-button
                round
                size="mini"
                icon="el-icon-edit-outline"
                @click="handleEditProduct(scope.$index, scope.row)"
              />
            </el-tooltip>

            <!-- 批发商对自己的能入池出池 -->
            <span v-if="currole == 'B'">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('message.入池')"
                placement="top-start"
              >
                <el-button
                  round
                  :content="$t('message.入池')"
                  icon="el-icon-share"
                  v-if="scope.row.publicStatus != 'yes'"
                  size="mini"
                  @click="handlePublicStatus(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('message.出池')"
                placement="top-start"
              >
                <el-button
                  round
                  icon="el-icon-upload2"
                  :content="$t('message.出池')"
                  v-if="scope.row.publicStatus == 'yes'"
                  size="mini"
                  @click="handlePublicStatus(scope.$index, scope.row)"
                />
              </el-tooltip>
            </span>

            <!-- 批发商对自己的代理或取消代理 -->
            <span v-if="currole == 'b'">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('message.取消代理')"
                placement="top-start"
              >
                <el-button
                  round
                  icon="el-icon-delete-solid"
                  :content="$t('message.取消代理')"
                  size="mini"
                  v-if="scope.row.pid"
                  @click="handleDelete(scope.$index, scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('message.取消代理')"
                placement="top-start"
              >
                <el-button
                  round
                  icon="el-icon-delete-solid"
                  :content="$t('message.取消代理')"
                  size="mini"
                  v-if="scope.row.exportid"
                  disabled
                  @click="handleStatus(scope.$index, scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('message.代理')"
                placement="top-start"
                v-if="listType =='public' && !scope.row.exportid"
              >
                <!-- pid 是我的商品中的上级id exportid是总池中的代理后对应的我的店铺id -->
                <el-button
                  round
                  icon="el-icon-share"
                  size="mini"
                  @click="handleImportProduct(scope.$index, scope.row)"
                />
              </el-tooltip>
              <!-- <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">代理
              </el-button>-->
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.paging.limit"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.paging.page"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { uploadImg, ImgUrl } from '@/api/upload'
import { ReqData } from '@/api/system.js'
import { list, save, detial } from '@/api/product'
import { fetchList as categorylist } from '@/api/category'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ProductList',
  props: {
    appednreq: {}
  },
  components: { Pagination },

  computed: {
    currole: function() {
      return this.$store.state.user.roles[0]
    },
    storename: function() {
      return this.$store.getters.storename
    },
    listType() {
      var paths = this.$route.path.split('/')
      return paths[paths.length - 1]
    }
  },
  data() {
    return {
      // 成功

      // 活动配置
      actives: [],
      changePublishStatus: '', //设置上架下架
      screenPublishStatus: '', //筛选
      selectProductIndex: [],
      productSn: '',
      productname: '',
      productCateOptions: [],
      selectCategoryID: [],
      publishStatusOptions: [
        { label: this.$t('message.上架'), value: 'yes' },
        { label: this.$t('message.下架'), value: 'no' }
      ],
      list: null,
      deptlist: null,
      total: 0,

      listLoading: true,
      listQuery: {
        req: this.appednreq,

        paging: {
          page: 1,
          limit: 10
        },
        sort: '_createtime',
        importance: undefined,
        title: undefined,
        type: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getProductCateList()
    this.getStore()
  },
  methods: {
    //禁止选中的条件
    checkSelectable(row) {
      return !row.exportid
    },

    imgurl(imgid) {
      // if (imgid.slice(0, 4) == 'http') {
      //   return imgid
      // }
      return ImgUrl(imgid)
    },
    changeActives(data) {
      let savedata = { _id: data._id, actives: data.actives }
      save(savedata).then(res => {})
    },
    // 活动配置
    getStore() {
      ReqData('store').then(res => {
        console.log(res)
        // 找到对应的商铺的活动名称   改
        const sidActive = res.data.items
        sidActive.map((item, i) => {
          if (item.sid == this.$store.getters.storename) {
            this.actives = item.desc
            this.actives = this.actives.filter(function(e) {
              return e != ''
            })
            console.log(this.actives)
          }
        })
      })
    },
    indexMethod(index) {
      return (
        index +
        1 +
        (this.listQuery.paging.page - 1) * this.listQuery.paging.limit
      )
    },
    onSelect(vals) {
      this.selectProductIndex = vals
    },
    Reset() {
      ;(this.productname = ''),
        (this.productSn = ''),
        (this.screenPublishStatus = ''),
        (this.selectCategoryID = [])
      this.listQuery.req = {}
      this.getList()
    },

    stockSum(data) {
      var s = 0
      if (data.stockcloud) {
        s = Number(data.stockcloud)
      }
      if (data.stock) {
        s += Number(data.stock)
      }
      return s
    },
    handleViewProduct(index, product) {
      this.$router.push({
        path: '/merchandise/view',
        query: { id: product._id }
      })
    },
    handleStatus() {},
    handleDelete(index, product) {
      console.log(product)
      // product.publicStatus = 'open'
      this.$confirm(
        this.$t('message.您确定要取消代理该商品吗'),
        this.$t('message.提示'),
        {
          confirmButtonText: this.$t('message.确定'),
          cancelButtonText: this.$t('message.取消'),
          type: 'warning'
        }
      )
        .then(() => {
          product._delete = ''
          save(product).then(res => {
            this.getList()
          })
          this.$message({
            type: 'success',
            message: this.$t('message.已取消代理')
          })
        })
        .catch(() => {})
    },
    handleEditProduct(index, product) {
      this.$router.push({
        path: '/merchandise/update',
        query: { id: product._id }
      })
    },
    handleImportProduct(index, product) {
      product.publicStatus = 'no'
      product.publishStatus = 'yes'
      this.$router.push({
        path: '/merchandise/import',
        query: { id: product._id }
      })
    },

    // 更改上架下架状态
    handlePublishStatusChange(publishStatus, row) {
      const publishStatusChan = {
        publishStatus: publishStatus,
        _id: row._id
      }
      save(publishStatusChan).then(res => {})
    },
    handleImportProductCancel(index, product) {
      if (product.publicStatus == 'yes') {
        product.publicStatus = ''
      } else {
        product.publicStatus = 'yes'
      }

      save(product).then(res => {
        if (res.code == 0) {
          this.$set(this.list, index, res.data)
        }
      })
    },
    handlePublicStatus(index, product) {
      // console.log(index, product
      // );

      if (product.publicStatus == 'yes') product.publicStatus = 'no'
      else product.publicStatus = 'yes'
      save(product).then(res => {
        console.log(res)
        if (res.code == 0) {
          this.$set(this.list, index, res.data)
          this.getList()
        }
      })
    },

    addCatMap(par, node) {
      par.push(node.id)
      if (node.items.length == 0) {
        //this.CatMap.push({ id: node.id, list: par })
        delete node.items
      }
      for (var i in node.items) {
        let newpar = []
        newpar = newpar.concat(par)
        this.addCatMap(newpar, node.items[i])
      }
    },
    //
    getProductCateList() {
      categorylist().then(response => {
        // console.log(response)
        this.productCateOptions = response.data.items
        for (var i in this.productCateOptions) {
          let par = []
          this.addCatMap(par, this.productCateOptions[i])
        }
        //this.selectProductCateValue = this.getCatIDList(this.product.categoryId)
      })
    },
    getList() {
      //this.listQuery = { type: "activity", code: "0" }
      // console.log(this.listQuery)
      list(this.listQuery).then(response => {
        this.list = response.data.items
        console.log(this.list)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //查询结果
    query() {
      if (this.selectCategoryID.length > 0)
        this.listQuery.req.categoryId = this.selectCategoryID[
          this.selectCategoryID.length - 1
        ]

      delete this.listQuery.req.name
      // 改
      delete this.listQuery.req.productSn
      delete this.listQuery.req.publishStatus
      if (this.productname != '') {
        this.listQuery.req.name = { $regex: this.productname }
      }
      if (this.productSn != '') {
        this.listQuery.req.productSn = { $regex: this.productSn }
      }
      if (this.screenPublishStatus != '') {
        this.listQuery.req.publishStatus = { $regex: this.screenPublishStatus }
      }
      this.getList()
    },

    handleQuickImport() {
      console.log(this.selectProductIndex)
      this.$confirm(
        this.$t('message.是否要一件代理'),
        this.$t('message.提示'),
        {
          confirmButtonText: this.$t('message.确定'),
          cancelButtonText: this.$t('message.取消'),
          type: 'warning'
        }
      ).then(() => {
        for (var i in this.selectProductIndex) {
          let buff = JSON.parse(JSON.stringify(this.selectProductIndex[i]))
          buff.pid = buff._id //追溯上级商户产品状态
          delete buff._id
          delete buff._createtime
          delete buff._updatetime
          //this.productParam.sourceId = this.productParam.id
          //this.productParam.originalPrice = this.productParam.price
          buff.stockcloud = buff.stock
          buff.price = buff.price
          buff.stock = 0
          buff.parentstore = buff.sid //追溯上级商户
          console.log(buff)
          save(buff).then(response => {
          })
              this.$message({
              type: 'success',
              message: this.$t('message.代理成功'),
              duration: 1000
            })
          this.getList()
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.paging.page = 1
      this.listQuery.paging.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    saveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.role = this.$t('message.管理员')
          save(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>