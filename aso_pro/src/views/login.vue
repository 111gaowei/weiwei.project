<template>
  <div class="outside">
    <div class="login">
      <div class="first">
        <img src="../../static/img/logo_blue@2x.png" alt="" />
      </div>
      <div class="second">
        技术领先的ASO智能自助投放平台
        <div v-show="show2" class="final">手机号或密码有误，请重新输入</div>
      </div>
      <div class="third">
        <el-select class="left" v-model="value" placeholder="请选择">
          <el-option
            v-for="(item, index) of countries"
            :key="index"
            :label="item.value"
            :value="item.value"
          >
            <span style="float: left; margin-right: 30px">{{
              item.label
            }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
        <el-input
          class="right"
          style="flex: 7"
          v-model="phone"
          placeholder="手机号"
          @blur="phoneTest"
        ></el-input>
      </div>
      <div :class="show1 ? 'show' : ''" class="phone-msg">{{ phoneMsg }}</div>
      <div class="fourth">
        <el-input
          v-model="passward"
          show-password
          placeholder="登录密码"
        ></el-input>
      </div>
      <el-button
        class="btn-login"
        type="primary"
        :disabled="!test"
        :class="test ? 'abled' : 'disabled'"
        @click="login"
        >立即登录</el-button
      >
      <div class="last">
        <span @click="toRegister">立即注册</span>
        <div></div>
        <span @click="toForget">忘记密码</span>
      </div>
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
      phone: "",
      passward: "",
      show1: false,
      show2: false, //上部提示
      phoneMsg: "",
      test: false, //是否验证成功
    };
  },
  watch: {
    // 监听show1的变化
    show1() {
      if (
        this.phone.trim() !== "" &&
        this.passward.trim() !== "" &&
        this.show1 == false
      ) {
        this.test = true;
      } else {
        this.test = false;
      }
    },
    phone() {
      if (
        this.phone.trim() !== "" &&
        this.passward.trim() !== "" &&
        this.show1 == false
      ) {
        this.test = true;
      } else {
        this.test = false;
      }
    },
    passward() {
      if (
        this.phone.trim() !== "" &&
        this.passward.trim() !== "" &&
        this.show1 == false
      ) {
        this.test = true;
      } else {
        this.test = false;
      }
    },
  },
  methods: {
    toForget() {
      this.$router.push("/forget");
    },
    toRegister() {
      this.$router.push("/register");
    },
    login() {
      // 向数据库查询有无该用户的信息，有的话提示登录成功，没有的话登录失败。
      this.axios
        .get(`/users?phone=${this.phone}&&upwd=${this.passward}`)
        .then((res) => {
          if (res.data.length > 0) {
            sessionStorage.setItem("isLogin", 1);
            this.$store.commit("login");
            this.$router.push("/success/login");
          } else {
            this.show2 = false;
            setTimeout(() => {
              this.show2 = true;
            }, 100);
          }
        });
    },
    phoneTest() {
      let phoneReg = /^1[34578]\d{9}$/;
      if (!phoneReg.test(this.phone) && this.phone.trim() !== "") {
        this.show1 = true;
        this.phoneMsg = "手机号格式错误";
      } else {
        this.show1 = false;
        this.phoneMsg = "";
      }
    },
  },
};
</script>
<style scoped>
/* 手机号格式错误提示 */
.phone-msg {
  color: #f55;
  font-size: 12px;
  text-align: left;
  height: 0px;
  line-height: 30px;
  padding-left: 15px;
  transition: all 0.3s linear;
  margin-top: 0px;
}
.phone-msg.show {
  height: 30px;
  margin-top: -16px;
}
.outside {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #f5f5f5;
  left: 0;
}
.login {
  box-sizing: border-box;
  position: absolute;
  width: 364px;
  /* height: 371px; */
  top: 15%;
  left: 0;
  right: 0;
  /* bottom: 50%; */
  padding: 24px 32px 32px;
  margin: 0 auto;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.login > .first {
  width: 33%;
  margin: 0 auto 16px;
}
.login > .first > img {
  width: 100%;
}
.login > .second {
  position: relative;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
  text-align: center;
  margin: 0 auto 32px;
}
.login > .second .final {
  position: absolute;
  left: 10px;
  bottom: -30px;
  font-size: 12px;
  color: #f55;
}
.login > .third {
  width: 100%;
  display: flex;
  margin-bottom: 16px;
}
.login > .third .left {
  flex: 3;
}

.login > .third .right {
  flex: 7;
}
.login > .fourth {
  margin-bottom: 32px;
}
.login .last {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #2886ff;
  line-height: 22px;
}
.login .last span {
  cursor: pointer;
}
.login .last div {
  width: 1px;
  height: 13px;
  margin: 0 8px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
<style >
/* 修改elementui中的样式 */
.login > .third .left .el-input__inner {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.login > .third .left ul {
  width: 170px;
}
.login > .third .el-input__inner:focus,
.login > .fourth .el-input__inner:focus {
  border-color: #dcdfe6;
}
.login .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}
.login > .third .right .el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.login .btn-login {
  width: 100%;
  padding: 9px 0;
  text-align: center;
  background-color: #2886ff;
  font-size: 16px;
  /* : PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  margin-bottom: 23px;
}
.login .btn-login.abled:hover {
  opacity: 0.9;
}
.login .btn-login.disabled {
  background-color: #a0cfff;
}
</style>