<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
import PlayAlbum from '@/components/PlayAlbum.vue';
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

const route = useRoute();
const router = useRouter();

const briefAllReleaseCategoriesData = ref([]);
const getNewReleaseCategories = () => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-release-categories?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      briefAllReleaseCategoriesData.value = res.data.data;
    });
};

// 音樂專輯播放

const musicPlayerStore = useMusicPlayerStore();
const { musicAlbumData, isMusicAlbumPlaying } = storeToRefs(musicPlayerStore);
const { resetMusicAlbumData } = musicPlayerStore;

const musicAlbumModalRef = ref(null);

const playMusicAlbumModal = musicAlbumId => {
  if (musicAlbumData.value.id === musicAlbumId) return;

  // 如果已經在播放音樂，先關閉當前播放的音樂
  if (isMusicAlbumPlaying.value) {
    musicAlbumModalRef.value.closeMusicAlbumModal();
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

const handleBrowserChangePage = () => {
  if (isMusicAlbumPlaying.value) {
    musicAlbumModalRef.value.closeMusicAlbumModal();
  }
};

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});

// 切換 active 狀態
const rankingCategoryIndex = ref('');
const changeStatus = categoryId => {
  rankingCategoryIndex.value = categoryId;
  router.push({
    name: 'releaseCategories',
    params: {
      categoriesId: categoryId,
    },
  });
};

const categoryData = ref({
  categoryId: '',
  categoryTitle: '',
  albums: [],
});
// 取得特定新發布類別的歌曲
const getNewSpecificCategorySong = categoryId => {
  showLoadingEffect();
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-release-categories/${categoryId}?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      categoryData.value.categoryTitle = res.data.title;
      categoryData.value.albums = res.data.albums.data;
      hideLoadingEffect();
    });
};

watch(
  () => route.params.categoriesId,
  () => {
    changeStatus(route.params.categoriesId);
    getNewSpecificCategorySong(route.params.categoriesId);
  },
);

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();

  getNewReleaseCategories();

  changeStatus(route.params.categoriesId);
  getNewSpecificCategorySong(route.params.categoriesId);
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />
    <main>
      <section class="new-release-categories py-lg-13 py-9">
        <div class="container">
          <h2 class="fs-lg-2 fs-3 text-center">
            新發行{{ categoryData.categoryTitle }}歌曲
          </h2>
          <div class="row px-3 px-sm-0">
            <ul
              class="list-unstyled d-flex gap-md-2 gap-1 flex-no-wrap overflow-x-auto mb-lg-4 mb-3 py-lg-5 py-3"
            >
              <li v-for="item in briefAllReleaseCategoriesData" :key="item.id">
                <a
                  href="#"
                  class="btn border btn-custom-info text-nowrap"
                  :class="{ active: rankingCategoryIndex === item.id }"
                  @click.prevent="changeStatus(item.id)"
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
          <div class="row">
            <div class="col" v-if="categoryData.albums.length !== 0">
              <ul class="list-group list-group-flush mt-6">
                <li
                  class="list-group-item d-flex align-items-center release-album-item"
                  v-for="(item, index) in categoryData.albums"
                  :key="item.id"
                >
                  <h4 class="fw-bolder text-warning fs-5 fs-md-4">
                    {{ index + 1 }}
                  </h4>
                  <div
                    class="release-albums-info d-flex align-items-center ms-lg-5 ms-3"
                  >
                    <img :src="item.images[0].url" :alt="item.name" />
                    <div class="ms-lg-4 ms-2">
                      <h5 class="single-name fs-6 fs-md-5 mb-1">
                        {{ item.name }}
                      </h5>
                      <h6 class="singer-name fs-7 fs-md-6 mb-2">
                        {{ item.artist.name }}
                      </h6>
                      <span class="fs-7 fs-md-6 text-gray-300">{{
                        item.release_date
                      }}</span>
                    </div>
                  </div>
                  <div class="d-flex ms-auto">
                    <button
                      type="button"
                      class="btn btn-custom-play"
                      @click="playMusicAlbumModal(item.id)"
                    >
                      <i class="bi bi-play-fill"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <div class="col" v-else>
              <h2 class="fs-4 fs-md-2 fs-lg-1 mt-9 mt-lg-12">
                😓 抱歉，目前沒有新發行{{ categoryData.categoryTitle }}相關歌曲
              </h2>
            </div>
          </div>
        </div>

        <PlayAlbum
          ref="musicAlbumModalRef"
          :music-album-data="musicAlbumData"
          @emitCloseMusicAlbumModal="stopPlayAlbumMusic"
        />
      </section>
    </main>

    <FooterView />
  </div>
</template>

<style lang="scss">
.new-release-categories {
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

.release-albums-info {
  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
}

.release-album-item {
  h4 {
    width: 28px;
  }
}

@media (min-width: 768px) {
  .release-albums-info {
    img {
      width: 90px;
      height: 90px;
    }
  }
  .release-album-item {
    h4 {
      width: 34px;
    }
  }
}
</style>
