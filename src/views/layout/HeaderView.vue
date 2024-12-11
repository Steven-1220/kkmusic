<script setup>
import { Offcanvas } from 'bootstrap';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const offcanvasRef = ref(null);
const offcanvasInstance = ref(null);

const openOffcanvas = () => {
  offcanvasInstance.value.show();
};

const closeOffcanvas = () => {
  offcanvasInstance.value.hide();
};

const router = useRouter();

const searchInputData = ref('');
const isDropdownOpen = ref(false);

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const searchMusic = () => {
  if (searchInputData.value.trim() === '') {
    Swal.fire({
      icon: 'question',
      title: '想找什麼歌曲呢',
      text: '搜尋內容不能是空白',
      color: '#dc3545',
      customClass: {
        title: 'swal2-title',
        htmlContainer: 'swal2-text',
        confirmButton: 'swal2-confirm-btn',
      },
    });
    return;
  }
  router.push({
    name: 'search',
    query: {
      q: searchInputData.value,
    },
  });
};

const hotSearchData = ref(['周杰倫', 'IU', '泰勒絲', '告五人', 'twice']);

//  當點擊熱門搜尋連結，阻止 blur 的觸發
const handleDropdownMouseDown = e => {
  if (e.target.closest('.search-dropdown')) {
    e.preventDefault();
  }
};

onMounted(() => {
  offcanvasInstance.value = new Offcanvas(offcanvasRef.value, {
    backdrop: true,
  });
  document.addEventListener('mousedown', handleDropdownMouseDown);
  router.afterEach(() => {
    offcanvasInstance.value.hide();
    closeDropdown();
  });
});

onBeforeUnmount(() => {
  offcanvasInstance.value.hide();
  document.removeEventListener('mousedown', handleDropdownMouseDown);
});
</script>

<template>
  <header class="sticky-top">
    <nav class="navbar navbar-expand-xl bg-gray-300">
      <div class="container">
        <h1>
          <RouterLink class="fs-6 fs-md-4 p-3 font-poppins link-info" to="/"
            >KK music
            <i class="bi bi-music-note"></i>
          </RouterLink>
        </h1>
        <button
          class="btn d-md-none fs-5 border-0"
          type="button"
          @click="openOffcanvas"
        >
          <i class="bi bi-list"></i>
        </button>

        <div
          class="offcanvas-md offcanvas-end"
          tabindex="-1"
          ref="offcanvasRef"
        >
          <div class="offcanvas-header">
            <button
              type="button"
              class="btn border-0 ms-auto"
              @click="closeOffcanvas"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="offcanvas-body">
            <div class="d-flex flex-column flex-md-row">
              <ul class="navbar-nav flex-md-row mb-2 mb-md-0 me-auto">
                <li class="nav-item">
                  <RouterLink
                    to="/ranking"
                    class="nav-link link-light link-custom px-md-1 fs-md-7 fs-lg-6"
                  >
                    排行榜
                  </RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink
                    class="nav-link link-light link-custom px-md-1 fs-md-7 fs-lg-6"
                    :to="{
                      name: 'hotPlayList',
                      params: {
                        hotPlayListCategoryId: 'DZrC8m29ciOFY2JAm3',
                      },
                    }"
                  >
                    熱門歌曲
                  </RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink
                    class="nav-link link-light link-custom px-md-1 fs-md-7 fs-lg-6"
                    :to="{
                      name: 'releaseCategories',
                      params: {
                        categoriesId: 'KrdH2LdyUKS8z2aoxX',
                      },
                    }"
                  >
                    歌曲風格
                  </RouterLink>
                </li>
              </ul>
              <form
                class="d-md-flex align-items-center position-relative ms-lg-3 form-search"
                role="search"
                @submit.prevent="searchMusic"
              >
                <label
                  for="search"
                  class="d-flex align-items-center position-absolute bottom-0 top-0 ms-1"
                  @click="searchMusic"
                >
                  <i class="bi bi-search fs-5 fs-md-7 fs-lg-6"></i>
                </label>
                <input
                  class="form-control ps-7 fs-md-7 fs-lg-6"
                  id="search"
                  type="search"
                  placeholder="搜尋歌曲"
                  aria-label="Search"
                  v-model="searchInputData"
                  @focus="openDropdown"
                  @blur="closeDropdown"
                />
                <div
                  class="search-dropdown bg-gray-300 px-4 py-3 rounded-3"
                  v-if="isDropdownOpen"
                >
                  <h3 class="fs-md-5 fs-6 mb-2">熱門搜尋</h3>
                  <ul class="list-unstyled d-flex flex-wrap gap-3">
                    <li
                      v-for="(item, index) in hotSearchData"
                      :key="index + 'keyword'"
                    >
                      <RouterLink
                        class="badge rounded-pill text-bg-danger"
                        :to="{
                          name: 'search',
                          query: {
                            q: item,
                          },
                        }"
                      >
                        {{ item }}
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.form-search {
  position: relative;
  label {
    cursor: pointer;
  }
}
.search-dropdown {
  position: absolute;
  bottom: -152px;
  z-index: 100;
  @media (min-width: 385px) {
    bottom: -122px;
  }
  @media (min-width: 768px) {
    bottom: -206px;
  }
  @media (min-width: 992px) {
    bottom: -162px;
  }
  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 10px solid #494755;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
  }
}
</style>
