<script setup>
import { onMounted, ref, nextTick, computed } from 'vue';
import { RouterLink, onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import { useMusicPlayerStore } from '@/stores/musicPlayer';
import { storeToRefs } from 'pinia';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
import PlayTrackMusic from '@/components/PlayTrackMusic.vue';
import LoadingEffect from '@/components/LoadingEffect.vue';

import user01 from '@/assets/images/user-01.png';
import user02 from '@/assets/images/user-02.png';
import user03 from '@/assets/images/user-03.png';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AOS from 'aos';

const modules = ref([Navigation, Pagination]);
const navigation = ref({
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
});

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

// 取得所有新發布歌曲類別 (取得歌曲類別 id)
const briefAllCategoriesData = ref([]);
const categoriesIdData = ref([]);

const getNewReleaseCategories = () => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-release-categories?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      briefAllCategoriesData.value = res.data.data;
      categoriesIdData.value = briefAllCategoriesData.value
        .map(item => item.id)
        .slice(0, 5);
    });
};

// KrdH2LdyUKS8z2aoxX 綜合
// 4pVhRTE2XjCwnJfQRn 韓語
// Cng5IUIQhxb8w1cbsz 華語
// CkgxHJdAgNrEruEDza 西洋
// -nap5A1iST1A6Ny3ze 日語

// 特定類別新專輯資料 limit = 20
const specificCategoryNewAlbumData = ref([]);

// Get albums of a new release category 取得特定類別新發行專輯 ， 由 getNewReleaseCategories 取得類別 id
const getNewSpecificCategoryAlbum = categoryId => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-release-categories/${categoryId}/albums?territory=TW&limit=20`,
      generalConfig.value,
    )
    .then(res => {
      specificCategoryNewAlbumData.value = res.data.data;
    });
};

// Get list of chart playlists 各類排行榜

const allRankingCategoriesData = ref([]);
const homePageRankingCategoriesData = ref([]);
const getAllCategoriesRankingList = () => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/charts?territory=TW`,
      generalConfig.value,
    )
    .then(res => {
      allRankingCategoriesData.value = res.data.data;
      homePageRankingCategoriesData.value =
        allRankingCategoriesData.value.slice(0, 6);
    });
};

const titleName = ref('綜合新歌即時榜');

const changeRankingTitle = titleData => {
  titleName.value = titleData;
};

// Get tracks of a chart playlist 取得特定類別排行榜的曲目 (前15名)
// 首頁設定綜合排行
const specificRankingTracksData = ref([]);
const getSpecificCategoryRankingListTracks = rankingCategoryId => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/charts/${rankingCategoryId}/tracks?territory=TW&limit=15`,
      generalConfig.value,
    )
    .then(res => {
      specificRankingTracksData.value = res.data.data;
    });
};

const hotPlayListCategoryData = ref([]);

// Get  new hits playlist 取得新的熱門播放列表類別 (目前有4種類)
const getNewHotPlaylist = () => {
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-hits-playlists?territory=TW `,
      generalConfig.value,
    )
    .then(res => {
      hotPlayListCategoryData.value = res.data.data;
    });
};

// 音樂播放
const musicPlayerStore = useMusicPlayerStore();
const { singleRankData, isMusicPlaying } = storeToRefs(musicPlayerStore);
const { resetMusicTrackData } = musicPlayerStore;

const musicTrackModalRef = ref(null);

const playMusicTrackModal = async singleSongId => {
  if (singleRankData.value.id === singleSongId) return;

  // 如果已經在播放音樂，關閉音樂
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

// 使用者推薦區塊 hover 效果

const users = ref([
  {
    name: 'Sophia',
    img: user01,
    comment: '完全免費暢聽抒情好歌，靜心放鬆無負擔！',
  },
  {
    name: 'Ryan',
    img: user02,
    comment: '音質穩定不卡頓，嘻哈節奏讓你沉浸音樂世界！',
  },
  {
    name: 'Ethan',
    img: user03,
    comment: '多元曲風滿足耳朵，流行音樂一次聽個夠！',
  },
]);

const hoverActiveCardIndex = ref(0);

const setHoverCard = index => {
  clearHoverTimeout(); // 清楚計時器
  hoverActiveCardIndex.value = index;
};

let hoverTimeout = null;
const resetHoverCard = e => {
  const target = e.relatedTarget;
  // 如果移入其它的 .card-user，取消重置
  if (target.closest('.card-user')) return;

  hoverTimeout = setTimeout(() => {
    hoverActiveCardIndex.value = 0;
  }, 100);
};

const clearHoverTimeout = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
};

