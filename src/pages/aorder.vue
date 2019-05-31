<template>
  <div class="order-content">
    <vheader :goBack="true" title="订单" background="#1BBC9B" color="#fff"></vheader>
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
    <ul class="order-ul">
      <li class="order-li" v-for="(item, index) in order_item" :key="index">
        <div>D{{ item.order_id }}</div>
        <div class="order-time">
          <img src="../assets/images/icon1.png" alt>
          {{ item.addtime }}{{ item.open_status == 1 ? '开门成功' : '开门成功' }}
        </div>
        <div class="order-pirce">
          <img src="../assets/images/icon4.png" alt>
          价格 ：{{ item.total }}元 (门编号：{{ item.lock_id }})
        </div>
        <div class="order-start">
          <img src="../assets/images/yw.png" alt>
        </div>
        <h2 class="order-detail">
          <span>{{ item.order_id }}({{ item.post_title }})</span>
          <span>{{ item.type == 1 ? '微信' : '支付宝' }}</span>
        </h2>
      </li>
    </ul>
    <!-- 使用上拉加载更多插件 订单信息 -->
    <infinite-loading force-use-infinite-wrapper infinite-scroll-disabled="busy" @infinite="infiniteHandler" v-if="isShow">
    </infinite-loading>
    <div class="noData" v-else>暂无更多数据</div>
  </div>
</template>

<script>
import vheader from "components/header/header";
import { getLogGoods } from "../service/getData";
// 引入 上拉加载插件 组件
import InfiniteLoading from "vue-infinite-loading";
import { Toast } from "vant";

export default {
  data() {
    return {
      rental: 0, // 总额
      profit: 0, // 总利润
      old_price: 0, // 昨日收益
      order_item: [], // 存放订单信息
      isShow: true, // 是否显示正在加载动画
      current: 1, // 分页，从第几页加载
      size: 5, // 加载数据的条数
      orderInfo: [] // 拷贝一份订单信息，用来处理上拉加载更多效果，减少请求
    };
  },
  methods: {
    // 首屏加载前五条数据
    handleOrderInfo() {
      let that = this;
      getLogGoods().then(res => {
        console.log(res)
        if (res.code == 1) {
          that.orderInfo = res.data.good_data;
          that.order_item = res.data.good_data;
          var page = {
            current: 0,
            size: 5
          };
          let data = that.order_item;
          let filterData = page => {
            let start = page.current * page.size;
            data = data.slice(start, start + page.size);
            that.order_item = data;
            return data;
          };
          filterData(page);
          // 计算出 总额 总利润 ----- 需要修改
          res.data.good_data.forEach(item => {
            that.rental += parseFloat(item.total);
          });
          that.rental = that.rental.toFixed(2);
          that.profit = that.rental;
        } else {
          Toast(res.msg);
        }
      });
    },
    // 上拉 加载更多订单数据信息 方法
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
          this.order_item = [].concat(this.order_item,data)
        };
        filterData(page);
        // 判断还有没有数据
        if (this.order_item.length >= this.orderInfo.length) {
          // 隐藏 正在加载动画
          this.isShow = false;
          // 结束了
          return;
        }
        // 再次调用请求的函数
        $state.loaded();
      }, 1000);
    },
  },
  created() {
    this.handleOrderInfo();
  },
  // 挂载组件
  components: {
    vheader: vheader,
    InfiniteLoading
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.order-content {
  overflow: auto;
}

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

.order-ul {
  .order-li {
    padding: $p10;
    @include bl15();
    &::after {
      border-top: 1px dashed #dedede;
    }
    // border-bottom:  1px dashed #dedede;
    @include sc($p12, #333);
    position: relative;
    line-height: $p30;
    .order-title {
      font-size: $p14;
    }
    .order-pirce,
    .order-time {
      display: flex;
      align-items: center;

      img {
        width: $p18;
        vertical-align: middle;
        margin-right: $p10;
      }
    }
    .order-start {
      position: absolute;
      right: $p10;
      bottom: $p30;
      img {
        width: $p47;
      }
    }
    .order-detail {
      display: flex;
      justify-content: space-between;
      @include sc($p12, #333);
    }
  }
}

.noData {
  padding: 10px 0;
  text-align: center;
  font-size: 18px;
}
</style>
