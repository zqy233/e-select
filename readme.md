# e-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 功能

- 自定义placeholder
- 自定义宽度
- 高亮已选择的选项
- 自动滚动至已选择的选项

## 属性

```js
 // 选项列表
    options: {
      type: Array,
      default() {
        return []
      }
    },
    // 占位
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 宽度
    width: {
      type: [String, Number],
      default: "200"
    },
    // 空值占位
    emptyTips: {
      type: String,
      default: "暂无选项"
    },
    // 是否可清除,显示清除icon
    clear: {
      type: Boolean,
      default: false
    }
```

## 事件

`change` 返回选中选项的value值

## 用法

```js
<template>
  <view class="content">
    <e-select
      v-model="value"
      :options="options"
      @change="change"
      width="210"
      placeholder="选择选项"
    ></e-select>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value: 15,
      options: []
    }
  },
  methods: {
    change(data) {
      console.log("data", data)
    }
  },
  mounted() {
    this.options = [
      { value: 0, text: "1" },
      { value: 1, text: "2" },
      { value: 2, text: "3" },
      { value: 3, text: "3" },
      { value: 4, text: "4" },
      { value: 5, text: "5" },
      { value: 6, text: "6" },
      { value: 7, text: "7" },
      { value: 8, text: "8" },
      { value: 9, text: "9" },
      { value: 10, text: "10" },
      { value: 11, text: "11" },
      { value: 12, text: "12" },
      { value: 13, text: "13" },
      { value: 14, text: "14" },
      { value: 15, text: "15" },
      { value: 16, text: "16" },
      { value: 17, text: "17" },
      { value: 18, text: "18" },
      { value: 19, text: "19" }
    ]
  }
}
</script>
<style>
.content {
  margin: 0 auto;
  width: 200px;
}
</style>
```

