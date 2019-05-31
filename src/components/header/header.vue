<template>
  <header id="head_top" :style="{background: background ? background : ''}">
    <div class="backicon" v-if="goBack" @click="$router.go(-1)">
      <img src="../../assets/images/bj.png" alt>
    </div>
    <slot name="user-pic"></slot>
    <div class="title" :style="{color: color ? color : ''}">{{ title }}</div>
  </header>
</template>

<script>
export default {
  props: ["title", "goBack", "background", "color"]
};
</script>


<style scoped lang="scss">
@import "../../assets/style/mixin";

#head_top {
  background: #fff;
  // position: fixed;
  // z-index: 100;
  // left: 0;
  // top: 0;
  @include wh(100%, 1.92rem);
  // box-shadow: 0 0 1px #ebebeb;
}
.title {
  @include cl();
  line-height: 1.92rem;
  @include sc(0.6826rem, #333);
  font-weight: 600;
  letter-spacing: 2px;
}
.backicon {
  position: absolute;
  left: 10px;
  top: 7px;
  > img {
    @include wh(10.5px, 17.5px);
  }
}
</style>

