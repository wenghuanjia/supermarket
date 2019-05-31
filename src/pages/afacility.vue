<template>
    <div class="auser-content">
        <vheader :goBack="true" title="设备管理" background="#1BBC9B" color="#fff"></vheader>
        
        <van-radio-group v-model="radio">
            <ul class="auser-main">
                <li class="auser-li" v-for="(item, index) in user_list" :key="index" @click="radio = item.id">
                    <div class="item-id">{{ item.id }}</div>
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-radio">
                        <van-radio :name="item.id"></van-radio>
                    </div>
                </li>  
            </ul>
        </van-radio-group>

        <van-actionsheet v-model="show" :actions="actions" @select="onSelect" />
        <div @click="setfacility" class="add-user" >分配权限</div>
    </div>
</template>

<script>
import vheader from "components/header/header";
import { Actionsheet, RadioGroup, Radio, Toast } from 'vant';
import Vue from 'vue';

Vue.use(Actionsheet).use(RadioGroup).use(Radio).use(Toast);
export default {
    components: {
        vheader: vheader
    },
    data () {
        return {
            show: false,
            radio: '',
            actions: [
                {
                    name: '分配'
                },
                {
                    name: '取消'
                }
            ],
            user_list: [
                {
                    id: '15521214001',
                    name: '123123',
                },
                {
                    id: '155212140012',
                    name: '123123',
                }
            ]
        }
    },
    methods: {
        onSelect(item) {
            this.show = false;
            console.log(item.name);
        },
        // 分配权限
        setfacility () {
            if (this.radio) {
                this.show = true;
            } else {
                Toast('请选择设备！');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/style/mixin.scss";

    .add-user {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        height: $p45;
        line-height: $p45;
        text-align: center;
        background: #5F81EE;
        @include sc($p16, #fff);
    }

    .auser-main {
        // padding: $p45 0 $p45;
        .auser-li {
            padding: $p10;
            @include bl15();
            position: relative;
            line-height: $p25;
            .item-id, .item-name, .item-time {  
                @include sc($p14, #333);
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
    }
</style>
