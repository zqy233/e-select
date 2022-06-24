# e-datetime-picker

## 功能

- 支持微信小程序 pc 端滚动选择列表

## 用法

```vue
<template>
  <view class="content">
    {{ date }}
    <e-date-picker v-model="date"></e-date-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      date: ""
    }
  }
}
</script>
```
