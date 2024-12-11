<script setup>
import { Modal } from 'bootstrap';
import { nextTick, onMounted, ref } from 'vue';

const musicModalRef = ref(null);
const kkMusicModal = ref(null);

const showMusicModal = () => {
  kkMusicModal.value.show();
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '0px';
};

const closeMusicModal = () => {
  // 延遲移動焦點，確保模態框關閉後操作
  setTimeout(() => {
    document.activeElement.blur(); // 解除當前聚焦
  }, 100);
  kkMusicModal.value.hide();
  emit('emitCloseTrackMusicModal');
};

const props = defineProps({
  singleRankData: Object,
});

const emit = defineEmits(['emitCloseTrackMusicModal']);

onMounted(() => {
  nextTick(() => {
    kkMusicModal.value = new Modal(musicModalRef.value, {
      backdrop: false,
      focus: true,
    });
  });
});

defineExpose({
  showMusicModal,
  closeMusicModal,
});
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" ref="musicModalRef">
    <div class="modal-dialog modal-dialog-bottom">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">KK music</h1>
          <button
            type="button"
            class="btn border-0 ms-auto"
            @click="closeMusicModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body d-flex justify-content-md-center">
          <iframe
            v-if="props.singleRankData.id"
            :key="props.singleRankData.id"
            :src="`https://widget.kkbox.com/v1/?id=${props.singleRankData.id}&type=song&terr=TW&lang=TC&autoplay=${props.singleRankData.autoplay}`"
            allow="autoplay"
            class="w-100 w-md-50"
            style="height: 100px"
          >
          </iframe>
          <p v-else class="text-center">無歌曲 id，無法播放音樂</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  pointer-events: none;
}

.modal-dialog-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  max-width: 100%;
  button {
    i {
      border-radius: 50%;
      padding: 4px 6px;
      &:hover {
        background-color: #494755;
      }
    }
  }
}
</style>
