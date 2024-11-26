<template>
  <footer class="footer py-lg-13 py-9 bg-gray-300">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div
            class="d-flex flex-md-row flex-column justify-content-md-between align-items-md-center px-0 mb-9 mb-md-3"
          >
            <h1>
              <RouterLink
                class="fs-6 fs-md-4 p-3 ps-0 font-poppins link-light"
                to="/"
                >KK music
                <i class="bi bi-music-note"></i>
              </RouterLink>
            </h1>
            <ul class="list-unstyled d-flex gap-4 flex-md-row flex-column">
              <li>
                <RouterLink
                  to="/ranking"
                  class="link-light link-custom fs-8 fw-medium p-lg-3 p-sm-2 ps-sm-0"
                >
                  排行榜
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  class="link-light link-custom fs-8 fw-medium p-lg-3 p-sm-2 ps-sm-0"
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
              <li>
                <RouterLink
                  class="link-light link-custom fs-8 fw-medium p-lg-3 p-sm-2 ps-sm-0"
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
          </div>
        </div>

        <div class="col-12">
          <div
            class="d-flex justify-content-md-between align-items-md-center flex-md-row flex-column-reverse"
          >
            <div>
              <p class="fs-8 text-gray-tint">
                copyright © 2024 KK music All Rights Reserved. <br />
                (本網站僅限個人作品使用，不使用於商業用途)
              </p>
              <p class="fs-8 text-gray-tint">
                Icons created by
                <a
                  target="_blank"
                  href="https://www.flaticon.com/free-icons/404-error"
                  class="link-light"
                  title="404 error icons"
                >
                  monkik - Flaticon
                </a>
              </p>
              <p class="fs-8 text-gray-tint">
                <a href="https://icons8.com/icon/12783/music" class="link-light"
                  >Music</a
                >
                icon by
                <a target="_blank" href="https://icons8.com" class="link-light"
                  >Icons8</a
                >
              </p>
            </div>
            <ul
              class="social-media list-unstyled d-flex flex-md-row gap-3 mb-7 mb-md-0 pe-md-2"
            >
              <li>
                <a href="#" class="link-light">
                  <i class="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#" class="link-light">
                  <i class="bi bi-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" class="link-light">
                  <i class="bi bi-line"></i>
                </a>
              </li>
              <li>
                <a href="#" class="link-light">
                  <i class="bi bi-youtube"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  .social-media {
    a {
      width: 40px;
      height: 40px;
      border: 1px solid #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      i {
        padding-left: 1px;
        padding-top: 1px;
      }
      @media (min-width: 992px) {
        width: 45px;
        height: 45px;
        font-size: 20px;
        i {
          padding-left: 2px;
          padding-top: 2px;
        }
      }
    }
  }
}
</style>
