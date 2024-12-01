<script setup>
import { nextTick, onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave } from 'vue-router';

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
  bgColor: '',
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

// Get tracks of a chart playlist 取得特定類別排行榜的曲目 (100名)
const specificDefaultNumbersRankingTracksData = ref([]);
const getDefaultNumbersSpecificCategoryRankingListTracks =
  rankingCategoryId => {
    showLoadingEffect();
    axios
      .get(
        `${import.meta.env.VITE_BASE_API_URL}/charts/${rankingCategoryId}/tracks?territory=TW`,
        generalConfig.value,
      )
      .then(res => {
        specificDefaultNumbersRankingTracksData.value = res.data.data;
        hideLoadingEffect();
      });
  };

const allRankingCategories = ref([]);
const getAllCategoriesRankingList = () => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/charts?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      allRankingCategories.value = res.data.data;
    });
};

// 音樂單曲播放
const musicPlayerStore = useMusicPlayerStore();
const { singleRankData, isMusicPlaying } = storeToRefs(musicPlayerStore);
const { resetMusicTrackData } = musicPlayerStore;

const musicTrackModalRef = ref(null);

const playMusicTrackModal = async singleSongId => {
  if (singleRankData.value.id === singleSongId) return;

  // 如果已經在播放音樂，先關閉當前播放的音樂
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

// 切換 active 狀態
const rankingCategoryIndex = ref('');
const changeActive = rankingCategoryId => {
  rankingCategoryIndex.value = rankingCategoryId;
};

const titleName = ref('綜合新歌即時榜');

const changeRankingTitle = titleData => {
  titleName.value = titleData;
};

const handleBrowserChangePage = () => {
  if (isMusicPlaying.value) {
    musicTrackModalRef.value.closeMusicModal();
  }
};

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();
  getDefaultNumbersSpecificCategoryRankingListTracks('LZPhK2EyYzN15dU-PT');
  getAllCategoriesRankingList();
  changeRankingTitle('綜合新歌即時榜');
  changeActive('LZPhK2EyYzN15dU-PT');
});

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});
</script>

<template>
  <LoadingEffect v-bind="loadingProps" />
  <HeaderView />

  <section class="ranking-page py-lg-13 py-9">
    <div class="container">
      <h2 class="fs-lg-2 fs-3 mb-7 mb-lg-9">KK music 熱門排行榜</h2>
      <div class="row gy-3">
        <div class="col-lg-3 d-none d-lg-block">
          <div class="list-group">
            <a
              href="#"
              v-for="item in allRankingCategories"
              :key="item.id"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center link-light"
              :class="{ active: rankingCategoryIndex === item.id }"
              @click.prevent="
                changeActive(item.id);
                changeRankingTitle(item.title);
                getDefaultNumbersSpecificCategoryRankingListTracks(item.id);
              "
            >
              {{ item.title }}
              <span
                v-if="item.title === '綜合新歌即時榜'"
                class="badge text-bg-warning rounded-pill"
                >最熱門</span
              >
            </a>
          </div>
        </div>

        <div class="col d-block d-lg-none">
          <ul
            class="list-unstyled d-flex gap-md-2 gap-1 flex-wrap mb-lg-4 mb-3"
          >
            <li v-for="item in allRankingCategories" :key="item.id">
              <a
                class="btn border btn-custom-info text-nowrap"
                :class="{ active: rankingCategoryIndex === item.id }"
                @click="
                  changeActive(item.id);
                  changeRankingTitle(item.title);
                  getDefaultNumbersSpecificCategoryRankingListTracks(item.id);
                "
              >
                {{ item.title }}
                <span
                  v-if="item.title === '綜合新歌即時榜'"
                  class="badge text-bg-warning rounded-pill"
                  >最熱門</span
                >
              </a>
            </li>
          </ul>
        </div>

        <div class="col-lg-9">
          <h2 class="text-center fs-lg-2 fs-3">{{ titleName }}</h2>
          <ul class="list-group list-group-flush ranking-list mt-6">
            <li
              class="list-group-item d-flex align-items-center ranking-item"
              v-for="(item, index) in specificDefaultNumbersRankingTracksData"
              :key="item.id"
            >
              <h4 class="fw-bolder text-warning fs-5 fs-md-4">
                {{ index + 1 }}
              </h4>
              <div
                class="ranking-single-info w-100 d-flex align-items-center ms-lg-5 ms-3"
              >
                <img
                  :src="item.album.artist.images[0].url"
                  :alt="item.album.artist.name"
                />
                <div class="ms-lg-4 ms-2">
                  <h5 class="single-name fs-6 fs-md-5 mb-1">{{ item.name }}</h5>
                  <h6 class="singer-name fs-7 fs-md-6">
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

    <PlayTrackMusic
      ref="musicTrackModalRef"
      :single-rank-data="singleRankData"
      @emitCloseTrackMusicModal="stopPlayTrackMusic"
    />
  </section>

  <FooterView />
</template>

<style lang="scss" scoped>
.ranking-page {
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

.ranking-single-info {
  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
}

.ranking-item {
  h4 {
    width: 28px;
  }
}

@media (min-width: 768px) {
  .ranking-single-info {
    img {
      width: 90px;
      height: 90px;
    }
  }
  .ranking-item {
    h4 {
      width: 34px;
    }
  }
}
</style>
