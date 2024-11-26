import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/album/:albumId',
      name: 'album',
      component: () => import('../views/AlbumView.vue'),
    },
    {
      path: '/playlist/:playlistId',
      name: 'playlist',
      component: () => import('../views/PlaylistView.vue'),
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/RankingView.vue'),
    },
    {
      path: '/hotPlayList/:hotPlayListCategoryId',
      name: 'hotPlayList',
      component: () => import('../views/HotPlayList.vue'),
    },
    {
      path: '/releaseCategories/:categoriesId',
      name: 'releaseCategories',
      component: () => import('../views/ReleaseCategories.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/search/searchAlbum',
      name: 'searchAlbum',
      component: () => import('../views/search/SearchAlbum.vue'),
    },
    {
      path: '/search/SearchTrack',
      name: 'SearchTrack',
      component: () => import('../views/search/SearchTrack.vue'),
    },
    {
      path: '/search/SearchPlaylist',
      name: 'SearchPlaylist',
      component: () => import('../views/search/SearchPlaylist.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior(to) {
    if (to.name === 'home') {
      return {
        top: 0,
      }
    } else if (to.fullPath.match('hotPlayList')) {
      return {
        top: 0,
      }
    }
  },
})

export default router
