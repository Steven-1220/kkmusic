<script setup>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  fullPage: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
});
</script>

<template>
  <Loading
    :active="props.active"
    :is-full-page="props.fullPage"
    :background-color="props.backgroundColor"
  >
    <div class="loadingio-spinner-spin-container">
      <div class="loading-animate">
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div>
          <div></div>
        </div>
        <div><div></div></div>
      </div>
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
@keyframes loading-animate {
  0% {
    opacity: 1;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1.5, 1.5);
  }
  100% {
    opacity: 0;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1, 1);
  }
}
.loading-animate div > div {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0099e5;
  animation: loading-animate 1.1235955056179776s linear infinite;
}
.loading-animate div:nth-child(1) > div {
  left: 71px;
  top: 44px;
  animation-delay: -0.9831460674157303s;
}
.loading-animate > div:nth-child(1) {
  transform: rotate(0deg);
  transform-origin: 77px 50px;
}
.loading-animate div:nth-child(2) > div {
  left: 63px;
  top: 63px;
  animation-delay: -0.8426966292134831s;
}
.loading-animate > div:nth-child(2) {
  transform: rotate(45deg);
  transform-origin: 69px 69px;
}
.loading-animate div:nth-child(3) > div {
  left: 44px;
  top: 71px;
  animation-delay: -0.7022471910112359s;
}
.loading-animate > div:nth-child(3) {
  transform: rotate(90deg);
  transform-origin: 50px 77px;
}
.loading-animate div:nth-child(4) > div {
  left: 25px;
  top: 63px;
  animation-delay: -0.5617977528089888s;
}
.loading-animate > div:nth-child(4) {
  transform: rotate(135deg);
  transform-origin: 31px 69px;
}
.loading-animate div:nth-child(5) > div {
  left: 17px;
  top: 44px;
  animation-delay: -0.42134831460674155s;
}
.loading-animate > div:nth-child(5) {
  transform: rotate(180deg);
  transform-origin: 23px 50px;
}
.loading-animate div:nth-child(6) > div {
  left: 25px;
  top: 25px;
  animation-delay: -0.2808988764044944s;
}
.loading-animate > div:nth-child(6) {
  transform: rotate(225deg);
  transform-origin: 31px 31px;
}
.loading-animate div:nth-child(7) > div {
  left: 44px;
  top: 17px;
  animation-delay: -0.1404494382022472s;
}
.loading-animate > div:nth-child(7) {
  transform: rotate(270deg);
  transform-origin: 50px 23px;
}
.loading-animate div:nth-child(8) > div {
  left: 63px;
  top: 25px;
  animation-delay: 0s;
}
.loading-animate > div:nth-child(8) {
  transform: rotate(315deg);
  transform-origin: 69px 31px;
}
.loadingio-spinner-spin-container {
  width: 47px;
  height: 47px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.loading-animate {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.47);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.loading-animate div {
  box-sizing: content-box;
}
</style>
