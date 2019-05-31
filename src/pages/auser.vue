<template>
  <div class="auser-content">
    <vheader :goBack="true" title="账户管理" background="#1BBC9B" color="#fff"></vheader>
    <ul class="auser-main">
      <li class="auser-li" v-for="(item, index) in user_list" :key="index">
        <div class="item-id">{{ item.id }}</div>
        <div class="item-name">{{ item.name }}</div>
        <div class="item-time">{{ item.time }}</div>
        <div class="item-handle">
          <router-link to="afacility" tag="span">管理设备</router-link>
          <span @click="show = true">删除</span>
        </div>
      </li>
    </ul>
    <van-actionsheet v-model="show" :actions="actions" @select="onSelect"/>
    <router-link to="aadduser" class="add-user">添加账号</router-link>
  </div>
</template>

<script>
import vheader from "components/header/header";
import { Actionsheet } from "vant";
import Vue from "vue";

Vue.use(Actionsheet);
export default {
  components: {
    vheader: vheader
  },
  data() {
    return {
      show: false,
      actions: [
        {
          name: "删除"
        },
        {
          name: "取消"
        }
      ],
      user_list: [
        {
          id: "15521214001",
          name: "123123",
          time: "2019-03-27 16:17:22"
        }
      ]
    };
  },
  methods: {
    onSelect(item) {
      this.show = false;
      console.log(item.name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.add-user {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: $p45;
  line-height: $p45;
  text-align: center;
  background: #5f81ee;
  @include sc($p16, #fff);
}

.auser-main {
  // padding: $p45 0 $p45;
  .auser-li {
    padding: $p10;
    @include bl15();
    position: relative;
    line-height: $p25;
    .item-id,
    .item-name,
    .item-time {
      @include sc($p14, #333);
    }
    .item-handle {
      position: absolute;
      right: $p10;
      bottom: $p10;
      @include sc($p12, #333);
      > span:first-child {
        margin-right: $p10;
      }
    }
  }
}
</style>
