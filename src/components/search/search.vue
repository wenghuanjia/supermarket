<template>
    <header class="alist-header">
        <img src="../../assets/images/back.png" alt="" @click="$router.go(-1)">
        <form @submit.prevent="sublogin">
            <input type="text" v-model="search" placeholder="搜索机器编码、终端名称">
            <input type="submit" value="搜索">
        </form>
    </header>
</template>

<script>
export default {
    data () {
        return {
            search: ''
        }
    },
    methods: {
        // 搜索
        sublogin () {
            this.$emit('searchfun', 11111)
        }
    }
}
</script>

<style scoped lang="scss">
    @import "../../assets/style/mixin.scss";
    .alist-header {
        display: flex;
        align-items: center;
        padding: 0 $p10;
        height: 40px;
        img {
            @include wh($p12, $p20);
            vertical-align: middle;
        }
        form {
            display: flex;
            align-items: center;
            flex: 1;
            input[type="text"] {
                width: 85%;
                background: #E8E8E8;
                border-radius: 4px;
                height: 30px;
                padding-left: $p10;
                margin-left: $p10;
                @include sc($p14, #333);
            }
            input[type="submit"] {
                margin-left: $p15;
                background: transparent;
                @include sc($p16, $theme);
            }
        }
    }
</style>
