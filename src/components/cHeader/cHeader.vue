<template>
  <div class="header">
    <div class="goBack" @click="$router.go(-1)">
      <span class="iconfont iconjiantou-copy-copy"></span>
    </div>
    <div class="pay">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import "../../assets/style/mixin.scss";
.header {
  font-size: $p6;
  display: flex;
  background: #f5f9fc;
  padding: 0px 15px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  .pay {
    flex: 1;
    text-align: center;
  }
}
</style>
