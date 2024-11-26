<script setup>
import { Modal } from 'bootstrap';
import { nextTick, onMounted, ref } from 'vue';

const musicPlaylistModalRef = ref(null);
const kkMusicPlaylistModal = ref(null);

const showMusicPlaylistModal = () => {
  kkMusicPlaylistModal.value.show();
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '0px';
};

const closeMusicPlaylistModal = () => {
  // 延遲移動焦點，確保模態框關閉後操作
  setTimeout(() => {
    document.activeElement.blur(); // 解除當前聚焦
  }, 100);
  kkMusicPlaylistModal.value.hide();
  emit('emitCloseMusicPlaylistModal');
};

const props = defineProps({
  musicPlaylistData: Object,
});

const emit = defineEmits(['emitCloseMusicPlaylistModal']);

onMounted(() => {
  nextTick(() => {
    kkMusicPlaylistModal.value = new Modal(musicPlaylistModalRef.value, {
      backdrop: false,
      focus: true,
    });
  });
});

defineExpose({
  showMusicPlaylistModal,
  closeMusicPlaylistModal,
});
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" ref="musicPlaylistModalRef">
    <div class="modal-dialog modal-dialog-bottom">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">KK music</h1>
          <button
            type="button"
            class="btn border-0 ms-auto"
            @click="closeMusicPlaylistModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body d-flex justify-content-md-center">
          <iframe
            v-if="props.musicPlaylistData.id"
            :src="`https://widget.kkbox.com/v1/?id=${props.musicPlaylistData.id}&type=playlist&terr=TW&lang=TC&autoplay=${props.musicPlaylistData.autoplay}`"
            allow="autoplay"
            class="w-100 w-md-50 playlist"
          >
          </iframe>
          <p v-else class="text-center">無歌單 id，無法播放音樂</p>
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
}

.playlist {
  min-height: 600px;
  .widget-songlist-container {
    height: 300px;
  }
}
</style>
