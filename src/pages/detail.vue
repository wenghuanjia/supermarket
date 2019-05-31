<template>
  <main id="paypwd" v-cloak v-if="shop">
    <article class="main-content">
      <dl>
        <dt>
          <img :src="shops.more.thumbnail" style="width: 100%; height: 100%; max-height: 123px;">
        </dt>
        <dd>
          <p class="p_name">{{ shops.post_title }}</p>
          <p class="p_price">
            ¥
            <span>{{ shops.post_keywords }}</span>
          </p>
        </dd>
      </dl>
      <div class="btn-wrapper" @click="payment">
        <a class="btn-complete">立即支付</a>
      </div>
      <dl v-for="(img, i) in shops.more.photos" :key="i">
        <dt>
          <img :src="img.url" width="96%" height="96%" alt>
        </dt>
        <dd>
          <p class="p_name"></p>
          <p class="p_price"></p>
        </dd>
      </dl>
    </article>
  </main>
</template>

<script>
import axios from "axios";
import { host } from "../service/env";
import { getCookie } from "../assets/js/common";
import {
  getShopLists,
  getShopInfo,
  aliPayment,
  toWxpay,
  getShopStatus,
  IsOnline
} from "../service/getData";
import Vue from "vue";
import { Toast } from "vant";
import { Loading } from "vant";
Vue.use(Loading);
Vue.use(Toast);
export default {
  data() {
    return {
      imgs: [],
      shops: [],
      shop: "",
      allowClickStu: true, // 允许点击
      items: []
    };
  },

  methods: {
    // 获取商品列表
    getShops() {
      let id = this.$route.params.id;
      let devicename = this.$route.query.devicename;
      getShopLists({ suo_devicename: devicename })
        .then(res => {
          if (res.code === 1) {
            this.items = res.data;
            let data = res.data;
            // 循环遍历出对应子id的商品信息
            data.forEach(item => {
              if (item.id == id) {
                // 存储所有数据
                this.shops = item;
                this.imgs = item.more.photos;
                this.shop = item.more.thumbnail;
                this.isShow = false;
              }
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 支付 环境判断
    IsWeixinOrAlipay() {
      let that = this;
      // 获取从url传递过来的商品id号
      let id = this.$route.params.id;
      // 获取从url传递过来的设备号
      let devicename = this.$route.query.devicename;
      // 查询是否在线
      IsOnline({ suo_devicename: devicename }).then(res => {
        if (res.code == 1 && res.data.data) {
          // 查询状态
          getShopStatus({ post_id: id, suo_devicename: devicename }).then(
            res => {
              let exist = '';
              // 循环遍历当前的商品存放的柜子中是否有商品 0 表示不存在,1 表示存在
              this.items.forEach(item => {
                if (item.id == id) {
                  exist = item.exist;
                }
              })
              // 当柜子中有或并且该柜子的openStatus=0时,才允许用户进行支付操作
              if (exist == 1 && res.code == 1 && res.data.data.openStatus == "0") {
                // 判断支付环境是微信还是支付宝
                var explorer = window.navigator.userAgent;
                if (explorer.indexOf("MicroMessenger") >= 0) {
                  // 判断是不是微信
                  this.wxjsPay();
                  // 重新运行点击
                  this.allowClickStu = true;
                } else {
                  // 调用支付宝支付
                  this.goaliPay();
                  // 重新运行点击
                  this.allowClickStu = true;
                }
              } else {
                Toast("该商品已售空");
              }
            }
          );
        } else {
          Toast("设备未联网或者该商品已售空");
        }
      });
    },
    // 调用支付事件
    payment() {
      if (this.allowClickStu) {
        console.log(1)
        this.IsWeixinOrAlipay();
        this.allowClickStu = false;
      }
    },
    // 支付宝支付
    goaliPay() {
      // ----------取消支付,还停留在详情页中----------
      // 整个流程其实已经走了,但是取消支付后,页面跳转位置不清晰? 间接值?做判断,间接值是什么?
      // http://wap.gzwmdy.cn/api/user/Pay/toalipay?post_id=21
      let id = this.$route.params.id;
      window.location.href = `${host}/user/Pay/toAlipay?post_id=${id}`;
      // Toast('支付成功')
      this.allowClickStu = true;
    },
    // 微信支付
    wxjsPay() {
      let that = this;
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://res.wx.qq.com/open/js/jweixin-1.4.0.js";
      document.body.appendChild(script);
      let openid = getCookie("openid");
      let id = this.$route.params.id;
      let devicename = this.$route.query.devicename;
      // 微信公众号支付接口
      toWxpay({ post_id: id, openid: openid }).then(res => {
        if (res.code == 1) {
          let data = res.data;
          // 微信公众号配置
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timeStamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.paySign,// 必填，签名
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function() {
            wx.chooseWXPay({
              appId: data.appId,
              timestamp: data.timeStamp, // 支付签名时间戳
              nonceStr: data.nonceStr, // 支付签名随机串，不长于32 位
              package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: data.paySign, // 支付签名
              success: function(res) {
                //支付成功
                Toast.success({
                  message: '支付成功',
                  duration: 2000,
                  onClose: () => {
                    that.$router.push({path:`/index/?devicename=${devicename}`})
                  }
                });
              },
              cancel: function(res) {
                //支付取消
              }
            });
          });
        }
      });
    }
  },

  created() {
    this.getShops();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

[v-cloak] {
  display: none;
}

#paypwd .main-content {
  margin: 0 0.4rem;
  padding-top: 20px;
  dl {
    width: 100%;
    position: relative;
    dd {
      width: 40%;
      margin-top: 11px;
      text-align: right;
      font-size: 16px;
      color: #221815;
      position: absolute;
      right: 6%;
      top: 0;
    }
  }
}
#paypwd .btn-wrapper .btn-complete {
  display: block;
  width: 100%;
  background: #20b375;
  border-radius: 3px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
  margin-top: 20px;
}
</style>
