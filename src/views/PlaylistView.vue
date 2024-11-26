<script setup>
import { onMounted, ref, nextTick, computed } from 'vue';
import axios from 'axios';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useBaseSet } from '@/stores/baseSet';
import { useToolsStore } from '@/stores/tools';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
import PlayPlaylist from '@/components/PlayPlaylist.vue';
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

// Get a featured playlist 取得特定歌單資訊，不包含歌單的曲目
const specificPlaylistData = ref({});
const getSpecificPlaylistInfo = playlistId => {
  showLoadingEffect();
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/featured-playlists/${playlistId}?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      specificPlaylistData.value = res.data;
      getSpecificPlaylistTracks(specificPlaylistData.value.id);
    });
};

// Get tracks of a featured playlist 取得特定 id 的歌單中的單曲
const specificPlaylistTracksData = ref([]);
const getSpecificPlaylistTracks = playlistId => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/featured-playlists/${playlistId}/tracks?territory=TW&limit=100 `,
      generalConfig.value,
    )
    .then(res => {
      specificPlaylistTracksData.value = res.data.data;
      hideLoadingEffect();
    });
};

// 音樂播放
const musicPlayerStore = useMusicPlayerStore();
const {
  singleRankData,
  isMusicPlaying,
  musicPlaylistData,
  isMusicPlaylistPlaying,
} = storeToRefs(musicPlayerStore);
const { resetMusicTrackData, resetMusicPlaylistData } = musicPlayerStore;

const musicTrackModalRef = ref(null);
const musicPlaylistModalRef = ref(null);

// 音樂專輯播放
const playMusicPlaylistModal = playlistId => {
  // 先關閉當前播放的單曲音樂
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }

  musicPlaylistData.value.id = playlistId;
  musicPlaylistData.value.autoplay = true;
  isMusicPlaylistPlaying.value = true;

  nextTick(() => {
    setTimeout(() => {
      musicPlaylistModalRef.value.showMusicPlaylistModal();
    }, 300);
  });
};

const stopPlayPlaylistMusic = () => {
  resetMusicPlaylistData();
};

// 音樂單曲播放
const playMusicTrackModal = singleSongId => {
  if (singleRankData.value.id === singleSongId) return;

  // 先關閉當前播放的專輯和單曲音樂
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  } else if (isMusicPlaylistPlaying.value) {
    musicPlaylistModalRef.value.closeMusicPlaylistModal();
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

// 處理時間
const tools = useToolsStore();
const { processDateExpression } = tools;

const handleBrowserChangePage = () => {
  if (isMusicPlaylistPlaying.value) {
    musicPlaylistModalRef.value.closeMusicPlaylistModal();
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
  getSpecificPlaylistInfo(route.params.playlistId);
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />
    <main>
      <section class="playlist-banner pb-lg-13 pb-9">
        <img :src="specificPlaylistData.images?.[2].url" class="bg-playlist" />

        <div class="playlist-content pt-8 pt-lg-10">
          <div class="container position-relative">
            <div class="row mt-lg-9">
              <div class="col-lg-4">
                <div class="image-area d-flex flex-md-column align-items-start">
                  <div class="playlist mb-lg-5 mb-3">
                    <img
                      :src="specificPlaylistData.images?.[1].url"
                      class="rounded-5"
                      :alt="specificPlaylistData?.title"
                    />
                  </div>
                  <div class="singer d-flex flex-column ms-6 ms-md-0">
                    <div class="d-flex align-items-center">
                      <img
                        :src="specificPlaylistData.owner?.images?.[0].url"
                        class="rounded-circle"
                        alt=""
                      />
                      <h3 class="fs-6 ms-3">
                        {{ specificPlaylistData.owner?.name }}
                      </h3>
                    </div>
                    <p class="mt-md-5 my-3 fs-7 fs-sm-6">
                      更新時間 :
                      {{
                        processDateExpression(specificPlaylistData?.updated_at)
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-8">
                <h2 class="fs-5 fs-md-3 fs-lg-2 mb-4 mb-lg-6">
                  {{ specificPlaylistData.title }}
                </h2>
                <p class="fs-7 fs-sm-6">
                  {{ specificPlaylistData.description }}
                </p>
                <div class="play-album-area mt-lg-8 mt-5">
                  <button
                    type="button"
                    class="btn btn-info rounded-5"
                    @click="playMusicPlaylistModal(specificPlaylistData?.id)"
                  >
                    播放歌單
                    <i class="bi bi-play-btn-fill"></i>
                  </button>
                </div>
                <div class="playlist-all-tracks my-8 mt-md-10">
                  <h4 class="fs-5 fs-md-4 text-warning pt-6 pt-lg-12">
                    全歌單曲目
                  </h4>
                  <ul class="list-group list-group-flush ranking-list mt-6">
                    <li
                      class="list-group-item d-flex align-items-center playlist-item"
                      v-for="(item, index) in specificPlaylistTracksData"
                      :key="item.id"
                    >
                      <h4 class="fw-bolder text-warning fs-6">
                        {{ index + 1 }}
                      </h4>
                      <div
                        class="playlist-single-info d-flex align-items-center ms-lg-5 ms-3"
                      >
                        <img
                          :src="item.album.images[0].url"
                          :alt="item.album.name"
                        />
                        <div class="ms-lg-4 ms-2">
                          <h5 class="single-name fs-md-6 fs-7 mb-1">
                            {{ item.name }}
                          </h5>
                          <h6 class="singer-name fs-7">
                            {{ item.album.artist.name }}
                          </h6>
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

        <PlayPlaylist
          ref="musicPlaylistModalRef"
          :music-playlist-data="musicPlaylistData"
          @emitCloseMusicPlaylistModal="stopPlayPlaylistMusic"
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

<style lang="scss">
.playlist-banner {
  overflow: hidden;
  .bg-playlist {
    width: 100%;
    height: 350px;
    filter: blur(4px);
    opacity: 0.8;
  }
  .playlist-content {
    margin-top: -300px;
  }
}

.image-area {
  .playlist {
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
    .playlist {
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

.playlist-all-tracks {
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

.playlist-single-info {
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
  }
}

.playlist-item {
  h4 {
    width: 28px;
  }
}

@media (min-width: 768px) {
  .playlist-single-info {
    img {
      width: 50px;
      height: 50px;
    }
  }
  .playlist-item {
    h4 {
      width: 34px;
    }
  }
}
</style>
