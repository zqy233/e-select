# e-select

基于官方`uni-data-select`组件修改

图标部分使用的是`uni-icons`组件，需要安装`uni-icons`组件，否则图标可能无法正常显示

只保留必要部分代码，并添加详细注释，方便个人再次修改

## 平台兼容性

以下平台个人测试无误：vue2 vue3 微信小程序 安卓 app

## 主要功能

- v-model 绑定，设置默认选项的话，更改 v-model 绑定的值即可
- 默认填满父元素宽度，也可传 width 来固定宽度
- 高亮已选择的选项，下次打开自动滚动至
- 默认开启搜索模式，输入或删除进行选项过滤搜索，搜索开启滚动动画
- 选项列表悬浮框支持方向设置（top/bottom），默认向下（bottom）
- 可通过 props 属性定义选项列表数据格式
- 可清除
- 支持禁用整个组件，或者禁用单独选项
- 内置插槽，大数据量的话可以搭配第三方分页组件一起使用

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
          text: 'text',
          value: 'value',
          disabled: 'disabled',
        };
      },
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 输入框宽度
    width: {
      type: String,
      default: '100%',
    },
    // 输入框最小宽度
    minWidth: {
      type: String,
      default: '120rpx',
    },
    // 选项列表悬浮框最大高度
    maxHeight: {
      type: String,
      default: '160px',
    },
    // 选项列表空值占位空值占位
    emptyTips: {
      type: String,
      default: '暂无选项',
    },
    // 是否可清空
    clear: {
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
      default: false,
    },
    // 悬浮框位置top/bottom
    position: {
      type: String,
      default: 'bottom',
    },
```

## 事件

`change` 用户选择选项，则返回选中选项的对象，用户点击清空，则返回一个空对象

`getText` 实时获取输入框中显示的值，用户输入与选择选项后都会触发该事件，所以能保证实时性

## 用法与示例

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
          @change="change1"
          width="610rpx"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">可清除</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          @change="change1"
          clear></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">禁用</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          @change="change1"
          disabled></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">关闭搜索过滤</view>
      <view class="item-value">
        <e-select
          v-model="value1"
          :options="options1"
          @change="change1"
          :search="false"></e-select>
      </view>
    </view>
    <view class="demo-value">v-model绑定值2：{{ value2 }}</view>
    <view class="form-item">
      <view class="item-label">设置数据格式</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          :props="props2"
          @change="change2"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">设置placeholder</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          @change="change2"
          :props="props2"
          placeholder="选择选项"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">获取输入框文本，而不是绑定值</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options2"
          :props="props2"
          @getText="getText"></e-select>
      </view>
    </view>
    <view class="form-item">
      <view class="item-label">分页</view>
      <view class="item-value">
        <e-select
          position="top"
          v-model="value2"
          :options="options3"
          @change="change3">
          <!-- 内置插槽，可以搭配官方uni-ui的分页组件使用 -->
          <uni-pagination
            show-icon="true"
            :total="1000"
            :pageSize="100"
            :current="current"
            @change="page"></uni-pagination>
        </e-select>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        value1: 50,
        value2: 50,
        // 默认选项数据结构，使用默认可以不传
        // props1: {
        //   text: "text",
        //   value: "value",
        //   disabled: "disabled"
        // },
        // 更改选项数据结构
        props2: {
          text: 'label',
          value: 'data',
          disabled: 'noallowed',
        },
        options1: [],
        options2: [],
        AllOptions: [],
        options3: [],
        current: 1,
      };
    },
    methods: {
      getText(value) {
        console.log(value);
      },
      change1(item) {
        console.log(item);
      },
      change2(item) {
        console.log(item);
      },
      change3(item) {
        console.log(item);
      },
      page(item) {
        console.log(item);
        this.current = item.current;
        this.options3 = this.AllOptions.slice(
          (this.current - 1) * 100,
          this.current * 100
        );
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
        this.AllOptions.push({
          text: '分页数据' + i,
          value: i,
        });
      }
      this.options3 = this.AllOptions.slice(0, this.current * 100);
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
