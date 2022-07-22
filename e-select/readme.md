# e-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 主要功能

- v-model绑定
- 高亮已选择的选项，下次打开自动滚动至
- 可定义选项列表数据格式
- 可清除，可禁用
- 支持禁用单独选项，或者禁用整个组件
- 自适应填满父元素宽度，也可传width来固定宽度

## 属性

```js
  // 选项列表
    options: {
      type: Array,
      default() {
        return []
      }
    },
    // 选项列表数据格式
    props: {
      type: Object,
      default: {
        text: "text",
        value: "value",
        disabled: "disabled"
      }
    },
    // 占位
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 宽度，需要设置好父元素宽度
    width: {
      type: [String],
      default: "100%"
    },
    // 最小宽度
    minWidth: {
      type: [String],
      default: "120rpx"
    },
    // 空值占位
    emptyTips: {
      type: String,
      default: "暂无选项"
    },
    // 是否可清除
    clear: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
```

## 事件

`change` 返回选中选项的文本、值、索引

## 用法

```js
<template>
  <view class="content">
    <view class="w100"></view>
    <view class="flex1">
      <!-- 不传width则宽度填满父元素  -->
      <e-select
        v-model="value1"
        :options="options1"
        @change="change1"
        placeholder="选择选项"
      ></e-select>
      <e-select
        v-model="value2"
        :options="options2"
        @change="change2"
        placeholder="选择选项"
        :props="props2"
        width="200rpx"
        clear
      ></e-select>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value1: 5,
      value2: 10,
      // 默认选项数据结构，使用默认可以不传
      // props1: {
      //   text: "text",
      //   value: "value",
      //   disabled: "disabled"
      // },
      // 更改选项数据结构
      props2: {
        text: "label",
        value: "data",
        disabled: "noallawed"
      },
      options1: [],
      options2: [],
      options3: [
        { value: 0, text: "0", disabled: true }, // 设置单独项禁用
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3", disabled: true },
        { value: 4, text: "4" },
        { value: 5, text: "5" },
        { value: 6, text: "6" },
        { value: 7, text: "7" },
        { value: 8, text: "8" },
        { value: 9, text: "9" },
        { value: 10, text: "10" }
      ],
      options4: [
        { data: 0, label: "0", noallawed: true }, // 设置单独项禁用
        { data: 1, label: "1" },
        { data: 2, label: "2" },
        { data: 3, label: "3", noallawed: true },
        { data: 4, label: "4" },
        { data: 5, label: "5" },
        { data: 6, label: "6" },
        { data: 7, label: "7" },
        { data: 8, label: "8" },
        { data: 9, label: "9" },
        { data: 10, label: "10" }
      ]
    }
  },
  methods: {
    // 值变化时触发
    change1(data) {
      console.log("值改变", data)
    },
    change2(data) {
      console.log("值改变", data)
    }
  },
  mounted() {
    this.options1 = this.options3
    // 更改数据格式后，使用新数据格式的选项列表
    this.options2 = this.options4
  }
}
</script>
<style>
.content {
  width: 100%;
  display: flex;
  background-color: pink;
}
/* 左侧固定，右侧自适应 */
.w100 {
  width: 100px;
  background-color: skyblue;
}
.flex1 {
  flex: 1;
}
</style>
```

