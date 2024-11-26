<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const isShowButton = ref(false);

const toggleShowButton = () => {
  isShowButton.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener('scroll', toggleShowButton);
});

onUnmounted(() => {
  window.removeEventListener('scroll', toggleShowButton);
});
</script>

<template>
  <button
    type="button"
    class="btn-back-to-top"
    @click="backToTop"
    v-show="isShowButton"
  >
    <i class="bi bi-arrow-up"></i>
  </button>
</template>

<style lang="scss">
.btn-back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: #09acf5;
  color: #fff;
  border-radius: 50%;
  border: 1px solid #fff;
  opacity: 0.6;
  border: 0;
  transition: opacity 0.5s ease;
  z-index: 100;
  &:hover {
    opacity: 1;
  }
}
</style>
