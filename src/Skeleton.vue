<template>
  <div class="skeleton page">
    <div class="skeleton-nav"></div>
    <div class="skeleton-swiper" v-for="(i, index) in 9" :key="index"></div>
  </div>
</template>

<style>
.skeleton {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 0 12px;
  box-sizing: border-box;
  background: #fff;
}
.skeleton-nav {
  height: 85px;
  background: #eee;
}
.skeleton-swiper {
  margin-top: 3%;
  height: 160px;
  background: #eee;
  margin-bottom: 15px;
}
</style>
