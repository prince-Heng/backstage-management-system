<template>
  <div class="form-container" style="margin-top: 50px">
    <el-form
      :model="storeInfo"
      :rules="rules"
      ref="formName"
      class="demo-ruleForm"
      label-width="120px"
      style="width: 700px"
      size="small"
    >
      <el-form-item :label="$t('message.商铺名称')">
        <el-input v-model="storeInfo.storeName" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.商铺电话')" prop="storeTel">
        <el-input v-model="storeInfo.storeTel"></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.商铺地址')" prop="storeAddress">
        <el-input v-model="storeInfo.storeAddress"></el-input>
      </el-form-item>
      <!-- <el-form-item label="广告图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-input v-model="ruleForm.picAddress" placeholder="请输入图片路径" style="width: 200px"></el-input>
      </el-form-item>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>-->

      <el-form-item :label="$t('message.商铺广告：')" prop="picList">
        <multi-upload drag v-model="adds"></multi-upload>
        <span></span>
      </el-form-item>
      <el-form-item :label="$t('message.广告链接')">
        <el-input
          v-model="item.url"
          v-for="(item,index) in storeInfo.adds"
          :key="index"
          :placeholder="$t('message.图片')+(index+1)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.默认活动')">
        <el-input v-model="homeActive" disabled></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('message.活动')+(index+1)"
        prop="desc"
        v-for="(item,index) in storeInfo.desc"
        :key="index"
      >
        <el-input v-model="storeInfo.desc[index]" @input="onDescChange(index)"></el-input>
      </el-form-item>

      <!-- <el-form-item label="活动三" prop="desc3">
        <el-input v-model="storeInfo.desc3"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{$t('message.确定')}}</el-button>
        <!-- <el-button @click="resetForm()">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { SaveData, ReqData } from '@/api/system.js'
import MultiUpload from '@/components/Upload/multiUpload'
export default {
  components: { MultiUpload },
  data() {
    return {
      req: { sid: this.$store.getters.storename },
      imgUrl: process.env.VUE_APP_BASE_API + '/avatar/img?id=',
      adds: [],
      homeActive:this.$t('message.首页活动'),
      storeInfo: {
        storeName: this.$store.getters.storename,
        storeTel: '',
        storeAddress: '',
        desc: ['', '', ''],
        dialogImageUrl: '',
        dialogVisible: false,
        picAddress: '',
        adds: [],
        sid: this.$store.getters.storename
      },
      rules: {
        storeTel: [
          { required: true, message:this.$t('message.请输入商铺电话'), trigger: 'blur' }
        ],
        storeAddress: [
          { required: true, message:this.$t('message.请输入商铺地址'), trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getStore()
  },
  methods: {
    submitForm() {
      this.storeInfo.adds = []
      for (var i in this.adds) {
        this.storeInfo.adds.push({
          img: this.adds[i].replace(this.imgUrl, ''),
          url: '/'
        })
      }
      this.storeInfo.desc.push(this.homeActive)
      console.log(this.storeInfo)
      SaveData('store', this.storeInfo).then(res => {
        if(res.code==0){
          this.$message({
            type: 'success',
            message: this.$t('message.提交成功')
          })
          this.getStore()
        }
      })
       
    },
    onDescChange(value, index) {
      console.log(value, index)
      this.$forceUpdate()
    },
    getStore() {
         ReqData('store', this.req).then(res => {
        console.log(res)
         this.adds = []
        // console.log( res.data.items[0].desc.slice(0,-1))
        if (res.code == 0) {
          if (res.data.items.length > 0) {
            ;(this.storeInfo.sid = this.$store.getters.storename),
              (this.storeInfo = res.data.items[0])
            for (var i in this.storeInfo.adds) {
              this.adds.push(this.imgUrl + this.storeInfo.adds[i].img)
            }
             this.storeInfo.desc = res.data.items[0].desc.slice(0,-1)
             console.log(this.storeInfo.desc)
          }
        }
      })
    },
    
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
}
</style>