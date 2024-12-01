<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  nextTick,
  computed,
} from 'vue';
import { useBaseSet } from '@/stores/baseSet';
import { useToolsStore } from '@/stores/tools';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import YouTube from 'vue3-youtube';

import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
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

// Get a new hits playlist 取得新的特定類別熱門播放列表 (無限制歌曲數量)
const hotPlayListSpecificCategoryData = ref({
  title: '',
  tracks: [],
});
const getNewSpecificCategoryHotPlaylist = playListId => {
  showLoadingEffect();
  axios
    .get(
      `${import.meta.env.VITE_BASE_API_URL}/new-hits-playlists/${playListId}?territory=TW `,
      generalConfig.value,
    )
    .then(res => {
      hotPlayListSpecificCategoryData.value.title = res.data.title;
      hotPlayListSpecificCategoryData.value.tracks = res.data.tracks.data;

      const musicTitle = hotPlayListSpecificCategoryData.value.tracks[0].name;
      const singerName =
        hotPlayListSpecificCategoryData.value.tracks[0].album.artist.name;
      playYouTubeMusic(musicTitle, singerName);
      hideLoadingEffect();
    });
};

const showItemsIndex = ref(30);
const expandMoreItems = () => {
  showItemsIndex.value += 50;
};

// YouTube
const youTubeData = ref({
  musicId: '',
  musicInfo: {},
});

const playYouTubeMusic = (song, singer) => {
  axios
    .get(`${import.meta.env.VITE_BASE_API_YT_URL}/search`, {
      params: {
        key: import.meta.env.VITE_API_YTKEY,
        part: 'snippet',
        type: 'video',
        q: `${song} ${singer}`,
        maxResults: 5,
        order: 'relevance',
      },
    })
    .then(res => {
      youTubeData.value.musicId = res.data.items[0].id.videoId;
      youTubeData.value.musicInfo = res.data.items[0].snippet;
    })
    .catch(err => {
      console.log('searchYT 錯誤 :', err.response);
    });
};

const youtubePlayerRef = ref(null);

const onPlayerReady = () => {
  nextTick(() => {
    playYoutubeVideo();
  });
};

const playYoutubeVideo = () => {
  youtubePlayerRef.value.playVideo();
};

const stopYoutubeVideo = () => {
  if (youtubePlayerRef.value) {
    youtubePlayerRef.value.stopVideo();
  }
};

const rankingCategoryIndex = ref('');
const changeStatus = hotPlayListCategoryId => {
  rankingCategoryIndex.value = hotPlayListCategoryId;
  router.push({
    name: 'hotPlayList',
    params: {
      hotPlayListCategoryId: hotPlayListCategoryId,
    },
  });
};

// 處理時間
const tools = useToolsStore();
const { processDateExpression } = tools;

watch(
  () => route.params.hotPlayListCategoryId,
  () => {
    changeStatus(route.params.hotPlayListCategoryId);
    getNewSpecificCategoryHotPlaylist(route.params.hotPlayListCategoryId);
  },
);

watch(
  () => hotPlayListSpecificCategoryData.value.tracks,
  () => {
    showItemsIndex.value = 30;
  },
);

onMounted(async () => {
  generalConfig.value = await getConfigAuthToken();

  getNewSpecificCategoryHotPlaylist(route.params.hotPlayListCategoryId);
  getNewHotPlaylist();
  changeStatus(route.params.hotPlayListCategoryId);
});

onBeforeUnmount(() => {
  stopYoutubeVideo();
});
</script>

