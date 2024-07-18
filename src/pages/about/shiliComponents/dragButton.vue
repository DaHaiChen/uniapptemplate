<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '拖拽按钮',
  },
}
</route>

<template>
  <view class="h-100vh relative">
    <DragoButton :size="[96, 96]" :x-edge="8">
      <view
        class="h-48 w-48 flex items-center justify-center b-1 b-white rounded-full b-solid shadow-[0px_1_4px_0px_rgba(0,0,0,0.25)]"
        style="background: linear-gradient(80deg, #3a73c2 0%, #3a73c2 100%)"
      >
        <wd-icon name="add" custom-style="color: #FFFFFF;font-size: 46rpx;font-weight: bold" />
      </view>
    </DragoButton>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
//
</style>
