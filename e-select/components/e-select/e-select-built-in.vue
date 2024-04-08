<template>
  <view
    class="e-select-box"
    :style="{ width: width, minWidth: minWidth }">
    <view
      class="e-select"
      :class="{ 'e-select-disabled': disabled }">
      <view
        class="e-select-input-box"
        @click="toggleSelector">
        <!-- 微信小程序input组件在部分安卓机型上会出现文字重影，placeholder抖动问题，2019年时微信小程序就有这个问题，一直没修复，估计短时间内也别指望修复了 -->
        <input
          class="e-select-input-text"
          :placeholder="placeholder"
          placeholder-class="e-select-input-placeholder"
          v-model="currentData"
          @input="filter"
          v-if="search && !disabled" />
        <view
          class="e-select-input-text"
          :class="{
            'e-select-input-placeholder': !(currentData || currentData === 0),
          }"
          v-else>
          {{ currentData || currentData === 0 ? currentData : placeholder }}
        </view>
        <!-- 清空图标，用一个更大的盒子包裹图标,便于点击 -->
        <view
          class="e-select-icon"
          @click.stop="clearVal"
          v-if="currentData && clearable && !disabled">
          <uni-icons
            type="clear"
            color="#e1e1e1"
            size="16"></uni-icons>
        </view>
        <!-- 箭头图标，同上 -->
        <view
          class="e-select-icon"
          @click.stop="toggleSelector"
          v-else>
          <uni-icons
            size="16"
            color="#6A6A6A"
            type="top"
            class="arrowAnimation"
            :class="showSelector ? 'top' : 'bottom'"></uni-icons>
        </view>
      </view>
      <!-- 全屏遮罩-->
      <view
        class="e-select--mask"
        v-if="showSelector"
        @click.stop="toggleSelector" />
      <!-- 选项列表 这里用v-show是因为微信小程序会报警告 [Component] slot "" is not found，v-if会导致开发工具不能正确识别到slot -->
      <!-- https://developers.weixin.qq.com/community/minihome/doc/000c8295730700d1cd7c81b9656c00 -->
      <view
        class="e-select-selector"
        :style="
          position === 'top'
            ? 'bottom: calc(0px + 42px)'
            : 'top: calc(100% + 12px)'
        "
        v-show="showSelector">
        <!-- 三角小箭头 -->
        <view
          :class="
            position === 'top' ? 'e-popper-arrow-bottom' : 'e-popper-arrow'
          "></view>
        <scroll-view
          scroll-y="true"
          :scroll-top="scrollTop"
          class="e-select-selector-scroll"
          :style="{ maxHeight: maxHeight }"
          :scroll-into-view="scrollToId"
          :scroll-with-animation="scrollWithAnimation"
          v-if="showSelector">
          <view
            class="e-select-selector-empty"
            v-if="currentOptions.length === 0">
            <text>{{ emptyTips }}</text>
          </view>
          <!-- 非空,渲染选项列表 -->
          <view
            v-else
            class="e-select-selector-item"
            :class="[
              { highlight: currentData == item[props.text] },
              {
                'e-select-selector-item-disabled': item[props.disabled],
              },
            ]"
            v-for="(item, index) in currentOptions"
            :key="index"
            @click="change(item, index)">
            <view
              id="scrollToId"
              v-if="currentData == item[props.text]"></view>
            <text>{{ item[props.text] }}</text>
          </view>
        </scroll-view>
        <slot />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'e-select',
  data() {
    return {
      // 是否显示下拉选择列表
      showSelector: false,
      // 当前选项列表
      currentOptions: [],
      // 过滤后的选项列表
      filterOptions: [],
      // 当前值
      currentData: '',
      // 滚动高度
      scrollTop: 0,
      // 滚动至的id
      scrollToId: 'scrollToId',
      // 滚动动画
      scrollWithAnimation: false,
    };
  },
  props: {
    // vue2 v-model传值方式
    value: {
      type: [String, Number],
      default: '',
    },
    // vue3 v-model传值方式
    modelValue: {
      type: [String, Number],
      default: '',
    },
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
      default: 'bottom',
    },
    // 分页每页条数
    pageSize: {
      type: Number,
      default: 0,
    },
    // 分页当前页数
    pageIndex: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    options: {
      handler(val) {
        this.filterOptions = val.slice();
        this.initOptions();
        this.initData();
      },
      immediate: true,
      deep: true,
    },
    modelValue: {
      handler() {
        this.initData();
      },
      immediate: true,
    },
    value: {
      handler() {
        this.initData();
      },
      immediate: true,
    },
    pageSize() {
      this.initOptions();
    },
    pageIndex() {
      this.initOptions();
    },
  },
  methods: {
    /** 处理数据，此函数用于兼容vue2 vue3 */
    initData() {
      this.currentData = '';
      // vue2
      if (this.value || this.value === 0) {
        for (let i = 0; i < this.options.length; i++) {
          const item = this.options[i];
          if (item[this.props.value] === this.value) {
            this.currentData = item[this.props.text];
            this.$emit('getText', this.currentData);
            // 如果分页，初始化分页当前页数
            if (this.pageSize && this.pageIndex) {
              this.$emit('update:pageIndex', Math.floor(i / this.pageSize) + 1);
            }
            return;
          }
        }
      }
      // vue3
      else if (this.modelValue || this.modelValue === 0) {
        for (let i = 0; i < this.options.length; i++) {
          const item = this.options[i];
          if (item[this.props.value] === this.modelValue) {
            this.currentData = item[this.props.text];
            this.$emit('getText', this.currentData);
            if (this.pageSize && this.pageIndex) {
              this.$emit('update:pageIndex', Math.floor(i / this.pageSize) + 1);
            }
            return;
          }
        }
      }
    },
    /** 初始化选项列表 */
    initOptions() {
      // 设置分页情况下列表
      if (this.pageSize && this.pageIndex) {
        this.currentOptions = this.filterOptions.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize
        );
      } else {
        this.currentOptions = this.filterOptions;
      }
      // scrollTop变化，才能触发滚动顶部，再低如0.01则不能触发，真神奇
      this.scrollTop = 0.1;
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
    /** 过滤选项列表，会自动回到顶部 */
    filter() {
      // 回到分页第一页
      this.$emit('update:pageIndex', 1);
      this.$emit('getText', this.currentData);
      if (this.currentData) {
        this.filterOptions = this.options.filter((item) => {
          return item[this.props.text].indexOf(this.currentData) > -1;
        });
        this.$emit('update:total', this.filterOptions.length);
      }
      // 等待update:pageIndex事件执行完成
      setTimeout(() => {
        this.initOptions();
      }, 0);
    },
    /** 改变值 */
    change(item, index) {
      if (item[this.props.disabled]) return;
      const data = {
        index,
        ...item,
      };
      this.$emit('change', data);
      this.emit(data);
      this.toggleSelector();
    },
    /** 传递父组件值 */
    emit(item) {
      this.$emit('input', item[this.props.value]);
      this.$emit('update:modelValue', item[this.props.value]);
    },
    /** 清空值 */
    clearVal() {
      this.$emit('change', 'clear');
      this.$emit('input', '');
      this.$emit('update:modelValue', '');
    },
    /** 切换下拉显示 */
    toggleSelector() {
      if (this.disabled) return;
      this.showSelector = !this.showSelector;
      if (this.showSelector) {
        // 设计理念：只在filter时触发滚动动画，因为每次打开就触发，用户体验不好
        if (this.animation) {
          setTimeout(() => {
            // 开启滚动动画
            this.scrollWithAnimation = true;
          }, 100);
        }
      } else {
        // 关闭时重新初始化
        this.filterOptions = this.options.slice();
        this.initData();
        this.initOptions();
        this.$emit('update:total', this.options.length);
        this.scrollWithAnimation = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.e-select-box {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.e-select {
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  user-select: none;
  position: relative;
  border: 1px solid #dcdfe6;
}

.e-select-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.e-select-input-box {
  width: 100%;
  padding: 0px 20rpx;
  min-height: 34px;
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;

  .e-select-input-text {
    color: #303030;
    width: 100%;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
    font-size: 28rpx;
  }

  .e-select-input-placeholder {
    font-size: 28rpx;
    color: #999999;
  }

  .e-select-icon {
    width: 50px;
    padding-right: 3px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .arrowAnimation {
    transition: transform 0.3s;
  }

  .top {
    transform: rotateZ(0deg);
  }

  .bottom {
    transform: rotateZ(180deg);
  }
}

.e-select--mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
}

.e-select-selector {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 4px 2px;
  transition: all 1s;

  .e-select-selector-scroll {
    box-sizing: border-box;

    .e-select-selector-empty,
    .e-select-selector-item {
      display: flex;
      cursor: pointer;
      line-height: 35rpx;
      font-size: 28rpx;
      text-align: left;
      padding: 15rpx 10px;
    }

    .e-select-selector-item:hover {
      background-color: #f9f9f9;
    }

    .e-select-selector-empty:last-child,
    .e-select-selector-item:last-child {
      border-bottom: none;
    }

    .e-select-selector-item-disabled {
      color: #b1b1b1;
      cursor: not-allowed;
    }

    .highlight {
      color: #409eff;
      font-weight: bold;
      background-color: #f5f7fa;
      border-radius: 3px;
    }
  }
}

.e-popper-arrow,
.e-popper-arrow::after,
.e-popper-arrow-bottom,
.e-popper-arrow-bottom::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  left: 50%;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
}

.e-popper-arrow {
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}

.e-popper-arrow::after {
  content: ' ';
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}

.e-popper-arrow-bottom {
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  margin-right: 3px;
  border-bottom-width: 0;
  border-top-color: #ebeef5;
}

.e-popper-arrow-bottom::after {
  content: ' ';
  bottom: 1px;
  margin-left: -6px;
  border-bottom-width: 0;
  border-top-color: #fff;
}

/* 设置定位元素的位置 */
#scrollToId {
  margin-top: -15rpx;
}
</style>
