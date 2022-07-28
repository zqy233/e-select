<template>
  <view class="e-stat__select" :style="{ width: width, minWidth: minWidth }">
    <!-- 主体区域 -->
    <view class="e-select-main">
      <!-- 全屏遮罩-->
      <view class="e-select--mask" v-if="showSelector" @click="showSelector = false" />
      <view class="e-select" :class="{ 'e-select-disabled': disabled }">
        <view class="e-select__input-box" @click.stop="openSelectList">
          <!-- 当前值 -->
          <input class="e-select__input-text" v-model="currentData" :placeholder="placeholder" @input="filter" v-if="search" />
          <view class="e-select__input-text" v-else>
            {{ currentData || currentData === 0 ? currentData : placeholder }}
          </view>
          <!-- 用一个更大的盒子包裹图标,便于点击 -->
          <view class="e-select-icon" @click.stop="clearVal" v-if="currentData && clear && !disabled">
            <uni-icons type="clear" color="#e1e1e1" size="18" />
          </view>
          <view class="e-select-icon" @click.stop="toggleSelector" v-else>
            <uni-icons size="14" color="#999" type="top" class="arrowAnimation" :class="showSelector ? 'top' : 'bottom'" />
          </view>
        </view>
        <!-- 选项列表-->
        <view class="e-select__selector" v-if="showSelector">
          <!-- 三角小箭头 -->
          <view class="e-popper__arrow"></view>
          <!-- scroll-into-view="selectItemId" -->
          <scroll-view scroll-y="true" :scrollTop="scrollTop" class="e-select__selector-scroll" @scroll="scroll">
            <view class="parentDom">
              <!-- 可视区域的高度 -->
              <view :style="{ height: screenHeight + 'px' }"></view>
              <view class="positionRelative" :style="{ transform: getTransform }">
                <!-- 空值 -->
                <view class="e-select__selector-empty" v-if="currentOptions.length === 0">
                  <text>{{ emptyTips }}</text>
                </view>
                <!-- 非空,渲染选项列表 -->
                <view
                  v-else
                  class="e-select__selector-item"
                  :class="[{ highlight: currentData == item[props.text] }, { 'e-select__selector-item-disabled': item[props.disabled] }]"
                  v-for="(item, index) in visibleData"
                  :key="index"
                  @click.stop="change(item)"
                >
                  <text>{{ item[props.text] }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "e-select",
  comments: [],
  data() {
    return {
      // 当前值
      currentData: "",
      // 当前选项列表
      currentOptions: [],
      /** 是否显示下拉选择列表 */
      showSelector: false,
      /** 偏移高度 */
      startOffset: 0,
      /** 起始显示数据 */
      start: 0,
      /** 结束显示数据 */
      end: 5,
      /** 预留的dom，避免快速滚动空白 */
      remain: 20,
      /** 列表滚动高度 */
      scrollTop: 0
    }
  },
  props: {
    // 选项列表
    options: {
      type: Array,
      default() {
        return []
      }
    },
    // 配置选项
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
    // vue2 v-model传值方式
    value: {
      type: [String, Number],
      default: ""
    },
    // vue3 v-model传值方式
    modelValue: {
      type: [String, Number],
      default: ""
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
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 每条数据的高度
    itemSize: {
      type: Number,
      default: 40
    },
    // 启动搜索模式
    search: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    options: {
      handler() {
        this.currentOptions = this.options
      },
      immediate: true
    },
    modelValue: {
      handler() {
        this.initData()
      },
      immediate: true
    },
    value: {
      handler() {
        this.initData()
      },
      immediate: true
    }
  },
  computed: {
    /** 根据每条数据的高度获取总列表高度,最低一个元素 */
    screenHeight() {
      return Math.max(this.itemSize, this.currentOptions.length * this.itemSize)
    },
    /** 前面预留 */
    prevCount() {
      return Math.min(this.start, this.remain)
    },
    /** 后面预留 */
    nextCount() {
      return Math.min(this.remain, this.end)
    },
    /** 每次截取虚拟列表的位置 */
    getTransform() {
      return `translate(0,${this.startOffset}px)`
    },
    /** 虚拟数据 */
    visibleData() {
      return this.currentOptions.slice(this.start, Math.min(this.end, this.currentOptions.length))
    }
  },
  methods: {
    /** 处理数据，此函数用于兼容vue2 vue3 */
    initData() {
      this.currentData = ""
      if (this.value || this.value === 0) {
        return (this.currentData = this.value)
      }
      this.currentData = this.modelValue
    },
    /** 过滤选项列表 */
    filter() {
      if (this.currentData) {
        this.currentOptions = this.options.filter(item => {
          return item[this.props.text].indexOf(this.currentData) > -1
        })
      } else {
        this.currentOptions = this.options
      }
      this.scrollTop === 0 ? (this.scrollTop = 1) : (this.scrollTop = 0) // 触发滚动事件，回到顶部
      this.scrollFn(this.scrollTop)
      this.emit(this.currentData)
    },
    /** 选择选项 */
    change(item) {
      const { disabled, value } = this.props
      if (item[disabled]) return
      this.$emit("change", item)
      this.emit(item[value])
      this.currentOptions = this.options
      this.showSelector = false
    },
    /** 还原值,清空值 */
    clearVal() {
      this.showSelector = false
      this.start = 0
      this.end = 5
      this.startOffset = 0
      this.$emit("change", "清空")
      this.emit("")
    },
    /** 兼容vue2、vue3的v-model传值 */
    emit(value) {
      this.$emit("input", value)
      this.$emit("update:modelValue", value)
    },
    /** 打开选择列表 */
    openSelectList() {
      if (this.disabled || this.showSelector) return
      this.showSelector = true
      // 找到当前值所在的索引
      if (this.currentData) {
        this.currentOptions = this.options
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i][this.props.text] === this.currentData) {
            this.start = i
            break
          }
        }
        this.end = this.start + this.nextCount + this.remain // 此时的结束索引
        this.scrollTop = this.start * this.itemSize // 设置滚动
      } else {
        this.currentOptions = this.options
        this.scrollTop = 0
      }
    },
    /** 切换选择列表显示, */
    toggleSelector() {
      if (this.disabled) return
      this.showSelector = !this.showSelector
      this.currentOptions = this.options
    },
    /** 滚动事件 */
    scroll(e) {
      this.scrollFn(e.target.scrollTop)
    },
    /** 滚动函数 */
    scrollFn(scrollTop) {
      // uni.showLoading({
      //   title: "加载中",
      //   mask: true
      // })
      // 此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize) - this.prevCount - this.remain >= 0 ? Math.floor(scrollTop / this.itemSize) - this.prevCount - this.remain : 0
      this.end = this.start + this.nextCount + this.remain * 3 // 此时的结束索引
      this.startOffset = this.start * this.itemSize // 此时的偏移量
      // uni.hideLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
/deep/ ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/deep/ ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  height: 40px;
  background-color: #dedfe1;
}

/* #endif */

.e-stat__select {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;

  .e-select-main {
    width: 100%;
  }

  .e-select-disabled {
    background-color: #f5f7fa;
    cursor: not-allowed;
  }

  .e-select--mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
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
      height: 34px;
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
        padding-left: 7px;
        width: 100%;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
      }
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
      padding: 4px 0;
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
        content: " ";
        top: 1px;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #fff;
      }

      .e-select__selector-scroll {
        max-height: 200px;

        .parentDom {
          position: relative;

          .positionRelative {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 32rpx;
          }
        }

        .e-select__selector-empty,
        .e-select__selector-item {
          display: flex;
          cursor: pointer;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          padding: 0px 10px;
          box-sizing: border-box;
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
        }
      }
    }
  }
}
</style>
