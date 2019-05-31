<template>
  <div class="toggle">
    <!-- <div class="head">
      <div class="head-inner">
        <i class="back-btn iconfont iconjiantou-copy-copy" @click="$router.push({path:'/admin'})"></i>
        <h2>界面展示</h2>
      </div>
    </div> -->
    <vheader :goBack="true" title="界面展示" background="#1BBC9B" color="#fff"></vheader>
    <div class="mode">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="九宫格展示" ref="jiugongge">
            <van-radio checked-color="#1BBC9A" name="1" @click="handletoggleA"/>
          </van-cell>
          <van-cell title="横版展示" ref="hengpai">
            <van-radio checked-color="#1BBC9A" name="0" @click="handletoggleB"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="btn" @click="handlemode">确认</div>
  </div>
</template>
<script>
import vheader from "components/header/header";
import { setStore, getStore } from "../assets/js/common";
import Vue from "vue";
import { Cell, CellGroup } from "vant";
import { RadioGroup, Radio } from "vant";
Vue.use(Cell).use(CellGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
export default {
  data() {
    return {
      radio: "0"
    };
  },
  methods: {
    // 九宫格展示方式
    handletoggleA() {
      this.radio = "1";
    },
    // 横排展示方式
    handletoggleB() {
      this.radio = "0";
    },
    // 点击确认按钮，跳转
    handlemode() {
      setStore("mode", this.radio, false);
      this.$router.push({ path: "/admin" });
    },
    // 点击展示对应的布局样式
    handleShowPicA($event) {
      let pattern = "";
      if ($event.target.innerText == "横版展示") {
        pattern = 0;
      } else if ($event.target.innerText == "九宫格展示") {
        pattern = 1;
      }
      this.$router.push(`/exhibition?${pattern}`);
    }
  },
  created() {
    let mode = getStore("mode", false);
    if (mode) {
      this.radio = mode;
    }
  },
  mounted() {
    // 为 两个文本 添加点击事件，跳转到对应的展示页面
    this.$refs.jiugongge.children[0].addEventListener('click', this.handleShowPicA)
    this.$refs.hengpai.children[0].addEventListener('click', this.handleShowPicA)
  },
  components: {
    vheader
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/style/mixin.scss";
.toggle {
  .head {
    width: 100%;
    height: 37px;
    text-align: center;
    background: #1bbc9a;
    font-size: 18px;
    line-height: 37px;
    .head-inner {
      padding: 0 0.1rem;
      display: flex;
      justify-content: space-around;
      i {
        color: #fff;
        font-size: 1rem;
      }
      h2 {
        flex: 1;
        color: #fff;
        font-size: 0.7rem;
        text-align: center;
      }
    }
  }
  .mode {
    .van-cell:not(:last-child)::after {
      content: " ";
      left: 0;
    }
  }
  .btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #1bbc9a;
    @include sc($p16, #fff);
    text-align: center;
    height: 1.92rem;
    line-height: 1.92rem;
  }
}
.van-cell {
  justify-content: space-between;
}
.van-cell__value {
  flex: none;
}
</style>
