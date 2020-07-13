<template>
  <div class="app-container">
    <div style="margin: 3px">
      <el-form :inline="true" :model="listQuery" label-width="100px" size="mini">
        <el-form-item>
          <el-input
            style="width: 203px"
            :placeholder="$t('message.店铺名称')"
            v-model="shopName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 203px"
            :placeholder="$t('message.用户名称')"
            v-model="userName"
            clearable
          ></el-input>
        </el-form-item>
        <el-button @click="query()" size="mini">{{$t('message.查询')}}</el-button>
      </el-form>
    </div>
    <div class="table-container">
      <!-- 订单整体部分 -->
      <el-table :data="list" style="width: 100%">
        <!-- 每个订单 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--订单内的产品列表-->
            <el-table ref="productTable" style="width: 100%; " border :data="scope.row.productList">
              <el-table-column type="selection" width="40" align="center"></el-table-column>
              <el-table-column
                :label="$t('message.序号')"
                type="index"
                align="center"
                :index="indexMethod"
              ></el-table-column>
              <!-- <el-table-column label="商铺名称" width="100" align="center" prop="sid"></el-table-column> -->
              <el-table-column :label="$t('message.产品图片')" align="center">
                <template slot-scope="scope1" prop="skuImg">
                  <img width="100" height="100" :src="imgurl(scope1.row.skuImg)" alt />
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.产品编号')" align="center" prop="productSn"></el-table-column>
              <el-table-column :label="$t('message.产品数量')" align="center" prop="productNumber"></el-table-column>
              <el-table-column :label="$t('message.商品编号')" align="center" prop="skucode"></el-table-column>
              <el-table-column :label="$t('message.产品图片')" align="center" prop="_createtime">
                <template slot-scope="{row}">
                  <span>
                    {{
                    row._createtime | parseTime('{y}-{m}-{d} {h}:{i}')
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.拣货状态')" align="center">
                <template slot-scope="scope1" prop="pickStatus">
                  <el-tag effect="plain" type="danger">{{ pickingStatus(scope1.row.pickStatus) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('message.操作')"
                align="center"
                v-if="scope.row.deliveryStatus=='1'"
              >
                <template prop="pickStatus" slot-scope="scope2">
                  <el-button
                    size="mini"
                    type="danger"
                    disabled
                    v-if="scope.row.sid!=scope.row.pid&& currole=='b'"
                  >{{$t('message.拣货完成')}}</el-button>
                  <div v-else>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="changePick(scope2.row.pickStatus,scope2.row, scope.row)"
                      v-if="scope2.row.pickStatus!='2'"
                    >{{ pickStatus(scope2.row.pickStatus) }}</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.店铺名称')">
          <template prop="pid" slot-scope="scope">
            <div
              v-if="scope.row.sid!=scope.row.pid&& currole=='b'"
              style="color:red"
            >{{scope.row.pid+($t('message.订单转出'))}}</div>
            <div
              v-else-if="scope.row.sid!=scope.row.pid&& currole!='b'"
              style="color:red"
            >{{scope.row.pid+($t('message.转入订单'))}}</div>
            <div v-else>{{scope.row.pid}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.订单编号')" prop="orderId"></el-table-column>
        <el-table-column :label="$t('message.物流编号')" prop="logId">
          <template slot-scope="{ row }">
            <el-tag effect="plain" type="info" v-if="row.logId">{{row.logId}}</el-tag>
            <el-tag effect="plain" type="info" v-else>{{"--"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.物流类型')" prop="logType">
          <template slot-scope="{ row }">
            <el-tag effect="plain" type="info" v-if="row.logType">{{row.logType}}</el-tag>
            <el-tag effect="plain" type="info" v-else>{{"--"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.用户名称')" prop="uname"></el-table-column>
        <el-table-column :label="$t('message.入库时间')" prop="_createtime">
          <template slot-scope="{ row }">
            <span>
              {{
              row._createtime | parseTime('{y}-{m}-{d} {h}:{i}')
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.更新时间')" prop="updatetime">
          <template slot-scope="{ row }">
            <span>{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.拣货状态')" align="center">
          <template slot-scope="scope" prop="deliveryStatus">
            <el-tag
              effect="plain"
              type="danger"
            >{{ deliveryStatus(scope.row.deliveryStatus,scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.订单状态')" align="center">
          <template slot-scope="scope" prop="status">
            <el-tag effect="plain" type="danger">{{ orderStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.出库操作')" align="center">
          <template prop="(status,sid,pid)" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              disabled
              v-if="scope.row.sid!=scope.row.pid && currole=='b'"
            >{{$t('message.订单出库')}}</el-button>
            <div v-else>
              <el-button
                type="primary"
                size="mini"
                @click="
                changeStatus(scope.row.status, scope.row)
              "
                v-if="scope.row.status!='2'"
              >{{ changeStatusInfo(scope.row.status) }}</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- v-if="currole != 'B'" -->
        <el-table-column
          :label="$t('message.转订单')"
          align="center"
          prop="pid"
          v-if="this.currole!='B'"
        >
          <template slot-scope="scope">
             <div v-if="scope.row.sid!=scope.row.pid">
              <el-button
              type="primary"
              size="mini"
              disabled
              
            >{{$t('message.订单已转出')}}</el-button>
            </div>
            <div v-else>
              <el-button
              type="primary"
              size="mini"
              @click="transferOrder(scope.row)"
              v-if="scope.row.transShow==true"
            >{{scope.row.sid!=scope.row.pid?$t('message.订单已转出'):$t('message.转订单')}}</el-button>
            </div>
           
            
          </template>
        </el-table-column>
      </el-table>
      <!-- 订单状态编辑 -->
      <el-dialog :title="$t('message.填写出货信息')" :visible.sync="dialogFormVisible" width="20%">
        <el-form :model="form">
          <el-form-item :label="$t('message.订单编号')" :label-width="formLabelWidth">
            <el-input v-model="form.orderId" autocomplete="off" :label-width="formLabelWidth"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.物流号')" :label-width="formLabelWidth">
            <el-input v-model="form.logId" autocomplete="off" :label-width="formLabelWidth"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.物流类型')" :label-width="formLabelWidth">
            <el-input v-model="form.logType" autocomplete="off" :label-width="formLabelWidth"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">{{$t('message.取 消')}}</el-button>
          <el-button type="primary" @click="shipmentInfor(form)">{{$t('message.确 定')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.paging.page"
        :page-sizes="[10, 30, 50]"
        :limit.sync="listQuery.paging.limit"
        @pagination="getOrderList"
      />
    </div>
  </div>
</template>

<script>
import { orderList, receiptSave, transorder } from '@/api/warehouse'
import { save } from '@/api/order'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { ImgUrl } from '@/api/upload'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      shopName: '',
      userName: '',
      total: 0,
      listQuery: {
        req: {},
        paging: {
          page: 1,
          limit: 10
        },
        sort: '+id'
      },
      listLoading: true,
      list: [],
      product: [],
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      orderData: {},
      getFormInfo: {}
    }
  },
  computed: {
    currole: function() {
      return this.$store.state.user.roles[0]
    }
  },
  created() {
    this.getOrderList()
    console.log(this.$store.state.user.storename)
  },
  methods: {
    // 转订单
    transferOrder(data) {
      console.log(data)
      transorder(data).then(res => {
        console.log(res)
        this.getOrderList()
      })
    },
    //出库状态
    deliveryStatus(status, data) {
      if (status == '1') {
        return this.$t('message.拣货中')
      } else if (status == '2') {
        return this.$t('message.拣货完成')
      } else if (status == '3') {
        return this.$t('message.已出库')
      }
    },
    imgurl(imgid) {
      // if (imgid.slice(0, 4) == 'http') {
      //   return imgid
      // }
      return ImgUrl(imgid)
    },
    // 取消
    cancel() {
      console.log(this.form)
      ;(this.form.logId = ''),
        (this.form.logType = ''),
        (this.dialogFormVisible = false)
    },
    // 获取表单信息
    getForm(form) {
      // console.log(form)
      this.dialogFormVisible = true
      this.form = form
    },
    // 填写出货信息
    shipmentInfor(infoData) {
      console.log(infoData)
      if (this.form.logId == '' || this.form.logType == '') {
        alert('请完善出货信息')
      } else {
        this.dialogFormVisible = false
        let newFormStatus = '2'
        ;(this.getFormInfo.deliveryStatus = '3'),
          (this.getFormInfo.status = newFormStatus)
        receiptSave(this.getFormInfo).then(res => {
          // console.log(res)
          this.getOrderList()
        })
        const saveOrder = {
          status: newFormStatus,
          _id: this.getFormInfo.orderId,
          logId: this.getFormInfo.logId,
          logType: this.getFormInfo.logType
        }
        console.log(saveOrder)
        console.log(this.getFormInfo, saveOrder)
        save(saveOrder).then(res => {})
      }
    },
    // 查询结果
    query() {
      // 改
      delete this.listQuery.req.sid
      delete this.listQuery.req.uname
      if (this.shopName != '') {
        this.listQuery.req.sid = { $regex: this.shopName }
      }
      if (this.userName != '') {
        this.listQuery.req.uname = { $regex: this.userName }
      }
      this.getOrderList()
    },

    // 过滤方法 订单状态
    orderStatus(status) {
      switch (status) {
        case '0':
          return this.$t('message.待付款')
          break
        case '1':
          return this.$t('message.待发货')
          break
        case '2':
          return this.$t('message.待收货')
          break
        case '3':
          return this.$t('message.已取消')
          break
      }
    },
    // 显示订单出库的状态
    changeStatusInfo(status) {
      switch (status) {
        case '0':
          return this.$t('message.已付款')
          break
        case '1':
          return this.$t('message.订单出库')
          break
        // case '2':
        //   return '完成出库'
        //   break
      }
    },
    // 显示产品拣货状态
    pickingStatus(status) {
      switch (status) {
        case '1':
          return this.$t('message.待拣货')
          break
        case '2':
          return this.$t('message.拣货完成')
          break
      }
    },
    pickStatus(status) {
      switch (status) {
        case '1':
          return this.$t('message.拣货完成')
          break
        case '2':
          return this.$t('message.等待发货')
          break
      }
    },
    // 更改产品拣货状态
    changePick(pickStatus, childrenData, parentData) {
      console.log(childrenData, parentData)
      let picks = pickStatus
      switch (pickStatus) {
        case '1':
          picks = '2'
          break
      }
      this.$set(childrenData, 'pickStatus', picks)
      let delivery = parentData.productList.every(v => {
        return v.pickStatus == '2'
      })
      if (delivery == true) {
        parentData.deliveryStatus = '2'
        parentData.transShow = false
      } else {
        parentData.deliveryStatus = '1'
        parentData.transShow = false
      }

      receiptSave(parentData).then(res => {
        console.log(res)
      })
    },
    // 请求订单接口
    getOrderList() {
      this.listLoading = true

      orderList(this.listQuery).then(res => {
        // console.log(res)
        if (res.code == 0) {
          console.log(res)
          this.list = res.data.items
          this.total = res.data.total
          console.log(this.list)
          for (var i = 0; i < this.list.length; i++) {
            this.product = res.data.items[i].productList
            for (var j = 0; j < this.list[i].productList.length; j++) {
              this.list[i].productList[j].status = this.list[i].status
            }
          }
          this.listLoading = false
          // console.log(this.product)
        }
      })
    },
    indexMethod(index) {
      return index++ + 1
    },

    // 点击修改状态
    changeStatus(status, data) {
      // console.log(status, data)
      if (status == '1') {
        if (data.deliveryStatus == '2') {
          this.getForm(data)
          this.getFormInfo = data
          this.getFormInfo._id = data._id
          console.log(this.getFormInfo)
        } else {
          this.$message(this.$t('message.拣货状态还未完成'))
        }
      }
    }
  }
}
</script>
<style scoped>
.el-collapse-item__header span {
  padding: 0px 100px;
}
</style>