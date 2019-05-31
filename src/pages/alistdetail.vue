<template>
  <div class="list_detail">
    <!-- top 设备名 -->
    <vheader :goBack="true" :title="nickname" background="#1BBC9B" color="#fff"></vheader>
    <!-- 三个一键 结构 -->
    <div class="list_detail_footer">
      <div @click="open=true">一键开门</div>
      <div @click="clear=true">一键清空</div>
      <div @click="fill=true">一键填满</div>
    </div>
    <!-- 商品展示部分 结构 -->
    <ul class="list_ul_row">
      <li class="list_li" v-for="(item, index) in items" :key="index">
        <img v-lazy="item.thumbnail" @click="popup=true">
        <div class="title">{{item.id}} 补货时间：{{ item.time | format }}</div>
        <div class="title">{{ item.post_title }}</div>
        <div class="num">
          <span>容量1</span>
          <span>缺{{ item.exist==1 ? 0 : 1}}</span>
        </div>
        <div class="handle">
          <span @click="handleOpenDoor(item.id)">开门</span>
          <span
            :class="(item.Value == 1 || item.exist == 0) ? 'lack' : ''"
            @click="handleFill(item.id)"
          >补货</span>
        </div>
      </li>
    </ul>
    <!-- 点击 三个一键 展开结构 -->
    <div class="alert-city1 show_open" v-if="open">
      <ul>
        <li @click="handleCancel">取 消</li>
        <li @click="handleOpen" class="clear">开门</li>
      </ul>
    </div>
    <div class="alert-city1 show_clear" v-if="clear">
      <ul>
        <li @click="handleCancel">取 消</li>
        <li @click="handleClear" class="clear">清空</li>
      </ul>
    </div>
    <div class="alert-city1 show_fill" v-if="fill">
      <ul>
        <li @click="handleCancel">取 消</li>
        <li class="clear" @click="handleFill(9)">填满</li>
      </ul>
    </div>
    <!-- 点击图片弹窗 结构 -->
    <div class="alert-city" v-show="popup">
      <ul>
        <li @click="handleCancel">取 消</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  replenishment, // 商品信息
  openDoor, // 打开单个商品柜门
  IsOnline, // 设备是否在线
  clearGoods, // 一键清空
  additionalGoods, // 单个商品补货
  openAllLock, // 一键开门
  getDevicename
} from "../service/getData";
// 懒加载图片
import pic from "../assets/images/loading.gif";
import { imgBaseUrl } from "../service/env";
import vheader from "components/header/header";
import Vue from "vue";
import { Lazyload } from "vant";
import axios from 'axios'

// options 为可选参数，无则不传
Vue.use(Lazyload, {
  loading: pic
});
import { Toast } from "vant";

