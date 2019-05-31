<template>
  <div class="alist-content">
    <search @searchfun="searchfun"></search>
    <van-tabs
      v-model="active"
      :swipeable="true"
      :animated="true"
      color="#1BBC9B"
      title-active-color="#1BBC9B"
      title-inactive-color="#333333">
      <van-tab title="在线" class="vatab">
        <div v-if="items.length">
          <van-radio-group v-model="radio">
            <router-link
              :to="'alistdetail/'+item.devicename"
              tag="div"
              class="tab-item"
              v-for="(item, index) in items"
              :key="index"
            >
              <div class="tab-item-title">{{ item.devicename }}</div>
              <div class="tab-item-num">
                {{ item.nickname }}
                <span>{{ item.percent }}%</span>
              </div>
              <!-- <div class="tab-item-date">{{ item.date | format }}</div> -->
              <div class="item-radio" @click.stop>
                <van-radio :name="item.id"></van-radio>
              </div>
            </router-link>
          </van-radio-group>
        </div>
        <!-- <div v-else>当前没有设备哦！</div> -->
      </van-tab>
      <van-tab title="离线">
        <div v-if="items.length">
          <van-radio-group v-model="radio">
            <router-link
              to="alistdetail"
              tag="div"
              class="tab-item"
              v-for="(item, index) in items"
              :key="index"
            >
              <div class="tab-item-title">{{ item.title }}</div>
              <div class="tab-item-num">
                {{ item.num }}
                <span>{{ item.percent }}%</span>
              </div>
              <div class="tab-item-date">{{ item.date }}</div>
              <div class="item-radio" @click.stop>
                <van-radio :name="item.id"></van-radio>
              </div>
            </router-link>
          </van-radio-group>
        </div>
        <div v-else>当前没有设备哦！</div>
      </van-tab>
      <van-tab title="待补货">待补货-----当前没有设备哦！</van-tab>
    </van-tabs>
    <div class="add-user" @click="go_allot">修改设备名称</div>
  </div>
</template>

<script>
import { Tab, Tabs, RadioGroup, Radio, Toast } from "vant";
import Vue from "vue";
import search from "components/search/search";
import { getLockGoodsCount, getDevicename } from "../service/getData";

Vue.use(Tab)
  .use(Tabs)
  .use(RadioGroup)
  .use(Radio)
  .use(Toast);
export default {
  components: {
    search: search
  },
  data() {
    return {
      active: 0,
      radio: "",
      percent: "",
      items: [],
    };
  },
  methods: {
    // 搜索
    searchfun(date) {
      console.log(date);
    },
    // 分配
    go_allot() {
      if (this.radio) {
        this.$router.push({ path: "asetname", query: { id: this.radio } });
      } else {
        Toast("请选择设备！");
      }
    },
    // 计算 有货的百分比
    handleCount(devicename) {
      const that = this;
      // 计算 商品缺货百分比
      getLockGoodsCount({suo_devicename: devicename}).then(res => {
        if (res.code == 1) {
          // 定义 所有商品的长度
          var count = res.data.length;
          // 定义 有货的商品个数
          var molecule = 0;
          // 定义 接收 有货占总商品的百分比
          var percent = ''
          // 循环计算出 有货商品的个数
          res.data.forEach(item => {
            if (item.exist == 1) {
              molecule++;
            }
          });
          // 计算比例
          percent = (molecule / count) * 100;
          this.items.forEach(item => {
            // 判断当前 设备是否对应
            if (item.devicename == devicename) {
              item.percent = percent
            }
          })
        }
      });
    },
    // 获取设备 名称
    handleDevicename() {
      getDevicename().then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            item.percent = ''
            this.handleCount(item.devicename)
          })
          this.items = res.data;
        }
      })
    }
  },
  created() {
    // this.handleCount();
    this.handleDevicename();
  },
  filters: {
    // 时间格式化 过滤器
    format(value) {
      var date = new Date(value);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var h = date.getHours();
      var m1 = date.getMinutes();
      var s = date.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.tab-item {
  padding: $p10;
  @include bl15();
  .tab-item-title {
    @include sc($p16, #333);
    font-weight: 600;
  }
  .tab-item-num {
    @include sc($p14, #666);
    span {
      margin-left: $p30;
      @include sc($p16, #666);
    }
  }
  .tab-item-date {
    @include sc($p12, #999);
  }
  .item-radio {
    position: absolute;
    right: $p10;
    bottom: 50%;
    transform: translateY(50%);
    @include sc($p12, #333);
    > span:first-child {
      margin-right: $p10;
    }
  }
}
.add-user {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: $p45;
  line-height: $p45;
  text-align: center;
  background: #5f81ee;
  @include sc($p16, #fff);
}
</style>

<style lang="scss">
.van-tab--active {
  > span {
    color: #1bbc9b;
  }
}

.van-tabs__content {
  position: fixed;
  top: 84px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

.vatab {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}
</style>
