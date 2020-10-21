<template>
  <div class="total">
    <div class="top">
      <div><h2>App数据监控</h2></div>
      <div>
        <img :src="appMsg[number].img" alt="" />
        <span>{{ appMsg[number].topName }}</span>
        <div class="down" @click="selectApp">
          <img src="../../static/img/down.png" alt="" />
        </div>
      </div>
      <div>
        <span>用户名</span>
        <span class="quit">退出</span>
      </div>
    </div>
    <div class="center">
      <div>
        <span :class="select == 1 ? 'selected' : ''" @click="cate(1)"
          >概述</span
        >
        <span :class="select == 2 ? 'selected' : ''" @click="cate(2)"
          >指标</span
        >
        <span
          v-show="number == 1"
          :class="select == 3 ? 'selected' : ''"
          @click="cate(3)"
          >提现</span
        >
      </div>
    </div>
    <div class="mask" v-show="maskShow" @click="mask">
      <div>
        <div
          class="icon"
          v-for="(item, index) of appMsg"
          :key="index"
        >
          <img @click="chooseApp(index)" :src="item.img" alt="" />
          <div @click="chooseApp(index)">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <!-- 概述 （其余）-->
    <out-other v-if="select == 1 && number == 0"></out-other>
    <!-- 概述 （走路有钱）-->
    <out-walk v-if="select == 1 && number == 1"></out-walk>
    <!-- 指标 -->
    <ind-walk ref="child1" :number="number" v-show="select == 2"></ind-walk>
    <!-- 提现 -->
    <with-draw ref="child2" v-show="select == 3 && number == 1"></with-draw>
  </div>
</template>
<script>
import outWalk from "../components/out_walk.vue";
import outOther from "../components/out_other.vue";
import indWalk from "../components/indicator_walk.vue";
import withDraw from "../components/withdraw.vue";
export default {
  components: {
    outWalk,
    indWalk,
    withDraw,
    outOther,
  },
  data() {
    return {
      // 两个app信息
      appMsg: [
        {
          name: "Record Calls",
          topName: "Record Calls - for iPhone",
          img: "./static/img/v2_qgr0t2.png",
        },
        {
          name: "走路有钱",
          topName: "走路有钱",
          img: "./static/img/v2_qgsy0x.png",
        },
      ],
      number: 1, //app分类
      maskShow: false, //遮罩层
      select: 1, //概述，指标，提现等分类
    };
  },
  methods: {
    selectApp() {
      this.maskShow = true;
    },
    chooseApp(e) {
      this.number = e;
      this.select = 1;
      this.maskShow = false;
    },
    cate(e) {
      this.select = e;
      this.$refs.child1.clearPage();
      this.$refs.child2.clearPage();
    },
    mask(){
      this.maskShow=false
    }
  },
};
</script>
<style scoped>
.total {
  width: 100%;
  margin: 0 auto;
}
.total > .top {
  background-color: #fff;
  display: flex;
  padding: 10px 100px;
  max-width: 1400px;
  min-width: 900px;
  margin: 0 auto;
}
.total > .top > div {
  flex: 1;
  align-self: center;
}
.total > .top > div:first-child {
  text-align: left;
}
.total > .top > div:nth-child(2) {
  text-align: center;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.total > .top > div:nth-child(2) > img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.total > .top > div:nth-child(2) > .down {
  width: 32px;
  height: 32px;
  margin-left: 8px;
  cursor: pointer;
}
.total > .top > div:nth-child(2) > .down > img {
  width: 50%;
  margin-top: 8px;
}
.total > .top > div:last-child {
  text-align: right;
  font-size: 14px;
}
.total > .top > div:last-child .quit {
  color: #409eff;
  cursor: pointer;
}
.total > .center {
  background-color: rgba(244, 244, 244, 1);
}
.total > .center > div {
  text-align: left;
  padding: 25px 100px;
  max-width: 1400px;
  min-width: 900px;
  margin: 0 auto;
}
.total > .center > div > span {
  margin-right: 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: rgba(174, 174, 174, 1);
  line-height: 24px;
}
.total > .center > div > span.selected {
  color: #409eff;
}
.total .mask {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.total .mask > div {
  width: 800px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.total .mask > div .icon {
  width: 160px;
  height: 100px;
  text-align: center;
}
.total .mask > div .icon>img{
  cursor: pointer;
}
.total .mask > div .icon > div {
  font-weight: 400;
  font-size: 14px;
  color: rgb(251, 251, 251);
  line-height: 20px;
  margin-top: 10px;
  cursor: pointer;
}
</style>