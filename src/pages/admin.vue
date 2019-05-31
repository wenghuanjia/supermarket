<template>
  <div class="admin-content">
    <header class="admin-header">
      <router-link to="alist" class="search">
        <input type="text" placeholder="搜索">
      </router-link>
      <img src="../assets/images/user.jpg" alt @click="show = true">
    </header>
    <van-actionsheet v-model="show" :actions="actions" @select="onSelect"/>
    <main class="admin-main">
      <div class="main-num">
        <dl class="line">
          <dt>
            <span>{{ single }}</span>
            <label>/{{ total }}</label>
          </dt>
          <dd>缺货/总机器数</dd>
        </dl>
        <dl>
          <dt>
            <span>{{ single }}</span>
            <label></label>
          </dt>
          <dd>故障机器数</dd>
        </dl>
      </div>
      <ul class="nav-list">
        <router-link to="alist" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic1.jpg" alt>
          <h2>补货窗口</h2>
        </router-link>
        <router-link to="aorder" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>订单</h2>
        </router-link>
        <router-link to="acollent" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>汇总查询</h2>
        </router-link>
        <router-link to="arecord" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>补货记录</h2>
        </router-link>
        <router-link to="awraning" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>警示</h2>
        </router-link>
        <router-link to="auser" tag="li" class="nav-list-li" v-if="user_type==1">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>账号管理</h2>
        </router-link>
        <router-link to="toggle" tag="li" class="nav-list-li">
          <img src="../assets/images/sj_pic2.jpg" alt>
          <h2>界面切换管理</h2>
        </router-link>
      </ul>
    </main>
  </div>
</template>

<script>
import { IsOnline, getDevicename } from '../service/getData'
import { Actionsheet } from "vant";
import Vue from "vue";
import { removeStore, getStore } from "assets/js/common.js";
Vue.use(Actionsheet);
export default {
  data() {
    return {
      show: false,
      total: 0,
      single: 0,
      actions: [
        {
          name: "修改密码"
        },
        {
          name: "退出登录"
        },
      ],
      user_type: ''
    };
  },
  methods: {
    onSelect(item) {
      this.show = false;
      if (item.name == '退出登录') {
        removeStore('token', false)
        removeStore('user', false)
        this.$router.push({path:'/alogin'})
      }
      if (item.name == '修改密码') {
        this.$router.push({path:'/modify'})
      }
    },
    // 查询设备 故障
    async handleCheckFault() {
      // ------------缺货和故障机器数还未计算-----------------
      // const result = await IsOnline();
      // if (result.code == 1) {
      //   this.total = 1
      //   this.single = 0
      // } else {
      //   this.single = 1
      // }
      let that = this;
      const result = await getDevicename();
      if (result.code == 1) {
        this.total = result.data.length
      }
    }
  },
  created () {
    let { user_type } = JSON.parse(getStore('user', false));
    this.user_type = user_type;
    this.handleCheckFault();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";
.admin-header {
  background: #5f81ee;
  @include fj();
  height: 1.92rem;
  align-items: center;
  padding: 0px $p10;
  .search {
    @include wh(85%, 1.28rem);
    input {
      display: block;
      @include wh(100%, 100%);
      background: #4f72df;
      padding-left: $p10;
      @include sc($p14, #fff);
      border-radius: 4px;
      &::placeholder {
        color: #fff;
      }
    }
  }
  img {
    @include wh(1.28rem, 1.28rem);
    vertical-align: middle;
  }
}

.main-num {
  @include wh(100%, 187px);
  background: url("../assets/images/num_bj.jpg");
  background-size: 100%;
  overflow: auto;
  display: flex;
  dl {
    position: relative;
    margin-top: 40px;
    width: 50%;
    padding: 0 3%;
    background: url("../assets/images/num_r_b.jpg") no-repeat right center;
    background-size: 1px;
    text-align: center;
    dt {
      color: #fff;
      span {
        @include sc(48px, #fff);
      }
    }
    dd {
      padding-top: 5px;
      @include sc(18px, #fff);
    }
    &:last-child {
      background-image: none;
    }
  }
}

.nav-list {
  .nav-list-li {
    background: #fff;
    padding: $p10;
    display: flex;
    align-items: center;
    background: url("../assets/images/sj_r_icon.jpg") right center no-repeat;
    background-position-x: 98%;
    @include bl15();
    img {
      margin-right: $p10;
      @include wh(1.5rem, 1.5rem);
    }
    h2 {
      @include sc($p16, #333);
    }
  }
}
</style>
