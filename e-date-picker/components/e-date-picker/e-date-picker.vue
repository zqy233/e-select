<template>
  <view class="uni-date">
    <!-- 输入框区域 -->
    <view class="uni-date-editor" @click="show">
      <slot>
        <view
          class="uni-date-editor--x uni-date-x--border"
          :class="{ 'uni-date-editor--x__disabled': disabled }"
        >
          <!-- 一个输入框组件 -->
          <view class="uni-date-x uni-date-single">
            <!-- 日期图标 -->
            <uni-icons type="calendar" color="#e1e1e1" size="22" />
            <!-- 输入框不能输入，只用于触发日期弹窗显示 -->
            <input
              class="uni-date__x-input"
              type="text"
              v-model="date"
              :placeholder="placeholder"
              :disabled="true"
            />
          </view>
          <!-- 输入框是否显示清除按钮 -->
          <view v-if="showClearIcon" class="uni-date__icon-clear" @click.stop="clear">
            <uni-icons type="clear" color="#e1e1e1" size="18" />
          </view>
        </view>
      </slot>
    </view>
    <!-- 弹窗遮罩 -->
    <view v-show="popup" class="uni-date-mask" @click="close"></view>
    <!-- 日期弹窗 -->
    <view ref="datePicker" v-show="popup" class="uni-date-picker__container">
      <view class="uni-date-single--x">
        <!-- 指示小三角 -->
        <view class="uni-popper__arrow"></view>
        <!-- 日期列表 -->
        <calendar ref="pcSingle" :date="date" @change="change" />
        <view class="uni-date-popper__arrow"></view>
      </view>
    </view>
  </view>
</template>
<script>
import calendar from "./calendar.vue"

export default {
  name: "UniDatetimePicker",
  components: {
    calendar
  },
  data() {
    return {
      /** 显示在input输入框的值 */
      date: "",
      /** 是否显示日期选择列表 */
      popup: false
    }
  },
  props: {
    /** vue2传值写法 */
    value: {
      type: String,
      default: ""
    },
    /** vue3传值写法 */
    modelValue: {
      type: String,
      default: ""
    },
    /** 占位文本 */
    placeholder: {
      type: String,
      default: "选择日期"
    },
    /** 是否禁用 */
    disabled: {
      type: [Boolean],
      default: false
    },
    /** 是否显示清除图标 */
    clearIcon: {
      type: [Boolean],
      default: true
    }
  },
  watch: {
    /** vue2动态赋值 */
    value() {
      this.setDate()
    },
    /** vue3动态赋值 */
    modelValue() {
      this.setDate()
    }
  },
  computed: {
    /** 判断是否显示清除图标 */
    showClearIcon() {
      const { clearIcon, disabled, date } = this
      // clearIcon为真,disabled为假，日期值为真
      return clearIcon && !disabled && date
    }
  },
  created() {
    this.setDate()
  },
  methods: {
    /** 设置date，兼容vue2和vue3的传值方式 */
    setDate() {
      if (this.value === 0 || this.value) {
        this.date = this.value
      }
      if (this.modelValue === 0 || this.modelValue) {
        this.date = this.modelValue
      }
    },
    /** 点击input输入框时打开日期选择弹窗 */
    show() {
      // 如果禁用则不往下执行
      if (this.disabled) {
        return
      }
      setTimeout(() => {
        this.popup = !this.popup
      }, 50)
    },
    /** 点击遮罩层触发关闭事件 */
    close() {
      setTimeout(() => {
        this.popup = false
      }, 20)
    },
    /** 设置传递给父组件的值 */
    setEmit(value) {
      this.$emit("change", value)
      this.$emit("input", value)
      this.$emit("update:modelValue", value)
    },
    /** 日期更改时触发 */
    change(date) {
      this.date = date
      this.setEmit(this.date)
      this.popup = false
    },
    /** 点击清除图标或文本，清除内容 */
    clear() {
      // 单个选择
      this.date = ""
      // 清除子组件的date
      this.$refs.pcSingle.clearCalender()
      // 清除日期列表的数据
      this.$emit("change", "")
      this.$emit("input", "")
      this.$emit("update:modelValue", "")
    },
    /** 处理日期，返回yyyy-mm-dd的格式和hh-mm-ss的格式*/
    parseDate(date) {
      date = this.fixIosDateFormat(date)
      const defVal = new Date(date)
      const year = defVal.getFullYear()
      const month = defVal.getMonth() + 1
      const day = defVal.getDate()
      const hour = defVal.getHours()
      const minute = defVal.getMinutes()
      const second = defVal.getSeconds()
      const defDate = year + "-" + this.lessTen(month) + "-" + this.lessTen(day)
      const defTime = this.lessTen(hour) + ":" + this.lessTen(minute) + ":" + this.lessTen(second)
      return {
        defDate,
        defTime
      }
    },
    /** 获取日期的毫秒数 */
    createTimestamp(date) {
      date = this.fixIosDateFormat(date)
      return Date.parse(new Date(date))
    },
    /** 兼容 iOS、safari 日期格式 */
    fixIosDateFormat(value) {
      if (typeof value === "string") {
        value = value.replace(/-/g, "/")
      }
      return value
    },
    /** 小于10的数字前加上0 */
    lessTen(item) {
      return item < 10 ? "0" + item : item
    }
  }
}
</script>

