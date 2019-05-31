<template>
  <div class="acollent-main">
    <vheader :goBack="true" title="汇总查询" background="#1BBC9B" color="#fff"></vheader>
    <div class="acollent-content">
      <section class="acollent-income">
        <div>
          总额
          <div>{{ rental }}</div>
        </div>
        <div>
          总利润
          <div>{{ profit }}</div>
        </div>
        <div>
          昨日
          <div>{{ old_price }}</div>
        </div>
      </section>
      <form @submit.prevent="sublogin" class="acollent-form">
        <div>
          <input type="text" v-model="terminal" placeholder="请输入机器ID">
        </div>
        <div class="timer">
          <div>
            <input type="text" v-model="start_time" placeholder="请选择开始时间" @click="start_show = true">
          </div>
          <span class="to">-</span>
          <div>
            <input type="text" v-model="end_time" placeholder="请选择结束时间" @click="end_show = true">
          </div>
          <div class="form-submit">
            <input type="submit" value="搜索">
          </div>
        </div>
      </form>
      <ul class="acollent-list">
        <li class="acollent-li">
          <div>产品</div>
          <div>月份</div>
          <div>单价</div>
          <div>数量</div>
          <div>总价</div>
        </li>
        <li class="acollent-li" v-for="(item, index) in collent_list" :key="index">
          <div>{{ item.name }}</div>
          <div>{{ item.month }}月</div>
          <div>{{ item.pirce }}</div>
          <div>{{ item.number }}</div>
          <div>{{ item.total }}</div>
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
      rental: 0.9, // 总额
      profit: 0.9, // 总利润
      old_price: 0.9, // 昨日
      terminal: "", // 机器ID
      time: new Date(),
      start_time: "", // 起点时间
      end_time: "", // 结束时间
      start_show: false, // 时间选择器显示隐藏
      end_show: false, // 时间选择器显示隐藏
      collent_list: [
        {
          name: "饼干牛奶",
          month: 3,
          pirce: 5,
          number: 1,
          total: 5
        },
        {
          name: "饼干牛奶",
          month: 3,
          pirce: 5,
          number: 1,
          total: 5
        }
      ] // 数据存储
    };
  },
  methods: {
    // 时间选择器确定
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
      console.log(this.start_time, this.end_time)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.acollent-main {
  overflow: auto;
  .acollent-content {
    .acollent-income {
      display: flex;
      justify-content: space-between;
      background: #1bbc9b;
      padding: $p15 0px;
      > div {
        flex: 1;
        padding: $p6 0;
        text-align: center;
        @include sc($p12, #fff);
        border-right: 1px solid #7bcba9;
        &:last-child {
          border: none;
        }
        > div {
          @include sc($p16, #fff);
          margin-top: $p6;
        }
      }
    }
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
    .acollent-list {
      padding: $p10;
      > .acollent-li:first-child {
        div {
          @include sc($p14, #333);
        }
      }
      .acollent-li {
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        div {
          flex: 1;
          @include sc($p12, #333);
          line-height: $p30;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
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
