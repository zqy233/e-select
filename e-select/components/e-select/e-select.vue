<template>
  <view class="e-stat__select" :style="{ width: width, minWidth: minWidth }">
    <!-- 主体区域 -->
    <view class="e-select-main">
      <view class="e-select" :class="{ 'e-select-disabled': disabled }">
        <view class="e-select__input-box" @click="toggleSelector">
          <!-- 当前值 -->
          <view v-if="current" class="e-select__input-text">{{ current }}</view>
          <!-- 占位文本 -->
          <view v-else class="e-select__input-text e-select__input-placeholder">
            {{ placeholder }}
          </view>
          <!-- 可清除的图标，当前有值可清除-->
          <uni-icons
            v-if="current && clear && !disabled"
            type="clear"
            color="#e1e1e1"
            size="18"
            @click.stop="clearVal"
          />
          <!-- 显示向上向下箭头图标 -->
          <uni-icons
            v-else
            size="14"
            color="#999"
            type="top"
            class="arrowAnimation"
            :class="showSelector ? 'top' : 'bottom'"
          />
        </view>
        <!-- 全屏遮罩-->
        <view class="e-select--mask" v-if="showSelector" @click="toggleSelector" />
        <!-- 选项列表-->
        <view class="e-select__selector" v-if="showSelector">
          <!-- 三角小箭头 -->
          <view class="e-popper__arrow"></view>
          <scroll-view
            scroll-y="true"
            class="e-select__selector-scroll"
            scroll-into-view="selectItemId"
          >
            <!-- 空值 -->

            <view class="e-select__selector-empty" v-if="options.length === 0">
              <text>{{ emptyTips }}</text>
            </view>
            <!-- 非空,渲染选项列表 -->
            <view
              v-else
              class="e-select__selector-item"
              :class="[
                { highlight: current == item[props.text] },
                { 'e-select__selector-item-disabled': item[props.disabled] }
              ]"
              v-for="(item, index) in options"
              :key="index"
              @click="change(item, index)"
            >
              <text>{{ item[props.text] }}</text>
              <view id="selectItemId" v-if="current == item[props.text]"></view>
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
  data() {
    return {
      // 是否显示下拉选择列表
      showSelector: false
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
      default: {
        text: "text",
        value: "value",
        disabled: "disabled"
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
  },
  computed: {
    // 当前值
    current() {
      // 初始化一个值，用于兼容vue2 vue3 v-model传值
      let value = ""
      // vue2使用value传值
      if (this.value === 0 || this.value) {
        value = this.value
      }
      // vue3使用modelValue传值
      if (this.modelValue === 0 || this.modelValue) {
        value = this.modelValue
      }
      // 取出当前值，不为undefined则正常显示，否则显示空字符串
      const optionItem = this.options.find(item => item[this.props.value] === value)
      return optionItem ? optionItem[this.props.text] : ""
    }
  },
  methods: {
    /** 改变值 */
    change(item, index) {
      if (item[this.props.disabled]) return
      this.emit(item, index)
      this.toggleSelector()
    },
    /** 传递父组件值 */
    emit(item, index) {
      if (index || index === 0) {
        item.index = index
        this.$emit("change", item)
      } else {
        this.$emit("change", item)
      }
      this.$emit("input", item[this.props.value])
      this.$emit("update:modelValue", item[this.props.value])
    },
    /** 清空值 */
    clearVal() {
      this.$emit("change", "")
      this.$emit("input", "")
      this.$emit("update:modelValue", "")
    },
    /** 切换列表选项显示, */
    toggleSelector() {
      if (this.disabled) return
      this.showSelector = !this.showSelector
    }
  }
}
</script>

<style lang="scss" scoped>
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
        }
      }
    }
  }
}
</style>
