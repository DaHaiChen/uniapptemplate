<route lang="json5">
{
  style: {
    navigationBarTitleText: '关于',
  },
}
</route>

<template>
  <view class="p-16">
    <view class="h-40 center">常用组件</view>
    <view class="grid grid-cols-2 gap-20">
      <wd-button v-for="item in componentsList" :key="item.name" @click="handleToUrl(item.url)">
        {{ item.name }}
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { routerTo } from '@/utils/index'
const componentsList = ref([
  {
    name: 'tab分页列表',
    url: '/pages/about/shiliComponents/tabList',
  },
  {
    name: '上传图片',
    url: '/pages/about/shiliComponents/upload',
  },
  {
    name: '微信登录',
    url: '/pages/about/shiliComponents/login',
  },
  {
    name: '拖拽按钮',
    url: '/pages/about/shiliComponents/dragButton',
  },
])

function handleToUrl(url: string) {
  routerTo(url)
}
</script>

<style lang="scss" scoped></style>
