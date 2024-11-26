<script setup>
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import { useBaseSet } from '@/stores/baseSet';
import Paginate from 'vuejs-paginate-next';

import HeaderView from '../layout/HeaderView.vue';
import FooterView from '../layout/FooterView.vue';
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

// 當前分頁的歌單資料
const searchResultData = ref({
  playlists: {
    data: [],
  },
});

const route = useRoute();
const router = useRouter();

// 分頁
const totalPlaylistItems = ref(0); // 總歌單數量
const currentPage = ref(Number(route.query.page) || 1); // 當前頁數
const itemsPerPage = ref(18); // 每頁顯示幾筆
const prevIcon = `<i class="bi bi-caret-left-fill"></i>`;
const nextIcon = `<i class="bi bi-caret-right-fill"></i>`;

// 總頁數計算
const totalPage = computed(() =>
  Math.ceil(totalPlaylistItems.value / itemsPerPage.value),
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
  getSearchPlaylist(keyWord.value);
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

// 搜尋歌單
const keyWord = ref('');
const getSearchPlaylist = keyWord => {
  showLoadingEffect();
  const offset = (currentPage.value - 1) * itemsPerPage.value; // 偏移資料筆數
  const limit = itemsPerPage.value; // 限制每頁 API 取得筆數

  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/search?q=${keyWord}&territory=TW&type=artist,track,album,playlist&limit=${limit}&offset=${offset} `,
      generalConfig.value,
    )
    .then(res => {
      searchResultData.value.playlists.data = res.data.playlists.data;
      totalPlaylistItems.value = res.data.playlists.summary.total;
      hideLoadingEffect();
    });
};

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();
  if (route.query.q) {
    keyWord.value = route.query.q;
    getSearchPlaylist(keyWord.value);
  }
});

onBeforeRouteUpdate(to => {
  if (to.query.q) {
    keyWord.value = to.query.q;
    getSearchPlaylist(keyWord.value);
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
              <strong class="text-warning">{{ keyWord }}</strong> 歌單搜尋結果
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

          <div class="row row-cols-lg-6 row-cols-md-3 row-cols-2 gy-4">
            <div
              class="col"
              v-for="item in searchResultData.playlists.data"
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
                  <h3 class="fs-lg-6 fs-7 mb-2">{{ item.title }}</h3>
                  <h4 class="fs-7">{{ item.owner.name }}</h4>
                </div>
              </RouterLink>
            </div>
          </div>

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
            v-if="searchResultData.playlists.data.length !== 0"
          />
        </div>
      </section>
    </main>

    <FooterView />
  </div>
</template>

<style lang="scss">
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
