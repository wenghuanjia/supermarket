<template>
  <div class="acollent-main">
    <vheader :goBack="true" title="汇总查询" background="#1BBC9B" color="#fff"></vheader>
    <div class="acollent-content">
      <form @submit.prevent="sublogin" class="acollent-form">
        <div>
          <input type="text" v-model="terminal" placeholder="请输入机器ID">
        </div>
        <div class="timer">
          <div>
            <input type="text" v-model="start_time" placeholder="请选择时间" @click="start_show = true">
          </div>
          <span class="to">-</span>
          <div>
            <input type="text" v-model="end_time" placeholder="请选择时间" @click="end_show = true">
          </div>
          <div class="form-submit">
            <input type="submit" value="搜索">
          </div>
        </div>
      </form>
      <ul class="acollent-list">
        <li class="acollent-li" v-for="(item, index) in record_list" :key="index">
          <h3 class="order-title">{{ item.order_title }}</h3>
          <div class="order-time">
            <img src="../assets/images/icon1.png" alt>
            {{ item.order_time }}
          </div>
          <div class="order-pirce">(门编号：{{ item.order_num }})</div>
          <h2 class="order-detail">{{ item.order_name }}</h2>
        </li>
      </ul>
      <van-popup v-model="start_show" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="time"
          type="date"
          :max-date="new Date()"
          @confirm="set_start_time"
          @cancel="start_show = false"
        />
      </van-popup>
      <van-popup v-model="end_show" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="time"
          type="date"
          :max-date="new Date()"
          @confirm="set_end_time"
          @cancel="end_show = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import vheader from "components/header/header";
import { formatDate } from "assets/js/common";
import { DatetimePicker, Popup } from "vant";
import Vue from "vue";

Vue.use(DatetimePicker).use(Popup);
export default {
  components: {
    vheader: vheader
  },
  data() {
    return {
      terminal: "",
      time: new Date(),
      start_time: "", // 起点时间
      end_time: "", // 结束时间
      start_show: false, // 时间选择器显示隐藏
      end_show: false, // 时间选择器显示隐藏
      record_list: [
        {
          order_title: "D201903211056090387167",
          order_time: "2019-03-21 10:56:14",
          order_handle: "开门成功",
          order_pirce: 0.4,
          order_num: 2,
          order_client: "微信",
          order_name: "20190313000491(饼干牛奶套装（测试用）)"
        },
        {
          order_title: "D201903211056090387167",
          order_time: "2019-03-21 10:56:14",
          order_handle: "开门成功",
          order_pirce: 0.4,
          order_num: 2,
          order_client: "微信",
          order_name: "20190313000491(饼干牛奶套装（测试用）)"
        }
      ]
    };
  },
  methods: {
    set_start_time() {
      this.start_time = formatDate(this.time);
      this.start_show = false;
    },
    // 时间选择器确定
    set_end_time() {
      this.end_time = formatDate(this.time);
      this.end_show = false;
    },
    sublogin() {
      // 获取起始 时间 然后清空 两个变量的值
      console.log(this.start_time, this.end_time);
      this.start_time = this.end_time = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.acollent-main {
  overflow: auto;
  .acollent-content {
    .acollent-form {
      display: flex;
      flex-direction: column;
      padding: $p10;
      @include sc($p14, #333);
      .timer {
        margin-top: 8px;
        width: 100%;
        display: flex;
        > div {
          margin-right: 2%;
        }
      }
      > div {
        @include wh(40%, $p30);
        margin-right: 2%;
        input[type="text"] {
          @include wh(100%, 100%);
          padding: $p4 $p10;
          background: #f7f7f7;
        }
      }
      .form-submit {
        flex: 1;
        margin: 0;
        input[type="submit"] {
          @include wh(100%, 100%);
          color: #fff;
          background: #1bbc9b;
          padding: 0 4px;
        }
      }
    }
    .acollent-li {
      @include bl15();
      padding: $p10;
      line-height: $p30;
      &::after {
        border-top: 1px dashed #dedede;
      }
      .order-title {
        font-size: $p14;
      }
      .order-pirce,
      .order-time {
        display: flex;
        align-items: center;
        font-size: $p14;
        img {
          width: $p18;
          vertical-align: middle;
          margin-right: $p10;
        }
      }
      .order-detail {
        @include sc($p12, #333);
      }
    }
    .date-model {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
.to {
  line-height: 30px;
  margin-right: 2%;
}
</style>
