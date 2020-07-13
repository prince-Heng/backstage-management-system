<template>
  <div style="margin-top: 50px">
    <!-- <span>{{value.sourceId}} ={{currole}} =={{value.shopId}}</span> -->
    <el-form
      :model="product"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      style="width: 700px"
      size="small"
      :clearable="true"
      :disabled="edittype== 'view'"
    >
      <el-form-item :label="$t('message.商品分类')" prop="productaa">
        <!-- prop="productCategoryId" -->
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions"
          :props="{label:'name' , children:'items',value:'id'}"
          style="width: 100%"
          @change="catchange"
        ></el-cascader>
      </el-form-item>
      <el-form-item :label="$t('message.商品名称')" prop="name">
        <el-input v-model="product.name" :disabled="isdisable"></el-input>
      </el-form-item>
      <el-form-item v-if="checkPsn==''" :label="$t('message.商品货号：')" prop="productSn">
        <el-input v-model="product.productSn" :disabled="isdisable"></el-input>
      </el-form-item>
       <el-form-item v-else :label="$t('message.商品货号：')" >
        <el-input v-model="product.productSn" disabled></el-input>
      </el-form-item>

      <div v-if="currole != 'b'">
        <!-- 批发商和管理员 -->
        <el-form-item :label="$t('message.商品批发价:')" prop="bradePrice">
          <el-input v-model="product.bradePrice"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.建议零售价:')">
          <el-input v-model="product.price" :disabled="isdisable"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.商品库存:')" v-if="product.sourceId == null" prop="stock">
          <el-input v-model="product.stock" :disabled="isdisable"></el-input>
        </el-form-item>
      </div>
      <!-- {{product }} -->
      <!-- {{product._id}} -->
      <div v-if="currole == 'b'">
        <!-- 总池代理商品 -->
        <div v-if="!product.pid && product.publicStatus == 'yes'">
          <el-form-item :label="$t('message.批发商批发价:')">
            <el-input v-model="product.bradePrice" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.零售价:')">
            <el-input v-model="product.price" :disabled="isdisable2"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.商品云库存:')">
            <el-input v-model="product.stockcloud" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.商品本地库存:')" prop="stock">
            <el-input v-model="product.stock" :disabled="isdisable2"></el-input>
          </el-form-item>
        </div>

        <!-- 查看代理商品 或是自己的-->

        <!-- 自己的 -->
        <div v-if="!product.pid &&product.publicStatus == 'no'">
          <el-form-item :label="$t('message.市场销售价:')" prop="price">
            <el-input v-model="product.price" :disabled="isdisable"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.商品库存:')" prop="stock">
            <el-input v-model="product.stock" :disabled="isdisable"></el-input>
          </el-form-item>
        </div>

        <div v-if="product.pid">
          <!-- 查看代理 -->
          <el-form-item :label="$t('message.批发商批发价:')" prop="price">
            <el-input v-model="product.bradePrice" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.零售价:')" prop="price">
            <el-input v-model="product.price" :disabled="isdisable2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.商品云库存:')">
            <el-input v-model="product.stockcloud" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.商品库存:')" v-if="product.sourceId == null">
            <el-input v-model="product.stock"></el-input>
          </el-form-item>
        </div>
      </div>

      <!-- <div>------shopid-{{value.shopId}}---dept-{{$store.state.user.deptid}} ---sid--{{value.sourceId}}---</div> -->

      <el-form-item :label="$t('message.商品发货地')" prop="selectAddraa">
        <el-cascader
          v-model="selectAddr"
          :options="addresslist"
          style="width: 100%"
          :disabled="isdisable"
          :clearable="true"
        ></el-cascader>
      </el-form-item>
      <el-form-item :label="$t('message.计量单位：')" prop="unit">
        <!-- <el-input v-model="product.unit" :disabled="isdisable"></el-input> -->

        <el-select
          v-model="product.unit"
          allow-create
          filterable
          default-first-option
          :placeholder="$t('message.请选择')"
          style="width: 100%"
        >
          <el-option
            v-for="item in unitlist"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('message.商品规格：')" prop="weightOrSize">
        <el-form-item :label="$t('message.体积：')">
          <el-input v-model="product.volume" :disabled="isdisable">
            <!-- <span style="margin-left: 20px">立方米</span> -->
            <template slot="append">{{$t('message.立方米')}}</template>
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('message.长宽高：')">
          <el-row>
            <el-col :span="8">
              <el-input v-model="product.length" :disabled="isdisable">
                <template slot="append">{{$t('message.厘米')}}</template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="product.width" :disabled="isdisable">
                <template slot="append">{{$t('message.厘米')}}</template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="product.height" :disabled="isdisable">
                <template slot="append">{{$t('message.厘米')}}</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form-item>

      <el-form-item :label="$t('message.商品重量：')">
        <el-input v-if="selectValues=='3'" v-model="product.weight" :disabled="isdisable">
          <template slot="append">{{$t('message.千克')}}</template>
        </el-input>
        <el-input v-model="product.weight" :disabled="isdisable" v-else>
          <template slot="append">{{$t('message.克')}}</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="pagefoot">
      <el-button size="mini" @click="handleNext">{{$t('message.下一步，商品属性')}}</el-button>
      <el-button
        size="mini"
        @click="$emit('close')"
        v-if="this.edittype == 'view'"
      >{{$t('message.关闭')}}</el-button>
    </div>
  </div>
