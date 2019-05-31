<template>
  <div class="exhibition">
    <vheader :goBack="true" title="界面展示" background="#1BBC9B" color="#fff"></vheader>
    <div v-if="pattern==0" class="center">
      <img src="../assets/images/0.png" alt="">
    </div>
    <div v-if="pattern==1" class="center">
      <img src="../assets/images/1.png" alt="">
    </div>
  </div>
</template>
<script>
import vheader from "components/header/header";
export default {
  data () {
    return {
      pattern: ''
    }
  },
  created () {
    let href = (window.location.href).split('?')
    // 确保在ulr路径中要的字段处于最后
    this.pattern = href[href.length - 1];
  },
  components: {
    vheader
  }
};
</script>
<style lang="scss" scoped>
.center {
  padding: 10px 15px;
}
</style>
