<template>
  <div id="login">
    <header>
      <div class="head">
        <h2>登录</h2>
      </div>
    </header>
    <article>
      <section>
        <form class="form" @submit.prevent="sublogin">
          <div class="form-row line">
            <img src="../assets/images/tel-icon.png" alt>
            <input type="text" placeholder="请输入账号" v-model="username">
          </div>
          <div class="form-row">
            <img src="../assets/images/pwd-icon.png" alt>
            <input type="password" placeholder="请输入密码" v-model="password">
          </div>
          <input type="submit" value="登录" class="submit" @click="sublogin">
        </form>
      </section>
    </article>
    <!-- <div class="login-container">
            <div class="logo">
                <img src="http://qiniu.gzwmdy.cn/20190326113529.png" alt="">
            </div>
            <form class="form" @submit.prevent="sublogin">
                <div class="form-row">
                    <img src="../assets/images/phone.png" alt="">
                    <input type="text" placeholder="请输入用户名" v-model="username" >
                </div>
                <div class="form-row">
                    <img src="../assets/images/password.png" alt="">
                    <input type="password" placeholder="请输入登录密码" v-model="password">
                </div>
                <input type="submit" value="登录" class="submit" @click="sublogin" />
            </form>
    </div>-->
  </div>
</template>

<script>
import { login } from "service/getData.js";
import { setStore, getStore } from "assets/js/common.js";
import { Toast } from "vant";
export default {
  name: "login",
  data() {
    return {
      username: "", // 手机号
      password: "", // 密码
      flag: false
    };
  },
  created() {
    var token = getStore("token");
    if (token) {
      this.$router.push({ path: "admin" });
    }
  },
  methods: {
    // 登录
    sublogin() {
      if (this.flag) {
        return;
      }
      this.flag = true;
      if (!this.username) {
        Toast("请输入用户名!");
        return;
      } else if (!this.password) {
        Toast("请输入密码!");
        return;
      }
      login({
        username: this.username.trim(),
        password: this.password.trim(),
        device_type: "mobile"
      }).then(res => {
        if (res.code == 1) {
          Toast(res.msg);
          res = res.data;
          setStore("token", res.token);
          setStore("user", res.user);
          this.$router.push({ path: "admin" });
        }
        if (res.code == 0) {
          Toast(res.msg);
        }
        this.flag = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/style/mixin.scss";
#login {
  height: 100%;
  background: #f2f2f2;
}
.line::after {
	content: '';
	position: absolute;
	top: 34%;
	left: 50%;
	transform: translate(-50%);
	display: block;
	width: 94%;
	height: 1px;
	background: #ccc;
}
.head {
  width: 100%;
  height: 47px;
  text-align: center;
  background: #50c291;
  h2 {
    line-height: 47px;
    font-size: 18px;
    font-weight: normal;
    color: #fff;
  }
}
.form {
	position: relative;
  .form-row {
		padding: 10px 0;
		background: #fff;
		img {
			margin-left: 4%;
			height: 18px;
			width: 16px;
			vertical-align: middle;
		}
		input {
			vertical-align: middle;
			font-size: 12px;
      width: 80%;
		}
	}
  .submit {
    margin-top: 15px;
    width: 92%;
    margin-left: 4%;
    padding: 10px 0;
    background: #3fc9cb;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    font-size: 14px;
  }
}
</style>
