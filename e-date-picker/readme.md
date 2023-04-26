# e-date-picker

基于官方`uni-datetime-picker`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 功能

- 适用于宽度较大页面的日期选择组件

## 属性

```js
/** 年year、年月month、年月日date */
type: {
  type: String,
  default: "date"
},
/** 占位文本 */
placeholder: {
  type: String,
  default: "选择日期"
},
/** 是否禁用 */
disabled: {
  type: Boolean,
  default: false
},
/** 是否显示清除图标 */
clearIcon: {
  type: Boolean,
  default: true
}
```

## 用法

```html
<template>
  <view class="content">
    <e-date-picker
      v-model="year"
      placeholder="请选择年"
      type="year" />
    <e-date-picker
      v-model="month"
      type="month"
      placeholder="请选择月" />
    <e-date-picker
      v-model="date"
      type="date" />
    <e-date-picker
      v-model="date"
      type="date"
      disabled />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        year: '',
        month: '',
        date: '',
      };
    },
  };
</script>
<style>
  .content {
    margin: 0 auto;
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>
```