const fetchAllApiData = async () => {
  try {
    await Promise.all([
      getNewReleaseCategories(),
      getNewSpecificCategoryAlbum('KrdH2LdyUKS8z2aoxX'),
      getAllCategoriesRankingList(),
      getSpecificCategoryRankingListTracks('LZPhK2EyYzN15dU-PT'),
      getNewHotPlaylist(),
    ]);
  } catch (error) {
    console.error('其中一個請求失敗:', error);
  }
};

onMounted(async () => {
  showLoadingEffect();
  generalConfig.value = await getConfigAuthToken();
  fetchAllApiData();

  changeRankingTitle('綜合新歌即時榜');
  hideLoadingEffect();

  setTimeout(() => {
    AOS.refresh();
  }, 1000);
});

onBeforeRouteLeave(() => {
  handleBrowserChangePage();
});
</script>

<template>
  <LoadingEffect v-bind="loadingProps" />
  <HeaderView />

  <main>
    <section class="banner py-7">
      <div class="container-fluid">
        <div class="d-flex" v-if="specificCategoryNewAlbumData.length !== 0">
          <Swiper
            :navigation="navigation"
            :modules="modules"
            :loop="true"
            :centeredSlides="true"
            :slidesPerView="1.2"
            :spaceBetween="20"
            :slidesPerGroup="1"
            :breakpoints="{
              576: {
                slidesPerView: 1.5,
              },
              992: {
                spaceBetween: 30,
                slidesPerView: 2.3,
              },
            }"
            class="SwiperBanner"
          >
            <SwiperSlide
              v-for="item in specificCategoryNewAlbumData"
              :key="item.id"
            >
              <div
                class="banner-item d-flex flex-shrink-0 w-100 justify-content-center position-relative"
              >
                <RouterLink
                  class="d-flex justify-content-center align-items-center position-relative"
                  :to="{
                    name: 'album',
                    params: {
                      albumId: item.id,
                    },
                  }"
                >
                  <img
                    :src="item.images[2].url"
                    class="object-fit-cover"
                    :alt="item.name"
                  />
                  <div class="position-absolute text-center">
                    <h2 class="fs-3 fs-md-1 mb-5">{{ item.name }}</h2>
                    <h2 class="fs-5 fs-md-3">{{ item.artist.name }}</h2>
                  </div>
                  <div class="banner-tag bg-warning rounded-5">
                    <p class="fw-bold p-3 text-center fst-italic fs-7 fs-md-6">
                      發行日 {{ item.release_date }}
                    </p>
                  </div>
                </RouterLink>
              </div>
            </SwiperSlide>

            <div>
              <button class="swiper-button-prev fs-md-5 fs-6 text-dark">
                <i class="bi bi-arrow-left"></i>
              </button>
              <button class="swiper-button-next fs-md-5 fs-6 text-dark">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </Swiper>
        </div>

        <div v-else class="py-lg-10 py-5">
          <h2 class="fs-lg-2 fs-md-3 fs-4 text-center">
            😓 目前綜合類專輯資料更新中 <br />
            可先逛逛其他地方，或是搜尋看看好聽的歌
          </h2>
        </div>
      </div>
    </section>

    <!-- 排行榜 -->
    <section class="ranking py-lg-13 py-9">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <h3 class="fs-lg-3 fs-4 mb-lg-5 mb-3">熱門即時排行 🎼</h3>
            <ul
              class="list-unstyled d-flex gap-md-2 gap-1 flex-wrap mb-lg-4 mb-3"
            >
              <li v-for="item in homePageRankingCategoriesData" :key="item.id">
                <a
                  class="btn border btn-custom-info text-nowrap"
                  @click="
                    getSpecificCategoryRankingListTracks(item.id);
                    changeRankingTitle(item.title);
                  "
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>
            <RouterLink
              to="/ranking"
              class="btn btn-info px-7 mb-6 d-sm-inline-block"
              >更多類型排行榜</RouterLink
            >
          </div>

          <div class="col-lg-8">
            <h2 class="fs-lg-2 fs-3">{{ titleName }}</h2>
            <ul class="list-group list-group-flush ranking-list mt-6">
              <li
                class="list-group-item d-flex align-items-center ranking-item"
                v-for="(item, index) in specificRankingTracksData"
                :key="item.id"
              >
                <h4 class="fw-bolder text-warning fs-5 fs-md-4">
                  {{ index + 1 }}
                </h4>
                <div
                  class="ranking-single-info d-flex align-items-center ms-lg-5 ms-3"
                >
                  <img
                    :src="item.album.artist.images[0].url"
                    :alt="item.album.artist.name"
                  />
                  <div class="ms-lg-4 ms-2">
                    <h5 class="single-name fs-6 fs-md-5 mb-1">
                      {{ item.name }}
                    </h5>
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

    <!-- 熱門歌單 -->
    <section class="hot-playlist py-lg-13 py-9">
      <div class="container">
        <h2 class="fs-lg-2 fs-3 text-center mb-9 mb-lg-12">4大熱門歌單 🔥</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 gy-5">
          <div
            class="col"
            v-for="item in hotPlayListCategoryData"
            :key="item.id"
            data-aos="flip-left"
            data-aos-once="false"
            data-aos-offset="200"
            data-aos-anchor-placement="top-bottom"
          >
            <div
              class="card card-hot-playlist h-100 align-items-center border-0 rounded-4"
            >
              <img
                :src="item.images[0].url"
                class="card-img-top"
                :alt="item.title"
              />
              <div class="card-body">
                <h3 class="fs-md-4 fs-5 text-center">
                  <RouterLink
                    href="#"
                    class="stretched-link link-light link-custom"
                    :to="{
                      name: 'hotPlayList',
                      params: {
                        hotPlayListCategoryId: item.id,
                      },
                    }"
                  >
                    {{ item.title }}
                  </RouterLink>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- KK music 三大特色 -->
    <section class="features py-lg-13 py-9 bg-gray-300">
      <div class="container">
        <h2 class="fs-lg-2 fs-3 text-center mb-9 mb-lg-12">
          KK music 三大特色
        </h2>
        <div class="row justify-content-center">
          <div class="col">
            <Swiper
              :pagination="{
                clickable: true,
                dynamicBullets: true,
              }"
              :modules="modules"
              :slidesPerView="1"
              :spaceBetween="20"
              :breakpoints="{
                768: {
                  slidesPerView: 2,
                },
                992: {
                  spaceBetween: 30,
                  slidesPerView: 3,
                },
              }"
              class="SwiperFeatures pb-12"
            >
              <SwiperSlide>
                <div class="card card-feature h-100 border-0 bg-transparent">
                  <img
                    src="../assets/images/home-01.jpg"
                    class="object-fit-cover rounded-4"
                    alt="特色1"
                  />
                  <div class="card-body rounded-4 bg-gray-400 p-3 p-md-6">
                    <h3 class="fs-md-4 fs-5 mb-md-3 mb-2">
                      <i class="bi bi-star-fill text-warning me-1"></i>曲風多元
                    </h3>
                    <p>
                      提供多種音樂曲風，每個音樂愛好者都能找到適合自己的旋律。探索不同的音樂風格，隨時隨地找到新的聆聽體驗。
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div class="card card-feature h-100 border-0 bg-transparent">
                  <img
                    src="../assets/images/home-02.jpg"
                    class="object-fit-cover rounded-4"
                    alt="特色2"
                  />
                  <div class="card-body rounded-4 bg-gray-400 p-3 p-md-6">
                    <h3 class="fs-md-4 fs-5 mb-md-3 mb-2">
                      <i class="bi bi-star-fill text-warning me-1"></i>音質穩定
                    </h3>
                    <p>
                      高品質音頻流暢播放，保證每首歌曲的音質清晰且穩定，讓您在任何設備上都能享受純淨的音樂體驗，不受中斷和雜音干擾。
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div class="card card-feature h-100 border-0 bg-transparent">
                  <img
                    src="../assets/images/home-03.jpg"
                    class="object-fit-cover rounded-4"
                    alt="特色3"
                  />
                  <div class="card-body rounded-4 bg-gray-400 p-3 p-md-6">
                    <h3 class="fs-md-4 fs-5 mb-md-3 mb-2">
                      <i class="bi bi-star-fill text-warning me-1"></i>完全免費
                    </h3>
                    <p>
                      無需訂閱費或額外費用，讓您隨時隨地享受喜愛的音樂。這裡的所有音樂資源都可以免費聆聽，帶來更便捷的音樂體驗！
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>

    <!-- 各種類最新發行音樂 -->
    <section class="all-new-release-categories py-lg-13 py-9">
      <div class="container">
        <h2 class="fs-lg-2 fs-3 text-center mb-9 mb-lg-12">
          各種最新發行音樂任意挑選
        </h2>
        <div class="row justify-content-center">
          <div class="col-md-10">
            <ul
              class="list-unstyled d-flex flex-column-row flex-wrap gap-md-4 gap-2"
            >
              <li
                class="card border"
                v-for="item in briefAllCategoriesData"
                :key="item.id"
              >
                <RouterLink
                  class="btn btn-custom-info fs-md-5 stretched-link py-md-3 px-md-4 py-2 px-3"
                  :to="{
                    name: 'releaseCategories',
                    params: {
                      categoriesId: item.id,
                    },
                  }"
                >
                  {{ item.title }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用者推薦 -->
    <section class="recommendation py-lg-13 py-9">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 d-none d-lg-block">
            <img
              src="../assets/images/home-recommend.jpg"
              class="img-fluid object-fit-cover rounded-4 main-img"
              alt=""
            />
          </div>
          <div class="col-lg-6">
            <h2 class="fs-lg-2 text-center fs-3 mb-9 mb-lg-12">
              聽聽大家怎麼說
            </h2>
            <ul class="card-list list-unstyled d-flex flex-column gap-4">
              <li
                v-for="(item, index) in users"
                :key="item.name + '123'"
                class="card-user d-flex align-items-center rounded-4 p-3 px-md-7 py-md-5 bg-gray-300"
                :class="{ 'hover-active': hoverActiveCardIndex === index }"
                @mouseenter="setHoverCard(index)"
                @mouseleave="resetHoverCard($event)"
              >
                <div class="flex-shrink-0">
                  <img :src="item.img" :alt="item.name" />
                </div>
                <div class="flex-grow-1 ms-4">
                  <h3 class="fs-5 mb-3">{{ item.name }}</h3>
                  <p>
                    {{ item.comment }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>

  <FooterView />
</template>

<style lang="scss" scoped>
.banner {
  .banner-item {
    a {
      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(#212529, 0.4);
        opacity: 0;
        transition: opacity 0.5s;
      }
      &:hover {
        &::after {
          opacity: 1;
        }
      }
    }
    img {
      border-radius: 60px;
      width: 800px;
      max-height: 450px;
    }
  }
  .banner-tag {
    position: absolute;
    bottom: 5%;
    right: 5%;
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

.card-hot-playlist {
  img {
    max-width: 320px;
  }
}

.card-feature {
  max-width: 350px;
  img {
    margin-right: 40px;
    width: auto;
  }
  .card-body {
    margin-top: -40px;
    margin-left: 30px;
  }
}

.recommendation {
  .main-img {
    max-height: 620px;
    width: 100%;
  }
}

.card-user {
  position: relative;
  transform-origin: bottom right;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:not(.hover-active) {
    transform: scale(1);
    z-index: 1;
  }

  img {
    max-width: 50px;
  }

  &.hover-active {
    @media (min-width: 992px) {
      z-index: 20;
      transform: scale(1.2) translate(0px, -10px);
      border: 2px solid rgba(255, 255, 0, 0.5);
      img {
        max-width: 70px;
      }
    }
  }
}
</style>
