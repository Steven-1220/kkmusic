<script setup>
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';
import Paginate from 'vuejs-paginate-next';

import HeaderView from '../layout/HeaderView.vue';
import FooterView from '../layout/FooterView.vue';
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

// 當前分頁的單曲資料
const searchResultData = ref({
  tracks: {
    data: [],
  },
});

const route = useRoute();
const router = useRouter();

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

const handleBrowserChangePage = () => {
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }
};

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});

// 分頁
const totalTrackItems = ref(0); // 總專輯數量
const currentPage = ref(Number(route.query.page) || 1); // 當前頁數
const itemsPerPage = ref(24); // 每頁顯示幾筆
const prevIcon = `<i class="bi bi-caret-left-fill"></i>`;
const nextIcon = `<i class="bi bi-caret-right-fill"></i>`;

// 總頁數計算
const totalPage = computed(() =>
  Math.ceil(totalTrackItems.value / itemsPerPage.value),
);
// 分頁點擊處理
const pageClickHandler = pageNumber => {
  currentPage.value = pageNumber;

  router.push({
    query: {
      ...route.query,
      page: pageNumber,
    },
  });

  nextTick(() => {
    // 移除 focus 狀態
    const focusElement = document.activeElement;
    if (focusElement && focusElement.tagName === 'A') {
      focusElement.blur();
    }
  });
};

watch(currentPage, () => {
  getSearchTrack(keyWord.value);
  backToTop();
});

watch(
  () => route.query.page,
  newPage => {
    currentPage.value = Number(newPage) || 1;
  },
);

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// 搜尋專輯
const keyWord = ref('');
const getSearchTrack = keyWord => {
  showLoadingEffect();
  const offset = (currentPage.value - 1) * itemsPerPage.value; // 偏移資料筆數
  const limit = itemsPerPage.value; // 限制每頁 API 取得筆數

  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/search?q=${keyWord}&territory=TW&type=artist,track,album,playlist&limit=${limit}&offset=${offset} `,
      generalConfig.value,
    )
    .then(res => {
      searchResultData.value.tracks.data = res.data.tracks.data;
      totalTrackItems.value = res.data.tracks.summary.total;
      hideLoadingEffect();
    });
};

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();
  if (route.query.q) {
    keyWord.value = route.query.q;
    getSearchTrack(keyWord.value);
  }
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />

    <main>
      <section>
        <div class="container">
          <div
            class="d-flex justify-content-between align-items-center flex-sm-row flex-column"
          >
            <h2 class="fs-lg-2 fs-3 my-lg-8 my-sm-6 my-4">
              <strong class="text-warning">{{ keyWord }}</strong> 單曲搜尋結果
            </h2>
            <RouterLink
              class="btn-more-content mb-4 mb-sm-0"
              :to="{
                name: 'search',
                query: {
                  q: route.query.q,
                },
              }"
            >
              回到 {{ keyWord }} 搜尋頁
              <i class="bi bi-arrow-left-circle"></i>
            </RouterLink>
          </div>
          <ul
            class="row row-cols-lg-2 row-cols-1 list-search gy-3 ps-0 mb-lg-8 mb-6"
          >
            <li
              class="col list-search-item d-flex align-items-center"
              v-for="item in searchResultData.tracks.data"
              :key="item.id"
            >
              <div class="search-single-info d-flex align-items-center">
                <img :src="item.album.images[0].url" :alt="item.name" />
                <div class="ms-lg-4 ms-2">
                  <h4 class="single-name fs-6 mb-1">{{ item.name }}</h4>
                  <h6 class="singer-name fs-7">{{ item.album.artist.name }}</h6>
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

          <Paginate
            :page-count="totalPage"
            :page-range="3"
            :margin-pages="2"
            :click-handler="pageClickHandler"
            :prev-text="prevIcon"
            :next-text="nextIcon"
            :container-class="'pagination'"
            class="py-lg-8 py-6 overflow-x-auto"
            v-model="currentPage"
            v-if="searchResultData.tracks.data.length !== 0"
          />
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

.pagination {
  display: flex;
  justify-content: center;
  li {
    margin: 0 5px;
    &.active {
      a {
        font-weight: bold;
        background-color: #ffc107;
        color: white;
      }
    }
    &.disabled {
      color: #495057;
    }
    a {
      padding: 5px 10px;
      color: #ffc107;
      cursor: pointer;
      &:focus {
        font-weight: bold;
        background-color: #ffc107;
        color: white;
      }
      &:hover {
        background-color: #ffc107;
        color: white;
      }
    }
  }
}
</style>
