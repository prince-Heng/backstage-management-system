<template>
  <div style="margin-top: 50px">
    <el-row :gutter="10">
      <div v-for="(sku, index) in skulist" :key="index">
        <el-col :span="8" v-if="sku._delete!='xxx'">
          <el-card class="cardsku">
            <el-form
              ref="sku"
              :model="sku"
              label-width="100px"
              size="mini"
              :disabled="edittype== 'view'"
              :rules="rules"
            >
              <el-row>
                <el-col :span="8">
                  <el-upload
                    :disabled="sku.skucode==''"
                    class="avatar-uploader"
                    :action="uploadImg()"
                    :data="{ id:  sku.skucode }"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :fit="'fill'"
                      :src="imgurl(sku.pic)"
                      class="avatar"
                      v-if="sku.pic"
                    ></el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-col>
                <el-col :span="16">
                  <!-- 代理 -->
                  <el-form-item :label="$t('message.商品编号')" v-if="agent">
                    <el-input v-model="sku.skucode" disabled></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('message.商品编号')" v-else prop="skucode">
                    <el-input v-model="sku.skucode"></el-input>
                  </el-form-item>

                  <el-form-item
                    :label="$t('message.批发价格')"
                    :disabled="true"
                    v-if="sku.skuBradePrice"
                  >
                    <el-input
                      v-model="sku.skuBradePrice"
                      :disabled=" $store.state.user.roles.indexOf('B') ==-1"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('message.零售价格')">
                    <el-input v-model="sku.skuprice"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('message.库存')">
                    <el-input v-model="sku.skunum"></el-input>
                     <!-- <el-input-number v-model="sku.skunum" :min="1" :max="sku.skunum"></el-input-number> -->
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- <div v-for="(a,index) in  sku.attributeList">
              <el-form-item :label="a.name">
                <el-select v-model="a.value" placeholder="请选择" @change="saveSku(sku)">
                  <el-option v-for="item in catattrs[a.name]" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              </div>-->
              <!-- {{sku.attributeList}} -->

              <div v-for="(cat,i) in  catattrs" :key="i">
                <!-- 代理 -->
                <el-form-item :label="cat.name" :disabled="edittype== 'view'" v-if="agent">
                  <el-select
                    allow-create
                    default-first-option
                    filterable
                    v-model="sku.attributeList[cat.name]"
                    :placeholder="$t('message.请选择')"
                    disabled
                  >
                    <el-option v-for="item in cat.values" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="cat.name" :disabled="edittype== 'view'" v-else>
                  <el-select
                    allow-create
                    default-first-option
                    filterable
                    v-model="sku.attributeList[cat.name]"
                    :placeholder="$t('message.请选择')"
                  >
                    <el-option v-for="item in cat.values" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
            <div
              style="float:right;font-size:30px;"
              @click="handleDeleteSku(index,sku)"
              v-if="edittype != 'view'"
            >
              <i class="el-icon-circle-close"></i>
            </div>
          </el-card>
          <p></p>
        </el-col>
      </div>
    </el-row>

    <!-- <el-form>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，商品信息</el-button>
        <div v-if="edittype != 'view'">
          <el-button type="primary" size="medium" @click="handleAddSku" :disabled="edittype== 'view'">增加Sku</el-button>
          <el-button type="primary" size="medium" @click="handleFinishCommit" v-if="this.edittype != 'view'">完成，提交商品
          </el-button>
        </div>

        <el-button type="primary" size="medium" @click="handleClose" v-if="this.edittype == 'view'">关闭</el-button>

      </el-form-item> 
    </el-form>-->

    <div class="pagefoot">
      <el-button size="mini" @click="$emit('prevStep')">{{$t('message.上一步，商品属性')}}</el-button>
      <el-button
        size="mini"
        @click="handleFinishCommit"
        v-if="this.edittype != 'view'"
      >{{$t('message.完成，提交商品')}}</el-button>
      <el-button
        size="mini"
        @click="handleAddSku"
        :disabled="edittype== 'view'"
        v-if="!agent"
      >{{$t('message.增加Sku')}}</el-button>
      <!-- <el-button size="mini" @click="handleDeleteSku" :disabled="edittype== 'view'">删除Sku</el-button> -->
      <el-button size="mini" @click="$emit('close')">{{$t('message.关闭')}}</el-button>
    </div>
  </div>