export default {
  components: {
    vheader: vheader
  },
  data() {
    return {
      show: false, // 数据加载出来前隐藏内容
      items: [], // 存储所有商品信息
      open: false, // 开门
      clear: false, // 清空
      fill: false, // 填满
      popup: false, // 点击图片弹窗
      devicename: '', // 设备名称
      nickname: ''
    };
  },
  methods: {
    // 获取设备名称
    handleGain(devicename) {
      let that = this;
      getDevicename().then(res => {
        console.log(res)
        if (res.code == 1) {
          res.data.forEach(item => {
            if (item.devicename == devicename) {
              that.nickname = item.nickname;
            }
          })
        }
      })
    },
    // 取消事件
    handleCancel() {
      this.open = false;
      this.clear = false;
      this.fill = false;
      this.popup = false;
    },
    // 一键清空
    async handleClear() {
      this.clear = false;
      const result = await clearGoods({suo_devicename: this.devicename});
      Toast("清空中...");
      if (result.code == 1) {
        this.clear = false;
        window.location.reload();
      } else {
        Toast(result.msg);
      }
    },
    // 获取该设备的所有led锁和对应的商品，和lock表的exist 状态
    async handleOperation() {
      const result = await replenishment({suo_devicename: this.devicename});
      if (result.code == 1) {
        // 遍历所有商品信息 拼接完整的图片路径
        result.data.forEach(item => {
          item.thumbnail = `${imgBaseUrl}${item.thumbnail}`;
        });
        this.items = result.data;
        // 显示页面内容
        this.show = true;
      } else {
        Toast(result.msg);
      }
    },
    // 打开单个商品存放的柜门
    async handleOpenDoor(id) {
      this.handlePopup("开门中...", 6000);
      // 查询设备是否在线
      const result = await IsOnline({suo_devicename: this.devicename});
      if (result.code == 1 && result.data.data == true) {
        const res = await openDoor({ id: id, suo_devicename: this.devicename });
        if (res.code == 1) {
          console.log(res);
          Toast(res.msg);
          // window.location.reload();
          this.handleOperation();
        } else {
          Toast(res.msg);
        }
      } else {
        Toast(result.msg);
      }
    },
    // 一键开门
    async handleOpen() {
      let that = this;
      // this.handlePopup("开门中...", 20000);
      this.open = false;
      // 查询设备是否在线
      const result = await IsOnline({ suo_devicename: this.devicename });
      if (result.code == 1 && result.data.data == true) {
        const res = await openAllLock({ suo_devicename: this.devicename });
        // ------------------一键开门 需要解决问题-------------------
        // 成功开门与真正的开门存在时间上的误差 刷新页面 ，状态可能还没发生改变
        // -------------------模拟 解决问题----------------------------
        Toast.loading({
          mask: true,
          message: '开门中...',
          duration: 10000,
          onClose: () => {
            // this.handleOperation();
            window.location.reload();
          }
        });
        // if () {
        // } else {
        //   Toast(res.msg);
        // }
      } else {
        Toast(result.msg);
      }
    },
    // 单个商品填充 传递进入9时为一键填满
    async handleFill(id) {
      if (id != 9) {
        this.handlePopup("补货中...", 5000);
      } else {
        this.handlePopup("补货中...", 11000);
      }
      this.fill = false;
      const result = await IsOnline({ suo_devicename: this.devicename });
      if (result.code == 1 && result.data.data == true) {
        additionalGoods({ id: id, suo_devicename: this.devicename }).then(res => {
          if (res.code == 1) {
            if (id != 9) {
              // 刷新页面 单个商品补货
              this.handleOperation();
              Toast(res.msg);
              // window.location.reload();
            } else {
              // console.log(res.data);
              this.handleOperation();
              Toast(res.msg);
            }
          } else {
            console.log(res);
            Toast(res.msg);
          }
        });
      } else {
        Toast(result.msg);
      }
    },
    // 弹出提示框
    handlePopup(message, duration) {
      Toast.loading({
        mask: true,
        message: message,
        duration: duration,
        forbidClick: true
      });
    }
  },
  filters: {
    // 处理时间格式
    format(value) {
      var time = new Date(value).toLocaleDateString().split("/");
      time = time[1] + "-" + time[2];
      return time;
    }
  },
  created() {
    this.devicename = this.$route.params.name
    this.handleGain(this.devicename);
    this.handleOperation();
    if (!this.show) {
      Toast.loading({
        mask: true,
        message: "数据加载中..."
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.list_detail {
  height: 100%;
  background: #f6f6fa;
  #head_top {
    box-shadow: none;
  }
}

// 商品展示部分样式
.list_ul_row {
  display: flex;
  flex-wrap: wrap;
  .list_li {
    border-radius: 4px;
    background: #fff;
    width: 46%;
    margin: 0.32rem;
    position: relative;
    img {
      @include wh($p100, $p45);
      display: block;
      margin: $p10 auto;
      vertical-align: middle;
    }
    .title {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px $p10 0;
      @include sc($p14, #333);
    }
    .num,
    .handle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $p12;
      line-height: $p25;
      .lack {
        color: red;
      }
      span {
        flex: 1;
        text-align: center;
        color: $theme;
      }
    }
    > .handle {
      background: $theme;
      line-height: $p30;
      span {
        @include sc($p14, #fff);
        text-align: center;
      }
    }
  }
}

.list_detail_footer {
  background: $theme;
  display: flex;
  div {
    padding: 0 20px;
    line-height: $p45;
    @include sc($p14, #fff);
  }
}

// 一键 事件样式
.alert-city1 {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  z-index: 101;
  ul {
    width: 70%;
    // height: 88px;
    margin: 0 auto;
    background: #fff;
    margin-top: 28%;
    li {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #333;
      border-bottom: 1px solid #e7e7e7;
      font-size: 14px;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

// 点击图片弹窗样式
.alert-city {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  ul {
    width: 70%;
    height: 288px;
    margin: 0 auto;
    background: #fff;
    margin-top: 18%;
    overflow-y: auto;
    li {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #333;
      border-bottom: 1px solid #e7e7e7;
    }
  }
}

// 模仿移动端点击触发修改样式
.clear:hover {
  background: #20b375;
  color: #fff;
}
</style>
