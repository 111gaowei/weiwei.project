<template>
  <!-- 概述内容 走路有钱-->
  <div class="content">
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
      <el-popover
        ref="popover"
        placement="right"
        width="250"
        v-model="visible"
        trigger="manual"
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
      <el-button
        size="mini"
        style="margin-left: 25px; font-size: 14px"
        @click="showDate"
        v-popover:popover
        >自定义时间</el-button
      >
    </ul>
    <div class="second">
      <div class="left">
        <div class="top">
          <div v-for="(item, index) of counts" :key="index">
            <div class="name">{{ item.name }}</div>
            <div
              class="count"
              :style="{
                color:
                  index == 0
                    ? 'rgba(30, 119, 255, 1)'
                    : index == 1
                    ? 'rgba(56, 213, 140, 1)'
                    : index == 2
                    ? '#f66'
                    : 'rgb(16, 16, 16)',
              }"
            >
              {{
                index == 3 || index == 4
                  ? `¥${thousands(item.count + "")}`
                  : `${thousands(item.count + "")}`
              }}
            </div>
          </div>
        </div>
        <div class="bottom">
          <div>下载量&注册量&活跃量</div>
          <div id="discount"></div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <div>设备排名</div>
          <el-select
            style="width: 100px"
            v-model="value_pho"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) of phones"
              :key="index"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </div>
        <div id="bar">
          <div
            style="margin-bottom: 15px"
            class="bar-area"
            v-for="(item, index) of phones[cn].cate"
            :key="index"
          >
            <div>
              <div :style="{ width: item.width }"></div>
              <div>{{ item.count }}</div>
            </div>
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      times: ["今日", "最近七天", "最近30天", "最近一年", "全部"],
      //默认选中的时间
      time: 0,
      myChart: null,
      //量数组
      counts: [
        {
          name: "下载量",
          count: null,
          data: [],
        },
        {
          name: "注册量",
          count: null,
          data: [],
        },
        {
          name: "活跃量",
          count: null,
          data: [],
        },
        {
          name: "广告收入",
          count: null,
        },
        {
          name: "提现收入",
          count: null,
        },
      ],
      // 手机型号和下载量
      phones: [
        {
          name: "装机量",
          cate: [
            {
              name: "iPhone11",
              count: 445,
            },
            {
              name: "iPhone12 pro",
              count: 287,
            },
            {
              name: "iPhone12",
              count: 366,
            },
            {
              name: "iPhone11 plus",
              count: 250,
            },
            {
              name: "iPhone XS",
              count: 239,
            },
          ],
        },
        {
          name: "付费量",
          cate: [
            {
              name: "iPhone11",
              count: 245,
            },
            {
              name: "iPhone12 pro",
              count: 187,
            },
            {
              name: "iPhone12",
              count: 166,
            },
            {
              name: "iPhone11 plus",
              count: 150,
            },
            {
              name: "iPhone XS",
              count: 139,
            },
          ],
        },
        {
          name: "销售额",
          cate: [
            {
              name: "iPhone11",
              count: 145,
            },
            {
              name: "iPhone12 pro",
              count: 487,
            },
            {
              name: "iPhone12",
              count: 1660,
            },
            {
              name: "iPhone11 plus",
              count: 1500,
            },
            {
              name: "iPhone XS",
              count: 139,
            },
          ],
        },
      ],
      nShow: false,
      //默认的类别
      value_pho: "",
      cn: 0,
      visible: false,
      value1: "",
      // 页面所需要的数据
      all_datas: [
        {
          name: "今日",
          count: [4721, 2001, 9997, 1236, 231],
          data: [
            {
              name: "下载量",
              data: [40, 59, 70, 43, 90, 100],
            },
            {
              name: "注册量",
              data: [30, 149, 65, 39, 70, 80],
            },
            {
              name: "活跃量",
              data: [50, 70, 80, 100, 70, 120],
            },
          ],
        },
        {
          name: "最近七天",
          count: [8721, 5001, 19997, 2236, 1031],
          data: [
            {
              name: "下载量",
              data: [400, 529, 670, 200, 70, 100],
            },
            {
              name: "注册量",
              data: [300, 409, 305, 309, 270, 400],
            },
            {
              name: "活跃量",
              data: [500, 700, 80, 100, 160, 320],
            },
          ],
        },
        {
          name: "最近三十天",
          count: [9721, 7001, 49997, 4236, 2031],
          data: [
            {
              name: "下载量",
              data: [400, 259, 70, 43, 190, 100],
            },
            {
              name: "注册量",
              data: [300, 149, 105, 309, 270, 280],
            },
            {
              name: "活跃量",
              data: [150, 70, 180, 100, 70, 120],
            },
          ],
        },
        {
          name: "最近一年",
          count: [11721, 10001, 99997, 7236, 23331],
          data: [
            {
              name: "下载量",
              data: [420, 99, 70, 473, 90, 300],
            },
            {
              name: "注册量",
              data: [30, 490, 605, 309, 70, 80],
            },
            {
              name: "活跃量",
              data: [500, 70, 480, 100, 370, 120],
            },
          ],
        },
        {
          name: "全部",
          count: [28721, 20001, 899997, 10236, 43331],
          data: [
            {
              name: "下载量",
              data: [400, 509, 700, 430, 900, 300],
            },
            {
              name: "注册量",
              data: [300, 490, 605, 309, 470, 200],
            },
            {
              name: "活跃量",
              data: [500, 270, 480, 600, 270, 420],
            },
          ],
        },
      ],
    };
  },
  watch: {
    time() {
      this.drawChart();
    },
    value_pho() {
      let arr = [];
      this.phones.forEach((ele) => {
        arr.push(ele.name);
      });
      this.cn = arr.indexOf(this.value_pho);
    },
  },
  mounted() {
    this.value_pho = this.phones[this.cn].name;
    this.myChart = this.$echarts.init(document.getElementById("discount"));
    this.drawChart();
    this.counts.forEach((ele, index) => {
      ele.count = this.all_datas[0].count[index];
    });
    this.phones.forEach((ele) => {
      var max = 0;
      // 先算出总数
      ele.cate.forEach((element) => {
        max += element.count;
      });
      // 再依次计算每栏所占比例，”百分数“显示到页面
      ele.cate.forEach((element) => {
        element.width = (element.count * 2 * 100) / max + "%";
      });
    });
  },
  methods: {
    disapear() {
      this.visible = false;
    },
    showDate() {
      console.log(this.visible);
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
    showUl() {
      this.nShow = true;
    },
    choose(m) {
      this.nShow = false;
      this.cn = m;
    },
    drawChart() {
      var option = {
        // title: {
        //     text: '第一个 ECharts 实例'
        // },
        tooltip: {},
        // legend: {
        //     data:['销量']
        // },
        xAxis: {
          show: false,
          splitLine: {
            show: false,
          },
          data: ["1", "2", "3", "4", "5", "6"],
        },
        yAxis: {
          show: false,
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            type: "line",
            data: this.all_datas[this.time].data[0].data,
            lineStyle: {
              color: "rgb(44 128 255)",
            },
          },
          {
            type: "line",
            data: this.all_datas[this.time].data[1].data,
            lineStyle: {
              color: "rgb(255 70 70)",
            },
          },
          {
            type: "line",
            data: this.all_datas[this.time].data[2].data,
            lineStyle: {
              color: "rgb(56 213 140)",
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
    thousands(str) {
      //str 字符类型的数字
      let thousandsReg = /(\d)(?=(\d{3})+$)/g;
      const numArr = str.split(".");
      numArr[0] = numArr[0].replace(thousandsReg, "$1,");
      return numArr.join(".");
    },
    chooseTime(e) {
      this.time = e;
      this.counts.forEach((ele, index) => {
        ele.count = this.all_datas[e].count[index];
        if (index < 3) {
          ele.data = this.all_datas[0].data[index].data;
        }
      });
    },
  },
};
</script>
<style scoped>
.content {
  background-color: #fff;
  padding: 20px 100px 200px 100px;
  max-width: 1400px;
  min-width: 900px;
  margin: 0 auto 50px;
}
.content > .first {
  display: flex;
  justify-content: flex-start;
  margin: 15px 0 25px;
}
.content > .first > li {
  cursor: pointer;
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
}
.content > .second > .left {
  flex: 4;
}
.content > .second > .left .top {
  display: flex;
  flex-wrap: wrap;
}
.content > .second > .left .top > div {
  width: 22%;
  margin-right: 3%;
  padding: 13px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-weight: 400;
  margin-bottom: 25px;
}
.content > .second > .left .top > div .name {
  font-size: 14px;
  color: rgb(16, 16, 16);
  line-height: 20px;
  margin-bottom: 3px;
}
.content > .second > .left .top > div .count {
  line-height: 29px;
  font-size: 20px;
}
.content > .second > .left .bottom {
  width: 97%;
  box-sizing: border-box;
  margin-right: 3%;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 20px;
  font-weight: 400;
  font-size: 14px;
  color: rgb(16, 16, 16);
  line-height: 20px;
}
.content > .second > .left .bottom #discount {
  width: 100%;
  height: 300px;
}
.content > .second > .right {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 15px;
  box-sizing: border-box;
  min-width: 220px;
}
.content > .second > .right .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  color: rgb(16, 16, 16);
  line-height: 20px;
}
.content > .second > .right .top .download {
  border: 1px solid rgb(187, 187, 187);
  padding: 5px 8px;
  border-radius: 6px;
  color: rgb(139, 139, 139);
  position: relative;
}
.content > .second > .right .top .download > span {
  margin-right: 15px;
}
.content > .second > .right .top .download > img {
  width: 10px;
  height: 10px;
  cursor: pointer;
}
.content > .second > .right .top .download > ul {
  width: 100%;
  position: absolute;
  left: -1px;
  background-color: #999;
  color: #fff;
  border: 1px solid rgb(15, 15, 15);
  top: -1px;
  text-align: center;
  border-radius: 5px;
}
.content > .second > .right .top .download > ul > li {
  padding: 5px;
  cursor: pointer;
}
.content > .second > .right .top .download > ul > li:hover {
  background-color: #1e77ff;
}
.content > .second > .right #bar {
  width: 90%;
  height: 70%;
  margin-top: 40px;
  color: #aeaeae;
  font-size: 14px;
  line-height: 20px;
}
#bar .bar-area > div:first-child {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
#bar .bar-area > div:first-child > div:first-child {
  height: 10px;
  display: inline-block;
  background-color: rgb(198, 198, 198);
  margin-right: 5px;
}
</style>