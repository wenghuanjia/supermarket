<template>
  <div class="adduser">
    <vheader :goBack="true" title="修改设备名称" background="#1BBC9B" color="#fff"></vheader>
    <form @submit.prevent="sublogin" class="add-form">
      <input type="text" v-model="nickname" placeholder="请输入设备新名称">
      <input type="submit" value="确认修改">
    </form>
  </div>
</template>

<script>
import vheader from "components/header/header";
import { editDevicename, getDevicename } from "../service/getData";
import { Toast } from 'vant';
export default {
  components: {
    vheader: vheader
  },
  data() {
    return {
      nickname: "",
			id: "",
			suo_devicename: ''
    };
  },
  methods: {
		// 验证重新输入的设备名称
		handleCheck() {
			if (!this.nickname) {
				Toast('新的设备名称不能为空')
				return;
			}
		},
		// 通过id获取对应的设备名称
		handlGain(id) {
			let that = this;
			getDevicename().then(res => {
				if (res.code == 1) {
					res.data.forEach(item => {
						if (item.id == id) {
							this.suo_devicename = item.devicename
						}
					})
				}
			})
		},
		// 发送请求，修改设备名称
		handleChange() {
			let that = this;
			// 验证
			this.handleCheck();
			editDevicename({suo_devicename:this.suo_devicename,nickname:this.nickname}).then(res => {
				if (res.code == 1) {
					that.$router.push({path:'/alist'})
				}
			})
		},
		sublogin() {
			this.handleChange();
		}
	},
  created() {
		this.id = this.$route.query.id;
		this.handlGain(this.id)
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.add-form {
  padding: 10px $p10 $p10;
  input[type="text"] {
    display: block;
    border: 1px solid #dddddd;
    padding: $p10;
    margin-bottom: $p15;
    width: 100%;
    font-size: $p14;
  }
  input[type="submit"] {
    @include btn();
  }
}
</style>