<style>
.uni-date-x {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  font-size: 14px;
}

.uni-date-x--border {
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.uni-date-editor--x {
  position: relative;
}

.uni-date-editor--x .uni-date__icon-clear {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  box-sizing: border-box;
  border: 9px solid transparent;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-date__x-input {
  padding: 0 8px;
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 14px;
}

.t-c {
  text-align: center;
}

.uni-date__input {
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 14px;
}

.uni-date-range__input {
  text-align: center;
  max-width: 142px;
}

.uni-date-picker__container {
  position: relative;
}

.uni-date-mask {
  position: fixed;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0);
  transition-duration: 0.3s;
  z-index: 996;
}

.uni-date-single--x {
  background-color: #fff;
  position: absolute;
  top: 0;
  z-index: 999;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.uni-date-range--x {
  background-color: #fff;
  position: absolute;
  top: 0;
  z-index: 999;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.uni-date-editor--x__disabled {
  opacity: 0.4;
  cursor: default;
}

.uni-date-editor--logo {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

/* 添加时间 */
.popup-x-header {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  /* justify-content: space-between; */
}

.popup-x-header--datetime {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex: 1;
}

.popup-x-body {
  display: flex;
}

.popup-x-footer {
  padding: 0 15px;
  border-top-color: #f1f1f1;
  border-top-style: solid;
  border-top-width: 1px;
  /* background-color: #fff; */
  line-height: 40px;
  text-align: right;
  color: #666;
}

.popup-x-footer text:hover {
  color: #007aff;
  cursor: pointer;
  opacity: 0.8;
}

.popup-x-footer .confirm {
  margin-left: 20px;
  color: #007aff;
}

.uni-date-changed {
  /* background-color: #fff; */
  text-align: center;
  color: #333;
  border-bottom-color: #f1f1f1;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  /* padding: 0 50px; */
}

.uni-date-changed--time text {
  /* padding: 0 20px; */
  height: 50px;
  line-height: 50px;
}

.uni-date-changed .uni-date-changed--time {
  /* display: flex; */
  flex: 1;
}

.uni-date-changed--time-date {
  color: #333;
  opacity: 0.6;
}

.mr-50 {
  margin-right: 50px;
}

/* picker 弹出层通用的指示小三角, todo：扩展至上下左右方向定位 */
.uni-popper__arrow,
.uni-popper__arrow::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
}

.uni-popper__arrow {
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  top: -6px;
  left: 10%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}

.uni-popper__arrow::after {
  content: " ";
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}
</style>
