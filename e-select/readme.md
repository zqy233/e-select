# e-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则组件内部图标无法正常显示

## 平台兼容性

以下平台个人测试无误：vue2 vue3 h5 微信小程序 安卓

## 主要功能

- v-model 绑定，设置默认选项的话，更改 v-model 绑定的值即可
- 默认填满父元素宽度，也可传 width 来固定宽度
- 高亮已选择的选项，下次打开自动滚动至
- 默认开启搜索模式，输入或删除进行选项过滤搜索，搜索开启滚动动画
- 可通过 props 属性，定义选项列表数据格式
- 选项列表悬浮框支持方向设置（top/bottom），默认向下（bottom）
- 可清除
- 支持禁用整个组件，或者禁用单独选项
- 内置 uni-ui 的分页组件，大数据量的话可以选择开启分页。用户只需要传入分页每页条数 pageSize，如果大于 0 则开启分页。组件内部根据 pageSize 切割传入的大数据量选项列表，生成分页数量并根据 v-model 值检索判断当前页数，用户搜索时会自动更改分页数量。

## 属性

```js
    // 选项列表
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    // 选项列表自定义数据格式
    props: {
      type: Object,
      default: () => {
        return {
          text: "text",
          value: "value",
          disabled: "disabled",
        };
      },
    },
    // 占位文本
    placeholder: {
      type: String,
      default: "请选择",
    },
    // 输入框宽度
    width: {
      type: String,
      default: "100%",
    },
    // 输入框最小宽度
    minWidth: {
      type: String,
      default: "120rpx",
    },
    // 选项列表悬浮框最大高度
    maxHeight: {
      type: String,
      default: "160px",
    },
    // 选项列表空值占位
    emptyTips: {
      type: String,
      default: "暂无选项",
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否开启搜索
    search: {
      type: Boolean,
      default: true,
    },
    // 是否开启搜索的滚动动画
    animation: {
      type: Boolean,
      default: true,
    },
    // 悬浮框位置top/bottom
    position: {
      type: String,
      default: "bottom",
    },
    // 分页每页条数，如果大于0则开启分页
    pageSize: {
      type: Number,
      default: 0,
    },
```

## 事件

`change` 用户选择选项，则返回选中选项的对象，用户点击清空，则返回一个空对象

`getText` 实时获取输入框中显示的值，用户输入与选择选项后都会触发该事件，所以能保证实时性

`changePage` 开启分页后（传入 pageSize 且大于 0），用户更改分页当前页时触发

## 用法示例（强烈建议复制粘贴到本地页面运行）

```html
<template>
  <view class="demo">
    <view class="demo-value">v-model绑定值1：{{ value1 }}</view>
    <view class="form-item">
      <view class="item-label">基础用法</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">设置固定宽度</view>
      <view class="item-value special">
        <e-select
          v-model="value1"
          :options="options1"
          width="610rpx"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">可清除</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          clearable
          @change="change"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">禁用</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          disabled></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">关闭搜索过滤</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          :search="false"
          @change="change"></e-select>
      </view>
    </view>
    <view class="demo-value">v-model绑定值2：{{ value2 }}</view>
    <view class="form-item">
      <view class="item-label">设置悬浮框方向为上方</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          :props="props2"
          @change="change"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">设置数据格式</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          :props="props2"
          placeholder="选择选项"
          @change="change"></e-select>
      </view>
    </view>

    <view class="form-item">
      <view class="item-label">@getText获取输入框文本</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          :props="props2"
          @getText="getText"
          @change="change"></e-select>
      </view>
    </view>
    <view class="demo-value">v-model绑定值3：{{ value3 }}</view>
    <view class="form-item">
      <view class="item-label">前端分页</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value3"
          :options="options3"
          :pageSize="pageSize"
          @change="change"
          @changePage="changePage"></e-select>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        value1: 50,
        // 默认选项数据结构，使用默认可以不传
        // props1: {
        //   text: "text",
        //   value: "value",
        //   disabled: "disabled"
        // },
        options1: [],
        value2: 50,
        // 更改选项数据结构
        props2: {
          text: 'label',
          value: 'data',
          disabled: 'noallowed',
        },
        options2: [],
        value3: 500,
        options3: [],
        pageSize: 10,
      };
    },
    methods: {
      // 获取输入框中值
      getText(data) {
        console.log(data);
      },
      // 获取选择选项值
      change(data) {
        console.log(data);
      },
      // 获取分页更改值
      changePage(data) {
        console.log(data);
      },
    },
    mounted() {
      for (let i = 0; i < 100; i++) {
        this.options1.push({
          text: '名称' + i,
          value: i,
          a: 'a',
          b: 'b',
        });
      }
      for (let i = 0; i < 100; i++) {
        // 禁用指定选项
        if (i === 59 || i === 61) {
          this.options2.push({
            label: '数据' + i,
            data: i,
            noallowed: true,
          });
        } else {
          this.options2.push({
            label: '数据' + i,
            data: i,
          });
        }
      }
      for (let i = 0; i < 1000; i++) {
        this.options3.push({
          text: '分页数据' + i,
          value: i,
        });
      }
    },
  };
</script>
<style
  lang="scss"
  scoped>
  .demo {
    margin: 20px;
    padding: 1px 10px 20px 10px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  .demo-value {
    margin-top: 20px;
    margin-bottom: 5px;
    padding-left: 20rpx;
  }

  .form-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: #333333;
    border-bottom: 1px solid #dddddd;
    font-size: 28rpx;

    .item-label {
      display: flex;
      align-items: center;
      width: 40%;
      min-height: 80rpx;
      padding: 5rpx 20rpx 5rpx 20rpx;
    }

    .item-value {
      display: flex;
      align-items: center;
      flex: 1;
      min-height: 80rpx;
      padding: 5rpx 20rpx 5rpx 20rpx;
    }

    .special {
      display: flex;
      justify-content: center;
    }
  }
</style>
```
