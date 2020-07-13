<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <div>
          <!-- <el-tree
            :data="list"
            node-key="id"
            :props="{ label: 'name', children: 'items' }"
            :highlight-current="true"
            accordion
            @node-click="onChange"
          ></el-tree>-->
          <!-- 备用树 -->
          <el-tree
    
            :props="{ label: 'name', children: 'items' }"
            :data="list"
            draggable
            accordion
            node-key="id"
            @node-click="onChange"
            :expand-on-click-node="true"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <!-- <el-popover placement="right" title="标题" width="200" trigger="hover">
                <div>
                  <i @click.stop="remove()" class="el-icon-remove-outline"></i>
                  <i @click.stop="append()" class="el-icon-circle-plus-outline"></i>
                </div>
                <span>{{ node.label }}</span>
              </el-popover>-->

              <el-popover placement="right" trigger="hover">
                <div>
                  <i
                    @click.stop="removeChild(node)"
                    class="el-icon-remove-outline"
                  >{{$t('message.删除')}}</i>
                  <i
                    @click.stop="appendChild(node)"
                    v-if="node.level!=3"
                    class="el-icon-circle-plus-outline"
                  >{{$t('message.增加子分组')}}</i>
                </div>
                <span slot="reference">
                  <span>{{ node.label }}</span>
                </span>
              </el-popover>

              <!--  -->

              <!-- <span>{{ node.label }} + -</span>
              <span>
                <el-button type="text" size="mini" @click="append()">增加子类目</el-button>
                <el-button type="text" size="mini" @click="remove()">删除当前类目</el-button>
              </span>-->
            </span>
          </el-tree>
        </div>
      </el-col>
      <!-- 第二框 品类操作-->
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item :label="$t('message.编号')" prop="Id">
            <el-input v-model="form.id" :placeholder="$t('message.编号唯一')"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.名称')" prop="categoryName">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.俄语名称')" prop="categoryNameRu">
            <el-input v-model="form.runame"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.图片')" prop="img">
            <el-upload
              class="avatar-uploader"
              :action="uploadImg()"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="form.img" :fit="'fill'" :src="imgurl(form.img)" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('message.生效')">
            <el-switch v-model="form.delivery"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('message.说明')">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveNode(form)">{{$t('message.保存')}}</el-button>
            <!-- <el-button type="primary" disabled v-else>保存</el-button> -->
            <!-- <el-button type="primary" v-if="form._id" disabled>{{$t('message.创建一级类目')}}</el-button> -->
            <el-button
              type="primary"
              @click="addNode(form)"
             
            >{{$t('message.创建一级类目')}}</el-button>
            
            <!-- <el-button
              type="danger"
              @click="remove(form._id, form)"
              v-if="form._id"
            >{{$t('message.删除一级类目')}}</el-button>
            <el-button type="danger" v-else disabled>{{$t('message.删除一级类目')}}</el-button>-->
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 第三框  商品属性 -->
      <el-col :span="8">
        <el-tabs type="border-card">
          <el-tab-pane :label="$t('message.商品属性')">
            <!-- <el-button
              type="primary"
              v-if="this.productattr == null"
              disabled
            >{{$t('message.新增商品属性')}}</el-button>-->
            <el-button
              type="primary"
              @click="newproductAttr()"
              v-if="addprop==3"
            >{{$t('message.新增第三级商品属性')}}</el-button>
            <el-collapse accordion v-model="activeName">
              <el-collapse-item
                :name="index"
                :title="item.name"
                v-for="(item, index) in productattr"
                :key="index"
                ref="ProductAttar"
              >
                <el-form label-width="100px">
                  <el-form-item :label="$t('message.属性名称')">
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                  <p></p>
                  <el-form-item :label="$t('message.属性值列表')">
                    <el-input
                      v-model="item.values[i]"
                      :placeholder="$t('message.请输入内容')"
                      v-for="(v, i) in item.values"
                      :key="i"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <p></p>
                <div style="text-align: right;">
                  <el-button type="primary" size="mini" @click="addProp(item)">{{$t('message.添加')}}</el-button>
                  <el-button type="primary" size="mini" @click="saveProp(item)">{{$t('message.保存')}}</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteProp(item)"
                  >{{$t('message.删除')}}</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>

            <!-- {{productattr}} -->
          </el-tab-pane>
          <el-tab-pane :label="$t('message.品类属性')">
            <!-- <el-button
              type="primary"
              v-if="this.productattr == null"
              disabled
            >{{$t('message.新增品类属性')}}</el-button>-->
            <el-button type="primary" @click="newSkuAttr()">{{$t('message.新增第三级类目品类属性')}}</el-button>
            <el-collapse accordion v-model="activeName">
              <el-collapse-item
                :title="item.name"
                :name="index"
                v-for="(item, index) in skuattr"
                :key="index"
                :placeholder="$t('message.请输入内容')"
              >
                <el-form label-width="100px">
                  <el-form-item :label="$t('message.属性名称')">
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                  <p></p>
                  <el-form-item :label="$t('message.属性值列表')">
                    <el-input
                      v-model="item.values[i]"
                      :placeholder="$t('message.请输入内容')"
                      v-for="(v, i) in item.values"
                      size="mini"
                      :key="i"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <p></p>
                <div style="text-align: right;">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="addCategory(item)"
                  >{{$t('message.添加')}}</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="saveCategory(item)"
                  >{{$t('message.保存')}}</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteCategory(item)"
                  >{{$t('message.删除')}}</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchList, saveNode, addribute, saveProp } from '@/api/category'
