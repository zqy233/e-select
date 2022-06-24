<!-- 弹窗中的单个日期 -->
<template>
  <!-- 根据参数动态设置class -->
  <view
    class="uni-calendar-item__weeks-box"
    :class="{
      'uni-calendar-item--disable': item.disable
    }"
    @click="choiceDate(item)"
  >
    <!-- uni-calendar-item--checked选中的文本的背景颜色 -->
    <view
      class="uni-calendar-item__weeks-box-item"
      :class="{
        'uni-calendar-item--checked': nowDate.fullDate === item.fullDate,
        'uni-calendar-item--disable': item.disable
      }"
    >
      <!-- 日期名 -->
      <text class="uni-calendar-item__weeks-box-text uni-calendar-item__weeks-box-text-disable uni-calendar-item--checked-text">{{ item.date }}</text>
    </view>
    <!-- 今日则显示一个小圆点 -->
    <view :class="{ 'uni-calendar-item--isDay': item.isDay }"></view>
  </view>
</template>

<script>
export default {
  props: {
    /** 渲染的单个日期 */
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    /** 当前的日期 */
    nowDate: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    /** 点击数据时触发 */
    choiceDate(weeks) {
      this.$emit("change", weeks)
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-calendar-item__weeks-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 0;
  position: relative;
  margin: 0px 3px;
}

.uni-calendar-item__weeks-box-text {
  font-size: 14px;
  font-weight: bold;
  color: #455997;
}

.uni-calendar-item__weeks-lunar-text {
  font-size: 12px;
  color: #333;
}

.uni-calendar-item__weeks-box-item {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-calendar-item__weeks-box .uni-calendar-item--disable {
  // background-color: rgba(249, 249, 249, $uni-opacity-disabled);
  cursor: default;
}

.uni-calendar-item--disable .uni-calendar-item__weeks-box-text-disable {
  color: #d1d1d1;
}

.uni-calendar-item--isDay {
  position: absolute;
  top: 10px;
  right: 17%;
  background-color: #dd524d;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.uni-calendar-item--extra {
  color: #dd524d;
  opacity: 0.8;
}

.uni-calendar-item__weeks-box .uni-calendar-item--checked {
  background-color: #007aff;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 3px;
  border: 3px solid #fff;
}

.uni-calendar-item--checked .uni-calendar-item--checked-text {
  color: #fff;
}

.uni-calendar-item--multiple .uni-calendar-item--checked-range-text {
  color: #333;
}

.uni-calendar-item--multiple {
  background-color: #f6f7fc;
  // color: #fff;
}

.uni-calendar-item--multiple .uni-calendar-item--before-checked,
.uni-calendar-item--multiple .uni-calendar-item--after-checked {
  background-color: #409eff;
  border-radius: 50%;
  box-sizing: border-box;
  border: 3px solid #f6f7fc;
}

.uni-calendar-item--before-checked .uni-calendar-item--checked-text,
.uni-calendar-item--after-checked .uni-calendar-item--checked-text {
  color: #fff;
}

.uni-calendar-item--before-checked-x {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  box-sizing: border-box;
  background-color: #f6f7fc;
}

.uni-calendar-item--after-checked-x {
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  background-color: #f6f7fc;
}
</style>
