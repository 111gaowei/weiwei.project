  <template>
  <div class="outside">
    <div class="forget">
      <div class="first">
        <img src="../../static/img/logo_blue@2x.png" alt="" />
      </div>
      <div class="second">
        技术领先的ASO智能自助投放平台
        <div v-show="show3" class="final">{{ codeMsg }}</div>
      </div>
      <!-- 输入手机号 -->
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
          @blur="phoneTest"
          placeholder="手机号"
        ></el-input>
      </div>
      <!--手机号验证信息 -->
      <div :class="show1 ? 'show' : ''" class="phone-msg">{{ phoneMsg }}</div>
      <!-- 验证码 -->
      <div class="code">
        <el-input
          style="width: 160px; margin-right: 9px"
          v-model="code"
          placeholder="6位短信验证码"
        ></el-input>
        <el-button
          v-if="send"
          style="width: 136px; padding: 9px 13px 9px 11px; font-weight: 400"
          @click="getcode"
          >{{ btnContent }}</el-button
        >
        <div style="width: 136px" v-else class="minute">
          {{ second }}秒后重新发送
        </div>
      </div>
      <!-- 设置登录密码 -->
      <div class="passward" style="margin-bottom: 16px">
        <el-tooltip
          class="item"
          effect="dark"
          content="密码包含 字母，数字,字符中的两种或两种以上，长度6-20"
          placement="top"
        >
          <el-input
            v-model="passward1"
            @blur="passwardTest"
            show-password
            placeholder="设置登录密码"
          ></el-input>
        </el-tooltip>
      </div>
      <!--登录密码 -->
      <div :class="show2 ? 'show' : ''" class="phone-msg">
        {{ passwardMsg }}
      </div>
      <!-- 再次确认密码 -->
      <div class="passward" style="margin-bottom: 24px">
        <el-input
          v-model="passward2"
          @blur="nextPassward"
          show-password
          placeholder="再次输入密码"
        ></el-input>
      </div>
      <!--登录密码 -->
      <div
        :class="show4 ? 'show' : ''"
        class="phone-msg"
        :style="show4 ? 'margin-top: -24px' : ''"
      >
        {{ nextMsg }}
      </div>
      <!-- 确认 -->
      <el-button
        class="btn-sure"
        type="primary"
        :disabled="!test"
        :class="test ? 'abled' : 'disabled'"
        @click="sure"
        >确认</el-button
      >
      <router-link to="/login"><div class="last">直接登录</div></router-link>
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
      code: "",
      phone: "", //手机号
      passward1: "", //设置登录密码
      passward2: "", //再次输入
      send: true, //发送验证码
      btnContent: "获取短信验证码",
      second: 60,
      phoneMsg: "",
      passwardMsg: "",
      nextMsg: "",
      show1: false, //手机号验证信息
      show2: false, //第一次密码
      show3: false, //验证码
      show4: false, //第二次的密码
      test: false,
      codeMsg: "",
    };
  },
  mounted() {
    // var h=document.getElementsByClassName(".el-input.el-input--suffix")
    // console.log(h)
  },
  watch: {
    phone() {
      this.testAll();
    },
    code() {
      this.testAll();
    },
    passward1() {
      this.testAll();
    },
    passward2() {
      this.testAll();
    },
    show1() {
      this.testAll();
    },
    show2() {
      this.testAll();
    },
    show4() {
      this.testAll();
    },
  },
  methods: {
    // 所有必填项都不为空，按钮才可以点击
    testAll() {
      if (
        this.phone.trim() !== "" &&
        this.code.trim() !== "" &&
        this.passward1.trim() !== "" &&
        this.passward2.trim() !== "" &&
        this.show1 == false &&
        this.show2 == false &&
        this.show4 == false
      ) {
        this.test = true;
      } else {
        this.test = false;
      }
    },
    // 获取验证码
    getcode() {
      this.send = false;
      let timer = setInterval(() => {
        this.second--;
      }, 1000);
      setTimeout(() => {
        this.second = 60;
        clearInterval(timer);
        this.send = true;
        this.btnContent = "重新发送";
      }, 60000);
    },
    // 确认,修改成功后进入登录界面
    // 修改密码
    sure() {
      if (this.code == 1234 || this.code == 5678) {
        this.axios.get(`/users?phone=${this.phone}`).then((res) => {
          if (res.data.length > 0) {
            let obj = res.data[0];
            let id = obj.id;
            obj.upwd = this.passward1;
            this.axios.put(`/users/${id}`, obj).then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration:1200
              });
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            });
          } else {
            this.show3 = false;
            this.codeMsg = "您输入的手机号尚未注册过,请先注册";
            setTimeout(() => {
              this.show3 = true;
            }, 50);
            this.code = "";
          }
        });
      } else {
        this.show3 = false;
        this.codeMsg = "验证码错误";
        setTimeout(() => {
          this.show3 = true;
        }, 50);
        this.code = "";
      }
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
    passwardTest() {
      //密码包含 字母，数字,字符中的两种或两种以上，长度6-20
      let passwardReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/;
      if (!passwardReg.test(this.passward1) && this.passward1.trim() !== "") {
        this.show2 = true;
        this.passwardMsg = "您的密码设置不符合要求,请重新设置";
      } else {
        this.show2 = false;
        this.passwardMsg = "";
      }
    },
    nextPassward() {
      if (this.passward1 !== this.passward2) {
        this.show4 = true;
        this.nextMsg = "两次密码输入不一致，请重新输入";
      } else {
        this.show4 = false;
        this.nextMsg = "";
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
a {
  text-decoration: none;
}
.outside {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #f5f5f5;
  left: 0;
}
.forget {
  box-sizing: border-box;
  position: absolute;
  width: 364px;
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
.forget > .first {
  width: 33%;
  margin: 0 auto 16px;
}
.forget > .first > img {
  width: 100%;
}
.forget > .second {
  position: relative;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
  text-align: center;
  margin: 0 auto 32px;
}
.forget > .second .final {
  position: absolute;
  left: 10px;
  bottom: -30px;
  font-size: 12px;
  color: #f55;
}
.forget > .third {
  width: 100%;
  display: flex;
  margin-bottom: 16px;
}
.forget > .third .left {
  flex: 3;
}

.forget > .third .right {
  flex: 7;
}
.forget .code {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.forget .code .minute {
  font-size: 14px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  text-align: center;
  color: #aaa;
}
.forget .last {
  text-align: center;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #2886ff;
  line-height: 22px;
  cursor: pointer;
}
</style>
<style >
/* 修改elementui中的样式 */
.forget > .third .left .el-input__inner {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.forget > .third .left ul {
  width: 170px;
}
.forget > .third .el-input__inner:focus,
.forget > .passward .el-input__inner:focus,
.forget > .code .el-input__inner:focus {
  border-color: #dcdfe6;
}
.forget .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}
.forget > .third .right .el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.forget .btn-sure {
  width: 100%;
  padding: 9px 0;
  text-align: center;
  background-color: #2886ff;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  margin-bottom: 23px;
}
.forget .btn-sure.abled:hover {
  opacity: 0.9;
}
.forget .btn-sure.disabled {
  background-color: #a0cfff;
}
</style>