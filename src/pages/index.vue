<template>
  <main class="main-content">
    <!-- 轮播图模块 -->
    <div class="swiper-content">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <img src="../assets/images/lunbo-1.png" alt>
        </van-swipe-item>
        <van-swipe-item>
          <img src="../assets/images/lunbo-2.png" alt>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 商品排版模块 -->
    <div class="list" v-if="show">
      <!-- 横向排版方式 -->
      <ul class="nav" v-if="mode == 0">
        <router-link
          v-for="(item, index) in items"
          :key="index"
          class="nav-item"
          :to="{path: item.status!=0?'':'/detail/'+item.id, query:{devicename: devicename}}"
          tag="li"
        >
          <div class="pic">
            <img :src="item.more.thumbnail" alt>
          </div>
          <div class="desc">
            <p class="p_name">{{ item.post_title }}</p>
            <p class="p_price">
              <span>{{ item.post_keywords | formatMoney }}</span>
            </p>
          </div>
        </router-link>
      </ul>
      <!-- 九宫格排版方式 -->
      <ul class="nav list_ul_row_3 list_ul_row" v-if="mode == 1">
        <router-link
          @click.native="getPrice(item.price)"
          :to="{path: item.status!=0?'':'/detail/'+item.id, query:{devicename: devicename}}"
          tag="li"
          class="list_li"
          v-for="(item, index) in items"
          :key="index"
        >
          <img :src="item.more.thumbnail" alt>
          <div class="title">{{ item.post_title }}</div>
          <div class="price">{{ item.post_keywords | formatMoney }}</div>
          <div class="sell_out" v-if="item.sell_out_flag">已售空</div>
        </router-link>
      </ul>
    </div>
    <div class="list networking" v-else-if="no">暂无商品信息</div>
    <div class="list networking" v-else>设备未联网(设备插电后需要等待2分钟)</div>
    <!-- 提示 -->
    <div class="opinion-content">
      <p class="hint">
        <!-- <span>*</span> -->
        提示：由于网络延时等原因，请在支付完一个商品，门打开后，在购买其他商品
      </p>
      <p class="phone">运维：130000000000 13000000000</p>
      <address>广州市盐联信息技术有限公司 欢迎咨询加盟</address>
    </div>
    <!-- 留言 -->
    <ul>
      <router-link class="nav-item" to="/message" tag="li">
        <div class="pic"></div>
        <div class="desc">
          <p class="p_name">若有需求、意见、 点击留言</p>
          <p class="p_price"></p>
        </div>
      </router-link>
    </ul>
  </main>
</template>

