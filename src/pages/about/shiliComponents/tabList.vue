<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'tab分页列表',
  },
}
</route>

<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    auto-show-back-to-top
    auto-show-system-loading
    default-page-size="20"
    bg-color="#F5F7F9"
  >
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <view class="grid grid-cols-3 h-46 bg-#fff">
        <view
          class="center"
          :class="params.type === 1 ? 'text-#3875C5' : 'text-#333'"
          @click="handleChnageType(1)"
        >
          分类1
        </view>
        <view
          class="center"
          :class="params.type === 2 ? 'text-#3875C5' : 'text-#333'"
          @click="handleChnageType(2)"
        >
          分类2
        </view>
        <view
          class="center"
          :class="params.type === 3 ? 'text-#3875C5' : 'text-#333'"
          @click="handleChnageType(3)"
        >
          分类3
        </view>
      </view>
    </template>
    <view class="bg-#F5F7F9 py-8 px-16 h-full">
      <view class="" v-for="(item, index) in dataList" :key="index">
        <view class="col-center h-54 px-16 bg-#fff">{{ item.name }}</view>
      </view>
    </view>
    <template #empty>
      <view class="text-#666">暂无数据</view>
    </template>
  </z-paging>
</template>

<script setup>
import { ref } from 'vue'
const paging = ref(null)
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([])

const params = ref({
  type: 1,
})
function getList({ type, pageNo, pageSize }) {
  return new Promise((resolve, reject) => {
    const list = Array.from({ length: pageNo * pageSize }, (_, i) => {
      return {
        type,
        name: '分类' + type,
        text: '测试文字',
      }
    })
    setTimeout(() => {
      if (pageNo === 3 || type === 2) {
        resolve([])
      }
      resolve(list)
    }, 1000)
  })
}

function handleChnageType(type) {
  params.value.type = type
  nextTick(() => {
    paging.value.reload()
  })
}

// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (pageNo, pageSize) => {
  // 此处请求仅为演示，请替换为自己项目中的请求
  getList({ ...params.value, pageNo, pageSize })
    .then((res) => {
      // 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
      paging.value.complete(res)
    })
    .catch((res) => {
      // 如果请求失败写paging.value.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
      paging.value.complete(false)
    })
}
</script>

<style lang="scss" scoped>
//
</style>
