<template>
  <div style="margin-top: 50px">
    
    <el-form :model="value" ref="productAttrForm" :rules="rules" label-width="120px" style="width: 1000px" size="small"
      :disabled="edittype== 'view'">

      <el-form-item :label="$t('message.商品主图：')" prop="picList">
        <multi-upload drag v-model="selectProductPics" :disabled="isdisable"></multi-upload>
        <span></span>
      </el-form-item>
      <el-form-item :label="$t('message.商品属性：')" v-if="catattrs">
        <div>
          <el-row>
            <el-col :span="8" v-for="(cat,i) in  catattrs" :key="i">
              <el-form-item :label="cat.name">
                <el-select allow-create filterable default-first-option v-model="value.attributeList[cat.name]"
                  :placeholder="$t('message.请选择')" size="mini" width="200px">
                  <el-option v-for="item in cat.values" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item :label="$t('message.商品详情：')" prop="detial">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane :label="$t('message.移动端详情')" name="mobile" :disabled="isdisable">
            <tinymce width="100%" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane :label="$t('message.电脑端详情')" name="pc" :disabled="isdisable">
            <tinymce width="100%" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item style="text-align: center">

      </el-form-item>
    </el-form>
    <div class="pagefoot">
      <el-button size="mini" @click="$emit('prevStep')">{{$t('message.上一步，商品信息')}}</el-button>
      <el-button size="mini" @click="handleNext()">{{$t('message.下一步，商品Sku属性')}}</el-button>
      <el-button size="mini" @click="$emit('close')" v-if="this.edittype == 'view'">{{$t('message.关闭')}}</el-button>
    </div>
  </div>
