<template> 
  <div class="app-container">

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>{{$t('message.筛选搜索')}}</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          {{$t('message.查询搜索')}}
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          {{$t('message.重置')}}
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item :label="$t('message.输入搜索：')">
            <el-input v-model="listQuery.orderSn" class="input-width" :placeholder="$t('message.订单编号')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.收货人：')">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" :placeholder="$t('message.收货人姓名/手机号码')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.提交时间：')">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
              :placeholder="$t('message.请选择时间')">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('message.全部')" name="t1" :key="'t1'">
        <div style="background: rgb(189, 189, 187); display: inline">
        </div>
      </el-tab-pane>
      <el-tab-pane :key="item.label" :label="item.label" :name="item.label" v-for="(item) in statusOptions">
        <div style="background: green; display: inline">
        </div>
      </el-tab-pane>
     
    </el-tabs>

    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;"
        v-loading="listLoading" border>
        
        <el-table-column :label="$t('message.编号')" min-width="5%" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="$t('message.订单编号')" min-width="17%" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column :label="$t('message.提交时间')" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column :label="$t('message.客户账号')" min-width="13%">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column :label="$t('message.订单金额')" min-width="10%" align="center">
          <template slot-scope="scope">₽{{scope.row.totalAmount}}</template>
        </el-table-column>
        <el-table-column :label="$t('message.支付方式')" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.payType | formatPayType}}</template>
        </el-table-column>
        <el-table-column :label="$t('message.代发代收')" min-width="10%" align="center">
          <template slot-scope="scope"><p>{{scope.row.orderType }}</p><p>{{scope.row.status }}</p>  </template>
        </el-table-column>
        <el-table-column :label="$t('message.代收金额')" min-width="10%" align="center">
          <template slot-scope="scope"><p>{{scope.row }}</p>  </template>
        </el-table-column>
        <el-table-column :label="$t('message.订单状态')" min-width="10%" align="center">
          <template slot-scope="scope">{{formatStatus(scope.row.status,scope.row.states) }}</template>
        </el-table-column>
        <el-table-column :label="$t('message.操作')" min-width="20%" align="center">
          <template slot-scope="scope">

            <div v-if="roles[0]!=$t('message.操作')">
              <el-button-group>
                
                <el-button size="mini" @click="handleViewOrder(scope.row)" inline>{{$t('message.查看')}} </el-button>
                
                <el-button size="mini" v-show="scope.row.payStatus === 0 &&  scope.row.payType != 1 "
                  @click="handlePayOrder(scope.$index, scope.row)" inline>{{$t('message.确认收款')}}
                </el-button>

                <el-button size="mini" v-show="scope.row.status=== 0 &&  scope.row.payType == 1 "
                  @click="handleOrderOper($t('message.确认赊账') ,scope.row)" inline>{{$t('message.确认赊账')}} </el-button>

                <el-button size="mini" v-show="scope.row.status=== 0 &&  scope.row.payType != 1 "
                @click="handleOrderOper($t('message.委托收款'), scope.row)" inline>{{$t('message.委托收款')}}
              </el-button>


                <el-button size="mini" v-show="scope.row.status=== 0 &&  scope.row.payType != 1 "
                  @click="handleOrderOper($t('message.中转发货'),scope.row)" inline>{{$t('message.中转发货')}}
                </el-button>
                
                <el-button size="mini" @click="handleDeliveryOrder(scope.$index, scope.row)"
                  v-show="scope.row.status=== 1 " inline>{{$t('message.发货')}}</el-button>
                <el-button size="mini" @click="handleCloseOrder(scope.$index, scope.row)"
                  v-show="scope.row.status===0  " inline>{{$t('message.关闭')}}</el-button>

                <el-button size="mini" @click="handleViewLogistics(scope.$index, scope.row)"
                  v-show="scope.row.status===2||scope.row.status===3 " inline>{{$t('message.跟踪')}}</el-button>
              </el-button-group>
            </div>

            <div v-else>
              <el-button-group>
                <el-button size="mini" @click="handleViewOrder(scope.row)" inline>{{$t('message.查看')}} </el-button>
              </el-button-group>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :total="total">
      </el-pagination>
    </div>


    <el-dialog :title="OrderOper.title" :visible.sync="OrderOper.dialogVisible" width="30%">
      <span style="vertical-align: top">{{$t('message.操作备注：')}}</span>
      <el-input style="width: 80%"  :placeholder="$t('message.请输入内容')" v-model="OrderOper.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="OrderOper.dialogVisible = false">{{$t('message.取 消')}}</el-button>
        <el-button type="primary" @click="handleOrderOperConfirm">{{$t('message.确 定')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('message.订单支付确认')" :visible.sync="payOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">{{$t('message.操作备注：')}}</span>
      <el-input style="width: 80%"  :placeholder="$t('message.请输入内容')" v-model="payOrder.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payOrder.dialogVisible = false">{{$t('message.取 消')}}</el-button>
        <el-button type="primary" @click="handlePayOrderConfirm">{{$t('message.确 定')}}</el-button>
      </span>
    </el-dialog>



    <logistics-dialog v-model="logisticsDialogVisible" :deliverySn.sync="deliverySn"></logistics-dialog>
  </div>
</template>
<script>

  import { fetchList, closeOrder, deleteOrder, payOrder,confirmLoan,updateOrderNote } from '@/api/order'

  import { formatDate } from '@/utils/date';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import { mapGetters } from 'vuex'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,

    orderSn: null,
    receiverKeyword: null,
    status: null,
    orderType: 1,
    sourceType: null,
    createTime: null,
  };
  export default {
    name: "orderList",
    components: { LogisticsDialog },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'dept',
        'user',
        'roles'
      ])
    },
    data() {
      return {
        activeName: "all",
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: "",

        //dialogVisible:false,
        OrderOper: {
          dialogVisible: false,
          content: null,
          title:"",
          orderIds: []
        },

        payOrder: {
          dialogVisible: false,
          content: null,
          orderIds: []
        },

        statusOptions: [
          {
            label: $t('message.待付款'),
            value: 0
          },
          {
            label: $t('message.待付款'),
            value: 1
          }
        ],
        
        logisticsDialogVisible: false,
        deliverySn: null
      }
    },
    created() {
      this.getList();
    },
    handleViewOrder(row) {
        this.$router.push({ path: '/oms/orderDetail', query: { id: row.id } })
      },
    methods: {
      formatStatus(value,pattype) {
        // return this.statusOptions[value].label
        if (value === 1) {
          return this.$t('message.待发货');
        } else if (value === 2) {
           if(pattype ==1 )
            return this.$t('message.已发货(赊账)');
           return this.$t('message.已发货(已收款)');
        } else if (value === 3) {
          return this.$t('message.已完成');
        } else if (value === 4) {
          return this.$t('message.已关闭');
        } else if (value === 5) {
          return this.$t('message.无效订单');
        } else {
          return this.$t('message.待付款');
        }
      },

      handleOrderOper(title,row){
        this.OrderOper.dialogVisible = true
        this.OrderOper.orderIds = [row.id]
        this.OrderOper.title=title
        this.OrderOper.order=row
      },


      confirmLoanOrder(index, row) {
        let ids = [];
        ids.push(row.id);
        this.confirmLoan(ids);
      },
      confirmLoan(ids) {
        this.$confirm(this.$t('message.是否要同意该操作?'), this.$t('message.提示'), {
          confirmButtonText:this.$t('message.确定?'),
          cancelButtonText:this.$t('message.取消'),
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          confirmLoan(params).then(response => {
            this.$message({
              message: this.$t('message.操作成功！'),
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        })
      },


      handleOrderOperConfirm(){

        let params = new URLSearchParams();
        params.append("id",this.OrderOper.orderIds);
        params.append("note",this.OrderOper.content);

      //订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 6->委托收款发货 7->委托发货 
        switch(this.OrderOper.title){
          case this.$t('message.中转发货'):
          params.append("status",7);
            break;
          case this.$t('message.中转收款发货'):
            params.append("status",6);
          break;
          case this.$t('message.订单关闭'):
            params.append("status",4);
          break;
          case this.$t('message.赊账确认'):
            params.append("status",1);
          break;

          case this.$t('message.发货'):
            //params.append("status",2);
            let listItem = this.covertOrder(row);
            this.$router.push({ path: '/oms/deliverOrderList', query: { list: [listItem] } })
            return;
        }

        
          updateOrderNote(params).then(response=>{
            this.getList();
            this.OrderOper.dialogVisible = false
            
            this.$message({
              type: 'success',
              message: this.OrderOper.title+this.$t('message.成功!')
            });
           
          });
      },
      handleTabClick() {
        console.log(this.activeName)
        for (var i in this.statusOptions) {
          if (this.statusOptions[i].label == this.activeName) {
            //this.listQuery.ddd=""
          }
        }

        this.handleSearchList()
      },

      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },

      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      


      

      // handleOper(code, row) {
        
      //   this.closeOrder.dialogVisible = true;
      //   this.closeOrder.orderIds = [row.id];
      // },

      handlePayOrder(index, row) {

        
        this.payOrder.dialogVisible = true;
        this.payOrder.orderIds = [row.id];
      },

      handleDeliveryOrder(index, row) {
        let listItem = this.covertOrder(row);
        this.$router.push({ path: '/oms/deliverOrderList', query: { list: [listItem] } })
      },

      handleViewLogistics(index, row) {
        if (row.deliverySn == null) {
          this.$message({
            message: this.$t('message.尚未填写物流单号'),
            type: 'warning',
            duration: 1000
          });
          return;
        } else {
          this.deliverySn = row.id
          this.logisticsDialogVisible = true;
        }
      },
      handleDeleteOrder(index, row) {
        let ids = [];
        ids.push(row.id);
        this.deleteOrder(ids);
      },

      handleshoukuan(){

      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },

      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleCloseOrderConfirm() {
        if (this.closeOrder.content == null || this.closeOrder.content === '') {
          this.$message({
            message: this.$t('message.操作备注不能为空'),
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrder.orderIds);
        params.append('note', this.closeOrder.content);
        closeOrder(params).then(response => {
          this.closeOrder.orderIds = [];
          this.closeOrder.dialogVisible = false;
          this.getList();
          this.$message({
            message: this.$t('message.修改成功'),
            type: 'success',
            duration: 1000
          });
        });
      },

      handlePayOrderConfirm() {
        if (this.payOrder.content == null || this.payOrder.content === '') {
          this.$message({
            message: this.$t('message.操作备注不能为空'),
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.payOrder.orderIds);
        params.append('note', this.payOrder.content);
        payOrder(params).then(response => {
          this.payOrder.orderIds = [];
          this.payOrder.dialogVisible = false;
          this.getList();
          this.$message({
            message: this.$t('message.修改成功'),
            type: 'success',
            duration: 1000
          });
        });
      },

      getList() {
        this.listLoading = true;

        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      // deleteOrder(ids) {
      //   this.$confirm('是否要进行该删除操作?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     let params = new URLSearchParams();
      //     params.append("ids", ids);
      //     deleteOrder(params).then(response => {
      //       this.$message({
      //         message: '删除成功！',
      //         type: 'success',
      //         duration: 1000
      //       });
      //       this.getList();
      //     });
      //   })
      // },
      
      covertOrder(order) {
        let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
        let listItem = {
          orderId: order.id,
          orderSn: order.orderSn,
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverPostCode: order.receiverPostCode,
          address: address,
          deliveryCompany: null,
          deliverySn: null
        };
        return listItem;
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>