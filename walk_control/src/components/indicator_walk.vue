<template>
  <!-- 指标内容 -->
  <div class="content">
    <!-- 时间段选择 -->
    <ul class="first">
      <li v-for="(item, index) of times" :key="index">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item"
          :disabled="index > 4 ? false : true"
          placement="top-start"
        >
          <el-button
            size="mini"
            class="btn-time"
            :class="time == index ? 'active' : ''"
            @click="chooseTime(index)"
            style="font-size: 14px"
            >{{ item }}</el-button
          >
        </el-tooltip>
      </li>
      <li>
        <el-button
          size="mini"
          style="font-size: 13px"
          @click="showDate"
          v-popover:popover
          >自定义时间</el-button
        >
      </li>
      <el-popover
        ref="popover"
        placement="right"
        width="250"
        v-model="visible"
        trigger="manual"
        class="dateChoose"
      >
        <div class="block">
          <div style="margin-bottom: 15px">请选择您要查看的日期：</div>
          <el-date-picker
            type="dates"
            v-model="value1"
            @change="change"
            @blur="disapear"
            placeholder="选择一个或多个日期"
          >
          </el-date-picker>
        </div>
      </el-popover>
    </ul>
    <!-- 下部内容 -->
    <div class="second">
      <!-- 左侧内容 -->
      <div class="left">
        <ul class="cate">
          <li
            v-for="(item, index) of categorys"
            :key="index"
            :class="cate == index + 1 ? 'active' : ''"
            @click="cateChoose(index + 1)"
          >
            {{ item.name }}
            <span v-if="index + 1 !== categorys.length"
              >（{{ item.content.length }}）</span
            >
          </li>
        </ul>
        <div class="set" @click="openAlert">
          <img src="../../static/img/set.png" alt="" />
        </div>
      </div>
      <!-- 右侧内容 -->
      <!-- 表格 -->
      <el-table
        class="right"
        v-if="cate !== categorys.length"
        :data="data"
        stripe
      >
        <!-- 遍历每一项指定的表格内容 -->
        <el-table-column
          v-for="(item, index) of left_con[number].arr[cate - 1].table"
          :key="index"
          align="center"
          :label="item.label"
          :min-width="item.minWith"
        >
          <template slot-scope="scope">
            <!-- 序号 -->
            <span v-if="!item.show">{{
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
            <!-- 一般 -->
            <span v-if="item.show == -1">{{
              data[scope.$index][item.prop]
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 自定义添加 -->
      <div
        v-else
        style="
          min-height: 400px;
          background-color: white;
          padding: 20px;
          padding-right: 0;
        "
        class="right"
      >
        <h2 style="margin-bottom: 20px">设置指标</h2>
        <span style="font-size: 14px">指标名称</span>&nbsp;&nbsp;&nbsp;
        <el-popover
          placement="bottom"
          title="提示"
          width="200"
          trigger="manual"
          content="自定义指标内容不能为空"
          v-model="visible1"
        >
          <el-input
            slot="reference"
            style="width: 20%"
            v-model="input"
            @blur="visible1 = false"
            placeholder="请输入指标名称"
          ></el-input>
        </el-popover>
        <br />
        <br />
        <br />
        <span style="font-size: 14px">选择指标</span>&nbsp;&nbsp;&nbsp;
        <el-select
          style="margin-bottom: 50px"
          v-model="value"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <h2 style="margin-bottom: 30px">自定义表格</h2>
        <div style="display: flex; flex-wrap: wrap">
          <div
            v-for="(obj, index) of own_options"
            :key="index"
            style="margin-bottom: 20px"
          >
            <span style="font-size: 14px">{{ "字段" + (index + 1) }}</span
            >&nbsp;&nbsp;
            <el-select
              style="width: 65%"
              v-model="obj.value"
              placeholder="请选择"
              class="white"
            >
              <el-option
                v-for="(item, index) of obj.options"
                :key="index"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          type="primary"
          @click="ownCreate"
          v-if="cre"
          style="padding: 7px 25px; margin-top: 30px"
          >创建</el-button
        >
        <el-button
          type="primary"
          v-else
          @click="ownChange"
          style="padding: 7px 25px; margin-top: 30px"
          >修改</el-button
        >
      </div>
    </div>
    <!-- 页码区域 -->
    <div v-if="cate !== categorys.length" class="block page-area">
      <el-pagination
        layout="prev, pager, next"
        :total="left_con[number].arr[cate - 1].content.length"
        :page-size="15"
        @prev-click="moveTo"
        @next-click="moveTo"
        @current-change="moveTo"
      >
      </el-pagination>
    </div>
    <!-- 修改指标弹框 -->
    <div class="change-set" id="change" v-show="changeSet" @click="changeShow">
      <div class="animate__animated animate__fadeIn" >
        <h2 style="text-align: center">修改指标</h2>
        <ul v-if="content.length">
          <li v-for="(item, index) of content" :key="index">
            <div>{{ item }}</div>
            <div>
              <span @click="cha(index)">修改</span>
              <span @click="del(index)">删除</span>
            </div>
          </li>
        </ul>
        <div v-else style="font-size: 14px; text-align: center; margin: 60px 0">
          暂无可修改的指标
        </div>
        <div class="close" @click="closeSet">×</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["number"],
  data() {
    return {
      cre: true, //决定创建还是修改
      changeSet: false, //修改指标栏
      content: [],
      times: ["今日", "最近七天", "最近30天", "最近一年", "全部"],
      //默认选中的时间()
      time: 0,
      input: "", //指标名称
      options: [
        {
          value: "选项1",
          label: "拨号量",
        },
        {
          value: "选项2",
          label: "分享量",
        },
        {
          value: "选项3",
          label: "评分量",
        },
      ],
      value: "", //所选的指标名称
      // 自定义选项
      own_options: [
        {
          value: "",
          options: [],
        },
        {
          value: "",
          options: [],
        },
        {
          value: "",
          options: [],
        },
        {
          value: "",
          options: [],
        },
        {
          value: "",
          options: [],
        },
        {
          value: "",
          options: [],
        },
      ],
      categorys: [],
      cate: 1, //默认是注册量
      regNum: [],
      cashNum: [],
      data: [], //页面显示的内容
      page: 1,
      pagecount: 0,
      visible: false,
      visible1: false, //自定义指标输入提示框
      value1: "",
      changing: null,
      search: [
        "注册时间",
        "微信/Apple昵称",
        "可兑金额",
        "已兑金额",
        "提现账号",
        "OpenID",
        "手机号",
        "累计金币",
        "申请金额",
        "申请时间",
        "审批时间",
        "审批状态",
        "到期时间",
        "UUID",
        "付费金额",
        "拨号次数",
        "分享次数",
        "是否评分",
      ],
      // 各指标对应的内容
      indicators: [
        {
          label: "注册时间",
          prop: "regtime",
          minWith: 160,
          show: 1,
        },
        {
          label: "微信/Apple昵称",
          prop: "nickname",
          minWith: 150,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "可兑金额",
          prop: "amounts",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "已兑金额",
          prop: "amounted",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "提现账号",
          prop: null,
          minWith: 150,
          show: 2, //2,账号指定的HTML内容，有图片的判断
        },
        {
          label: "OpenID",
          prop: "openID",
          minWith: 280,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "手机号",
          prop: "phone",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "累计金币",
          prop: null,
          minWith: 100,
          show: -1,
        },
        {
          label: "申请金额",
          prop: "cashNum",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
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
          label: "审批状态",
          prop: "isAgree",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "到期时间",
          prop: "endTime",
          minWith: 160,
          show: 1, //-1表示没有添加其他内容。
        },
        {
          label: "UUID",
          prop: "UUID",
          minWith: 160,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "付费金额",
          prop: "payNum",
          minWith: 100,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "拨号次数",
          prop: "dialingNum",
          minWith: 130,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "分享次数",
          prop: "shareNum",
          minWith: 130,
          show: -1, //-1表示没有添加其他内容。
        },
        {
          label: "是否评分",
          prop: "score",
          minWith: 80,
          show: -1, //-1表示没有添加其他内容。
        },
      ],
      // 多层嵌套，所有APP的指标名称及其对应的表格内容都保存在此数组中
      left_con: [
        {
          number: 0,
          appName: "Record Calls",
          // 自定义选项内容
          options: [
            {
              label: "注册时间",
            },
            {
              label: "到期时间",
            },
            {
              label: "手机号",
            },
            {
              label: "UUID",
            },
            {
              label: "付费金额",
            },
            {
              label: "拨号次数",
            },
            {
              label: "分享次数",
            },
            {
              label: "是否评分",
            },
          ],
          // 数组内容
          arr: [
            {
              name: "下载量",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "付费量",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "销售额",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "自定义1",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "+添加",
            },
          ],
        },
        {
          number: 1,
          name: "走路有钱",
          options: [
            {
              label: "注册时间",
            },
            {
              label: "微信/Apple昵称",
            },
            {
              label: "手机号",
            },
            {
              label: "累计金币",
            },
            {
              label: "可兑金额",
            },
            {
              label: "已兑金额",
            },
            {
              label: "提现账号",
            },
            {
              label: "OpenID",
            },
          ],
          arr: [
            {
              name: "注册量",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "提现量",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "累计金币",
                  prop: "gold",
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
                  label: "已兑金额",
                  prop: "amounted",
                  minWith: 100,
                  show: -1,
                },
                {
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 280,
                  show: -1,
                },
              ],
            },
            {
              name: "自定义",
              content: [],
              table: [
                {
                  label: "序号",
                  prop: null,
                  minWith: 50,
                  show: 0,
                },
                {
                  label: "注册时间",
                  prop: "regtime",
                  minWith: 160,
                  show: 1,
                },
                {
                  label: "微信/Apple昵称",
                  prop: "nickname",
                  minWith: 150,
                  show: -1,
                },
                {
                  label: "可兑金额",
                  prop: "amounts",
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
                  label: "提现账号",
                  prop: null,
                  minWith: 150,
                  show: 2,
                },
                {
                  label: "OpenID",
                  prop: "openID",
                  minWith: 260,
                  show: -1,
                },
              ],
            },
            {
              name: "+添加",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // 不同产品的指标不同
    this.own_options.forEach((ele) => {
      ele.options = this.left_con[this.number].options;
    });
    this.start();
  },
  watch: {
    number() {
      this.categorys = this.left_con[this.number].arr;
    },
    page() {
      this.data = this.categorys[this.cate - 1].content.slice(
        (this.page - 1) * 15,
        this.page * 15
      );
      // if (this.cate == 1) {
      //   this.data = this.regNum.slice((this.page - 1) * 15, this.page * 15);
      // } else if (this.cate == 2) {
      //   this.data = this.cashNum.slice((this.page - 1) * 15, this.page * 15);
      // }
    },
    input() {
      if (this.input.trim() !== "") {
        this.visible1 = false;
      } else {
        this.visible1 = true;
      }
    },
  },
  filters: {
    // 将时间戳改为所需要的时间格式
    toChange(e) {
      let num = parseInt(e);
      return (
        // 上午或者下午或者晚上
        (new Date(num).getHours() >= 0 && new Date(num).getHours() <= 12
          ? "上午"
          : new Date(num).getHours() > 12 && new Date(num).getHours() <= 18
          ? "下午"
          : "晚上") +
        // 时间 几点
        new Date(num).getHours() +
        ":" +
        // 几分
        new Date(num).getMinutes() +
        "-" +
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
          : new Date(num).getDate())
      );
    },
  },
  methods: {
    changeShow(e){
      if(e.target.id=='change'){
        this.changeSet=false;
      }
    },
    showDate() {
      if (this.visible == false) {
        this.visible = true;
        setTimeout(() => {
          // 添加事件隐藏
          document.addEventListener("click", this.clickPanel);
        }, 50);
      } else {
        this.visible = false;
      }
    },
    clickPanel() {
      this.visible = false;
      document.removeEventListener("click", this.clickPanel);
    },
    // 挂载时进行的操作。
    start() {
      this.content = [];
      this.categorys = this.left_con[this.number].arr;
      // 自己手动添加的指标保存到content中
      let arr = this.categorys.slice(2, -1);
      arr.forEach((ele) => {
        this.content.push(ele.name);
      });
      this.axios.get("/information").then((res) => {
        this.categorys[0].content = res.data;
        // this.regNum = res.data;
        this.data = this.categorys[0].content.slice(0, 15);
        this.pagecount = Math.ceil(this.categorys[0].content.length / 15);
      });
      this.axios.get("/information?amounted_ne=0").then((res) => {
        this.categorys[1].content = res.data;
        // this.cashNum = res.data;
      });
      this.categorys.forEach((ele, index) => {
        if ((index < this, this.categorys.length - 1)) {
          ele.content = [
            {
              id: 1,
              openID: "46d2cb3ee6e84268bdd1421bee53d001",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                name: "wechat",
                number: "wechat345",
              },
            },
            {
              id: 2,
              openID: "46d2cb3ee6e84268bdd1421bee53d002",
              regtime: "1602207674318",
              nickname: "小尔",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 3,
              openID: "46d2cb3ee6e84268bdd1421bee53d003",
              regtime: "1602207674318",
              nickname: "小伞",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "wechat321",
              },
            },
            {
              id: 4,
              openID: "46d2cb3ee6e84268bdd1421bee53d004",
              regtime: "1602207674318",
              nickname: "小思",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                number: "未绑定",
              },
            },
            {
              id: 5,
              openID: "46d2cb3ee6e84268bdd1421bee53d005",
              regtime: "1602207674318",
              nickname: "小伍",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "wechat123",
              },
            },
            {
              id: 6,
              openID: "46d2cb3ee6e84268bdd1421bee53d006",
              regtime: "1602207674318",
              nickname: "小柳",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 7,
              openID: "46d2cb3ee6e84268bdd1421bee53d007",
              regtime: "1602207674318",
              nickname: "小戚",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 8,
              openID: "46d2cb3ee6e84268bdd1421bee53d008",
              regtime: "1602207674318",
              nickname: "小笆",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                number: "未绑定",
              },
            },
            {
              id: 9,
              openID: "46d2cb3ee6e84268bdd1421bee53d009",
              regtime: "1602207674318",
              nickname: "小九",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 10,
              openID: "46d2cb3ee6e84268bdd1421bee53d010",
              regtime: "1602207674318",
              nickname: "小史",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 11,
              openID: "46d2cb3ee6e84268bdd1421bee53d011",
              regtime: "1602207674318",
              nickname: "对3133",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 12,
              openID: "46d2cb3ee6e84268bdd1421bee53d012",
              regtime: "1602207674318",
              nickname: "3的3d",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 13,
              openID: "46d2cb3ee6e84268bdd1421bee53d013",
              regtime: "1602207674318",
              nickname: "第七位",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 14,
              openID: "46d2cb3ee6e84268bdd1421bee53d014",
              regtime: "1602207674318",
              nickname: "第七位",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 15,
              openID: "46d2cb3ee6e84268bdd1421bee53d015",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 16,
              openID: "46d2cb3ee6e84268bdd1421bee53d016",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 17,
              openID: "46d2cb3ee6e84268bdd1421bee53d017",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 18,
              openID: "46d2cb3ee6e84268bdd1421bee53d018",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 19,
              openID: "46d2cb3ee6e84268bdd1421bee53d019",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 20,
              openID: "46d2cb3ee6e84268bdd1421bee53d020",
              regtime: "1602207674318",
              nickname: "小戚",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 21,
              openID: "46d2cb3ee6e84268bdd1421bee53d021",
              regtime: "1602207674318",
              nickname: "小七",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 22,
              openID: "46d2cb3ee6e84268bdd1421bee53d022",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 23,
              openID: "46d2cb3ee6e84268bdd1421bee53d023",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 24,
              openID: "46d2cb3ee6e84268bdd1421bee53d024",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                name: "wechat",
                number: "wechat345",
              },
            },
            {
              id: 25,
              openID: "46d2cb3ee6e84268bdd1421bee53d025",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 26,
              openID: "46d2cb3ee6e84268bdd1421bee53d026",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "wechat321",
              },
            },
            {
              id: 27,
              openID: "46d2cb3ee6e84268bdd1421bee53d027",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                number: "未绑定",
              },
            },
            {
              id: 28,
              openID: "46d2cb3ee6e84268bdd1421bee53d028",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "wechat123",
              },
            },
            {
              id: 29,
              openID: "46d2cb3ee6e84268bdd1421bee53d029",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 30,
              openID: "46d2cb3ee6e84268bdd1421bee53d030",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 31,
              openID: "46d2cb3ee6e84268bdd1421bee53d031",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 0,
              amountNumber: {
                number: "未绑定",
              },
            },
            {
              id: 32,
              openID: "46d2cb3ee6e84268bdd1421bee53d032",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 33,
              openID: "46d2cb3ee6e84268bdd1421bee53d033",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 34,
              openID: "46d2cb3ee6e84268bdd1421bee53d034",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 35,
              openID: "46d2cb3ee6e84268bdd1421bee53d035",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 36,
              openID: "46d2cb3ee6e84268bdd1421bee53d036",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 37,
              openID: "46d2cb3ee6e84268bdd1421bee53d037",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 38,
              openID: "46d2cb3ee6e84268bdd1421bee53d038",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 39,
              openID: "46d2cb3ee6e84268bdd1421bee53d039",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 40,
              openID: "46d2cb3ee6e84268bdd1421bee53d040",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "wechat",
                number: "12797998",
              },
            },
            {
              id: 41,
              openID: "46d2cb3ee6e84268bdd1421bee53d041",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
            {
              id: 42,
              openID: "46d2cb3ee6e84268bdd1421bee53d042",
              regtime: "1602207674318",
              nickname: "小艺",
              gold: 9121,
              amounts: 3244,
              amounted: 3244,
              amountNumber: {
                name: "alipay",
                number: "12797998",
              },
            },
          ];
        }
      });
    },
    // 修改某个自定义指标
    cha(e) {
      this.cre = false; //按钮是修改。
      this.changeSet = false; //弹框消失
      this.cate = this.categorys.length;
      this.input = this.content[e];
      let tab = this.categorys[e + 2].table;
      this.own_options.forEach((ele, index) => {
        ele.value = tab[index + 1].label;
      });
      this.changing = e + 2; //正在修改的指标是changing
    },
    // 删除某个自定义指标
    del(e) {
      this.categorys.splice(e + 2, 1);
      this.content.splice(e, 1);
      this.cate = this.categorys.length - 1;
    },
    // 关闭弹框
    closeSet() {
      this.changeSet = false;
    },
    // 设置，打开弹框
    openAlert() {
      this.changeSet = true;
    },
    // 选择日期的框消失
    disapear() {
      this.visible = false;
    },
    // 自定义时间
    change() {
      this.times = ["今日", "最近七天", "最近30天", "最近一年", "全部"];
      this.visible = false;
      let arr = [...this.value1];
      let str = "";
      if (arr.length > 0) {
        arr.forEach((ele, index) => {
          str +=
            ele.getFullYear() +
            "-" +
            (ele.getMonth() + 1) +
            "-" +
            ele.getDate() +
            " , ";
        });
      }
      this.times.push(str.substring(0, str.length - 2));
      this.time = this.times.length - 1;
      this.value1 = "";
      document.removeEventListener("click", this.clickPanel);
    },
    // 将页码，cate都变为1
    clearPage() {
      this.page = 1;
      this.cate = 1;
      this.own_options.forEach((ele) => {
        ele.value = "";
      });
      this.start();
    },
    // 选择时间段
    chooseTime(e) {
      this.time = e;
    },
    //  跳转到某页
    moveTo(e) {
      this.page = e;
    },
    // 左侧导航选择
    cateChoose(e) {
      this.cate = e;
      this.page = 1;
      this.data = this.categorys[this.cate - 1].content.slice(
        (this.page - 1) * 15,
        this.page * 15
      );
      this.pagecount = Math.ceil(
        this.categorys[this.cate - 1].content.length / 15
      );
      if (e == this.categorys.length) {
        this.input = "";
        this.value = "";
        this.own_options.forEach((ele) => {
          ele.value = "";
        });
      }
    },
    // 自定义指标，创建按钮
    ownCreate() {
      if (this.input.trim() !== "") {
        let arr = [
          // 第一项是序号，必有。
          {
            label: "序号",
            prop: null,
            minWith: 50,
            show: 0,
          },
        ];
        this.own_options.forEach((ele) => {
          let index = this.search.indexOf(ele.value);
          if (index !== -1) {
            arr.push(this.indicators[index]);
          }
        });
        // 获取刚刚输入或者选择的自定义指标的内容添加到数组中。
        this.left_con[this.number].arr.splice(-1, 0, {
          name: this.input,
          content: [],
          table: arr,
        });
        this.start();
      } else {
        this.visible1 = true;
      }
    },
    // 修改指标
    ownChange() {
      if (this.input.trim() !== "") {
        let arr = [
          // 第一项是序号，必有。
          {
            label: "序号",
            prop: null,
            minWith: 50,
            show: 0,
          },
        ];
        this.own_options.forEach((ele) => {
          let index = this.search.indexOf(ele.value);
          if (index !== -1) {
            arr.push(this.indicators[index]);
          }
        });
        // 获取刚刚输入或者选择的自定义指标的内容添加到数组中。
        this.left_con[this.number].arr.splice(this.changing, 1, {
          name: this.input,
          content: [],
          table: arr,
        });
        this.start();
        this.cate = this.changing + 1;
        setTimeout(() => {
          this.changing = null;
        }, 500);
      } else {
        this.visible1 = true;
      }
    },
  },
};
</script>
<style scoped>
.change-set {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.2);
}
.change-set > div {
  width: 420px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 170px;
  padding: 20px;
}
.change-set > div ul {
  margin-top: 25px;
  height: 150px;
  overflow: auto;
}
.change-set > div ul > li {
  display: flex;
  padding: 13px;
  font-size: 14px;
  justify-content: space-between;
}
.change-set > div ul > li > div:last-child > span {
  cursor: pointer;
}
.change-set > div ul > li > div:last-child > span:first-child {
  margin-right: 5px;
}
.change-set .close {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 23px;
  cursor: pointer;
}
.white {
  margin-right: 1.3%;
}
.own-select {
  position: fixed;
}
.content {
  padding: 20px 100px 20px 100px;
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
  cursor: pointer;
  padding: 7px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  margin-right: 15px;
}
.content > .first > li button {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.content > .first > li .btn-time.active {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.content > .second {
  display: flex;
  background-color: rgb(251, 251, 251);
}
.content > .second > .left {
  flex: 2;
  position: relative;
  min-height: 400px;
  background-color: rgb(244, 244, 244);
  font-size: 16px;
  padding: 0px;
  text-align: center;
  line-height: 24px;
  margin-right: 10px;
  font-weight: 400;
}
.content > .second > .left > .cate > li {
  cursor: pointer;
  text-align: left;
  padding: 14px 30px;
  white-space: nowrap;
  border-bottom: 1px solid #e8e8e8;
  color: rgb(174, 174, 174);
}
.content > .second > .left > .cate > li.active {
  background-color: #fff;
  color: rgb(44, 128, 255);
  font-weight: 700;
}
.content > .second > .left > .cate > li > span {
  color: rgb(174, 174, 174);
  font-weight: 400;
}
.content > .second > .left .add {
  font-size: 16px;
  cursor: pointer;
  padding: 14px 30px;
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
</style>