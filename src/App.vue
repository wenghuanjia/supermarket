<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "./assets/style/common";

// 引入字体图标
@import "./assets/style/iconfont/iconfont.css";

.van-toast div,
.van-loading__circular {
  color: #fff;
}

#app,
.App {
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
</style>
