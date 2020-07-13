<template>
  <div class="app-container">
    <div style="margin: 3px">
      <el-form :inline="true" :model="listQuery" label-width="100px" size="mini">
        <el-form-item>
          <el-input style="width: 203px" :placeholder="$t('message.店铺名称')" v-model="shopName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 203px" :placeholder="$t('message.用户名称')" v-model="userName" clearable></el-input>
        </el-form-item>
        <el-button @click="query()" size="mini">{{$t('message.查询')}}</el-button>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="list" style="width: 100%" >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table ref="productTable" style="width: 100%; " border :data="scope.row.productList">
              <el-table-column type="selection" width="40" align="center"></el-table-column>
              <el-table-column :label="$t('message.序号')" type="index" width="60" align="center" :index="indexMethod"></el-table-column>
              <el-table-column :label="$t('message.产品图片')" align="center">
                <template slot-scope="scope" prop="skuImg">
                  <img width="100" height="100" :src="imgurl(scope.row.skuImg)" alt />
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.产品编号')" align="center" prop="productSn"></el-table-column>
              <el-table-column :label="$t('message.产品数量')" align="center" prop="productNumber"></el-table-column>
              <el-table-column :label="$t('message.产品价格')" align="center" prop="skuprice"></el-table-column>
              <el-table-column :label="$t('message.商品编号')" align="center" prop="skucode"></el-table-column>
              <el-table-column :label="$t('message.商铺名称')" align="center" prop="sid"></el-table-column>
              <el-table-column :label="$t('message.用户ID')" align="center" prop="uid"></el-table-column>
              <el-table-column :label="$t('message.下单时间')" align="center" prop="_createtime">
                <template slot-scope="{ row }">
                  <span>{{ row._createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('message.更新时间')" align="center" prop="updatetime">
                <template slot-scope="{ row }">
                  <span>{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="订单状态" width="100" align="center">
                <template slot-scope="scope" prop="status">
                  <el-tag effect="plain" type="danger">{{orderStatus(scope.row.status)}}</el-tag>
                </template>
              </el-table-column>-->
              <!-- <el-table-column label="操作" width="100" align="center">
                <template>
                  <p>
                    <el-button size="mini" type="success" @click="dialogFormVisible = true">编辑</el-button>
                  </p>
                </template>
              </el-table-column>-->
            </el-table>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.店铺名称')" prop="sid"></el-table-column>
        <el-table-column :label="$t('message.用户名称')" prop="uname"></el-table-column>
        <el-table-column :label="$t('message.订单编号')" prop="_id"></el-table-column>
        <el-table-column :label="$t('message.订单金额')" prop="totalPrice">
          <template slot-scope="{ row }">
            <span>{{' ₽'+ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.下单时间')" prop="_createtime">
          <template slot-scope="{ row }">
            <span>{{ row._createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.更新时间')" prop="updatetime">
          <template slot-scope="{ row }">
            <span>{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.订单状态')" align="center">
          <template slot-scope="scope" prop="status">
            <el-tag effect="plain" type="danger">{{orderStatus(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.修改订单状态')" align="center">
          <template prop="(status,_id)" slot-scope="scope">
            <el-button type="primary" size="mini"
              @click="changeStatus(scope.row.status,scope.row._id,scope.row.uid,scope.row)"
              v-if="scope.row.status=='0'">{{changeStatusInfo(scope.row.status)}}</el-button>
            <!-- <el-button
              type="danger"
              size="mini"
              @click="cancelOrder(scope.row.status,scope.row._id,scope.row)"
            >{{cancelOrderStatus(scope.row.status)}}</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.paging.page" :page-sizes="[10, 30, 50]"
        :limit.sync="listQuery.paging.limit" @pagination="getOrderList" />
    </div>
  </div>
</template>

<script>
  import { orderList, save } from '@/api/order'
  import { receiptSave } from '@/api/warehouse'
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
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px'
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      //取消订单
      // cancelOrder(status,id,data){
      //   console.log(status,id,data)
      //   const obj = {
      //     status: '4',
      //     _id: id
      //   }
      //   save(obj).then(res => {
      //     console.log(res);
      //     this.getOrderList()
      //   })
      // },
      imgurl(imgid) {
        // if (imgid.slice(0, 4) == 'http') {
        //   return imgid
        // }
        return ImgUrl(imgid)
      },
      query() {
        delete this.listQuery.req.sid
        delete this.listQuery.req.uname
        if (this.shopName != '') {
          this.listQuery.req.sid = { $regex: this.shopName }
        }
        if (this.userName != '') {
          this.listQuery.req.uname =  { $regex: this.userName }
        }
        this.getOrderList()
      },
      // 过滤方法
      // 取消订单
      cancelOrderStatus(status) {
        switch (status) {
          case '0':
            return this.$t('message.取消订单')
            break
          case '1':
            return this.$t('message.取消订单')
            break
          case '2':
            return this.$t('message.取消订单')
            break
          case '3':
            return this.$t('message.取消订单')
            break
          case '4':
            return this.$t('message.取消订单成功')
            break
        }
      },
      // 订单状态
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
            return this.$t('message.已完成')
            break
          case '4':
            return this.$t('message.已取消')
            break
        }
      },
      // 页面显示修改后订单状态
      changeStatusInfo(status) {
        switch (status) {
          case '0':
            return this.$t('message.确认收款')
            break
          // case '1':
          //   return '确认发货'
          //   break
          // case '2':
          //   return '已收货'
          //   break
          // case '3':
          //   return '已取消'
          //   break
        }
      },
      // 请求订单接口
      getOrderList() {
        this.listLoading = true

        orderList(this.listQuery).then(res => {
          if (res.code == 0) {
            console.log(res)
            this.list = res.data.items
            console.log(this.list, 'list')

            this.total = res.data.total
            // console.log(this.total)
            // console.log(this.list)
            for (var i = 0; i < this.list.length; i++) {
              // console.log(this.list[i].status)
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
      changeStatus(status, id, uid, data) {
        console.log(status, id, uid, data)
        let newStatus = status
        switch (status) {
          case '0':
            newStatus = '1'
            break
          case '1':
            newStatus = '2'
            break
        }
        if (newStatus == '1') {
          const { productList, sid, status, totalPrice, uid, uname, _id } = data
          productList.map(v => {
            this.$set(v, 'pickStatus', '1')
          })

          const receiptOrder = {
            productList,
            sid,
            status: newStatus,
            totalPrice,
            uid,
            uname,
            orderId: _id,
            pid: sid,
            deliveryStatus: '1',
            transShow:true
          }
          console.log(receiptOrder)
          receiptSave(receiptOrder).then(res => {
            // console.log(res)
          })
        }
        const obj = {
          status: newStatus,
          _id: id,
          uid: uid
        }
        save(obj).then(res => {
          // console.log(res)
          this.getOrderList()
        })
      }
    }
  }
</script>
<style scoped>
  .el-collapse-item__header span {
    padding: 0px 100px;
  }
</style>