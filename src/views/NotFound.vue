<script setup>
import HeaderView from './layout/HeaderView.vue';
import FooterView from './layout/FooterView.vue';
</script>

<template>
  <div class="wrapper">
    <HeaderView />

    <main>
      <div class="error-page py-lg-10 py-8">
        <div class="container">
          <div class="error-img d-flex justify-content-center mb-2">
            <img src="../assets/images/error-404.png" alt="404頁面" />
          </div>
          <h2 class="fs-lg-1 fs-md-2 fs-4 text-center mb-5 mb-md-8">
            喔!這個頁面沒有任何內容
          </h2>
          <div class="row d-flex justify-content-center pt-5 pt-md-10">
            <div class="col-6 col-md-4">
              <ul class="list-unstyled d-flex flex-column gap-3">
                <li class="w-100">
                  <RouterLink to="/" class="btn btn-info w-100">
                    回到首頁
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink to="/ranking" class="btn btn-info w-100">
                    看看排行榜
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink
                    class="btn btn-info w-100"
                    :to="{
                      name: 'hotPlayList',
                      params: {
                        hotPlayListCategoryId: 'DZrC8m29ciOFY2JAm3',
                      },
                    }"
                  >
                    聽聽熱門歌曲
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterView />
  </div>
</template>
