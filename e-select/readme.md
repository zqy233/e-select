# e-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 平台兼容性

以下平台个人测试无误：vue2 vue3 微信小程序 安卓app

## 主要功能

- v-model 绑定
- 内置插槽，大数据量的话可以搭配第三方分页组件一起使用
- 默认开启搜索模式，输入或删除进行选项过滤搜索，搜索开启滚动动画
- 高亮已选择的选项，下次打开自动滚动至
- 可定义选项列表数据格式
- 可清除
- 支持禁用整个组件，或者禁用单独选项
- 自适应填满父元素宽度，也可传 width 来固定宽度

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
      default: function() {
        return {
          text: "text", // 文本
          value: "value", // 值
          disabled: "disabled" // 禁用
        }
      }
    },
    // 输入框空值文本
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 选项空值文本
    emptyTips: {
      type: String,
      default: "暂无选项"
    },
    // 宽度
    width: {
      type: String,
      default: "100%"
    },
    // 最小宽度
    minWidth: {
      type: String,
      default: "120rpx"
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
    },
    // 开启搜索
    search: {
      type: Boolean,
      default: true
    },
    // 搜索开启滚动动画
    animation: {
      type: Boolean,
      default: true
    }
```

## 事件

`change` 返回选中选项的对象

## 用法与示例

```html
<template>
  <view>
    <view style="padding: 5px 15px;">值：{{ value1 }}</view>
    <view style="padding: 0px 15px;">基础用法（默认宽度100%）</view>
    <e-select
      v-model="value1"
      :options="options1"
      @change="change1"
    ></e-select>
    <view style="padding: 0px 15px;">设置固定宽度</view>
    <e-select
      v-model="value1"
      :options="options1"
      @change="change1"
      width="400rpx"
    ></e-select>
    <view style="padding: 0px 15px;">可清除</view>
    <e-select
      v-model="value1"
      :options="options1"
      @change="change1"
      clear
    ></e-select>
    <view style="padding: 0px 15px;">禁用</view>
    <e-select
      v-model="value1"
      :options="options1"
      @change="change1"
      disabled
    ></e-select>
    <view style="padding: 0px 15px;">关闭搜索过滤</view>
    <e-select
      v-model="value1"
      :options="options1"
      @change="change1"
      :search="false"
    ></e-select>
    <view style="padding: 0px 15px;">设置placeholder</view>
    <e-select
      v-model="value2"
      :options="options1"
      @change="change1"
      placeholder="选择选项"
    ></e-select>
    <view style="padding: 0px 15px;">设置数据格式</view>
    <e-select
      v-model="value2"
      :options="options2"
      :props="props2"
      @change="change2"
    ></e-select>
    <view style="padding: 0px 15px;">分页</view>
    <e-select v-model="value1" :options="options1" @change="change1">
      <!-- 内置插槽，可以搭配官方uni-ui的分页组件使用 -->
      <uni-pagination
        show-icon="true"
        :total="1000"
        :pageSize="100"
        :current="2"
        @change="page1"
      ></uni-pagination>
    </e-select>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value1: 50,
      value2: "",
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
        disabled: "noallowed"
      },
      options1: [],
      options2: []
    }
  },
  methods: {
    change1(item) {
      console.log(item)
    },
    change2(item) {
      console.log(item)
    },
    page1(item) {
      console.log(item)
    }
  },
  mounted() {
    for (let i = 0; i < 100; i++) {
      this.options1.push({
        text: "Shenzhen" + i,
        value: i
      })
    }
    for (let i = 0; i < 100; i++) {
      // 禁用指定选项
      if (i === 59 || i === 61) {
        this.options2.push({
          label: "Shenzhen" + i,
          data: i,
          noallowed: true
        })
      } else {
        this.options2.push({
          label: "Shenzhen" + i,
          data: i
        })
      }
    }
  }
}
</script>
```
