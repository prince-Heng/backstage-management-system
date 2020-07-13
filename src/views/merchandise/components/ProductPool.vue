<template>
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never"> -->
    <!-- <div>
        <i class="el-icon-search"></i>
        <el-button style="float: right" @click="Reset()" size="small">重置</el-button>
        <el-button style="float: right;margin-right:20px" @click="query()" type="primary" size="small">查询结果</el-button>
    </div>-->
    <!-- <div style="margin: 3px">
      <el-form :inline="true" :model="listQuery" label-width="100px" size="mini">
        <el-form-item>
          <el-input style="width: 203px" v-model="productname" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 203px" v-model="productSn" placeholder="商品货号" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-cascader v-model="selectCategoryID" :options="productCateOptions" clearable
            :props="{ label: 'name', children: 'items', value: 'id' }" style="width: 200px"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select v-model="screenPublishStatus" placeholder="全部" clearable>
            <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="Reset()" size="small">重置</el-button>
        <el-button @click="query()" size="small">查询</el-button>
        <el-button @click="query()" size="small">一键代理</el-button>

      </el-form>

    </div>-->
    <!-- </el-card> -->

    <div class="table-container">
      <el-table ref="productTable" :data="list" v-loading="listLoading" border size="mini">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="标题" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>-->
        <el-table-column :label="$t('message.商品主图')" width="120" align="center">
          <template slot-scope="scope">
            <!-- {{scope.row._id}} -->
            <img style="height: 80px" :src="scope.row.pic" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.categoryName }}</p>
          </template>
        </el-table-column>-->
        <el-table-column :label="$t('message.批发价/零售价')" align="center">
          <template slot-scope="scope">
            <!-- <p v-if="scope.row.sourceId != null">{{ scope.row.originalPrice }}</p> -->
            <!-- <p v-else>---</p> -->
            <p>₽{{ scope.row.bradePrice }}</p>
            <p>₽{{ scope.row.price }}</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.货号')" width="120" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>

        <!-- <el-table-column label="商品属性" align="center" width="200">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover" width="500">
              <el-row>
                <el-col :span="12" v-for="(a, index) in scope.row.attributeList" :key="index">
                  <span style="width: 80px;display: inline-block">
                    {{
                    a.name
                    }}
                  </span>
                  {{ a.value }}
                </el-col>
              </el-row>
              <el-button slot="reference">商品属性</el-button>
        </el-popover>-->

        <!-- <p v-for="(item,index ) in scope.row.attributeList ">{{item}}</p> -->
        <!-- </template>
        </el-table-column>-->
        <!-- <el-table-column label="sku" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row._createtime }}</p>
          </template>
        </el-table-column>-->

        <el-table-column :label="$t('message.发货地')" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.storelocaltion }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.标签')" width="140" align="center">
          <template slot-scope="scope">
            <p>
              {{$t('message.上架：')}}
              <el-switch
                @change="handlePublishStatusChange(scope.row.publishStatus,scope.row)"
                :active-value="'yes'"
                :inactive-value="'no'"
                :disabled="scope.row.sid != storename"
                v-model="scope.row.publishStatus"
              ></el-switch>
            </p>
            <!-- <p  v-if="scope.row.publishStatus == 0 && scope.row.pid" style="color: red;">批发商已下架</p> -->

            <!--<p>新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommandStatus">
              </el-switch>
            </p>-->
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.云库存')" align="center" v-if="currole == 'b'">
          <template slot-scope="scope">
            <p>{{ scope.row.stockcloud }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.本地库存')" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.stock }}</p>
          </template>
        </el-table-column>

        <el-table-column :label="$t('message.销量/总库存')" width="100" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.sale }}</p>
            <p v-if="! scope.row.sale">0</p>
            <p>{{ stockSum(scope.row)}}</p>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.代理商')"
          width="100"
          align="center"
          v-if="currole == 'B'"
        >
          <template slot-scope="scope">
            <span>q{{scope.row.exportsidlist}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.供应商')"
          width="100"
          align="center"
          v-if="currole == 'b'"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.parentstore">{{scope.row.parentstore}}</span>
            <span v-else>{{scope.row.sid}}</span>
            <p
              v-if="scope.row.importstatus =='no'"
              style="color: brown;"
            >{{$t('message.批发商已下架')}}</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <!-- <span>e{{scope.row.exportid}}</span>
            <span>p{{scope.row.pid}}</span>-->
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

            <el-tooltip v-if="storename != scope.row.sid " :content="$t('message.查看')" placement="top-start">
              <el-button
                round
                size="mini"
                icon="el-icon-view"
                @click="handleEditProduct(scope.$index, scope.row)"
              />
            </el-tooltip>

            <span v-if="currole == 'B'">
              <el-tooltip class="item" effect="dark" :content="$t('message.入池')" placement="top-start">
                <el-button
                  round
                  :content="$t('message.入池')"
                  icon="el-icon-download"
                  v-if="scope.row.publicStatus != 'yes'"
                  size="mini"
                  @click="handlePublicStatus(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('message.出池')" placement="top-start">
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
            <span v-if="currole == 'b'">
              <el-tooltip class="item" effect="dark" :content="$t('message.取消代理')" placement="top-start">
                <el-button
                  round
                  icon="el-icon-delete-solid"
                  :content="$t('message.取消代理')"
                  size="mini"
                  v-if="scope.row.pid"
                  @click="handleDelete(scope.$index, scope.row)"
                />
              </el-tooltip>

              <el-tooltip class="item" effect="dark" :content="$t('message.取消代理')" placement="top-start">
                <el-button
                  round
                  icon="el-icon-delete-solid"
                  :content="$t('message.取消代理')"
                  size="mini"
                  v-if="scope.row.exportid"
                  @click="handleDelete(scope.$index, scope.row)"
                />
              </el-tooltip>

              <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button v-if="storename == scope.row.sid " round size="mini" content="编辑" icon="el-icon-edit-outline"
                  @click="handleEditProduct(scope.$index, scope.row)" />
              </el-tooltip>-->
              <el-tooltip class="item" effect="dark" :content="$t('message.代理')" placement="top-start">
                <el-button
                  round
                  icon="el-icon-share"
                  v-if="!scope.row.exportid "
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

    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.paging.limit" :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.paging.page" :total="total"></el-pagination>
    </div>-->
  </div>
</template>

<script>
</script>