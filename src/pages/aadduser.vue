<template>
  <div class="adduser">
    <vheader :goBack="true" title="添加账户" background="#1BBC9B" color="#fff"></vheader>
    <form @submit.prevent="sublogin" class="add-form">
      <input type="text" v-model="user" placeholder="请输入账号">
      <input type="text" v-model="name" placeholder="请输入姓名">
      <input type="text" v-model="phone" placeholder="请输入手机号">
      <input type="password" v-model="password" placeholder="请输入密码">
      <input type="password" v-model="psd" placeholder="请再次输入密码">
      <input type="submit" value="添加" @click="sublogin">
    </form>
  </div>
</template>

<script>
import vheader from "components/header/header";
import { getShopLists } from '../service/getData'
import { Toast } from "vant";
export default {
  components: {
    vheader: vheader
  },
  data() {
    return {
      user: "",
      name: "",
      phone: "",
      password: "",
      psd: ""
    };
  },
  methods: {
    // 检测字段的合法性
    handleCheck() {
      if (this.user == '') {
        Toast('账号不能为空');
        return;
      }
      if (this.name == '') {
        Toast('姓名不能为空');
        return;
      }
      if (this.phone == '' || !(/^1[34578]\d{9}$/.test(this.phone))) {
        Toast('号码为空或该号码不合法');
        return;
      }
      if (this.password == '' || this.password.length < 6  || this.password == null) {
        Toast('密码的长度不能小于6');
        return;
      }
      if (this.psd != this.password) {
        Toast('两次输入的密码不一致');
        return;
      }
      this.handleEmpty();
    },
    // 添加账号后 清空字段
    handleEmpty() {
      this.user = ''
      this.name = ''
      this.phone = ''
      this.password = ''
      this.psd = ''
    },
    // 添加账号
    sublogin() {
      this.handleCheck()
    }
  },
  created () {
    getShopLists().then(res => {
      console.log(res)
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.add-form {
  padding: 10px $p10 $p10;
  input[type="text"],
  input[type="password"] {
    display: block;
    border: 1px solid #dddddd;
    padding: $p10;
    margin-bottom: $p15;
    width: 100%;
    font-size: $p14;
  }
  input[type="submit"] {
    @include btn();
  }
}
</style>
