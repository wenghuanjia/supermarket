<template>
    <div class="acollent-main">
        <vheader :goBack="true" title="警示" background="#1BBC9B" color="#fff"></vheader>
        <div class="acollent-content">
            <form @submit.prevent="sublogin" class="acollent-form">
                <div>
                    <input type="text" v-model="replenishment" placeholder="未补货天数">
                </div>
                <div>
                    <input type="text" v-model="marker" placeholder="未销售天数">
                </div>
                <div>
                    <input type="text" v-model="online" placeholder="未在线天数">
                </div>
                <div class="form-submit">
                    <input type="submit" value="搜索">
                </div>
            </form>
            <ul class="acollent-list">
                <li class="acollent-li" v-for="(item, index) in record_list" :key="index">
                    <h3 class="order-title">{{ item.order_title }}</h3>
                    <div class="order-time">
                        <img src="../assets/images/icon1.png" alt="">
                        {{ item.order_time }}
                    </div>
                    <h2 class="order-detail">
                        {{ item.order_name }}
                    </h2>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import vheader from "components/header/header";
import { formatDate } from "assets/js/common";
import { DatetimePicker, Popup } from 'vant';
import Vue from 'vue';

Vue.use(DatetimePicker).use(Popup);
export default {
    components: {
        vheader: vheader
    },
    data () {
        return {
            replenishment: '',
            marker: '',
            online: '',
            record_list: [
                {
                    order_title: 'D201903211056090387167',
                    order_time: '2019-03-21 10:56:14',
                    order_handle: '开门成功',
                    order_pirce: 0.4,
                    order_num: 2,
                    order_client: '微信',
                    order_name: '20190313000491(饼干牛奶套装（测试用）)'
                },
                {
                    order_title: 'D201903211056090387167',
                    order_time: '2019-03-21 10:56:14',
                    order_handle: '开门成功',
                    order_pirce: 0.4,
                    order_num: 2,
                    order_client: '微信',
                    order_name: '20190313000491(饼干牛奶套装（测试用）)'
                }
            ]
        }
    },
    methods: {
        // 搜索
        sublogin () {

        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/style/mixin.scss";

    .acollent-main {
        overflow: auto;
        .acollent-content {
            // margin-top: 1.92rem;
            .acollent-form {
                display: flex;
                align-items: center;
                padding: $p10;
                @include sc($p14, #333);
                > div {
                    @include wh(27%, $p30);
                    margin-right: 2%;
                    input[type=text] {
                        @include wh(100%, 100%);
                        padding: $p4 $p10;
                        background: #F7F7F7;
                    }
                }
                .form-submit {
                    flex: 1;
                    margin: 0;
                    input[type=submit] {
                        @include wh(100%, 100%);
                        color: #fff;
                        background: #1BBC9B;
                    }
                }
            }
            .acollent-li {
                @include bl15();
                padding: $p10;
                line-height: $p30;
                .order-title {
                    font-size: $p14;
                }
                .order-pirce, .order-time {
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
        }
    }
</style>
