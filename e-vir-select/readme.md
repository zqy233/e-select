# e-vir-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 兼容

只支持h5，因为小程序或手机端性能远不如浏览器，存在滚动过快，dom来不及加载的白屏现象，最终思考过后，我觉得暂时是无法解决这样的白屏问题的

最终，本组件只用于支持h5

## 主要功能

- v-model 绑定
- 虚拟滚动，支持上万条数据，只支持h5 
- 默认开启搜索模式，输入或删除进行过滤搜索
- 高亮已选择的选项，下次打开自动滚动至，上万条数据也支持
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
      default() {
        return {
          value: "value",
          text: "text",
          disabled: "disabled"
        }
      }
    },
    // 占位
    placeholder: {
      type: String,
      default: "请选择"
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
    // 是否整体禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 每条数据的高度，注意注意，只支持px，修改每条数据的css高度后，才需要改变这个值
    itemSize: {
      type: Number,
      default: 40
    },
    // 启动搜索模式
    search: {
      type: Boolean,
      default: true
    }
```

## 事件

`change` 返回选中选项的对象

## 用法

```html
<template>
  <view>
    <!-- 不传width则宽度填满父元素  -->
    <e-vir-select v-model="value1" :options="options1" disabled></e-vir-select>
    <e-vir-select
      v-model="value1"
      :options="options1"
      @change="change1"
      placeholder="选择选项"
      :search="false"
    ></e-vir-select>

    <e-vir-select v-model="value2" :options="options2" disabled width="400rpx"></e-vir-select>
    <e-vir-select
      v-model="value2"
      :options="options2"
      @change="change2"
      :props="props2"
      placeholder="选择选项"
      width="400rpx"
      clear
    ></e-vir-select>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value1: "Shenzhen50",
      value2: "Shenzhen6000",
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
    }
  },
  mounted() {
    for (let i = 0; i < 10000; i++) {
      this.options1.push({
        text: "Shenzhen" + i,
        value: "Shenzhen" + i
      })
    }

    for (let i = 0; i < 10000; i++) {
      // 禁用指定选项
      if (i === 5999 || i === 6001) {
        this.options2.push({
          label: "Shenzhen" + i,
          data: "Shenzhen" + i,
          noallowed: true
        })
      } else {
        this.options2.push({
          label: "Shenzhen" + i,
          data: "Shenzhen" + i
        })
      }
    }
  }
}
</script>
```
