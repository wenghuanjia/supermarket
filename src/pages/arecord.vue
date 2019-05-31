<template>
  <div class="acollent-main">
    <vheader :goBack="true" title="补货查询" background="#1BBC9B" color="#fff"></vheader>
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
          <h3 class="order-title">{{ item.suo_devicename }}</h3>
          <div class="order-time">
            <img src="../assets/images/icon1.png" alt>
            {{ item.time }}
          </div>
          <div class="order-pirce">(门编号：{{ item.lock_id }})</div>
          <h2 class="order-detail">{{ item.suo_devicename }}({{ item.post_title }})</h2>
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
    <infinite-loading force-use-infinite-wrapper infinite-scroll-disabled="busy" @infinite="infiniteHandler" v-if="isShow && orderInfo">
    </infinite-loading>
  </div>
</template>

<script>
import vheader from "components/header/header";
// 引入 上拉加载插件 组件
import InfiniteLoading from "vue-infinite-loading";
import { getTimeLockLog, getDevicename } from '../service/getData'
import { formatDate } from "assets/js/common";
import { DatetimePicker, Popup } from "vant";
import { Toast } from 'vant'
import Vue from "vue";

Vue.use(DatetimePicker).use(Popup);
export default {
  components: {
    vheader: vheader,
    InfiniteLoading
  },
  data() {
    return {
      terminal: "",
      time: new Date(),
      start_time: "", // 起点时间
      end_time: "", // 结束时间
      start_show: false, // 时间选择器显示隐藏
      end_show: false, // 时间选择器显示隐藏
      current: 1, // 分页，从第几页加载
      size: 10, // 加载数据的条数
      isShow: false, // 是否显示正在加载动画
      orderInfo: [], // 拷贝一份订单信息，用来处理上拉加载更多效果，减少请求
      record_list: []
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

    async sublogin() {
      // Toast.loading({
      //   message: "加载中...",
      //   duration: 3000
      // });
      const result = await getDevicename();
      console.log(result)
      if (result.code == 1) {
        let data = result.data;
        for (let i = 0; i < data.length; i++) {
          console.log(data[i].devicename == this.terminal)
          if (data[i].devicename == this.terminal) break;
          if (data[i].devicename != this.terminal) continue;
          console.log(this.terminal)
          if (this.terminal != data[i].devicename && this.terminal != "") {
            this.handleCheck("设备不存在");
            return;
          }
        }
      }
      const res = await getTimeLockLog({
        start_time: this.start_time,
        end_time: this.end_time,
        suo_devicename: this.terminal
      });
      if (this.start_time !== "" && this.end_time == "") {
        this.handleCheck("请输入完整时间");
        return;
      }
      if (this.end_time !== "" && this.start_time == "") {
        this.handleCheck("请输入完整时间");
        return;
      }
      if (res.code == 1) {
        this.record_list = this.orderInfo = res.data;
        if (res.data.length == 0) {
          Toast('暂无对应的数据信息')
          return;
        }
        var page = {
          current: 0,
          size: 10
        };
        let data = this.record_list;
        let filterData = page => {
          let start = page.current * page.size;
          data = data.slice(start, start + page.size);
          this.record_list = data;
          return data;
        };
        filterData(page);
        this.isShow = true;
      } else {
        Toast(res.msg);
      }
    },

    // 上拉加载更多数据
    infiniteHandler($state) {
      setTimeout(() => {
        var page = {
          current: this.current++,
          size: this.size
        };
        let data = this.orderInfo;
        // 获取数据 模拟分页获取数据的效果
        let filterData = page => {
          let start = page.current * page.size;
          data = data.slice(start, start + page.size);
          // 拼接数据，存放到订单信息中
          this.record_list = [].concat(this.record_list,data)
        };
        filterData(page);
        // 判断还有没有数据
        if (this.record_list.length >= this.orderInfo.length) {
          // 隐藏 正在加载动画
          this.isShow = false;
          // 结束了
          return;
        }
        // 再次调用请求的函数
        $state.loaded();
      }, 1000);
    },

    handleCheck(con) {
      this.record_list = [];
      Toast(con);
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