<template>
  <div class="wrapper">
    <LoadingEffect v-bind="loadingProps" />
    <HeaderView />
    <main>
      <section class="hot-playlist-page py-lg-13 py-9">
        <div class="container-fluid">
          <h2 class="fs-lg-2 fs-3 text-center mb-9 mb-lg-12">
            {{ hotPlayListSpecificCategoryData.title }}
          </h2>
          <div class="row">
            <div class="col-lg-8">
              <div class="youtube-video">
                <YouTube
                  v-if="youTubeData.musicId"
                  ref="youtubePlayerRef"
                  :src="youTubeData.musicId"
                  @ready="onPlayerReady"
                />
              </div>
              <div
                class="youtube-video-text my-md-5 my-3"
                v-if="youTubeData.musicId"
              >
                <h3 class="fs-5 fs-lg-4 mb-lg-4 mb-3">
                  {{ youTubeData.musicInfo.title }}
                </h3>
                <p>
                  發行日:
                  {{ processDateExpression(youTubeData.musicInfo.publishTime) }}
                </p>
              </div>
              <div class="youtube-request-maximum my-10" v-else>
                <h2 class="fs-md-1 fs-3">
                  😓 抱歉，目前已達到1天
                  <strong class="text-danger">YouTube API 請求上限</strong>
                </h2>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="row row-cols-1">
                <div class="col">
                  <ul
                    class="list-unstyled d-flex gap-md-2 gap-1 flex-wrap mb-lg-4 mb-3"
                  >
                    <li v-for="item in hotPlayListCategoryData" :key="item.id">
                      <a
                        class="btn border btn-custom-info text-nowrap"
                        :class="{ active: rankingCategoryIndex === item.id }"
                        @click="changeStatus(item.id)"
                      >
                        {{ item.title }}
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="col">
                  <ul
                    class="list-group list-group-flush list-group-hot-playlist mt-6"
                  >
                    <li
                      class="list-group-item d-flex align-items-center hot-playlist-item position-relative"
                      v-for="(
                        item, index
                      ) in hotPlayListSpecificCategoryData.tracks.slice(
                        0,
                        showItemsIndex,
                      )"
                      :key="item.id"
                    >
                      <a
                        href="#"
                        class="link-light d-flex align-items-center stretched-link"
                        @click.prevent="
                          playYouTubeMusic(item.name, item.album.artist.name)
                        "
                      >
                        <h4 class="fw-bolder text-warning fs-6 fs-lg-5">
                          {{ index + 1 }}
                        </h4>
                        <div
                          class="hot-playlist-info w-100 d-flex align-items-center ms-lg-5 ms-3"
                        >
                          <img :src="item.album.images[0].url" />
                          <div class="ms-lg-4 ms-2">
                            <h5 class="track-name fs-6 fs-xl-5 mb-1">
                              {{ item.name }}
                            </h5>
                            <h6 class="singer-name fs-7 fs-xl-6 mb-2">
                              {{ item.album.artist.name }}
                            </h6>
                          </div>
                        </div>
                      </a>
                    </li>

                    <li
                      class="list-group-item text-center position-relative"
                      v-if="
                        showItemsIndex <
                        hotPlayListSpecificCategoryData.tracks.length
                      "
                    >
                      <a
                        href="#"
                        class="btn btn-expand fw-bold stretched-link"
                        @click.prevent="expandMoreItems"
                        >展開更多歌曲</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterView />
  </div>
</template>

<style lang="scss" scoped>
.youtube-video {
  position: relative;
  aspect-ratio: 16 / 9;

  ::v-deep(> div) {
    width: 100% !important;
    height: 100% !important;
  }

  ::v-deep(iframe) {
    width: 100% !important;
    height: 100% !important;
    border-radius: 10px !important;
  }
}

.list-group-item:has(.btn-expand) {
  &:hover {
    color: #fff;
    background: #09acf5;
  }
}

.list-group-hot-playlist {
  height: calc(100vh - 6rem);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #888;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ffc107;
  }
}

.hot-playlist-item {
  h4 {
    width: 20px;
  }
}

.hot-playlist-info {
  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
}

@media (min-width: 768px) {
  .hot-playlist-item {
    h4 {
      width: 10px;
    }
  }

  .hot-playlist-info {
    img {
      width: 90px;
      height: 90px;
    }
  }
}
</style>
