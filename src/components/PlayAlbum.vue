<script setup>
import { Modal } from 'bootstrap';
import { nextTick, onMounted, ref } from 'vue';

const musicAlbumModalRef = ref(null);
const kkMusicAlbumModal = ref(null);

const showMusicAlbumModal = () => {
  kkMusicAlbumModal.value.show();
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '0px';
};

const closeMusicAlbumModal = () => {
  // 延遲移動焦點，確保模態框關閉後操作
  setTimeout(() => {
    document.activeElement.blur(); // 解除當前聚焦
  }, 100);
  kkMusicAlbumModal.value.hide();
  emit('emitCloseMusicAlbumModal');
  document.body.style.overflow = 'initial';
};

const props = defineProps({
  musicAlbumData: Object,
});

const emit = defineEmits(['emitCloseMusicAlbumModal']);

onMounted(() => {
  nextTick(() => {
    kkMusicAlbumModal.value = new Modal(musicAlbumModalRef.value, {
      backdrop: false,
      focus: true,
    });
  });
});

defineExpose({
  showMusicAlbumModal,
  closeMusicAlbumModal,
});
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" ref="musicAlbumModalRef">
    <div class="modal-dialog modal-dialog-bottom">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">KK music</h1>
          <button
            type="button"
            class="btn border-0 ms-auto"
            @click="closeMusicAlbumModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          class="modal-body d-flex justify-content-md-center modal-body-custom-album"
        >
          <iframe
            v-if="props.musicAlbumData.id"
            :src="`https://widget.kkbox.com/v1/?id=${props.musicAlbumData.id}&type=album&terr=TW&lang=TC&autoplay=${props.musicAlbumData.autoplay}`"
            allow="autoplay"
            class="w-100 w-md-50"
            style="height: 350px"
          ></iframe>
          <p v-else class="text-center">無專輯 id，無法播放音樂</p>
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

.modal-body-custom-album {
  iframe {
    height: 350px;
  }
}
</style>