</template>
<script>
// import { fetchList as fetchProductAttrCateList } from '@/api/productAttrCate'
import { addribute } from '@/api/category'
import { save, checkcode } from '@/api/sku'
import { skulist as fetchSkuList } from '@/api/product'
import { uploadImg, ImgUrl } from '@/api/upload'

import SingleUpload from '@/components/Upload/singleUpload'
import MultiUpload from '@/components/Upload/multiUpload'
import Tinymce from '@/components/Tinymce'
import router from '../../../router'
// import hfapi from '@/api/hf'
export default {
  name: 'ProductSkuDetail',
  components: { SingleUpload, MultiUpload, Tinymce },
  props: {
    value: Object,
    bload: false,
    categoryId: '',
    edittype: {
      type: String,
      default: ''
    }
  },
  data() {
    // 校验商品编号地唯一性
    var checkSkuCode = (rule, value, callback, source) => {
      checkcode(value).then(res => {
        if (res.data == 0) {
          callback()
        } else if (res.data > 0) {
          callback(this.$message('该商品编码已存在'))
        } else {
          this.$message('查询重复失败')
        }
      })
    }
    return {
      agent: false,
      catattrs: {},
      sku: true,
      ColorList: [],
      skulist: [],
      EditColorIndex: -1,
      AttrGroup: [],
      AttrOptions: [],

      // AttrVals: {},
      selectedArray: [],
      selectedArraysub: [],

      colorindex: 0,
      coloritem: [],
      //编辑模式时是否初始化成功
      hasEditCreated: false,

      //商品富文本详情激活类型
      activeHtmlName: 'mobile',
      // 校验
      rules: {
        skucode: [
          {
            required: true,
            message: this.$t('message.请输入商品编码'),
            trigger: 'blur',
            validator: checkSkuCode
          }
        ]
      }
    }
  },
  computed: {
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false
      }
      return true
    },

    isdisable: function() {
      if (
        this.edittype == 'view' ||
        this.$store.state.user.roles[0] == this.$t('message.超级管理员') ||
        this.value.sourceId != null
      )
        return true

      return false
    }
  },
  mounted() {
    this.LoadData()
    this.agentInfo()
  },
  watch: {
    categoryId: function(newValue) {
      if (newValue === undefined || newValue == null || newValue === 0) return
      this.fetchSkuaddr(newValue)
    },
    productId: function(newValue) {
      if (!this.isEdit) return
      //if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return

      this.handleEditCreated()
    }
  },
  methods: {
    // 获取身份是否为代理
    agentInfo() {
      if (this.value.pid) {
        this.agent = true
      }
    },
    // 删除SKU
    handleDeleteSku(index, sku) {
      this.$set(this.skulist[index], '_delete', 'xxx')
      // console.log(index, sku)
      // this.$set(sku, "_delete", '')
      // this.$forceUpdate()
    },
    handleAddSku() {
      this.skulist.push(this.getEmptySku())
    },
    uploadImg() {
      return uploadImg()
    },
    onColorRowClick(row, column, event) {
      var i = 0
      for (i in this.ColorList)
        if (this.ColorList[i] == row) this.EditColorIndex = i
    },

    onColorChange(value, row) {
      let fields = this.SkuList[this.EditColorIndex].id.split('_')
      fields[0] = value

      this.SkuList[this.EditColorIndex].id = fields.join('_')
    },
    AttrListChange(code) {
      // console.log('SkuDefine.AttrVals', code)

      if (code == 'skucolor') {
        let cs = this.AttrOptions[this.colorindex].items
        let as = this.AttrOptions[this.colorindex].values
        this.ColorList = []
        for (var i in as) {
          for (var j in cs) {
            if (as[i] == cs[j].name) {
              let c = {
                name: cs[j].name,
                code: cs[j].code,
                val: '',
                imgid: cs[j].imgid
              }
              this.ColorList.push(c)
            }
          }
        }
      }

      this.updateSku()

      this.$forceUpdate()
    },
    AppendAttr(templist, vals) {
      let temp = []
      for (var i in templist) {
        for (var j in vals) {
          temp.push({ id: templist[i].id + '_' + vals[j] })
        }
      }

      if (templist.length == 0) {
        for (var j in vals) {
          temp.push({ id: vals[j] })
        }
      }
      return temp
    },

    updateSku() {
      console.log('update')
      let skutemp = []
      console.log(this.AttrGroup)

      for (var i in this.AttrOptions) {
        let list = this.AttrOptions[i]

        if (this.AttrGroup.indexOf(list.code) != -1) {
          if (list.values.length > 0)
            skutemp = this.AppendAttr(skutemp, list.values)
        }
      }

      this.SkuList = skutemp
    },

    ////
    getSkuColorID(data) {
      console.log(data)
      return { id: data.name }
    },

    imgurl(imgid) {
      if (imgid.slice(0, 4) == 'http') {
        return imgid
      }
      return ImgUrl(imgid)
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        var id = res.data.id
        for (var i in this.skulist) {
          if (this.skulist[i].skucode == id) {
            this.$set(this.skulist[i], 'pic', res.data.fid)
            return
          }
        }
        this.$message.error('请先录入skuid')
      }
    },
    fetchSkuaddr(id) {
      if (typeof id == 'undefined' || id == '') return
      addribute(id, 'sku').then(res => {
        if (res.code == 0) {
          this.catattrs = res.data.items
          // for (var i in res.data.items) {
          //   console.log("item", res.data.items[i])
          //   this.catattrs[res.data.items[i].name] = res.data.items[i].values
          // }
        }
      })
    },
    getEmptySku() {
      let tmepSku = {
        attributeList: {},
        productSn: this.value.productSn,
        pic: '',
        price: 0.0,
        bradePrice: 0.0,
        skuId: ''
      }
      return tmepSku
    },
    LoadData() {
      if (this.value.categoryId != '') this.fetchSkuaddr(this.value.categoryId)
      if (this.value.productSn == '') return
      fetchSkuList(this.value.productSn, this.value.sid).then(res => {
        if (res.code == 0) {
          this.skulist = res.data.items
          console.log('sku编码', this.skulist)
          if (this.skulist.length == 0) {
            this.skulist.push(this.getEmptySku())
          }
        }
      })

      // if (this.value.categoryId != '')
      // this.fetchSkuaddr(this.value.categoryId)

      // console.log("subtitle", this.value.subTitle);
      // hfapi.listattr().then(res => {
      //   this.AttrOptions = res.data.items;
      //   for (var i in this.AttrOptions)
      //     if (this.AttrOptions[i].name == "颜色") {
      //       this.colorindex = i;
      //     }
      //   if (this.value.subTitle == "") return;

      //   hfapi.skulist(this.value.subTitle).then(res => {
      //     console.log("res", res);
      //     if (res.code == 200) {
      //       // let data = res.data
      //       // alert("skudata")
      //       // if (data.data.count == 1 && this.value.subTitle == data.data._id) { //临时 查询有问题
      //       let skudata = res.data;

      //       console.log("skudata", skudata);
      //       // this.SkuDefine = data.data.items[0]
      //       let AttrGroup = skudata.AttrGroup;

      //       for (var i in AttrGroup) {
      //         this.AttrGroup.push(AttrGroup[i].code);
      //         for (var j in this.AttrOptions) {
      //           if (this.AttrOptions[j].code == AttrGroup[i].code) {
      //             this.AttrOptions[i].values = [];
      //             this.AttrOptions[i].values = this.AttrOptions[
      //               i
      //             ].values.concat(AttrGroup[i].values);
      //           }
      //         }
      //       }
      //       this.ColorList = this.ColorList.concat(skudata.ColorList);
      //       this.SkuList = this.SkuList.concat(skudata.SkuList);

      //       this.$forceUpdate();
      //     }
      //   });
      // });
    },
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数

      this.hasEditCreated = true
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.mergeProductAttrValue()
      this.mergeProductAttrPics()

      this.$emit('nextStep')
    },

    // handleClose() {
    //   this.$store.dispatch('tagsView/delView', this.$route)
    //   this.$router.go(-1)
    // },

    handleFinishCommit() {
      console.log(this.edittype)
      for (var i in this.skulist) {
        if (
          typeof this.skulist[i]._id == 'undefined' &&
          typeof this.skulist[i]._delete != 'undefined'
        ) {
          continue
        }

        if (this.edittype == 'import') {
          delete this.skulist[i]._id
          this.skulist[i].sid = this.$store.getters.storename
        }
        if (this.skulist[i].pic == '') {
          this.$message.error(this.$t('message.请上传sku图片'))
          return
        }

        console.log('hahah', this.skulist[i])

        save(this.skulist[i])
      }
      this.$emit('finishCommit')
    }
  }
}
</script>

<style scoped>
.pagefoot {
  text-align: center;
}

.skuimg {
  width: 100px;
  height: 100px;
}

.el-input {
  width: 100%;
}

.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.el-form-item {
  margin: 3px;
}
</style>