<script>
import {
  getShopLists,
  IsOnline,
  getShopsStatus,
  getShopStatus
} from "../service/getData";
import Vue from "vue";
import { Toast } from "vant";
import vheader from "components/header/header";
import { Swipe, SwipeItem } from "vant";
Vue.use(Swipe).use(SwipeItem);
import { getStore, setCookie, getCookie } from "../assets/js/common";
import { host } from "../service/env";
export default {
  data() {
    return {
      isShow: true, // 隐藏列表
      show: true,
      items: [],
      shopInfo: "",
      status: "",
      loading: true,
      devicename: "",
      no: false
    };
  },

  components: {
    vheader: vheader
  },

  methods: {
    // 获取总的商品列表
    async getShopLists(devicename) {
      const result = await getShopLists({ suo_devicename: devicename });
      if (result.code == 1) {
        if (result.data.length == 0) {
          Toast('暂无商品信息')
          this.show = false;
          return this.no = true;
        }
        this.items = result.data;
        this.items.forEach(item => {
          // 判断是否已售空
          item.status = 0;
        });
      }  else {
        Toast(result.msg);
      }
    },

    // 查询设备是否在线
    handleIsOnline(devicename) {
      let that = this;
      IsOnline({ suo_devicename: devicename }).then(res => {
        let data = res.data.data;
        if (res.code == 1) {
          // 当设备在线，并且需要当前商品还有剩余，有，允许点击购买，否则，不允许点击购买
          if (data) {
            that.show = true;
            // 获取首页列表设备状态
            getShopsStatus({ suo_devicename: devicename }).then(res => {
              this.IsWeixin(devicename);
              if (res.code == 1) {
                res.data.data.forEach(item => {
                  if (item.openStatus == 1) {
                    // openStatus == 1 是缺货
                    let id = item.post_id;
                    this.items.forEach(s => {
                      if (s.id == id || s.exist == 0) {
                        s.status = 1;
                        s.post_keywords = "已售空";
                      }
                    });
                  }
                });
              } else {
                Toast(res.msg)
              }
            });
          } else {
            // 当设备不在线，显示设备不在线即可
            that.show = false;
          }
        } else {
          Toast(res.msg);
        }
      });
    },

    // 微信环境判断 需要 用户授权
    IsWeixin(devicename) {
      // if (window.location.href.indexOf('devicename') == -1) {
      //   return window.location.href = 'http://www.baidu.com';
      // }
      var explorer = window.navigator.userAgent;
      // 判断是不是微信
      if (explorer.indexOf("MicroMessenger") >= 0) {
        // var script = document.createElement("script");
        // script.type = "text/javascript";
        // script.src = "http://res.wx.qq.com/open/js/jweixin-1.4.0.js";
        // document.body.appendChild(script);
        if (window.location.href.indexOf("openid") > -1) {
          // 判断 url 中是否包含 openid
          var href = window.location.href.split('?')[1].split('&')
          for (var i = 0; i < href.length; i++) {
            if (href[i].indexOf('openid') > -1) {
              href = href[i].split('=')
              setCookie(href[0], href[1])
              break;
            }
          }
          return;
        }
        if (!getCookie("openid")) {
          window.location.href = `${host}/home/authorize/profile?devicename=${devicename}&openid=`;
        }
      }
    }
  },

  filters: {
    // 给价钱添加￥前缀
    formatMoney(value) {
      // 判断是否含有中文字符串
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value) || value.length == 0) {
        return value;
      }
      return "￥" + value;
    }
  },

  created() {
    // 获取设备名称
    let devicename = this.$route.query.devicename;
    if (!devicename) {
      this.show = false;
      return;
    }
    this.devicename = devicename;
    this.getShopLists(devicename);
    this.handleIsOnline(devicename);
    if (window.location.href.indexOf("status=1") > -1) {
      // this.$router.push({path:`/index/?devicename=${devicename}`});
      // window.location.reload();
      // Toast()
      Toast.success({
        message: "支付成功",
        duration: 2000,
        onClose: () => {
          this.$router.push({path:`/index/?devicename=${devicename}`});
          window.location.reload();
        }
      });
    }
  },

  computed: {
    // 从缓存中获取首页的排版方式  0 为默认横排 1 为九宫格排版
    mode() {
      let mode = getStore("mode", false);
      if (mode) return mode;
      return 0;
    }
  },

  mounted() {
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.networking {
  color: red;
  font-size: 12px;
  text-align: center;
}

.swiper-content {
  position: fixed;
  z-index: 99;
  background: #fff;
  width: 100%;
  img {
    width: 100%;
    vertical-align: middle;
  }
}

.figure-content {
  background: #fff;
  @include fj(start);
  padding: $p10 $p15;
  align-items: center;
  position: relative;
  img {
    width: 30px;
  }
  .figcaption-content {
    margin-left: $p10;
    @include sc($p16, #333);
    figcaption {
      font-weight: 600;
    }
    span {
      color: #666;
    }
  }
  .set-way {
    position: absolute;
    right: $p15;
    top: 50%;
    transform: translateY(-50%);
  }
}

.list {
  width: 94%;
  padding-top: 105px;
  margin: 0 3%;
}
.nav-item {
  width: 100%;
  margin-top: 4%;
  position: relative;
  .pic {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .desc {
    width: 40%;
    margin-top: 11px;
    text-align: right;
    font-size: 16px;
    color: #221815;
    position: absolute;
    right: 6%;
    top: 0;
    p {
      // font-size: 0.18rem;
      margin-bottom: 10px;
      line-height: 20px;
    }
  }
}

.list_ul_col {
  background: #fff;
  .list_li {
    display: flex;
    border-radius: 4px;
    width: 100%;
    padding: 0.32rem;
    border-bottom: 1px solid #f7f7f7;
    position: relative;
    .list_li_img {
      width: 30%;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .list_li_content {
      width: 70%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 4px $p10 0;
        @include sc($p14, #333);
      }
      .price_sell {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .price {
          padding: 0 $p10 4px;
          @include sc($p12, #fca90f);
        }
        .sell_out {
          @include sc($p14, #f72000);
        }
      }
    }
  }
}

.list_ul_col_p {
  padding: $p10;
  background: #f7f7f7;
  .list_li {
    background: #fff;
    border: none;
    margin-bottom: $p10;
  }
  .sell_out {
    position: absolute;
    top: $p10;
    right: $p10;
  }
}

.list_ul_col_5 {
  background: #f7f7f7;
  .list_li {
    background: #fff;
    flex-flow: column nowrap;
    border: none;
    margin-top: $p10;
    .list_li_img {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $p20 0;
      width: 100%;
      border-bottom: 1px solid #f7f7f7;
      img {
        width: 30%;
      }
    }
    .list_li_content {
      width: 100%;
    }
  }
}

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
      width: 100%;
      vertical-align: middle;
    }
    .title {
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px $p10 0;
      @include sc($p14, #333);
    }
    .price {
      padding: 0 $p10 4px;
      @include sc($p12, #fca90f);
    }
    .sell_out {
      position: absolute;
      bottom: $p15;
      right: $p10;
      @include sc($p14, #f72000);
    }
  }
}

.list_ul_row_3 {
  > .list_li {
    width: 32%;
    margin: 0.1rem;
    > .title {
      width: 57%;
    }
  }
}

.opinion-content {
  background: #000;
  margin: 4% 3%;
  @include sc($p12, #fff);
  padding: $p10;
  .hint {
    padding-bottom: 4px;
    color: #fff;
  }
  .phone {
    color: #fff;
  }
}

.opinion-title {
  margin-top: $p10;
  .opinion-small-title {
    background: #fff;
    height: 1.72rem;
    line-height: 1.72rem;
    text-align: center;
    @include sc($p14, #333);
  }
  .bg-fff {
    padding: 0px $p10 $p10;
    background: #ffffff;
    textarea {
      background: #f7f7f7;
      width: 100%;
      @include sc($p12, #333);
    }
  }
}

.opinion-btn-content {
  background: #fff;
  overflow: auto;
  .opinion-btn {
    margin: $p15 $p10;
    background: #1bbc9b;
    text-align: center;
    @include sc($p14, #fff);
    height: 1.72rem;
    line-height: 1.72rem;
    border-radius: 4px;
  }
}
</style>
