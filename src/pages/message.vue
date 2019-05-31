<template>
  <div class="message">
    <div class="set-pwd">
      <!-- <div class="head">
        <div class="head-inner">
          <i class="back-btn iconfont iconjiantou-copy-copy" @click="$router.go(-1)"></i>
          <h2>留言</h2>
        </div>
      </div> -->
      <vheader :goBack="true" title="留言" background="#1BBC9B" color="#fff"></vheader>
      <article>
        <section>
          <div class="input-main">
            <p>
              <input type="text" id="message" class="tel" placeholder="请输入留言内容" value v-model="message">
            </p>
            <a id="btn-complete" style="display: block">
              <p class="update" @click="update">提交</p>
            </a>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>
<script>
import vheader from "components/header/header";
import Vue from 'vue'
import { Toast } from 'vant';

Vue.use(Toast);
export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    update() {
      let that = this;
      if (this.message.length === 0) return;
      // 删除左右空格
      this.message = this.message.trim();
      
      const toast = Toast.loading({
        duration: 2000, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '留言成功',
        onClose: () => {
          that.message = '';
          this.$router.push({path:'/index'})
        }
      })
    }
  },
  components: {
    vheader
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/style/mixin.scss";
.message {
  .set-pwd {
    width: 100%;
    height: 100%;
    // position: fixed;
    // top: 0;
    // left: 0;
    .head {
      width: 100%;
      height: 47px;
      text-align: center;
      background: #50c291;
      // position: fixed;
      // top: 0;
      // left: 0;
      // z-index: 1;
      font-size: 18px;
      line-height: 47px;
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
    .input-main {
      margin: 0 0.3rem;
      .tel {
        width: 98%;
        padding-left: 2%;
        height: 40px;
        margin-top: 20px;
        border: 1px solid #dddddd;
        outline: none;
        color: #999;
        font-size: 0.6em;
        font-family: "微软雅黑";
        background-color: rgba(255,255,255,0.6);
      }
      .update {
        width: 70%;
        padding: 10px 0;
        background: #1BBC9B;
        border-radius: 5px;
        margin: 30px auto;
        text-align: center;
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
</style>
