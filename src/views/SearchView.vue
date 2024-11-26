<script setup>
import { onBeforeRouteUpdate, useRoute, onBeforeRouteLeave } from 'vue-router';
import { onMounted, ref, nextTick, computed } from 'vue';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { useToolsStore } from '@/stores/tools';
import { storeToRefs } from 'pinia';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
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

const searchResultData = ref({
  albums: {
    data: [],
  },
  playlists: {
    data: [],
  },
  tracks: {
    data: [],
  },
});

// 搜尋
const keyWord = ref('');
const restrictNum = ref({
  albums: [],
  playlists: [],
  tracks: [],
});
const getSearch = keyWord => {
  showLoadingEffect();
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/search?q=${keyWord}&territory=TW&type=artist,track,album,playlist&limit=24 `,
      generalConfig.value,
    )
    .then(res => {
      searchResultData.value.albums.data = res.data.albums.data;
      restrictNum.value.albums = res.data.albums.data.splice(0, 12);
      searchResultData.value.playlists.data = res.data.playlists.data;
      restrictNum.value.tracks = res.data.tracks.data;
      restrictNum.value.playlists = res.data.playlists.data.splice(0, 6);
      hideLoadingEffect();
    });
};

const musicPlayerStore = useMusicPlayerStore();
const { singleRankData, isMusicPlaying } = storeToRefs(musicPlayerStore);
const { resetMusicTrackData } = musicPlayerStore;

const musicTrackModalRef = ref(null);

// 音樂單曲播放
const playMusicTrackModal = singleSongId => {
  if (singleRankData.value.id === singleSongId) return;

  // 先關閉當前播放的專輯和單曲音樂
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
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

// 轉換時間格式
const tools = useToolsStore();
const { processDash } = tools;

const handleBrowserChangePage = () => {
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }
};

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});

const route = useRoute();
onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();
  if (route.query.q) {
    keyWord.value = route.query.q;
    getSearch(keyWord.value);
  }
});

onBeforeRouteUpdate(to => {
  if (to.query.q) {
    keyWord.value = to.query.q;
    getSearch(keyWord.value);
  }
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />

    <main>
      <section class="search-page py-lg-13 py-9">
        <div class="container">
          <h2 class="fs-lg-2 fs-3 text-center mb-lg-8 mb-6">
            <strong class="text-warning">{{ keyWord }}</strong> 搜尋結果
          </h2>

          <!-- 專輯 -->
          <div
            class="row g-4 mb-lg-10 mb-8"
            v-if="restrictNum.albums.length !== 0"
          >
            <div
              class="d-flex justify-content-between align-items-center px-10 px-sm-2"
            >
              <h3 class="fs-4 fs-lg-3">專輯</h3>
              <RouterLink
                class="btn-more-content"
                :to="{
                  name: 'searchAlbum',
                  query: {
                    ...route.query,
                    page: 1,
                  },
                }"
              >
                查看更多
                <i class="bi bi-arrow-right-circle"></i>
              </RouterLink>
            </div>
            <div
              class="col-xxl-2 col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center"
              v-for="item in restrictNum.albums"
              :key="item.id"
            >
              <div class="card card-search-album text-bg-dark h-100">
                <img
                  :src="item.images[1].url"
                  class="card-img-top"
                  :alt="item.name"
                />
                <RouterLink
                  class="card-body stretched-link"
                  :to="{
                    name: 'album',
                    params: {
                      albumId: item.id,
                    },
                  }"
                >
                  <h4 class="fs-lg-5 fs-6">{{ item.name }}</h4>
                  <h5 class="fs-lg-5 fs-6">{{ item.artist.name }}</h5>
                  <p class="card-text">
                    <small>發行日: {{ processDash(item.release_date) }}</small>
                  </p>
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="row mb-8" v-else>
            <h3 class="fs-4 fs-lg-3 text-center">無相關 {{ keyWord }}專輯</h3>
          </div>

          <!-- 單曲 -->
          <div
            class="row g-4 mb-lg-10 mb-8"
            v-if="restrictNum.tracks.length !== 0"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="fs-4 fs-lg-3">單曲</h3>
              <RouterLink
                class="btn-more-content"
                :to="{
                  name: 'SearchTrack',
                  query: {
                    ...route.query,
                    page: 1,
                  },
                }"
              >
                查看更多
                <i class="bi bi-arrow-right-circle"></i>
              </RouterLink>
            </div>
            <div class="col">
              <ul class="row row-cols-lg-2 row-cols-1 list-search gy-3 ps-0">
                <li
                  class="col list-search-item d-flex align-items-center"
                  v-for="item in restrictNum.tracks"
                  :key="item.id"
                >
                  <div class="search-single-info d-flex align-items-center">
                    <img :src="item.album.images[0].url" :alt="item.name" />
                    <div class="ms-lg-4 ms-2">
                      <h4 class="single-name fs-6 mb-1">{{ item.name }}</h4>
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

          <div class="row mb-8" v-else>
            <h3 class="fs-4 fs-lg-3 text-center">無相關 {{ keyWord }}單曲</h3>
          </div>
        </div>

        <!-- 歌單 -->
        <div class="container" v-if="restrictNum.playlists.length !== 0">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fs-4 fs-lg-3">
              歌單<small class="fs-md-6 fs-7">(官方小編與大家的歌單)</small>
            </h3>
            <RouterLink
              class="btn-more-content"
              :to="{
                name: 'SearchPlaylist',
                query: {
                  ...route.query,
                  page: 1,
                },
              }"
            >
              查看更多
              <i class="bi bi-arrow-right-circle"></i>
            </RouterLink>
          </div>
          <div class="row row-cols-lg-6 row-cols-md-3 row-cols-2 gy-4">
            <div
              class="col"
              v-for="item in restrictNum.playlists"
              :key="item.id"
            >
              <RouterLink
                class="card h-100"
                :to="{
                  name: 'playlist',
                  params: {
                    playlistId: item.id,
                  },
                }"
              >
                <img
                  :src="item.images[0].url"
                  :alt="item.title"
                  class="rounded-4"
                />
                <div class="card-body">
                  <h4 class="fs-lg-6 fs-7 mb-2">{{ item.title }}</h4>
                  <h5 class="fs-7">{{ item.owner.name }}</h5>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="container" v-else>
          <div class="row">
            <h3 class="fs-4 fs-lg-3 text-center">無相關 {{ keyWord }}歌單</h3>
          </div>
        </div>
      </section>

      <PlayTrackMusic
        ref="musicTrackModalRef"
        :single-rank-data="singleRankData"
        @emitCloseTrackMusicModal="stopPlayTrackMusic"
      />
    </main>

    <FooterView />
  </div>
</template>

<style lang="scss">
.card-search-album {
  max-width: 300px;
}

.list-search-item {
  &:hover {
    background-color: #09acf5;
    border-color: #09acf5;
  }
  &.active {
    background-color: #09acf5;
    border-color: #09acf5;
  }
}

.search-single-info {
  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
}

@media (min-width: 768px) {
  .search-single-info {
    img {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
