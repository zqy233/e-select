<template>
  <view class="uni-calendar">
    <!-- 主体区域 -->
    <view class="uni-calendar__content">
      <!-- 头部区域 -->
      <view class="uni-calendar__header">
        <!-- 左侧的箭头 -->
        <view class="uni-calendar__header-btn-box" @click.stop="pre">
          <view class="uni-calendar__header-btn uni-calendar--left"></view>
        </view>
        <!-- 年月文本 -->
        <view>
          <text class="uni-calendar__header-text" @click="showYears">
            {{ (nowDate.year || "") + " 年 " }}
          </text>
          <text class="uni-calendar__header-text" @click="showMonths">
            {{ (nowDate.month || "") + " 月" }}
          </text>
        </view>
        <!-- 右侧的箭头 -->
        <view class="uni-calendar__header-btn-box" @click.stop="next">
          <view class="uni-calendar__header-btn uni-calendar--right"></view>
        </view>
      </view>
      <view class="uni-calendar__box">
        <!--文本：日 一 二 三 四 五 六 -->
        <view class="uni-calendar__weeks" style="padding-bottom: 7px" v-show="showType == 1">
          <view
            class="uni-calendar__weeks-day"
            v-for="item in ['日', '一', '二', '三', '四', '五', '六']"
            :key="item"
          >
            <text class="uni-calendar__weeks-day-text">{{ item }}</text>
          </view>
        </view>
        <!-- 日期列表 -->
        <view v-show="showType == 1" class="list">
          <view class="uni-calendar__weeks" v-for="(item, index) in weeks" :key="index">
            <!-- 每行日期 -->
            <view
              class="uni-calendar__weeks-item"
              v-for="(itemData, itemIndex) in item"
              :key="itemIndex"
            >
              <!-- 单个日期 -->
              <calendar-item
                class="uni-calendar-item--hook"
                :item="itemData"
                :nowDate="nowDate"
                @change="choiceDate"
              ></calendar-item>
            </view>
          </view>
        </view>
        <!-- 月数列表 -->
        <view v-show="showType == 2" class="list">
          <view class="uni-calendar__weeks" v-for="(item, index) in months" :key="index">
            <!-- 每行日期 -->
            <view
              class="uni-calendar__weeks-item"
              v-for="(itemData, itemIndex) in item"
              :key="itemIndex"
            >
              <!-- 单个日期 -->
              <calendar-item
                class="uni-calendar-item--hook"
                :item="itemData"
                :nowDate="nowDate"
                @change="choiceDate"
              ></calendar-item>
            </view>
          </view>
        </view>
        <!-- 年份列表 -->
        <view v-show="showType == 3" class="list">
          <view class="uni-calendar__weeks" v-for="(item, index) in years" :key="index">
            <!-- 每行日期 -->
            <view
              class="uni-calendar__weeks-item"
              v-for="(itemData, itemIndex) in item"
              :key="itemIndex"
            >
              <!-- 单个日期 -->
              <calendar-item
                class="uni-calendar-item--hook"
                :item="itemData"
                :nowDate="nowDate"
                @change="choiceDate"
              ></calendar-item>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Calendar from "./util.js"
