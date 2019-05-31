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
            <input
              type="text"
              v-model="start_time"
              placeholder="请选择开始时间"
              @click="start_show = true"
            >
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
          <div>{{ item.post_title }}</div>
          <div>{{ item.addtime | format }}月</div>
          <div>{{ item.total }}</div>
          <div>{{ item.total }}</div>
          <div>{{ item.total }}元</div>
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
import { getTimeLogGoods, getDevicename } from "../service/getData";
import { formatDate } from "assets/js/common";
import { DatetimePicker, Popup, Toast } from "vant";
import Vue from "vue";

Vue.use(DatetimePicker).use(Popup);
export default {
  components: {
    vheader: vheader,
    InfiniteLoading
  },
  data() {
    return {
      rental: 0, // 总额
      profit: 0, // 总利润
      old_price: 0, // 昨日
      terminal: "", // 机器ID
      time: new Date(),
      start_time: "", // 起点时间
      end_time: "", // 结束时间
      start_show: false, // 时间选择器显示隐藏
      end_show: false, // 时间选择器显示隐藏
      collent_list: [],
      current: 1, // 分页，从第几页加载
      size: 15, // 加载数据的条数
      isShow: false, // 是否显示正在加载动画
      orderInfo: [] // 拷贝一份订单信息，用来处理上拉加载更多效果，减少请求
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

    // 搜索
    async sublogin() {
      Toast.loading({
        message: "加载中...",
        duration: 3000
      });
      const result = await getDevicename();
      if (result.code == 1) {
        let data = result.data;
        for (let i = 0; i < data.length; i++) {
          if (data[i].devicename == this.terminal) break;
          if (data[i].devicename != this.terminal) continue;
          if (this.terminal != data[i].devicename && this.terminal !== "") {
            this.handleCheck("设备不存在");
            return;
          }
        }
      }
      const res = await getTimeLogGoods({
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
        this.collent_list = this.orderInfo = res.data.good_data;
        if (res.data.good_data == 0) {
          Toast('暂无对应的数据信息')
          return;
        }
        var page = {
          current: 0,
          size: 15
        };
        let data = this.collent_list;
        let filterData = page => {
          let start = page.current * page.size;
          data = data.slice(start, start + page.size);
          this.collent_list = data;
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
          this.collent_list = [].concat(this.collent_list,data)
        };
        filterData(page);
        // 判断还有没有数据
        if (this.collent_list.length >= this.orderInfo.length) {
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
      // this.rental = this.profit = 0;
      this.collent_list = [];
      Toast(con);
    },

    // 查询昨日利益和总额与总利润
    async handleFront() {
      // 当前时间
      var nowDate = new Date(new Date().toLocaleDateString())
      // 获取前一天日期
      var beforeDate = new Date(nowDate.getTime()-24*60*60*1000).toLocaleDateString()
      const result = await getTimeLogGoods({start_time: beforeDate, end_time: nowDate, suo_devicename: ''})
      if (result.code == 1) {
        this.old_price = result.data.sum_total;
      } else {
        Toast(result.msg)
      }
      const res = await getTimeLogGoods({start_time: '', end_time: '', suo_devicename: ''})
      if (res.code == 1) {
        this.rental = this.profit = res.data.sum_total;
      } else {
        Toast(res.msg)
      }
    }
  },

  filters: {
    // 从value中获取到月份
    format(value) {
      value = value.split(" ")[0].split("-")[1];
      return value;
    }
  },

  created() {
    // 获取昨日利益和总额
    this.handleFront();
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
