<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view>
    <wd-swiper
      :list="swiperList"
      autoplay
      v-model:current="current"
      @click="handleClick"
      @change="onChange"
    ></wd-swiper>
    <view class="p-16 text-14 text-#666 flex flex-col gap-10">
      <view>
        <view class="leading-20 mb-5">按钮</view>
        <wd-button @click="handleMessage">主要按钮</wd-button>
      </view>
      <view>
        <view class="leading-20 mb-5">图标</view>
        <view class="flex gap-10">
          <text class="i-carbon-sun" />
          <text class="i-carbon-4k-filled" />
          <text class="i-carbon-aperture" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useMessage } from 'wot-design-uni'

const message = useMessage()
defineOptions({
  name: 'Home',
})

const current = ref<number>(0)

const swiperList = ref([
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
])
function handleClick(e) {
  console.log(e)
}
function onChange(e) {
  console.log(e)
}

function handleMessage() {
  message.alert('hello')
}
</script>

<style></style>
