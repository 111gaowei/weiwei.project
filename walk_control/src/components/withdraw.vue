<template>
  <!-- 提现内容 -->
  <div class="content">
    <ul class="first">
      <li class="active">全部</li>
      <li>今日提现：xxxx元</li>
      <li>总提现：xxxx元</li>
      <li v-show="cate !== 3">
        <el-button size="small" @click="agreeAll()">通过</el-button>
        <el-button size="small" @click="unknow()">{{
          cate == 1 ? "延迟审批" : "拒绝"
        }}</el-button>
      </li>
    </ul>
    <div class="second">
      <!-- 左侧内容 -->
      <div class="left">
        <ul class="cate">
          <li :class="cate == 1 ? 'active' : ''" @click="cateChoose(1)">
            待审批 <span>（{{ waits.length }}）</span>
          </li>
          <li :class="cate == 2 ? 'active' : ''" @click="cateChoose(2)">
            延迟审批 <span>（{{ delays.length }}）</span>
          </li>
          <li :class="cate == 3 ? 'active' : ''" @click="cateChoose(3)">
            审批历史
          </li>
        </ul>
      </div>
      <!-- 右侧内容 表格-->
      <el-table
        stripe
        border
        ref="multipleTable"
        :data="data"
        tooltip-effect="dark"
        class="right"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选按钮 -->
        <el-table-column
          v-if="cate !== 3"
          align="center"
          type="selection"
          min-width="55"
        >
        </el-table-column>
        <!-- 表格内容 -->
        <el-table-column
          v-for="(item, index) of tables[cate - 1].content"
          :key="index"
          :fixed="item.show == 3 || item.show == 5 ? 'right' : false"
          align="center"
          :label="item.label"
          :min-width="item.minWith"
        >
          <template slot-scope="scope">
            <!-- 序号 -->
            <span v-if="item.show == 0">{{
              (page - 1) * 15 + scope.$index + 1
            }}</span>
            <!-- 日期 -->
            <span v-if="item.show == 1">{{
              data[scope.$index][item.prop] | toChange
            }}</span>
            <!-- 账号 -->
            <div
              v-if="item.show == 2"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <img
                v-show="data[scope.$index].amountNumber.name"
                class="pay-pic"
                :src="
                  data[scope.$index].amountNumber.name == 'alipay'
                    ? './static/img/alipay.png'
                    : './static/img/wechat.png'
                "
                alt=""
              />
              <span style="white-space: nowrap">{{
                data[scope.$index].amountNumber.number
              }}</span>
            </div>
            <!-- openID -->
            <div
              v-if="item.show == 4"
              style="
                max-width: 140px;
                overflow: hidden;
                white-space: nowrap;
                margin: 0 auto;
                text-overflow: ellipsis;
              "
            >
              {{ data[scope.$index].openID }}
            </div>
            <!-- 按钮，通过或拒绝 -->
            <el-button
              v-show="item.show == 3"
              style="padding: 7px"
              @click="agree((page - 1) * 15 + scope.$index)"
              >通过</el-button
            >
            <el-button
              v-show="item.show == 3"
              style="padding: 7px"
              @click="delay((page - 1) * 15 + scope.$index)"
              >{{ cate == 1 ? "延迟审批" : "拒绝" }}</el-button
            >
            <!-- 审批历史 -->
            <div
              v-show="item.show == 5"
              :style="{
                color:
                  data[scope.$index].isAgree == '通过'
                    ? 'rgb(39, 183, 116)'
                    : data[scope.$index].isAgree == '拒绝'
                    ? 'rgb(255, 44, 44)'
                    : 'rgb(255, 171, 68)',
              }"
            >
              {{ data[scope.$index].isAgree }}
            </div>
            <!-- 一般情况 -->
            <span v-if="item.show == -1">{{
              data[scope.$index][item.prop]
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block page-area">
      <el-pagination
        layout="prev, pager, next"
        :page-size="15"
        :total="
          cate == 1 ? waits.length : cate == 2 ? delays.length : historys.length
        "
        @prev-click="moveTo"
        @next-click="moveTo"
        @current-change="moveTo"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cate: 1, //默认是待审批
      waits: [], //待审批
      delays: [], //延迟审批
      historys: [], //总的审批历史
      data: [], //页面显示内容的数组
      page: 1, //当前页码数
      pagecount: 0, //总页码数
      allse: 0, //是否全选
      index: [], //当前选中的下标
      multipleSelection: [], //保存选中内容
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
      tables: [
        {
          name: "待审批",
          content: [
            {
              label: "序号",
              prop: null,
              minWith: 50,
              show: 0,
            },
            {
              label: "昵称",
              prop: "nickname",
              minWith: 150,
              show: -1,
            },
            {
              label: "累计应兑",
              prop: "",
              minWith: 100,
              show: -1,
            },
            {
              label: "已兑金额",
              prop: "amounted",
              minWith: 100,
              show: -1,
            },
            {
              label: "可兑金额",
              prop: "amounts",
              minWith: 100,
              show: -1,
            },
            {
              label: "申请金额",
              prop: "cashNum",
              minWith: 100,
              show: -1,
            },
            {
              label: "提现账号",
              prop: "amountNumber",
              minWith: 150,
              show: 2,
            },
            {
              label: "OpenID",
              prop: "openID",
              minWith: 160,
              show: 4,
            },
            {
              label: "操作",
              prop: "",
              minWith: 180,
              show: 3,
            },
          ],
        },
        {
          name: "延迟审批",
          content: [
            {
              label: "序号",
              prop: null,
              minWith: 50,
              show: 0,
            },
            {
              label: "昵称",
              prop: "nickname",
              minWith: 150,
              show: -1,
            },
            {
              label: "累计应兑",
              prop: "",
              minWith: 100,
              show: -1,
            },
            {
              label: "已兑金额",
              prop: "amounted",
              minWith: 100,
              show: -1,
            },
            {
              label: "可兑金额",
              prop: "amounts",
              minWith: 100,
              show: -1,
            },
            {
              label: "申请金额",
              prop: "cashNum",
              minWith: 100,
              show: -1,
            },
            {
              label: "提现账号",
              prop: "amountNumber",
              minWith: 150,
              show: 2,
            },
            {
              label: "OpenID",
              prop: "openID",
              minWith: 160,
              show: 4,
            },
            {
              label: "操作",
              prop: "",
              minWith: 180,
              show: 3,
            },
          ],
        },
        {
          name: "审批历史",
          content: [
            {
              label: "序号",
              prop: null,
              minWith: 50,
              show: 0,
            },
            {
              label: "昵称",
              prop: "nickname",
              minWith: 150,
              show: -1,
            },
            {
              label: "申请时间",
              prop: "applyTime",
              minWith: 160,
              show: 1,
            },
            {
              label: "审批时间",
              prop: "approvalTime",
              minWith: 160,
              show: 1,
            },
            {
              label: "提现账号",
              prop: null,
              minWith: 150,
              show: 2,
            },
            {
              label: "申请金额",
              prop: "cashNum",
              minWith: 100,
              show: -1,
            },
            {
              label: "OpenID",
              prop: "openID",
              minWith: 160,
              show: 4,
            },
            {
              label: "审批状态",
              prop: "isAgree",
              minWith: 160,
              show: 5,
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.waiting();
    this.delaying();
    this.history();
  },
  computed: {
    dataSing() {
      let a = [];
      this.data.forEach((ele) => {
        a.push(ele.singse);
      });
      return a;
    },
  },
  // 事件监听
  watch: {
    page() {
      this.showInfo();
    },
    dataSing() {
      if (
        this.dataSing.indexOf(false) == -1 &&
        this.dataSing.indexOf(0) == -1
      ) {
        this.allse = 1;
      } else {
        this.allse = 0;
      }
    },
  },
  // 过滤器
  filters: {
    // 将时间戳改为所 xxxx-xx-xx xx:xx时间格式
    toChange(e) {
      let num = parseInt(e);
      return (
        // 年份
        new Date(num).getFullYear() +
        "-" +
        // 月份（三目判断是否是9月以前，是的话加0）
        (new Date(num).getMonth() < 9
          ? "0" + (new Date(num).getMonth() + 1)
          : new Date(num).getMonth() + 1) +
        "-" +
        // 日（判断9日之前加0）
        (new Date(num).getDate() < 10
          ? "0" + new Date(num).getDate()
          : new Date(num).getDate()) +
        "  " +
        // 时间 几点
        new Date(num).getHours() +
        ":" +
        // 几分
        new Date(num).getMinutes()
      );
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 页面显示的内容 data数组的内容
    showInfo() {
      if (this.cate == 1) {
        this.data = this.waits.slice(15 * (this.page - 1), 15 * this.page);
        this.pagecount = Math.ceil(this.waits.length / 15);
      } else if (this.cate == 2) {
        this.data = this.delays.slice(15 * (this.page - 1), 15 * this.page);
        this.pagecount = Math.ceil(this.delays.length / 15);
      } else {
        this.data = this.historys.slice(15 * (this.page - 1), 15 * this.page);
        this.pagecount = Math.ceil(this.historys.length / 15);
      }
    },
    // 待审批内容
    waiting() {
      this.axios.get("/applys?state=待审批&&_sort=applyTime").then((res) => {
        if (res.data.length !== 0) {
          this.waits = [];
          let n = 0;
          res.data.forEach((ele) => {
            this.axios
              .get(`/information?openID=${ele.openID}`)
              .then((result) => {
                let data = result.data[0];
                n++;
                delete data.id;
                ele = { ...ele, ...data, singse: 0 };
                this.waits.push(ele);
                if (n >= res.data.length) {
                  this.showInfo();
                }
              });
          });
        } else {
          this.waits = [];
          this.pagecount = 0;
        }
      });
    },
    // 延迟审批内容
    delaying() {
      this.axios
        .get("/applys?state=已审批&&isAgree=延迟审批&&_sort=applyTime")
        .then((res) => {
          if (res.data.length !== 0) {
            this.delays = [];
            let n = 0;
            res.data.forEach((ele) => {
              this.axios
                .get(`/information?openID=${ele.openID}`)
                .then((result) => {
                  let data = result.data[0];
                  n++;
                  delete data.id;
                  ele = { ...ele, ...data, singse: 0 };
                  this.delays.push(ele);
                  if (n >= res.data.length) {
                    this.showInfo();
                  }
                });
            });
          } else {
            this.delays = [];
            this.pagecount = 0;
          }
        });
    },
    // 审批历史内容
    history() {
      this.axios
        .get("/applys?state=已审批&&_sort=approvalTime&&_order=desc")
        .then((res) => {
          if (res.data.length !== 0) {
            this.historys = [];
            let n = 0;
            res.data.forEach((ele) => {
              this.axios
                .get(`/information?openID=${ele.openID}`)
                .then((result) => {
                  let data = result.data[0];
                  n++;
                  delete data.id;
                  ele = { ...ele, ...data, singse: 0 };
                  this.historys.push(ele);
                  if (n >= res.data.length) {
                    this.showInfo();
                  }
                });
            });
          } else {
            this.historys = [];
            this.pagecount = 0;
          }
        });
    },
    // 将页码变为1
    clearPage() {
      this.page = 1;
      this.cate = 1;
    },
    // 点击页码跳转
    moveTo(e) {
      this.page = e;
    },
    // 切换左侧内容
    cateChoose(e) {
      this.cate = e;
      this.page = 1;
      if (e == 1) {
        this.data = this.waits.slice((this.page - 1) * 15, this.page * 15);
        this.pagecount = Math.ceil(this.waits.length / 15);
      } else if (e == 2) {
        this.data = this.delays.slice((this.page - 1) * 15, this.page * 15);
        this.pagecount = Math.ceil(this.delays.length / 15);
      } else {
        this.data = this.historys.slice((this.page - 1) * 15, this.page * 15);
        this.pagecount = Math.ceil(this.historys.length / 15);
      }
    },
    // 全选
    allSelect() {
      this.allse = !this.allse;
      if (this.allse == 1) {
        this.data.forEach((ele) => {
          ele.singse = 1;
        });
      } else {
        this.data.forEach((ele) => {
          ele.singse = 0;
        });
      }
    },
    // 单选
    singSelect(e) {
      //e 当前选的是第几个
      this.data[e].singse = !this.data[e].singse;
    },
    // 选中的全通过
    agreeAll() {
      this.index = [];
      let arr = [];
      this.multipleSelection.forEach((ele) => {
        arr.push(ele.id);
      });
      if (this.cate == 1) {
        this.waits.forEach((ele, ind) => {
          if (arr.indexOf(ele.id) !== -1) {
            this.index.push(ind);
          }
        });
      } else {
        this.delays.forEach((ele, ind) => {
          if (arr.indexOf(ele.id) !== -1) {
            this.index.push(ind);
          }
        });
      }
      this.$confirm(
        "点击确认按钮以后，钱款将会自动打到用户账号，不可撤回！",
        "确认打款",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.sure1();
        })
        .catch((action) => {
          // 取消触发的事件
        });
    },
    // 选中部分延迟或者拒绝
    unknow() {
      this.index = [];
      let arr = [];
      this.multipleSelection.forEach((ele) => {
        arr.push(ele.id);
      });
      if (this.cate == 1) {
        this.waits.forEach((ele, ind) => {
          if (arr.indexOf(ele.id) !== -1) {
            this.index.push(ind);
          }
        });
      } else {
        this.delays.forEach((ele, ind) => {
          if (arr.indexOf(ele.id) !== -1) {
            this.index.push(ind);
          }
        });
      }
      this.$confirm(
        `${
          this.cate == 1
            ? "点击确认按钮以后，将会延迟审批用户的此次提现申请，不可撤回！"
            : "点击确认按钮以后，将会拒绝用户的此次提现申请，不可撤回！"
        }`,
        "确认打款",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.sure2();
        })
        .catch((action) => {
          // 取消触发的事件
        });
    },
    // promise 任务
    // 1 先查询指定id的内容（需要修改的某项数据）通过
    pass(id) {
      return new Promise((resolve) => {
        this.axios.get(`/applys/${id}`).then((res1) => {
          let now = new Date().getTime();
          let obj = res1.data;
          obj.state = "已审批";
          //approvalTime 审核时间
          obj.approvalTime = now;
          obj.isAgree = "通过";
          resolve([id, obj]);
        });
      });
    },
    // 延迟
    pending(id) {
      return new Promise((resolve) => {
        this.axios.get(`/applys/${id}`).then((res1) => {
          let obj = res1.data;
          let now = new Date().getTime();
          obj.state = "已审批";
          obj.isAgree = "延迟审批";
          //approvalTime 审核时间
          obj.approvalTime = now;
          resolve([id, obj]);
        });
      });
    },
    // 拒绝
    reject(id) {
      return new Promise((resolve) => {
        this.axios.get(`/applys/${id}`).then((res1) => {
          let obj = res1.data;
          let now = new Date().getTime();
          obj.state = "已审批";
          obj.isAgree = "拒绝";
          //approvalTime 审核时间
          obj.approvalTime = now;
          resolve([id, obj]);
        });
      });
    },
    //put 请求修改内容
    next([id, obj]) {
      return new Promise((resolve) => {
        this.axios.put(`/applys/${id}`, obj).then((res2) => {
          resolve();
        });
      });
    },
    // 某一项通过
    agree(e) {
      this.index = [];
      this.index.push(e);
      this.$confirm(
        "点击确认按钮以后，钱款将会自动打到用户账号，不可撤回！",
        "确认打款",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.sure1();
        })
        .catch((action) => {
          // 取消触发的事件
        });
    },
    // 确认打款
    sure1() {
      let count=0
      this.index.forEach((ele) => {
        let e = ele;
        //e是序号减一，也是数据的下标
        if (this.cate == 1) {
          let id = this.waits[e].id;
          // promise 顺序执行
          //pass 查询某一项数据 obj
          // next 更改更改查询到的 obj的状态
          // 最后再重新请求数据显示到页面上
          this.pass(id)
            .then(this.next)
            .then(() => {
              count++;
              if (count == this.index.length) {
                this.waiting();
                this.history();
              }
            });
        } else {
          let id = this.delays[e].id;
          this.pass(id)
            .then(this.next)
            .then(() => {
              count++;
              if (count == this.index.length ) {
                this.delaying();
                this.history();
              }
            });
        }
      });
    },
    // 某一项延迟审批或者拒绝
    delay(e) {
      this.index = [];
      this.index.push(e);
      this.$confirm(
        `${
          this.cate == 1
            ? "点击确认按钮以后，将会延迟审批用户的此次提现申请，不可撤回！"
            : "点击确认按钮以后，将会拒绝用户的此次提现申请，不可撤回！"
        }`,
        "确认打款",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.sure2();
        })
        .catch((action) => {
          // 取消触发的事件
        });
    },
    // 确认延迟或取消不
    sure2() {
      let count = 0;
      this.index.forEach((ele) => {
        let e = ele;
        //e是序号减一，也是数据的下标
        if (this.cate == 1) {
          let id = this.waits[e].id;
          // promise 顺序执行
          //pass 查询某一项数据 obj
          // next 更改更改查询到的 obj的状态
          // 最后再重新请求数据显示到页面上
          this.pending(id)
            .then(this.next)
            .then(() => {
              count++;
              if (count == this.index.length) {
                this.waiting();
                this.delaying();
                this.history();
              }
            });
        } else {
          let id = this.delays[e].id;
          // promise 顺序执行
          //pass 查询某一项数据 obj
          // next 更改更改查询到的 obj的状态
          // 最后再重新请求数据显示到页面上
          this.reject(id)
            .then(this.next)
            .then(() => {
              count++;
              if (count == this.index.length) {
                this.delaying();
                this.history();
              }
            });
        }
      });
    },
  },
};
</script>
<style scoped>
.info-sure {
  position: fixed;
  width: 100%;
  height: calc(100vh);
  z-index: 100;
  overflow: hidden;
  top: 0;
  left: 0;
}
.info-sure > .area {
  position: absolute;
  padding: 25px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  width: 300px;
  height: 180px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
.info-sure > .area > h1 {
  margin: 5px 0 15px 0;
}
.info-sure > .area > h1 + div {
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 28px;
}
.info-sure > .area > div:nth-child(3) {
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}
.info-sure > .area > div:nth-child(3) > span {
  padding: 7px 16px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
}
.info-sure > .area .close {
  position: absolute;
  font-size: 30px;
  top: 5px;
  right: 10px;
  color: #666;
  cursor: pointer;
}
.content {
  padding: 20px 100px;
  max-width: 1400px;
  min-width: 900px;
  margin: 0 auto 150px;
}
.content > .first {
  display: flex;
  justify-content: flex-start;
  margin: 15px 0 25px;
}
.content > .first > li {
  padding: 7px 12px;
  font-size: 14px;
  text-align: center;
  margin-right: 40px;
}
.content > .first > li.active {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  border-radius: 4px;
}
.content > .second {
  display: flex;
  background-color: rgb(251, 251, 251);
}
.content > .second > .left {
  flex: 2;
  position: relative;
  background-color: rgb(244, 244, 244);
  font-size: 16px;
  padding: 0px;
  text-align: left;
  line-height: 24px;
  min-height: 400px;
  margin-right: 10px;
  font-weight: 400;
}
.content > .second > .left > .cate > li {
  cursor: pointer;
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  color: rgb(174, 174, 174);
  white-space: nowrap;
}
.content > .second > .left > .cate > li.active {
  background-color: #fff;
  color: #409eff;
}
.content > .second > .left > .cate > li > span {
  color: rgb(174, 174, 174);
  font-weight: 400;
}
.content > .second > .left .add {
  font-size: 16px;
  cursor: pointer;
  padding: 14px 28px;
  text-align: left;
  font-weight: 400;
  line-height: 24px;
  color: rgb(174, 174, 174);
}
.content > .second > .left .set {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 20px;
  left: 18px;
  cursor: pointer;
}
.content > .second > .left .set > img {
  width: 100%;
}
.content > .second > .right {
  flex: 14;
  width: 100%;
}
img.select {
  width: 20px;
  height: 20px;
  margin-top: 21px;
  margin-right: 3px;
}
.content .page-area {
  display: flex;
  justify-content: flex-end;
  padding: 30px;
  font-size: 14px;
}
.content .page-area ul {
  display: flex;
}
.content .page-area ul > li {
  padding: 0 8px;
  cursor: pointer;
}
.content .page-area ul > li.active {
  color: rgb(30, 119, 255);
}
.content .page-area > div {
  cursor: pointer;
  margin: 0 5px;
}
.content .page-area > div.disable {
  cursor: text;
  color: rgb(187, 187, 187);
  pointer-events: none;
}
.pay {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pay-pic {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
.content > .first {
  position: relative;
}
.content > .first > li:last-child {
  position: absolute;
  top: -5px;
  right: 0;
  margin-right: 0;
}
.content > .first > li:last-child > el-button {
  color: #666;
  font-size: 13px !important;
}
.content > .first > li:last-child > el-button:last-child {
  margin-right: 15px;
}
</style>