import { uploadImg, ImgUrl } from '@/api/upload'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { array } from 'jszip/lib/support'
import { isArray } from '../../utils/validate'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return type
      //return calendarTypeKeyValue[type]
    }
  },

  data() {
    return {
      //   rules:{
      //   Id:[
      //    { required: true, message: '请输入编号', trigger: 'blur' },
      //   ],
      //   categoryName:[
      //     { required: true, message: '请输入品类名称', trigger: 'blur' },
      //   ],
      //   categoryNameRu:[
      //     { required: true, message: '请输入俄语名称', trigger: 'blur' },
      //   ],
      //   img:[
      //     { required: true, message: '请加入图片', trigger: 'blur' },
      //   ]
      // },
      addprop: 0,
      activeName: 0,
      skuProp: '',
      productProp: '',
      attribute: '',
      tableKey: 0,
      skuattr: [],
      productattr: [],
      list: [],
      groups: [],
      form: {},
      total: 0,
      listLoading: true,
      // 父节点
      curNode: null,
      root: null,
      listQuery: {
        paging: {
          page: 1,
          limit: 10
        },
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 增加子分组
    appendChild(data) {
      console.log(1, data)
      const { img, name, runame } = data.data
      let addNodeInfo = {
        id: '',
        img: '',
        name: this.$t('message.新增'),
        runame: '',
        items: [],
        groups: []
      }
      if (!data.items) {
        this.$set(data, 'children', [])
      }
      data.data.items.push(addNodeInfo)
    },
    // 删当前类目
    removeChild(node) {
      this.$confirm(
        this.$t('message.此操作将删除该节点'),
        this.$t('message.是否继续?'),
        this.$t('message.提示?'),
        {
          confirmButtonText: this.$t('message.确定'),
          cancelButtonText: this.$t('message.取消?'),
          type: 'warning'
        }
      )
        .then(() => {
          const parent = node.parent
          const children = parent.data.items || parent.data
          const index = children.findIndex(d => d.id === node.data.id)
          children.splice(index, 1)
          if (parent.parent == null) {
            node.data._delete = ''
            saveNode(node.data).then(res => {
              // console.log("删除",res)
            })
          } else {
            if (parent.data._id == undefined) {
              saveNode(parent.parent.data).then(res => {
                this.getList()
              })
            } else {
              console.log('id', parent)
              saveNode(parent.data).then(res => {
                this.getList()
              })
            }
          }

          this.$message({
            type: 'success',
            message: this.$t('message.删除成功!')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.已取消删除!')
          })
        })
    },
    //   新增商品属性
    newproductAttr() {
      this.productattr.unshift({
        name: this.$t('message.请输入商品属性'),
        values: ['']
      })
      //  this.productattr.unshift({ name: this.$t('message.请输入商品属性'), values: [''] })
    },
    // 新增品类属性
    newSkuAttr() {
      this.skuattr.unshift({
        name: this.$t('message.请输入品类属性'),
        values: ['']
      })
    },
    // 新增一级类目
    addNode(data) {
      console.log(data)
      const addCategory = {
        name: data.name,
        runame: data.runame,
        id: data.id,
        title: data.title,
        img: data.img,
        items: []
      }
      saveNode(addCategory).then(res => {
        this.getList()
      })
    },
    // // 删除一级类目
    // remove(id, data) {
    //   console.log(data)
    //   const removeCategory = {
    //     _id: id,
    //     _delete: ''
    //   }
    //   saveNode(removeCategory).then(res => {
    //     this.getList()
    //   })
    // },
    //  第二框内容保存
    saveNode(data) {
      if (data._id) {
        const newCategory = {
          _id: data._id,
          name: data.name,
          runame: data.runame,
          id: data.id,
          title: data.title,
          img: data.img
        }
        saveNode(newCategory).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功')
            })
            this.getList()
          }
        })
      } else {
        console.log('data', data)
        this.curNode.data = data
        console.log(this.curNode.parent)
        if (this.curNode.parent.data._id == undefined) {
          saveNode(this.curNode.parent.parent.data).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功')
            })
            this.getList()
          })
        } else {
          saveNode(this.curNode.parent.data).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功')
            })
            this.getList()
          })
        }
      }
    },

    // 第三框  商品属性 的增加
    addProp(item) {
      let arrProp = item.values
      if (arrProp.slice(-1)[0] != '') {
        item.values.push('')
      } else {
        this.$message(this.$t('message.请输入属性值'))
      }
    },
    // 第三框商品属性 的保存
    saveProp(item) {
      let productValues = item.values

      if (productValues.slice(-1)[0] == '') {
        this.$message(this.$t('message.请输入属性值'))
      } else {
        this.productattr.map(i => {
          if (i.name == item.name) {
            i.values = item.values
          }
        })
        var proattar = {}
        if (this.productProp._id) {
          console.log(1)
          proattar = {
            _id: this.productProp._id,
            items: this.productattr
          }
        } else {
          proattar = {
            attrtype: "product",
            catID:this.form.id,
            items: this.productattr
          }
        }
        console.log(proattar)
        saveProp(proattar).then(res => {
          if (res.code == 0) {
            console.log(res)
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功')
            })
          }
        })
      }
    },
    // 第三框商品属性删除
    deleteProp(item) {
      console.log(item)
      this.$confirm(
        this.$t('message.此操作将删除'),
        this.$t('message.是否继续?'),
        this.$t('message.提示?'),
        {
          confirmButtonText: this.$t('message.确定'),
          cancelButtonText: this.$t('message.取消?'),
          type: 'warning'
        }
      )
        .then(() => {
          // console.log(item)
          this.productattr.forEach((v, i) => {
            if (v.name == item.name) {
              console.log('1', i)
              this.productattr.splice(i, 1)
            }
          })
          const deleteProattar = {
            _id: this.productProp._id,
            items: this.productattr
          }
          saveProp(deleteProattar).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: this.$t('message.删除成功!')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.已取消删除!')
          })
        })
    },
    // 第三框  品类属性 的增加
    addCategory(item) {
      let arrCategory = item.values
      if (arrCategory.slice(-1)[0] != '') {
        item.values.push('')
      } else {
        this.$message(this.$t('message.请输入属性值'))
      }
    },
    // 第三框  品类属性 的保存
    saveCategory(item) {
      let skuValue = item.values

      if (skuValue.slice(-1)[0] == '') {
        this.$message(this.$t('message.请输入属性值'))
      } else {
        this.skuattr.map(i => {
          if (i.name == item.name) {
            i.values = item.values
          }
        })
        var cateattar = {}
        if (this.skuProp._id) {
          cateattar = {
            _id: this.skuProp._id,
            items: this.skuattr
          }
        } else {
          cateattar = {
            attrtype: "sku",
            catID:this.form.id,
            items: this.skuattr
          }
        }
        console.log(cateattar)
        saveProp(cateattar).then(res => {
          if (res.code == 0) {
            console.log(res)
            this.$message({
              type: 'success',
              message: this.$t('message.保存成功')
            })
          }
        })
      }
    },
    // 第三框  品类属性删除
    deleteCategory(item) {
      console.log(item)
      this.$confirm(
        this.$t('message.此操作将删除'),
        this.$t('message.是否继续?'),
        this.$t('message.提示?'),
        {
          confirmButtonText: this.$t('message.确定'),
          cancelButtonText: this.$t('message.取消?'),
          type: 'warning'
        }
      )
        .then(() => {
          this.skuattr.forEach((v, i) => {
            if (v.name == item.name) {
              console.log('1', i)
              this.skuattr.splice(i, 1)
            }
          })
          const deleteSkuattr = {
            _id: this.skuProp._id,
            items: this.skuattr
          }
          saveProp(deleteSkuattr).then(res => {
            if (res.code == 0) {
              console.log(res)
              this.$message({
                type: 'success',
                message: this.$t('message.删除成功!')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.已取消删除!')
          })
        })
    },
    // 第二框的上传图片点击文件夹  action 必选参数，上传的地址
    uploadImg() {
      return uploadImg()
    },
    // 第二框的选中图片后 图片地址
    imgurl(imgid) {
      return ImgUrl(imgid)
    },
    // on-success	文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        let id = res.data.id //颜色值
        let fid = res.data.fid
        this.form.img = fid
        this.img = fid
      }
    },
    // 节点被点击时的回调
    onChange(data, node, tree) {
      console.log(data, node, tree)
      // 点击事件 获取父亲节点
      this.curNode = node
      this.addprop = node.level
      console.log('curNode', this.curNode)
      this.form = data
      addribute(data.id, 'product').then(res => {
        if (res.code == 0) {
          if (res.data == null) {
            this.productattr = []
          } else {
            this.productattr = res.data.items
            this.productProp = {
              _id: res.data._id
            }
            console.log('product', this.productattr)
          }
        }
      })
      addribute(data.id, 'sku').then(res => {
        // console.log(res.data)
        if (res.code == 0) {
          if (res.data == null) {
            this.skuattr = []
          } else {
            this.skuattr = res.data.items
            this.skuProp = {
              _id: res.data._id
            }
            console.log('sku', this.skuattr)
          }
        }
      })
    },
    // 数据被调用
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code == 0) {
          console.log(response)
          this.list = response.data.items
          this.listLoading = false
        }
      })
    }
  }
}
</script>
<style>
.avatar {
  height: 100px;
  width: 100px;
}
.el-collapse-item__header.is-active {
  color: red;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
