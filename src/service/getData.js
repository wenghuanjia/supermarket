import axios from './fetch.js'

// 登录
export const login = (data) => axios('/user/public/login', data, 'POST');

// 获取所有的商品列表
export const getShopLists = (data) => axios('/portal/articles', data);

// 获取商品信息
export const getShopInfo = (data) => axios('/portal/lists/getCategoryPostLists', data);

// 获取首页列表设备状态
export const getShopsStatus = (data) => axios('/home/index/openStatus', data)

// 获取单个商品开关设备状态 加入商品对应 id
export const getShopStatus = (data) => axios('/home/index/openStatusEvery', data)

// 获取设备是否在线
export const IsOnline = (data) => axios('/home/index/index', data)

// 支付宝支付
export const aliPayment = (data) => axios(`/user/Pay/toAlipay`, data)

// 微信支付
export const toWxpay = (data) => axios('/user/pay/toWxpay', data, 'POST')

// 修改密码
export const modifyPsd = (data) => axios(`/user/profile/changePassword`, data, 'POST')

// 获取设备 id 区分不同的设备
export const getDevicename = () => axios('/user/Operate/getDevicename')

// 获取是否缺货 计算百分比
export const getLockGoodsCount = (data) => axios('/user/Operate/getLockGoodsCount', data)

// 获取该设备的所有led锁和对应的商品，和lock表的exist 状态
export const replenishment = (data) => axios('/user/Operate/index', data)

// 一键清空所有商品
export const clearGoods = (data) => axios('/user/Operate/clearGoods', data)

// 单个商品填充
export const additionalGoods  = (data) => axios('/user/Operate/additionalGoods', data)

// 一键开门
export const openAllLock = (data) => axios('/user/Operate/openAllLock?id=9', data)

// 打开单个商品存放柜的门 需要带一个id
export const openDoor = (data) => axios('/user/Operate/openOneLock', data)

// 修改设备名称
export const editDevicename = (data) => axios('/user/Operate/editDevicename', data, 'POST')

// 获取订单详情数据
export const getLogGoods = () => axios('/user/Operate/getLogGoods')
