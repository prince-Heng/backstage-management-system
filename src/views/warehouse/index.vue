<template>
  <div>
    <el-row>
      <el-col :span="6">
        <!-- <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
          <li v-for="i in count" class="infinite-list-item">{{ i }}</li>
        </ul>-->
        <div>
          <div class="container">
            <div class="header">
              <el-input
                size="small"
                :placeholder="$t('message.搜索')"
                clearable
                v-model="search"
                @input="onSearch"
                class="input-with-select"
              >
                <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
                  <el-option label="餐厅名" value="1"></el-option>
                  <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option>
                </el-select>-->
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="leftcontent">
              <a>
                <div
                  class="nameitem"
                  v-for="(item,index) in customer"
                  :key="index"
                  @click="curuser = item"
                >
                  <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                  <span
                    style="line-height: 20px; display:inline-block;margin-left: 10px;"
                  >{{item.user_name}}</span>
                  <!-- <span style="color: red;">*</span> -->
                </div>
              </a>

              <el-row>
                <el-col :span="24">
                  <el-input
                    :placeholder="$t('message.请输入内容')"
                    v-model="cmsg"
                    type="textarea"
                    @keydown.native="sendCostomerMessage($event)"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    class="input-with-select"
                  >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </el-col>
                <!-- <el-col :span="2">
               <el-select v-model="select" slot="prepend" placeholder="请选择">
                  <el-option label="餐厅名" value="1"></el-option>
                  <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option>
                </el-select> 
                <el-button icon="el-icon-s-promotion"> 发送</el-button>
               
                </el-col >-->
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="container">
          <div class="header">
            <i class="el-icon-user-solid"></i>
            {{curuser.user_name}}
          </div>
          <div class="content" ref="msgbox">
            <div style="background-color: #f5f5f5; padding:24px;">
              <el-row v-for="(item,index) in MessageList" :key="index">
                <el-col :span="20" :offset="3" v-if=" item.service ">
                  <span class="aa">{{ item.msg }}</span>
                </el-col>
                <el-col :span="1" v-if=" item.service ">
                  <span>
                    <i class="el-icon-headset"></i>
                  </span>
                </el-col>

                <el-col :span="1" v-if=" ! item.service ">
                  <span>
                    <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                  </span>
                </el-col>
                <el-col :span="20" v-if="! item.service ">
                  <span class="bb">{{ item.msg }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="footer">
            <el-row>
              <el-col :span="24">
                <el-input
                  :placeholder="$t('message.请输入内容')"
                  v-model="msg"
                  :disabled="curuser.user_name==null"
                  type="textarea"
                  @keydown.native="sendServiceMessage($event)"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  class="input-with-select"
                >
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
              <!-- <el-col :span="2">
             <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select> 
              <el-button icon="el-icon-s-promotion"> 发送</el-button>
             
              </el-col >-->
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from "@/mixins/crud";
// import crudCustomer from '@/api/system/customer'

import { getDepts } from "@/api/system/dept";
import hf from "@/api/system/hf";
export default {
  name: "StoreInput",
  // mixins: [crud],
  created() {
    this.getDeptName();
    //从当前时间往前最多取50个
    //this.fillMessage(this.lasttime, 2)
    this.loadusers();
    // this.$nextTick(() => {

    //   this.init()
    // })
  },
  watch: {
    MessageList() {
      this.$nextTick(() => {
        let list = this.$refs.msgbox;
        //console.log(list.scrollTop, list.scrollHeight)
        list.scrollTop = list.scrollHeight;
        //console.log(list.scrollTop, list.scrollHeight)
      });
    },
    curuser() {
      this.uname = this.curuser.user_name;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      this.lasttime = new Date().valueOf();
      this.MessageList = [];
      this.fillMessage(this.lasttime, 2);
      //console.log(this.curuser.name)
    }
  },

  methods: {
    onSearch() {
      this.$forceUpdate();
    },
    loadusers() {
      hf.customerlist(this.$store.state.user.uuid).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.userlist = res.data;
        }
      });
    },
    sendCostomerMessage(event) {
      if (event.keyCode === 13) {
        //let Authorization="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3aG0iLCJjcmVhdGVkIjoxNTg3ODAyNzk1MjI1LCJleHAiOjE1OTAzOTQ3OTV9.Eyl6FqJue7sdA5SebYusISThIolRSeKWiJT3dByEr9l_ebOmmOQ6Z4zBEnfnTjgCvYrX3xMaiJpnPSwXDmU2XQ"

        event.preventDefault(); // 阻止浏览器默认换行操作
        hf.cutomer_messgaeadd(this.uuid, this.cmsg).then(res => {
          console.log(res.data);
          this.MessageList.push(res.data);
          this.lasttime = res.data._createtime;
          this.cmsg = "";
        });

        return false;
      }
    },

    sendServiceMessage(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        hf.servicemessgaeadd(this.uuid, this.uname, this.msg).then(res => {
          console.log(res.data);
          this.MessageList.push(res.data);
          this.lasttime = res.data._createtime;
          this.msg = "";
        });

        return false;
      }
    },

    beforeInit() {
      this.url = "api/customer";
      return true;
    },

    flashNewmsg() {
      //hf.cutomer_messgaelist({ uuid: this.uuid, dt: dt }).then(res => {
      hf.servicemessgaelist({
        uuid: this.uuid,
        uname: this.uname,
        dt: this.lasttime
      }).then(res => {
        for (var i in res.data.items) this.MessageList.push(res.data.items[i]);
        if (this.MessageList.length > 0)
          this.lasttime = this.MessageList[
            this.MessageList.length - 1
          ]._createtime;
      });
    },

    //加载历史数据 loopnum 为循环次数 每次最多50个
    fillMessage(dt, loopnum) {
      //cutomer_messgaelist
      // hf.cutomer_messgaelist({ uuid: this.uuid, dt: dt, msgtype: "history" }).then(res => {
      hf.servicemessgaelist({
        uuid: this.uuid,
        uname: this.uname,
        dt: dt,
        msgtype: "history"
      }).then(res => {
        //console.log(res.data)
        if (res.code == 200) {
          let items = res.data.items.reverse();
          items.forEach(element => {
            this.MessageList.unshift(element);
          });
          if (this.timer) {
            clearInterval(this.timer);
          }

          this.timer = setInterval(this.flashNewmsg, 5000);
        }
      });
    },
    getDeptName() {
      getDepts({ id: this.$store.state.user.deptid }).then(res => {
        if (res.code == 200) {
          for (var i in res.data.dept) {
            if (res.data.dept[i].id == this.$store.state.user.deptid)
              this.uuid = res.data.dept[i].name;

            this.$store.commit("SET_UUID", uuid);
          }
        }
      });
    }
  },
  computed: {
    customer: function() {
      let key = this.search;
      var data = this.userlist;
      return data.filter(function(item) {
        if (key == "") return true;
        return item.user_name.indexOf(key) != -1;
      });
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  data() {
    return {
      userlist: [],
      timer: null,

      uuid: "1024",
      uname: "whm",
      lasttime: new Date().valueOf(),
      curuser: {},
      msg: "",
      cmsg: "",
      search: "",
      count: 10,
      MessageList: [],
      visible: false
    };
  }
};
</script>

<style>
.nameitem {
  margin: 2px;
  padding: 0 0 0 10px;
  border: #7dbcfc solid 1px;
  border-radius: 5px;
  background-color: antiquewhite;
}

.nameitem:hover {
  background-color: cadetblue;
}

.container {
  /* display: flex;
    /* padding: 30px,0,0,0; */
  /* min-height: calc(100vh - 52px);
    flex-direction: column;  */
  margin: 5px;
}

.el-row {
  margin-bottom: 10px;
}

.header {
  min-height: 30px;
}

.leftcontent {
  background-color: #f5f5f5;
  height: calc(100vh-60px);
  overflow: auto;
  margin-bottom: 10px;
  /* 1 代表盡可能最大，會自動填滿除了 header footer 以外的空間 */
}

.content {
  background-color: #f5f5f5;
  height: calc(100vh - 190px);
  overflow: auto;
  margin-bottom: 10px;
  /* 1 代表盡可能最大，會自動填滿除了 header footer 以外的空間 */
}

.footer {
  min-height: 100px;
}

/* .infinite-list {
    height:calc(100vh - 170px);
    padding: 0;
    margin: 0;
    list-style: none
  } */

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #e8f3fe;
  margin: 10px;
  color: #7dbcfc;
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.infinite-list-wrapper {
  height: 300px;
  text-align: center;
}

.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #fff6f6;
  color: #ff8484;
}