</template>
<script>
  // import { fetchList as fetchProductAttrCateList } from '@/api/productAttrCate'
  import { addribute } from '@/api/category'
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'
  import Tinymce from '@/components/Tinymce'
  import { uploadImg, ImgUrl, ImgID, ImgUrlPath } from '@/api/upload'

  export default {
    name: 'ProductAttrDetail',
    components: { SingleUpload, MultiUpload, Tinymce },
    props: {
      value: Object,
      categoryId: '',
      bload: false,
      edittype: {
        type: String,
        default: ''
      }
    },

    data() {
      var picListRule = (rule, value, callback) => {
        console.log(this.selectProductPics)
        if (this.selectProductPics.length == 0) {
          callback(new Error(this.$t('message.请选择主图')))
        } else {
          callback()
        }
      }
      return {
        catattrs: {},
        sku: true,
        ColorList: [],
        SkuList: [],
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

        rules: {
          picList: [{ required: true, type: 'array', validator: picListRule, trigger: 'blur' }],

          // name: [
          //   { required: true, message: '请输入商品名称', trigger: 'blur' },
          //   {
          //     min: 2,
          //     max: 100,
          //     message: '长度在 2 到 100 个字符',
          //     trigger: 'blur'
          //   }
          // ],
          // goRoom: [{ required: true, message: '请输入发货地', trigger: 'blur' }],

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
      //商品的主图和画册图片
      selectProductPics: {
        get: function () {
          let pics = []

          if (
            this.value.pic != undefined &&
            this.value.pic == null &&
            this.value.pic != ''
          ) {
            pics.push(ImgUrl(this.value.pic))
          }

          if (
            this.value.albumPics === undefined ||
            this.value.albumPics == null ||
            this.value.albumPics === ''
          ) {
            return pics
          }

          let albumPics = this.value.albumPics //.split(",");
          for (let i = 0; i < albumPics.length; i++) {
            pics.push(ImgUrl(albumPics[i]))
          }

          return pics
        },
        set: function (newValue) {
          this.value.albumPics = []
          if (newValue == null || newValue.length === 0) {
            this.value.pic = ''
          } else {
            this.value.pic = newValue[0]

            for (var i in newValue) {
              this.value.albumPics.push(ImgID(newValue[i]))
            }
          }
        }
      },
      attrGroup() {
        return this.SkuDefine.AttrGroup
      },
      //商品的编号
      productId() {
        return this.value.id
      },
      //商品的编号
      attriId() {
        return this.value.subTitle
      },
      currole: function () {
        return this.$store.state.user.roles[0]
      },
      isdisable: function () {
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
    },
    created() {

      console.log(this.value);


      //if(this.AttrOptions.length ==0)
      //this.LoadData();
      //this.getProductAttrCateList();
      // this.SkuDefine.selectedColor = []
      // this.SkuDefine.skutemp = []
      // this.SkuDefine.AttrVals = [{"items":[]},{"items":[]},{"items":[]}]
      // this.SkuDefine.AttrGroup
      //this.getAttr()
    },

    // beforeMount() {
    //   if (this.SkuDefine.selectedColor.length == 0) {
    //     alert("empty")
    //     return
    //   }

    //   console.log("mounted", this.SkuDefine)

    // },
    watch: {
      categoryId: function (newValue) {
        if (newValue === undefined || newValue == null || newValue === 0) return
        this.fetchSkuaddr(newValue)
      }
    },
    methods: {
      fetchSkuaddr(id) {
        if (typeof (id) == "undefined" || id == "")
          return
        addribute(id, 'product').then(res => {
          if (res.code == 0) {
            this.catattrs = res.data.items
            for (var i in res.data.items) {
              console.log("item", res.data.items[i])
              this.catattrs[res.data.items[i].name] = res.data.items[i].values
            }
          }
        })
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
        let skutemp = []

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
        return { id: data.name }
      },
      // doUpload() {
      //   return hfapi.uploadAvatar()
      // },
      // getimg(obj) {
      //   return hfapi.getAvatar(obj.imgid)
      // },
      handleAvatarSuccess(res, file) {
        if (res.code == 0) {
          var id = res.data.id
          for (var i in this.ColorList) {
            if (this.ColorList[i].name == id) {
              this.ColorList[i].imgid = res.data.fid
            }
          }
        }
      },

      LoadData() {
        if (this.value.categoryId != '') this.fetchSkuaddr(this.value.categoryId)
      },
      handleEditCreated() {
        //根据商品属性分类id获取属性和参数
        this.hasEditCreated = true
      },

      handleNext() {

        if (this.isdisable) {
          this.$emit('nextStep')
          return
        }


        this.$refs["productAttrForm"].validate(valid => {
          if (valid) {
            //if (this.addtionvalidate()) 
            this.$emit('nextStep')
          } else {
            this.$message({
              message: this.$t('message.验证失败'),
              type: 'error',
              duration: 1000
            })
            return false
          }
        })
      },

      // handleClose() {
      //   this.$emit('close')
      //   // this.$store.dispatch('tagsView/delView', this.$route)
      //   // this.$router.go(-1)
      // },
      // handlePrev() {
      //   this.$emit('prevStep')
      // },
      // handleNext() {
      //   // this.mergeProductAttrValue();
      //   // this.mergeProductAttrPics();

      //   this.$emit('nextStep')
      // },


      // handleFinishCommit() {
      //   //this.value.subTitle=JSON.stringify(this.SkuDefine.skutemp)
      //   let SkuDefine = {};
      //   if (this.sku != undefined) {
      //     SkuDefine.AttrGroup = [];
      //     SkuDefine.SkuList = this.SkuList;
      //     SkuDefine.ColorList = this.ColorList;
      //     for (var i in this.AttrOptions) {
      //       let attr = { code: this.AttrOptions[i].code };
      //       attr.values = this.AttrOptions[i].values;
      //       SkuDefine.AttrGroup.push(attr);
      //     }
      //   }

      //   //his.$emit('setSkuDefine', this.SkuDefine);
      //   //this.SkuDefine.AttrVals = this.AttrVals
      //   this.$emit("finishCommit", this.isEdit, SkuDefine);
      // }
    }
  }
</script>

<style scoped>
  .pagefoot {
    text-align: center;
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

  .tinymce-container {
    width: 880px !important;
  }
</style>