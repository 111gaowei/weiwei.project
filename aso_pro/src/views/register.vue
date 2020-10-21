  <template>
  <div class="outside">
    <div class="reg">
      <div class="first">
        <img src="../../static/img/logo_blue@2x.png" alt="" />
      </div>
      <div class="second">
        技术领先的ASO智能自助投放平台
        <div v-show="show3" class="final">验证码错误</div>
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
            v-model="passward"
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
      <!-- 选择主体 -->
      <el-select
        v-model="select_major"
        placeholder="选择主体"
        style="margin-bottom: 16px; width: 100%"
      >
        <el-option
          v-for="(item, index) of majors"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <!-- 设置主体名称 -->
      <div class="passward" style="margin-bottom: 24px">
        <el-input v-model="major" placeholder="主体名称"></el-input>
      </div>
      <!-- 确认 -->
      <el-button
        class="btn-sure"
        type="primary"
        :disabled="!test"
        :class="test ? 'abled' : 'disabled'"
        @click="register"
        >立即注册</el-button
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
      value: "+86", //手机区号
      code: "", //验证码
      phone: "", //手机号
      passward: "", //设置登录密码
      send: true, //发送验证码
      btnContent: "获取短信验证码",
      second: 60,
      majors: ["公司", "个人"],
      select_major: "", //主体名称
      major: "", //主体名称
      show1: false,
      show2: false,
      phoneMsg: "",
      passwardMsg: "",
      test: false,
      show3: false, //验证码输入提示框
    };
  },
  watch: {
    phone() {
      this.testAll();
    },
    code() {
      this.testAll();
    },
    passward() {
      this.testAll();
    },
    select_major() {
      this.testAll();
    },
    major() {
      this.testAll();
    },
    show1() {
      this.testAll();
    },
    show2() {
      this.testAll();
    },
  },
  methods: {
    // 所有必填项都不为空，按钮才可以点击
    testAll() {
      if (
        this.phone.trim() !== "" &&
        this.code.trim() !== "" &&
        this.passward.trim() !== "" &&
        this.select_major.trim() !== "" &&
        this.major.trim() !== "" &&
        this.show1 == false &&
        this.show2 == false
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
    register() {
      if (this.code == 1234 || this.code == 5678) {
        this.show3 = false;
        let obj = {
          phone: this.phone,
          upwd: this.passward1,
          major: this.select_major,
          major_name: this.major,
        };
        this.axios.post("/users", obj).then((res) => {
          this.$message({
            message: "注册成功",
            type: "success",
            duration: 1200,
          });
          setTimeout(() => {
            this.$router.push("/success/register");
          }, 1000);
        });
      } else {
        this.show3 = false;
        setTimeout(() => {
          this.show3 = true;
        }, 100);
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
      if (!passwardReg.test(this.passward) && this.passward.trim() !== "") {
        this.show2 = true;
        this.passwardMsg = "您的密码设置不符合要求,请重新设置";
      } else {
        this.show2 = false;
        this.passwardMsg = "";
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
.reg {
  box-sizing: border-box;
  position: absolute;
  width: 364px;
  /* height: 540px; */
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
.reg > .first {
  width: 33%;
  margin: 0 auto 16px;
}
.reg > .first > img {
  width: 100%;
}
.reg > .second {
  position: relative;
  font-size: 16px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 22px;
  text-align: center;
  margin: 0 auto 32px;
}
.reg > .second .final {
  position: absolute;
  left: 10px;
  bottom: -30px;
  font-size: 12px;
  color: #f55;
}
.reg > .third {
  width: 100%;
  display: flex;
  margin-bottom: 16px;
}
.reg > .third .left {
  flex: 3;
}

.reg > .third .right {
  flex: 7;
}
.reg .code {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.reg .code .minute {
  font-size: 14px;
  /* font-family: PingFangSC-Regular, PingFang SC; */
  font-weight: 400;
  text-align: center;
  color: #aaa;
}
.reg .last {
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
.reg > .third .left .el-input__inner {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.reg > .third .left ul {
  width: 170px;
}
.reg > .third .el-input__inner:focus,
.reg > .passward .el-input__inner:focus,
.reg > .code .el-input__inner:focus {
  border-color: #dcdfe6;
}
.reg .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}
.reg > .third .right .el-input__inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.reg .btn-sure {
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
.reg .btn-sure.abled:hover {
  opacity: 0.9;
}
.reg .btn-sure.disabled {
  background-color: #a0cfff;
}
</style>