import calendarItem from "./calendar-item.vue"
export default {
  components: {
    calendarItem
  },
  props: {
    /** 日期 */
    date: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      /** 月列表 */
      months: [],
      /** 年列表 */
      years: [],
      /** 日列表 */
      weeks: [],
      /** 1显示日列表，2显示月列表，3显示年列表 */
      showType: 1,
      /** 日期函数类的实例 */
      cale: {},
      /** 当前日期 */
      nowDate: ""
    }
  },
  watch: {
    /** 动态赋值 */
    date() {
      this.setDate(this.date)
    }
  },
  mounted() {
    // 获取日历方法实例
    this.cale = new Calendar()
    // 选中某一天
    console.log("this.da", this.date)
    this.setDate(this.date)
  },
  methods: {
    /** 供父组件调用，去除高亮 */
    clearCalender() {
      this.nowDate.fullDate = ""
      this.setDate()
    },
    /** 显示月列表 */
    showMonths() {
      this.showType = 2
    },
    /** 显示年列表 */
    showYears() {
      this.showType = 3
    },
    /** 点击日期时触发 */
    change() {
      this.$emit("change", this.nowDate.fullDate)
    },
    /** 选择日期  */
    choiceDate(weeks) {
      if (weeks.disable) return
      // 选择日
      if (this.showType == 1) {
        this.setDate(weeks.fullDate)
        // 传给父组件
        this.change()
      }
      // 选择月，则显示日列表
      if (this.showType == 2) {
        const month = new Date(this.nowDate.fullDate).getMonth() + 1
        const differ = Number(weeks.date.replace("月", "")) - month
        const date = this.cale.getDate(this.nowDate.fullDate, differ, "month").fullDate
        this.showType = 1
        this.setDate(date)
      }
      // 选择年，则显示月列表
      if (this.showType == 3) {
        const year = new Date(this.nowDate.fullDate).getFullYear()
        const differ = weeks.date - year
        const date = this.cale.getDate(this.nowDate.fullDate, differ, "year").fullDate
        this.showType = 2
        this.setDate(date)
      }
    },
    /** 点击左箭头时触发 */
    pre() {
      let preDate = ""
      // 年列表，每次往前推1年
      if (this.showType === 3) {
        preDate = this.cale.getDate(this.nowDate.fullDate, -1, "year").fullDate
      }
      // 月列表或日列表，每次往前推一个月
      if (this.showType === 2 || this.showType === 1) {
        preDate = this.cale.getDate(this.nowDate.fullDate, -1, "month").fullDate
      }
      this.setDate(preDate)
    },
    /** 点击右箭头时触发 */
    next() {
      let nextDate = ""
      // 年列表，每次往后推1年
      if (this.showType === 3) {
        nextDate = this.cale.getDate(this.nowDate.fullDate, +1, "year").fullDate
      }
      // 月列表或日列表，每次往后推一个月
      if (this.showType === 2 || this.showType === 1) {
        nextDate = this.cale.getDate(this.nowDate.fullDate, +1, "month").fullDate
      }
      this.setDate(nextDate)
    },
    /** 设置日期 */
    setDate(date) {
      this.cale.setDate(date)
      this.weeks = this.cale.weeks
      this.months = this.cale.months
      this.years = this.cale.years
      this.nowDate = this.cale.getInfo(date)
    }
  }
}
</script>

<style lang="scss">
.uni-calendar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  padding: 20px 0px;
}

.uni-calendar__content {
  background-color: #fff;
}

.uni-calendar__header {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.uni-calendar__header-mobile {
  padding: 10px;
  padding-bottom: 0;
}

.uni-calendar--fixed-top {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: space-between;
  border-top-color: rgba(0, 0, 0, 0.4);
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-calendar--fixed-width {
  width: 50px;
}

.uni-calendar__backtoday {
  position: absolute;
  right: 0;
  top: 25rpx;
  padding: 0 5px;
  padding-left: 10px;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  color: #fff;
  background-color: #f1f1f1;
}

.uni-calendar__header-text {
  text-align: center;
  width: 100px;
  font-size: 15px;
  color: #666;
}

.uni-calendar__button-text {
  text-align: center;
  width: 100px;
  font-size: 14px;
  color: #007aff;
  /* #ifndef APP-NVUE */
  letter-spacing: 3px;
  /* #endif */
}

.uni-calendar__header-btn-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.uni-calendar__header-btn {
  width: 9px;
  height: 9px;
  border-left-color: #808080;
  border-left-style: solid;
  border-left-width: 1px;
  border-top-color: #555555;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-calendar--left {
  transform: rotate(-45deg);
}

.uni-calendar--right {
  transform: rotate(135deg);
}

.uni-calendar__weeks {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  /* background-color: palegoldenrod; */
  align-items: center;
  flex-direction: row;
}
.list {
  width: 360px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.uni-calendar__weeks-item {
  flex: 1;
}

.uni-calendar__weeks-day {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-bottom-color: #f5f5f5;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.uni-calendar__weeks-day-text {
  font-size: 12px;
  color: #b2b2b2;
}

.uni-calendar__box {
  position: relative;
  padding: 0px 20px;
}

.uni-date-changed {
  padding: 0 10px;
  // line-height: 50px;
  text-align: center;
  color: #333;
  border-top-color: #dcdcdc;
  border-top-style: solid;
  border-top-width: 1px;
  flex: 1;
}

.uni-date-btn--ok {
  padding: 20px 15px;
}

.uni-date-changed--time-start {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
}

.uni-date-changed--time-end {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
}

.uni-date-changed--time-date {
  color: #999;
  line-height: 50px;
  margin-right: 5px;
  // opacity: 0.6;
}

.time-picker-style {
  // width: 62px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.mr-10 {
  margin-right: 10px;
}

.dialog-close {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  padding: 0 25px;
  margin-top: 10px;
}

.dialog-close-plus {
  width: 16px;
  height: 2px;
  background-color: #737987;
  border-radius: 2px;
  transform: rotate(45deg);
}

.dialog-close-rotate {
  position: absolute;
  transform: rotate(-45deg);
}

.uni-datetime-picker--btn {
  border-radius: 100px;
  height: 40px;
  line-height: 40px;
  background-color: #007aff;
  color: #fff;
  font-size: 16px;
  letter-spacing: 5px;
}

/* #ifndef APP-NVUE */
.uni-datetime-picker--btn:active {
  opacity: 0.7;
}
/* #endif */
</style>
