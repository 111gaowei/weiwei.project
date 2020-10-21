<template>
  <div class="main">
    <div class="top">
      <div class="left">
        <img src="../../static/img/logo@2x.png" alt="" />
      </div>
      <div class="right" v-if="!$store.state.isLogin">
        <el-button
          style="
            padding: 4px 16px;
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
          "
          type="primary"
          plain
          @click="toLogin"
          >登录</el-button
        >
        <el-button
          style="
            padding: 4px 16px;
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
          "
          @click="toReg"
          type="primary"
          >注册</el-button
        >
      </div>
      <div class="right" v-else>
        <span>自助投放</span>
        <div>耿</div>
        <div></div>
      </div>
    </div>
    <!-- 背景 -->
    <div class="second">
      <div class="bg">
        <div class="text">
          <div class="title">让您的App在全球获得明星级曝光</div>
          <div class="detail">
            技术领先的ASO智能自助投放平台，支持全球35个国家，助力APP出海
          </div>
          <div class="search">
            <!-- <img :src="cities[num].img" class="flag" alt="" /> -->
            <el-select
              class="select"
              style="width: 80px"
              v-model="value"
              @change="select"
              placeholder=""
            >
              <el-option
                v-for="(item, index) in cities"
                :key="index"
                :value="index"
              >
                <span style="float: left; margin-right: 15px">{{
                  item.value
                }}</span>
                <span style="float: right"
                  ><img
                    style="width: 28px; height: 20px; margin-top: 7px"
                    :src="item.img"
                    alt=""
                /></span>
              </el-option>
            </el-select>
            <el-input
              class="input"
              v-model="store"
              style="width: 301px"
              placeholder="输入应用名称或App ID查找"
            ></el-input>
            <el-button
              class="btn"
              @click="toLogin"
              style="width: 96px; padding: 16px 0"
              type="primary"
              >搜索应用</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 排名 -->
    <div class="third">
      <div class="title">提升排名</div>
      <div class="detail">
        全面快速执行优化策略并实时提供热门搜索排行榜，并监控您定制关键词的实时排名，保证排名提升的有效落实
      </div>
      <img style="width: 100%" src="../../static/img/paiming@2x.png" alt="" />
    </div>
    <!-- 流量 -->
    <div style="background: #f9fcff">
      <div class="third">
        <div class="title">获取流量</div>
        <div class="detail">
          100%真实用户下载安装，在短时间内完成大量级CPA或指定用户行为CPSA达到推广目标
        </div>
        <img
          style="width: 100%"
          src="../../static/img/liuliang@2x.png"
          alt=""
        />
      </div>
    </div>
    <!-- 热门搜索 -->
    <div class="third">
      <div class="title">热门搜索</div>
      <div class="detail">
        100%提升热搜词曝光度，提高App在关键词下的排名，从而获取精准搜索用户的下载、激活
      </div>
      <img style="width: 100%" src="../../static/img/sousuo@2x.png" alt="" />
    </div>
    <!-- 专家选词 -->
    <div style="background: #f8fafc">
      <div class="third">
        <div class="title">专家选词</div>
        <div class="detail">
          通过专家人工分析提升App相关的关键词覆盖数量，从而获得更多精准用户的下载转化
        </div>
        <img style="width: 100%" src="../../static/img/xuanci@2x.png" alt="" />
      </div>
    </div>
    <!-- 冲榜 -->
    <div class="third">
      <div class="title">冲榜</div>
      <div class="detail">
        提升App在总榜、分类榜上的排名，从而快速获取用户并提升知名度
      </div>
      <img style="width: 100%" src="../../static/img/chongbang@2x.png" alt="" />
    </div>
    <!-- 最后 关于我们。。。 -->
    <div class="last">
      <ul>
        <li v-for="(item, index) of ul" :key="index">{{ item }}</li>
      </ul>
      <div>©️2020-2021 asoplus.cn All Rights Reserved.</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      store: "", //应用名称
      cities: [
        {
          value: "中国",
          img: "./static/img/CN@3x.png",
        },
        {
          value: "美国",
          img: "./static/img/US@3x.png",
        },
        {
          value: "安道尔",
          img: "./static/img/AD@3x.png",
        },
        {
          value: "阿拉伯",
          img: "./static/img/AE@3x.png",
        },
        {
          value: "阿富汗",
          img: "./static/img/AF@3x.png",
        },
        {
          value: "巴布达",
          img: "./static/img/AG@3x.png",
        },
        {
          value: "安圭拉岛",
          img: "./static/img/AI@3x.png",
        },
      ],
      value: "", //选中的国家
      num: 0, //默认是第几个国家
      ul: ["关于我们", "加入我们", "商务合作", "自助投放", "业务咨询"],
    };
  },
  mounted() {
    console.log(sessionStorage.getItem('isLogin'))
    let input = document.querySelector(
      ".main .second .bg .text .search .select .el-input__inner"
    );
    input.style.backgroundImage=`url(${this.cities[0].img})`;
    input.style.backgroundSize='28px 20px';
  },
  methods: {
    select(e) {
      this.value = "";
      let input = document.querySelector(
        ".main .second .bg .text .search .select .el-input__inner"
      );
      input.style.backgroundImage = `url(${this.cities[e].img}) `;
      input.style.backgroundSize='28px 20px'
    },
    toLogin() {
      // 跳转到登录
      this.$router.push("/login");
    },
    toReg() {
      // 跳转到注册页面
      this.$router.push("/register");
    },
  },
  watch: {
    value() {
      this.num = this.value;
    },
  },
};
</script>
<style scoped>
.main {
  width: 100%;
}
.main .top {
  width: 80%;
  max-width: 1140px;
  min-width: 900px;
  margin: 0 auto;
  padding: 12px 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main .top .left > img {
  height: 1rem;
}
.main .top .right {
  position: relative;
}
.main .top .right > span:first-child {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
}
.main .top .right > div:nth-child(2) {
  background: #2886ff;
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  line-height: 32px;
  text-align: center;
  margin: 0 28px 0 22px;
}
.main .top .right > div:nth-child(3) {
  position: absolute;
  display: inline-block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: 3px;
  border: 9px solid rgba(0, 0, 0, 0);
  border-top: 9px solid rgba(0, 0, 0, 1);
  right: 0;
  top: 12px;
}
.main .second {
  width: 100%;
  /* height: calc(23vw); */
  background: linear-gradient(29deg, #fdfdfd 0%, #f1f7ff 100%);
  padding: 17px 0 1px;
  box-sizing: border-box;
}
.main .second .bg {
  width: 80%;
  max-width: 1140px;
  min-width: 900px;
  margin: 0 auto;
  /* height: calc(23vw - 18px); */
  background: url("../../static/img/topImg@2x.png") no-repeat 100% 0;
  background-size: cover;
}
.main .second .bg .text {
  /* height: calc(23vw - 18px); */
  display: flex;
  max-width: 500px;
  flex-direction: column;
  justify-content: center;
  padding: 50px 0 58px 0;
}
.main .second .bg .text .title {
  width: 347px;
  font-size: 36px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  line-height: 44px;
  margin-bottom: 24px;
}
.main .second .bg .text .detail {
  width: 500px;
  height: 16px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  line-height: 16px;
  margin-bottom: 32px;
}
.main .second .bg .text .search {
  width: 467px;
  display: flex;
  position: relative;
}
.main .second .bg .text .search .flag {
  width: 28px;
  height: 20px;
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 100;
}
.main .third {
  width: 66%;
  margin: 0 auto;
  max-width: 950px;
  min-width: 710px;
  padding-top: 40px;
}
.main .third .title {
  margin-bottom: 4px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  line-height: 33px;
}
.main .third .detail {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
  width: 545px;
  margin: 0 auto;
  margin-bottom: 14px;
}
.main .last {
  padding: 32px 0;
  background: #edf1f5;
}
.main .last ul {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.main .last ul > li {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  line-height: 20px;
  margin: 0 8px;
  cursor: pointer;
}
.main .last > div {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 23px;
  text-align: center;
}
</style>
<style>
/* 更改element ui的样式 */
.main .second .bg .text .search .el-input__inner {
  border: 1px solid #2886ff;
  height: 48px;
  line-height: 48px;
}
.main .second .bg .text .search .select .el-input__inner {
  border-radius: 4px 0 0 4px;
  border-right: 0;
  padding: 6px 0 6px 16px;
  background-repeat: no-repeat;
  background-position: 16px 14px;
}
.main .second .bg .text .search .select .el-input__inner input {
  width: 0;
}
.main .second .bg .text .search .input .el-input__inner {
  border-radius: 0;
  padding-left: 0px;
  border-left: 0;
  border-right: 0;
}
.main .second .bg .text .search .btn {
  border-radius: 0 4px 4px 0;
}
</style>