<template>
  <el-card class="form-container" shadow="never" v-if="load">
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step :title="$t('message.填写商品信息')"></el-step>
      <el-step :title="$t('message.填写商品属性')"></el-step>
      <el-step :title="$t('message.设置SKU信息')"></el-step>
    </el-steps>

    <product-info-detail v-show="showStatus[0]" v-model="productParam" @catchanged="catchanged" :edittype="edittype"
      @nextStep="nextStep" @close="handleClose"></product-info-detail>

    <product-attr-detail v-show="showStatus[1]" v-model="productParam" :edittype="edittype" @prevStep="prevStep"
      :categoryId="categoryId" @nextStep="nextStep" @close="handleClose"></product-attr-detail>

    <product-sku-detail v-show="showStatus[2]" v-model="productParam" :edittype="edittype" :categoryId="categoryId"
      @prevStep="prevStep" @finishCommit="finishCommit(arguments)" @close="handleClose"></product-sku-detail>
  </el-card>
</template>

<script>
  import ProductInfoDetail from './ProductInfoDetail'
  import ProductSkuDetail from './ProductSkuDetail'
  import ProductAttrDetail from './ProductAttrDetail'
  import { uploadImg, ImgUrl, ImgID, ImgUrlPath } from '@/api/upload'
  import { createProduct, detial, updateProduct, save } from '@/api/product'
  const defaultProductParam = {
    albumPics: [], //相册
    description: '',
    detailDesc: '',
    detailHtml: '',
    priceMode: '',
    detailMobileHtml: '',
    name: '',
    pic: '',
    price: 0,
    productAttributeCategoryId: null,
    //商品属性相关{productAttributeId: 0, value: ''}
    attributeList: {},
    categoryId: null,
    categoryName: '',
    productSn: '',
    publicStatus: 'no',
    sale: 0,
    sort: 0,
    stock: 0,
    unit: '',
    weight: 0
  }

  export default {
    name: 'ProductDetail',
    components: {
      ProductInfoDetail,
      ProductAttrDetail,
      ProductSkuDetail
    },
    props: {
      edittype: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        dd: '<img style="width:100%" src="' + ImgUrlPath,
        categoryId: '',
        activeStep: 0,
        load: false,
        showStatus: [true, false, false],
        productParam: Object.assign({}, defaultProductParam)
      }
    },
    created() {
      // console.log(this.$route.query.id)
      //if (this.isEdit) {
      if (this.$route.query.id) {
        this.loadProduct(this.$route.query.id)
      } else {
        this.load = true
      }
    },

    methods: {
      loadProduct(id) {
        detial(this.$route.query.id).then(response => {
          console.log('loadProduct', response)
          this.productParam = response.data
          if (this.productParam.attributeList == null) {
            this.productParam.attributeList = {}
          }

          if (this.edittype == 'import') {
            this.doPreImport()
          }
          this.categoryId = this.productParam.categoryId
          this.load = true

          this.productParam.detailMobileHtml = this.DetailImgReplacePath(
            this.productParam.detailMobileHtml
          )
        })
      },
      DetailImgReplacePath(html) {

        console.log("ImgUrlPath", ImgUrlPath)
        let buff = html.replace(
          /<img src="/g,
          '<img style="width:100%" src="' + ImgUrlPath
        )
        console.log('buff', buff)
        return buff
      },
      DetailImgClearPath(html) {
        if (html == undefined) return
        let buff = html.split('style="width:100%"').join('')
        buff = buff.split(ImgUrlPath).join('')
        return buff
      },
      catchanged(categoryId) {
        this.categoryId = categoryId
      },

      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false
        }
      },
      prevStep() {
        if (this.activeStep > 0 && this.activeStep < this.showStatus.length) {
          this.activeStep--
          this.hideAll()
          this.showStatus[this.activeStep] = true
        }
      },
      nextStep() {
        if (this.activeStep < this.showStatus.length - 1) {
          this.activeStep++
          this.hideAll()
          this.showStatus[this.activeStep] = true
        }
      },

      handleClose(bSave) {
        if (
          typeof bSave == 'undefined' &&
          confirm(this.$t('message.数据未保存，确定要关闭吗？')) == false
        ) {
          return
        }
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.go(-1)
      },

      doPreImport(productParam) {
        //代理
        //this.productParam.publicStatus = 'yes' //代理别人的
        //保存来源id

        this.productParam.pid = this.productParam._id //追溯上级商户产品状态
        delete this.productParam._id
        //this.productParam.sourceId = this.productParam.id
        //this.productParam.originalPrice = this.productParam.price
        this.productParam.stockcloud = this.productParam.stock
        this.productParam.price = this.productParam.price
        this.productParam.stock = 0
        this.productParam.parentstore = this.productParam.sid //追溯上级商户
      },

      finishCommit(param) {
        //let skudata = param[1];
        console.log(param)
        console.log(this.productParam)
        this.$confirm(

          this.$t('message.是否要提交该产品'), this.$t('message.提示'),
          {
            confirmButtonText: this.$t('message.确定'),
            cancelButtonText: this.$t('message.取消'),
            type: 'warning'
          }
        ).then(() => {
          this.productParam.detailMobileHtml = this.DetailImgClearPath(
            this.productParam.detailMobileHtml
          )

          this.productParam.pic = this.DetailImgClearPath(this.productParam.pic)

          save(this.productParam).then(response => {
            console.log('finishCommit', response)
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功'),
              duration: 1000
            })
            this.handleClose(true)
          })
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 100%;
  }
</style>