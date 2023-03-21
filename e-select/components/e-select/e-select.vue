<template>
  <view
    class="e-stat__select"
    :style="{ width: width, minWidth: minWidth }">
    <!-- 主体区域 -->
    <view class="e-select-main">
      <view
        class="e-select"
        :class="{ 'e-select-disabled': disabled }">
        <view
          class="e-select__input-box"
          @click="toggleSelector">
          <!-- 微信小程序input组件在部分安卓机型上会出现文字重影，placeholder抖动问题，2019年时微信小程序就有这个问题，一直没修复，估计短时间内也别指望修复了 -->
          <input
            class="e-select__input-text"
            :placeholder="placeholder"
            v-model="currentData"
            @input="filter"
            v-if="search && !disabled" />
          <view
            class="e-select__input-text"
            v-else>
            {{ currentData || currentData === 0 ? currentData : placeholder }}
          </view>
          <!-- 用一个更大的盒子包裹图标,便于点击 -->
          <view
            class="e-select-icon"
            @click.stop="clearVal"
            v-if="currentData && clear && !disabled">
            <uni-icons
              type="clear"
              color="#e1e1e1"
              size="18"></uni-icons>
          </view>
          <view
            class="e-select-icon"
            @click.stop="toggleSelector"
            v-else>
            <uni-icons
              size="14"
              color="#999"
              type="top"
              class="arrowAnimation"
              :class="showSelector ? 'top' : 'bottom'"></uni-icons>
          </view>
        </view>
        <!-- 全屏遮罩-->
        <view
          class="e-select--mask"
          v-if="showSelector"
          @click="toggleSelector" />
        <!-- 选项列表 这里用v-show是因为微信小程序会报警告 [Component] slot "" is not found，v-if会导致开发工具不能正确识别到slot -->
        <!-- https://developers.weixin.qq.com/community/minihome/doc/000c8295730700d1cd7c81b9656c00 -->
        <view
          class="e-select__selector"
          v-show="showSelector">
          <!-- 三角小箭头 -->
          <view class="e-popper__arrow"></view>
          <scroll-view
            scroll-y="true"
            :scroll-top="scrollTop"
            class="e-select__selector-scroll"
            :scroll-into-view="scrollToId"
            :scroll-with-animation="scrollWithAnimation"
            v-if="showSelector">
            <view
              class="e-select__selector-empty"
              v-if="currentOptions.length === 0">
              <text>{{ emptyTips }}</text>
            </view>
            <!-- 非空,渲染选项列表 -->
            <view
              v-else
              class="e-select__selector-item"
              :class="[
                { highlight: currentData == item[props.text] },
                {
                  'e-select__selector-item-disabled': item[props.disabled],
                },
              ]"
              v-for="(item, index) in currentOptions"
              :key="index"
              @click="change(item, index)">
              <text>{{ item[props.text] }}</text>
              <view
                id="scrollToId"
                v-if="currentData == item[props.text]"></view>
            </view>
          </scroll-view>
          <slot />
        </view>
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
      // 当前选项
      currentOptions: [],
      // 当前值
      currentData: '',
      // 旧的滚动高度
      oldScrollTop: 0,
      // 最新的滚动高度
      scrollTop: 0,
      // 滚动至的id
      scrollToId: '',
      // 滚动动画
      scrollWithAnimation: false,
    };
  },
  props: {
    // 选项列表
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    // 配置选项
    props: {
      type: Object,
      default: function () {
        return {
          text: 'text',
          value: 'value',
          disabled: 'disabled',
        };
      },
    },
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
    // 占位
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 宽度
    width: {
      type: String,
      default: '100%',
    },
    // 最小宽度
    minWidth: {
      type: String,
      default: '120rpx',
    },
    // 空值占位
    emptyTips: {
      type: String,
      default: '暂无选项',
    },
    // 是否可清除
    clear: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 开启搜索
    search: {
      type: Boolean,
      default: true,
    },
    // 搜索开启滚动动画
    animation: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    options: {
      handler() {
        this.currentOptions = this.options;
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
  },
  methods: {
    /** 处理数据，此函数用于兼容vue2 vue3 */
    initData() {
      this.currentData = '';
      // vue2
      if (this.value || this.value === 0) {
        for (let item of this.options) {
          if (item[this.props.value] === this.value) {
            this.currentData = item[this.props.text];
            return;
          }
        }
      }
      // vue3
      if (this.modelValue || this.modelValue === 0) {
        for (let item of this.options) {
          if (item[this.props.value] === this.modelValue) {
            this.currentData = item[this.props.text];
            return;
          }
        }
      }
    },
    /** 过滤选项列表，会自动回到顶部 */
    filter() {
      if (this.currentData) {
        this.currentOptions = this.options.filter((item) => {
          return item[this.props.text].indexOf(this.currentData) > -1;
        });
      } else {
        this.currentOptions = this.options;
      }
      // scrollTop变化，才能触发滚动顶部
      this.scrollTop = 1;
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
    /** 改变值 */
    change(item, index) {
      if (item[this.props.disabled]) return;
      const data = {
        [this.props.text]: item[this.props.text],
        [this.props.value]: item[this.props.value],
        index,
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
        this.currentOptions = this.options;
        // scrollToId变化，才能触发scroll-to-view的滚动
        this.scrollToId = '';
        this.$nextTick(() => {
          this.scrollToId = 'scrollToId';
          // 设计理念：只在filter时触发滚动动画，因为每次打开就触发，用户体验不好
          if (this.animation) {
            setTimeout(() => {
              // 开启滚动动画
              this.scrollWithAnimation = true;
            }, 100);
          }
        });
      } else {
        // 关闭时关闭动画
        this.scrollWithAnimation = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.e-stat__select {
  display: flex;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.e-select-main {
  width: 100%;
}
.e-select-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}
.e-select {
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 5px;
  position: relative;
  display: flex;
  user-select: none;
  flex-direction: row;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-bottom: solid 1px #dddddd;
  .e-select__input-box {
    width: 100%;
    min-height: 34px;
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    .e-select-icon {
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: center;
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
    .e-select__input-text {
      color: #303030;
      padding-left: 7px;
      width: 100%;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .e-select__input-placeholder {
      padding-left: 7px;
      color: #666;
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
  .e-select__selector {
    box-sizing: border-box;
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 999;
    padding: 4px 4px;
    transition: all 2s;
    .e-popper__arrow,
    .e-popper__arrow::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      left: 50%;
      border-color: transparent;
      border-style: solid;
      border-width: 6px;
    }
    .e-popper__arrow {
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      margin-right: 3px;
      border-top-width: 0;
      border-bottom-color: #ebeef5;
    }
    .e-popper__arrow::after {
      content: ' ';
      top: 1px;
      margin-left: -6px;
      border-top-width: 0;
      border-bottom-color: #fff;
    }
    .e-select__selector-scroll {
      max-height: 200px;
      box-sizing: border-box;
      .e-select__selector-empty,
      .e-select__selector-item {
        display: flex;
        cursor: pointer;
        line-height: 34px;
        font-size: 14px;
        text-align: center;
        padding: 0px 10px;
      }
      .e-select__selector-item:hover {
        background-color: #f9f9f9;
      }
      .e-select__selector-empty:last-child,
      .e-select__selector-item:last-child {
        border-bottom: none;
      }
      .e-select__selector-item-disabled {
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
}
</style>
