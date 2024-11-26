<script setup>
import { onMounted, ref, nextTick, computed } from 'vue';
import axios from 'axios';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
import PlayAlbum from '@/components/PlayAlbum.vue';
import PlayTrackMusic from '@/components/PlayTrackMusic.vue';
import LoadingEffect from '@/components/LoadingEffect.vue';

const base = useBaseSet();
const { getConfigAuthToken } = base;
// 共用 generalConfig
const generalConfig = ref({});

// loading 效果
const loadingState = ref({
  isLoading: false,
  fullPage: true,
  bgColor: 'rgba(0,0,0,0.9)',
});

const loadingProps = computed(() => ({
  active: loadingState.value.isLoading,
  fullPage: loadingState.value.fullPage,
  ...(loadingState.value.bgColor && {
    backgroundColor: loadingState.value.bgColor,
  }),
}));

const showLoadingEffect = () => {
  loadingState.value.isLoading = true;
};
const hideLoadingEffect = () => {
  loadingState.value.isLoading = false;
};

const route = useRoute();

// Get an album 取得特定專輯資訊，不包含曲目
const specificAlbumData = ref({});
const getSpecificAlbumInfo = albumId => {
  showLoadingEffect();
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/albums/${albumId}?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      specificAlbumData.value = res.data;
      getSpecificAlbumTracks(specificAlbumData.value.id);
    });
};

// Get tracks in an album 取得特定專輯曲目
const specificAlbumTracksData = ref([]);
const getSpecificAlbumTracks = albumId => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/albums/${albumId}/tracks?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      specificAlbumTracksData.value = res.data.data;
      hideLoadingEffect();
    });
};

// 音樂播放
const musicPlayerStore = useMusicPlayerStore();
const { singleRankData, isMusicPlaying, musicAlbumData, isMusicAlbumPlaying } =
  storeToRefs(musicPlayerStore);
const { resetMusicTrackData, resetMusicAlbumData } = musicPlayerStore;

const musicTrackModalRef = ref(null);
const musicAlbumModalRef = ref(null);

// 音樂專輯播放
const playMusicAlbumModal = musicAlbumId => {
  if (musicAlbumData.value.id === musicAlbumId) return;
  // 先關閉當前播放的單曲音樂
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }

  musicAlbumData.value.id = musicAlbumId;
  musicAlbumData.value.autoplay = true;
  isMusicAlbumPlaying.value = true;

  nextTick(() => {
    setTimeout(() => {
      musicAlbumModalRef.value.showMusicAlbumModal();
    }, 300);
  });
};

const stopPlayAlbumMusic = () => {
  resetMusicAlbumData();
};

// 音樂單曲播放
const playMusicTrackModal = singleSongId => {
  if (singleRankData.value.id === singleSongId) return;

  // 先關閉當前播放的專輯和單曲音樂
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  } else if (isMusicAlbumPlaying.value) {
    musicAlbumModalRef.value.closeMusicAlbumModal();
  }

  singleRankData.value.id = singleSongId;
  singleRankData.value.autoplay = true;
  isMusicPlaying.value = true;

  nextTick(() => {
    setTimeout(() => {
      musicTrackModalRef.value.showMusicModal();
    }, 300);
  });
};

const stopPlayTrackMusic = () => {
  resetMusicTrackData();
};

const handleBrowserChangePage = () => {
  if (isMusicAlbumPlaying.value) {
    musicAlbumModalRef.value.closeMusicAlbumModal();
  }
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }
};

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();
  getSpecificAlbumInfo(route.params.albumId);
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />
    <main>
      <section class="album-banner pb-lg-13 pb-9">
        <img :src="specificAlbumData.images?.[2].url" class="bg-album" />

        <div class="album-content pt-8 pt-lg-10">
          <div class="container position-relative">
            <div class="row mt-lg-9">
              <div class="col-lg-4">
                <div class="image-area d-flex flex-md-column align-items-start">
                  <div class="album mb-lg-5 mb-3">
                    <img
                      :src="specificAlbumData.images?.[1].url"
                      class="rounded-5"
                      :alt="specificAlbumData?.name"
                    />
                  </div>
                  <div class="singer d-flex flex-column ms-6 ms-md-0">
                    <div class="d-flex align-items-center">
                      <img
                        :src="specificAlbumData.artist?.images?.[0].url"
                        class="rounded-circle"
                        alt=""
                      />
                      <h3 class="fs-6 fs-md-4 ms-3">
                        {{ specificAlbumData.artist?.name }}
                      </h3>
                    </div>
                    <p class="mt-md-5 mt-3 fs-7 fs-sm-6">
                      發行日 : {{ specificAlbumData?.release_date }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-8">
                <h2 class="fs-5 fs-md-3 fs-lg-2">
                  {{ specificAlbumData.name }}
                </h2>
                <div class="play-album-area mt-lg-8 mt-5">
                  <button
                    type="button"
                    class="btn btn-info rounded-5"
                    @click="playMusicAlbumModal(specificAlbumData?.id)"
                  >
                    播放專輯
                    <i class="bi bi-play-btn-fill"></i>
                  </button>
                </div>

                <div class="album-all-tracks my-8 mt-lg-16 pt-lg-10 mt-lg-19">
                  <h4 class="fs-5 fs-md-4 text-warning pt-6">全專輯曲目</h4>
                  <ul class="list-group list-group-flush mt-6">
                    <li
                      class="list-group-item d-flex align-items-center"
                      v-for="(item, index) in specificAlbumTracksData"
                      :key="item.id"
                    >
                      <h5 class="fw-bolder text-warning fs-5 fs-md-4">
                        {{ index + 1 }}
                      </h5>
                      <div
                        class="album-single-info d-flex align-items-center ms-lg-5 ms-3"
                      >
                        <div class="ms-lg-4 ms-2">
                          <h4 class="single-name fs-6 fs-md-5">
                            {{ item.name }}
                          </h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-custom-play ms-auto"
                        @click="playMusicTrackModal(item.id)"
                      >
                        <i class="bi bi-play-fill"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PlayAlbum
          ref="musicAlbumModalRef"
          :music-album-data="musicAlbumData"
          @emitCloseMusicAlbumModal="stopPlayAlbumMusic"
        />
        <PlayTrackMusic
          ref="musicTrackModalRef"
          :single-rank-data="singleRankData"
          @emitCloseTrackMusicModal="stopPlayTrackMusic"
        />
      </section>
    </main>

    <FooterView />
  </div>
</template>

<style lang="scss" scoped>
.album-banner {
  overflow: hidden;
  .bg-album {
    width: 100%;
    height: 350px;
    filter: blur(4px);
    opacity: 0.8;
  }
  .album-content {
    margin-top: -300px;
  }
}

.image-area {
  .album {
    img {
      max-width: 150px;
    }
  }
  .singer {
    img {
      max-width: 40px;
    }
  }
}

@media (min-width: 992px) {
  .image-area {
    .album {
      img {
        max-width: 250px;
      }
    }

    .singer {
      img {
        max-width: 80px;
      }
    }
  }
}

.album-banner {
  .list-group-item {
    &:hover {
      background-color: #09acf5;
      border-color: #09acf5;
    }
    &.active {
      background-color: #09acf5;
      border-color: #09acf5;
    }
  }
}

.album-all-tracks {
  h5 {
    width: 30px;
    @media (min-width: 768px) {
      width: 35px;
    }
  }
}
</style>