</template>

<script>
import { getProduct, fetchList, checkSn } from '@/api/product'
import { fetchList as categorylist } from '@/api/category'
import { systemdata } from '@/api/system'

export default {
  name: 'ProductInfoDetail',
  props: {
    value: Object,
    edittype: {
      type: String,
      default: ''
    }
  },

  data() {
    // 校验产品货号地唯一性
    var checkProductSn = (rule, value, callback) => {
      console.log('1', value)
        checkSn(value).then(res => {
          console.log("校验")
          if (res.code == 0) {
            if (res.data == 0) {
              callback()
            } else if (res.data > 0) {
              callback(this.$message('该商品货号已存在'))
            } else {
              this.$message('查询重复失败')
            }
          }
        })
      
    }
    var productRule = (rule, value, callback) => {
      if (this.selectProductCateValue.length == 0) {
        callback(new Error(this.$t('message.请选择商品分类')))
      } else {
        callback()
      }
    }
    var selectAddrRule = (rule, value, callback) => {
      if (this.selectAddr.length == 0) {
        callback(new Error(this.$t('message.请选择发货地')))
      } else {
        callback()
      }
    }
    var weightOrSizeRule = (rule, value, callback) => {
      console.log('dd')
      console.log(this.product)
      if (
        this.product.volume == null &&
        (this.product.length == null ||
          this.product.width == null ||
          this.product.height == null)
      ) {
        console.log('err')
        callback(new Error(this.$t('message.请输入规格')))
        return
      }
      if (
        this.product.volume == '' &&
        (this.product.length == '' ||
          this.product.width == '' ||
          this.product.height == '')
      ) {
        console.log('err')
        callback(new Error(this.$t('message.请输入规格')))
        return
      }

      if (
        this.product.volume == 0 &&
        (this.product.length == 0 ||
          this.product.width == 0 ||
          this.product.height == 0)
      ) {
        console.log('err')
        callback(new Error(this.$t('message.请输入规格')))
      } else {
        callback()
      }
    }
    return {
      checkPsn:this.value.productSn,
      product: {},
      parstock: 0,
      CatMap: [],
      unitlist: [],
      hasEditCreated: false,

      //选中商品分类的值
      selectProductCateValue: [],
      selectAddr: [],
      productCateOptions: [],
      brandOptions: [],

      rules: {
        productaa: [
          {
            required: true,
            type: 'array',
            validator: productRule,
            trigger: 'blur'
          }
        ],
        selectAddraa: [
          { required: true, validator: selectAddrRule, trigger: 'blur' }
        ],
        weightOrSize: [
          { required: true, validator: weightOrSizeRule, trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: this.$t('message.请输入商品名称'),
            trigger: 'blur'
          },
          {
            min: 2,
            max: 100,
            message: this.$t('message.长度在 2 到 100 个字符'),
            trigger: 'blur'
          }
        ],
        goRoom: [
          {
            required: true,
            message: this.$t('message.请输入发货地'),
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: this.$t('message.请输入单位'),
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            min: 1,
            message: this.$t('message.请输入库存'),
            trigger: 'blur'
          }
        ],
        // storelocation: [
        //   {  type: 'array',required: true, message: "请输入发货地", trigger: "blur" }
        // ],
        unit: [
          {
            required: true,
            message: this.$t('message.请输入'),
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: this.$t('message.请输入零售价'),
            trigger: 'blur'
          }
        ],
        bradePrice: [
          {
            required: true,
            message: this.$t('message.请输入批发价'),
            trigger: 'blur'
          }
        ],

        productSn: [
          {
            required: true,
            message: this.$t('message.请输入进货号'),
            trigger: 'blur'
          },
          { validator: checkProductSn, trigger: 'blur' }
        ],
        productCategoryId: [
          {
            required: true,
            message: this.$t('message.请选择商品分类'),
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: this.$t('message.请输入商品介绍'),
            trigger: 'blur'
          }
        ],
        selectAddr: [
          {
            type: 'array',
            required: true,
            message: this.$t('message.请输入发货地'),
            trigger: 'blur'
          }
        ],
        requiredProp: [
          {
            required: true,
            message: this.$t('message.该项为必填项'),
            trigger: 'blur'
          }
        ]
      },
      addresslist: []
    }
  },
  created() {
    console.log("获取信息",this.checkPsn)
    console.log(this.selectProductCateValue)
    this.product = this.value
    this.initdata()
    // console.log(this.product)
    // this.getBrandList();
  },

  computed: {
    //商品的编号
    productId() {
      return this.product.id
    },
    selectValues() {
      if (this.selectProductCateValue) {
        return this.selectProductCateValue[0]
      }
    },
    currole: function() {
      return this.$store.state.user.roles[0]
    },
    isdisable: function() {
      if (
        this.edittype == 'view' ||
        this.$store.state.user.roles[0] == this.$t('message.超级管理员')
      )
        return true

      if (this.product.sourceId != null) return true

      return false
    },
    isdisable2: function() {
      if (this.edittype == 'view') return true
      return false
    }
  },
  watch: {
    productId: function(newValue, oldValue) {
      if (!this.isEdit) return
      //if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.handleEditCreated() //初始化
    },
    selectAddr: function(newValue, oldval) {
      if (newValue != null) this.product.storelocation = newValue.join('/')
    }

    // selectProductCateValue: function (newValue) {
    //   if (newValue != null && newValue.length > 1) {
    //     this.value.productCategoryId = newValue[newValue.length - 1];

    //     this.value.productCategoryName = this.getCateName(
    //       newValue,
    //       this.productCateOptions
    //     );
    //   } else {
    //     this.value.productCategoryId = null;
    //     this.value.productCategoryName = null;
    //   }
    // }
  },

  methods: {
    catchange() {
      this.value.categoryId = this.selectProductCateValue[
        this.selectProductCateValue.length - 1
      ]
      this.$emit('catchanged', this.value.categoryId)
    },
    //处理编辑逻辑
    handleEditCreated() {
      // var r = [];
      // this.getCateList(
      //   r,
      //   this.value.productCategoryId,
      //   this.productCateOptions
      // );

      //this.selectProductCateValue = r.reverse();

      if (this.product.storelocation != null)
        console.log(this.product.storelocation)
      this.selectAddr = this.product.storelocation.split('/')
      // if (this.value.productCategoryId != null) {
      //   this.selectProductCateValue = [
      //     this.value.cateParentId,
      //     this.value.productCategoryId
      //   ];
      //   //this.selectProductCateValue.push(this.value.cateParentId);
      //   //this.selectProductCateValue.push(this.value.productCategoryId);
      // }
      this.hasEditCreated = true
    },
    initdata() {
      systemdata('addr').then(res => {
        if (res.code == 0) {
          this.addresslist = res.data.items
        }
      })
      systemdata('unit').then(res => {
        if (res.code == 0 && res.data.items.length == 1) {
          this.unitlist = res.data.items[0].Items
        }
      })
      this.getProductCateList()

      if (this.product.storelocation != null)
        this.selectAddr = this.product.storelocation.split('/')
      this.selectProductCateValue = this.CatMap[this.value.productId]
      console.log(this.selectProductCateValue)

      // if (this.value.sourceId != null) {
      //   getProduct(this.value.sourceId).then(res => {
      //     this.parstock = res.data.stock;
      //   });
      // }
    },
    // buildcattree(cat) {
    //   let node = {
    //     label: cat.name,
    //     value: cat.id
    //   };

    //   if (cat.children != null && cat.children.length > 0) {
    //     let children = [];
    //     for (let i = 0; i < cat.children.length; i++) {
    //       let child = this.buildcattree(cat.children[i]);
    //       children.push(child);
    //     }
    //     node.children = children;
    //   }
    //   return node;
    // },

    // clearLeafNodeItesm(node) {
    //   if (node.items.length == 0) {
    //     delete node.items
    //   }
    //   for (var i in node.items) {

    //     this.clearLeafNodeItesm(node.items[i])
    //   }
    // },
    addCatMap(par, node) {
      // console.log(par, node);

      par.push(node.id)
      if (node.items == undefined || node.items.length == 0) {
        this.CatMap.push({ id: node.id, list: par })
        delete node.items
      }
      for (var i in node.items) {
        let newpar = []
        newpar = newpar.concat(par)
        this.addCatMap(newpar, node.items[i])
      }
    },

    getCatIDList(id) {
      for (var i in this.CatMap) {
        if (this.CatMap[i].id == id) {
          return this.CatMap[i].list
        }
      }
      return []
    },

    getProductCateList() {
      categorylist().then(response => {
        console.log(response)
        this.productCateOptions = response.data.items
        for (var i in this.productCateOptions) {
          let par = []
          this.addCatMap(par, this.productCateOptions[i])
        }
        this.selectProductCateValue = this.getCatIDList(this.product.categoryId)
        console.log(this.selectProductCateValue)
      })
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.brandOptions = []
        let brandList = response.data.list
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id
          })
        }
      })
    },

    // getCateNameById(id) {
    //   let name = null;
    //   for (let i = 0; i < this.productCateOptions.length; i++) {
    //     for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
    //       if (this.productCateOptions[i].children[j].value === id) {
    //         name = this.productCateOptions[i].children[j].label;
    //         return name;
    //       }
    //     }
    //   }
    //   return name;
    // },

    // getCateList(result, id, list) {
    //   var flag = false;
    //   for (var i in list) {
    //     if (list[i].value == id) {
    //       flag = true;
    //       result.push(list[i].value);
    //       return true;
    //     }
    //   }

    //   for (var i in list) {
    //     if (this.getCateList(result, id, list[i].children)) {
    //       result.push(list[i].value);
    //       return true;
    //     }
    //   }
    //   return false;
    // },

    // getCateName(vals, list) {
    //   for (var i in list) {
    //     // console.log(vals[0])
    //     // console.log(list[i].value)
    //     if (list[i].value == vals[0]) {
    //       if (vals.length == 1) {
    //         return list[i].label;
    //       } else {
    //         return this.getCateName(vals.slice(1), list[i].children);
    //       }
    //     }
    //   }

    //   // for(var i in vals){

    //   // }
    //   // let name = null;
    //   // for (let i = 0; i < this.productCateOptions.length; i++) {
    //   //   for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
    //   //     if (this.productCateOptions[i].children[j].value === id) {
    //   //       name = this.productCateOptions[i].children[j].label;
    //   //       return name;
    //   //     }
    //   //   }
    //   // }
    //   // return name;
    // },
    addtionvalidate() {
      if (this.currole != 'B') {
        if (Number(this.product.price) == 0) {
          this.$message({
            message: this.$t('message.价格不能为 0'),
            type: 'error',
            duration: 1000
          })
          return false
        }
      }

      if (this.currole == 'B') {
        if (Number(this.product.stock) == 0) {
          this.$message({
            message: this.$t('message.库存不能为 0'),
            type: 'error',
            duration: 1000
          })
          return false
        }
      }

      if (this.selectAddr == '') {
        this.$message({
          message: this.$t('message.请选择发货地'),
          type: 'error',
          duration: 1000
        })
        return false
      }

      if (
        Number(this.product.weight) &&
        Number(this.product.volume) == 0 &&
        (this.product['length'] == undefined ||
          this.product.width == undefined ||
          this.product.height == undefined)
      ) {
        this.$message({
          message: this.$t('message.请输入商品规格：重量、体积或长宽高'),
          type: 'error',
          duration: 1000
        })
        return false
      }

      return true
    },
    handleNext() {
      if (this.isdisable) {
        this.$emit('nextStep')
        return
      }
      this.$refs['productInfoForm'].validate(valid => {
        if (valid) {
          if (this.addtionvalidate()) this.$emit('nextStep')
        }
        //  else {
        //   this.$message({
        //     message: this.$t('message.验证失败'),
        //     type: 'error',
        //     duration: 1000
        //   })
        //   return false
        // }
      })
    },
    handleBrandChange(val) {
      let brandName = ''
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label
          break
        }
      }
      this.product.brandName = brandName
    }
  }
}
</script>

<style scoped>
.pagefoot {
  text-align: center;
}
</style>