.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}

.font {
  font-size: 16px;
  font-weight: bold;
  font-family: "微软雅黑 Light";
}

.dataShow {
  overflow-y: hidden;
  overflow-x: hidden;
  margin-bottom: -24px;
  margin-top: -24px;
  height: 100%;
  margin-bottom: 5%;
  margin-top: 5%;
}

.aa {
  float: right;
  position: relative;
  display: inline-block;
  max-width: calc(80%);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  background-color: #9eea6a;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 1px 7px -5px #000;
  border: 0px solid #000;
  margin-top: 0;
  margin-right: 10px;
}

.aa:after {
  content: "";
  border-top: solid 5px #00800000;
  border-left: solid 10px #9eea6a;
  border-right: solid 10px #00800000;
  border-bottom: solid 5px #00800000;
  position: absolute;
  top: 10px;
  left: 100%;
}

.bb {
  display: inline-block;
  line-height: 30px;
  font-style: normal;
  background-color: white;
  letter-spacing: 2px;
  position: relative;
  max-width: calc(80%);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  border-radius: 4px;
  color: #000;
  box-shadow: 0px 1px 7px -5px #000;
  border: 0px solid #000;
  margin-top: 0;
  margin-left: 10px;
}

.bb:after {
  content: "";
  border-top: solid 5px #00800000;
  border-left: solid 10px #00800000;
  border-right: solid 10px white;
  border-bottom: solid 5px #00800000;
  position: absolute;
  top: 10px;
  right: 100%;
}
</style>