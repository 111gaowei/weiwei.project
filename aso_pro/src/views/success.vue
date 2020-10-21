<template>
  <div class="outside">
    <div class="success">
      <div class="first">
        <img src="../../static/img/logo_blue@2x.png" alt="" />
      </div>
      <div class="second">技术领先的ASO智能自助投放平台</div>
      <div class="third">{{ name }}</div>
      <div class="fourth">
        {{ message }}
      </div>
      <div class="fifth">{{ delay }}</div>
      <el-button disabled class="btn-success" type="primary"
        >进入投放后台</el-button
      >
      <div class="refresh">刷新页面</div>
      <div class="contact">紧急联系：188 8888 8888</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      countries: [
        {
          value: "+86",
          label: "中国大陆",
        },
        {
          value: "+852",
          label: "中国香港",
        },
        {
          value: "+853",
          label: "中国澳门",
        },
        {
          value: "+856",
          label: "中国台湾",
        },
        {
          value: "+81",
          label: "日本",
        },
        {
          value: "+82",
          label: "韩国",
        },
        {
          value: "+65",
          label: "新加坡",
        },
        {
          value: "+1",
          label: "美国",
        },
        {
          value: "+1",
          label: "加拿大",
        },
        {
          value: "+61",
          label: "澳大利亚",
        },
        {
          value: "+7",
          label: "俄罗斯",
        },
        {
          value: "+34",
          label: "西班牙",
        },
      ],
      value: "+86",
      name: "",
      message: "", //从哪个页面跳转而来
      delay: "",
    };
  },
  mounted() {
    let name = this.$route.params.last;
    if (name == "login") {
      this.name = "登录成功";
      this.message = "暂无自助投放权限，请与运营专家取得联系！";
      this.delay = "节假日、晚间若不能及时回复敬请谅解";
    } else {
      this.name = "注册成功";
      this.message = "运营专家将会在1小时内与您取得联系，请注意接听电话。";
      this.delay = "节假日、晚间可能会稍有延后，请谅解";
    }
  },
  methods: {
  },
};
</script>
<style scoped>
.outside {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #f5f5f5;
  left: 0;
}
.success {
  box-sizing: border-box;
  position: absolute;
  width: 364px;
  height: 439px;
  top: 15%;
  left: 0;
  right: 0;
  padding: 24px 32px 32px;
  margin: 0 auto;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.success > .first {
  width: 33%;
  margin: 0 auto 16px;
}
.success > .first > img {
  width: 100%;
}
.success > .second {
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
  text-align: center;
  margin: 0 auto 40px;
}
.success > .third {
  margin-bottom: 8px;
  text-align: center;
  font-size: 24px;
  /* font-family: PingFangSC-Semibold, PingFang SC; */
  font-weight: 600;
  color: #000000;
  line-height: 33px;
}
.success > .fourth {
  width: 241px;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #000000;
  line-height: 22px;
  margin: 0 auto 16px;
  text-align: center;
}
.success > .fifth {
  width: 241px;
  font-size: 12px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.3);
  line-height: 17px;
  margin: 0 auto 40px;
  text-align: center;
}
.success .refresh {
  text-align: center;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #2886ff;
  line-height: 22px;
  margin-bottom: 4px;
  cursor: pointer;
}
.success .contact {
  font-size: 12px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.3);
  line-height: 17px;
  text-align: center;
}
</style>
<style >
/* 修改elementui中的样式 */
.success .btn-success {
  width: 100%;
  padding: 9px 0;
  text-align: center;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  margin-bottom: 32px;
}
</style>