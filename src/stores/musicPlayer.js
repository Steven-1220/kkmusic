import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  // 單曲
  const singleRankData = ref({
    id: '',
    autoplay: false,
  })

  // 專輯
  const musicAlbumData = ref({
    id: '',
    autoplay: false,
  })

  // 歌單
  const musicPlaylistData = ref({
    id: '',
    autoplay: false,
  })

  // 音樂播放
  const isMusicPlaying = ref(false)
  const isMusicAlbumPlaying = ref(false)
  const isMusicPlaylistPlaying = ref(false)

  const resetMusicTrackData = () => {
    singleRankData.value = {
      id: '',
      autoplay: false,
    }
    isMusicPlaying.value = false
  }

  const resetMusicAlbumData = () => {
    musicAlbumData.value = {
      id: '',
      autoplay: false,
    }
    isMusicAlbumPlaying.value = false
  }

  const resetMusicPlaylistData = () => {
    musicPlaylistData.value = {
      id: '',
      autoplay: false,
    }
    isMusicPlaylistPlaying.value = false
  }

  return {
    singleRankData,
    isMusicPlaying,
    resetMusicTrackData,
    musicAlbumData,
    isMusicAlbumPlaying,
    resetMusicAlbumData,
    musicPlaylistData,
    isMusicPlaylistPlaying,
    resetMusicPlaylistData,
  }
})
