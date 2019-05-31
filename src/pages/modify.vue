<template>
  <div class="modify">
    <vheader :goBack="true" title="重设密码" background="#1BBC9B" color="#fff"></vheader>
    <article>
      <section>
        <form class="form">
          <div class="form-row" @submit.prevent="handleModify">
            <input type="password" placeholder="旧密码" v-model="oldPwd">
          </div>
          <div class="form-row">
            <input type="password" placeholder="请输入6-16个字符的密码" v-model="newPwd">
          </div>
          <div class="form-row">
            <input type="password" placeholder="确认密码" v-model="repeat_pwd">
          </div>
          <input type="submit" value="确认修改" class="submit" @click="handleModify">
        </form>
      </section>
    </article>
  </div>
</template>
<script>
import vheader from "components/header/header";
import { modifyPsd } from "../service/getData";
import { removeStore } from "../assets/js/common";
import { Toast } from 'vant'
export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      repeat_pwd: ""
    };
  },
  methods: {
    // 检测字段的合法性
    handleCheck() {
      if (this.oldPwd == "" || this.oldPwd == null) {
        Toast("旧密码不能为空");
        return;
      }
      if (this.newPwd == "" || this.newPwd == null) {
        Toast("密码不能为空");
        return;
      }
      if (this.newPwd.length < 6 || this.newPwd.length > 16) {
        Toast("请输入6-16个字符的密码");
        return;
      }
      if (this.newPwd != this.repeat_pwd) {
        Toast("两次密码不一致");
        return;
      }
    },
    handleModify() {
      // 确认修改，提交新的
      this.handleCheck();
      modifyPsd({
        old_password: this.oldPwd,
        password: this.newPwd,
        confirm_password: this.repeat_pwd
      }).then(res => {
        if (res.code == 1) {
          removeStore("user");
          removeStore("token");
          this.$router.push({ path: "/alogin" });
          Toast("修改成功，请重新登录");
        } else {
          Toast("修改失败，请重新输入");
        }
      });
    }
  },
  components: {
    vheader
  }
};
</script>
<style lang="scss" scoped>
.form {
  padding: 0 10px;
  .form-row {
    width: 98%;
    padding-left: 2%;
    height: 40px;
    margin-top: 25px;
    border: 1px solid #dddddd;
    color: #999;
    font-family: "微软雅黑";
    background-color: rgba(255, 255, 255, 0.6);
    input {
      font-size: 14px;
      width: 100%;
      outline: none;
      border: 0 none;
    }
  }
  .submit {
    margin-top: 25px;
    width: 92%;
    margin-left: 4%;
    padding: 10px 0;
    background: #1bbc9b;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    font-size: 14px;
  }
}
</style>
