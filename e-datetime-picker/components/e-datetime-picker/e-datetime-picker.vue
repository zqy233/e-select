<template>
  <view>
    <input type="text" v-model="date" :disabled="true" @click="show" />
    <view class="e-datetime-picker-mask" v-if="open"></view>
    <view class="e-datetime-picker-popup" v-if="open">
      <text class="e-datetime-picker-text">选择日期与时间</text>
      <view class="e-datetime-picker-title">
        <text>年</text>
        <text :class="{ 'err-red': err && !month }">月</text>
        <text :class="{ 'err-red': err && !day }">日</text>
        <text>时</text>
        <text>分</text>
        <text>秒</text>
      </view>
      <!-- 日期与时间 -->
      <view class="e-datetime-picker-container">
        <view class="e-datetime-picker-scroll">
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId" :show-scrollbar="true">
            <view v-for="item in years" :key="item" @click="year = item" :class="{ 'e-datetime-picker-scroll-item-active': year == item }">
              <view :id="year == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId">
            <view v-for="item in months" :key="item" @click="month = item" :class="{ 'e-datetime-picker-scroll-item-active': month == item }">
              <view :id="month == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId">
            <view v-for="item in days" :key="item" @click.stop="day = item" :class="{ 'e-datetime-picker-scroll-item-active': day == item }">
              <view :id="day == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId">
            <view v-for="item in hours" :key="item" @click="hour = item" :class="{ 'e-datetime-picker-scroll-item-active': hour == item }">
              <view :id="hour == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId">
            <view v-for="item in minutes" :key="item" @click="minute = item" :class="{ 'e-datetime-picker-scroll-item-active': minute == item }">
              <view :id="minute == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
          <scroll-view class="e-datetime-picker-scroll-item" scroll-y="true" scroll-into-view="selectItemId">
            <view v-for="item in seconds" :key="item" @click="second = item" :class="{ 'e-datetime-picker-scroll-item-active': second == item }">
              <view :id="second == item ? 'selectItemId' : ''"> {{ item }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="e-datetime-picker-btn">
        <view @click="clearTime">
          <text class="e-datetime-picker-btn-text" @click="clear">清空</text>
        </view>
        <view class="e-datetime-picker-btn-group">
          <view class="e-datetime-picker-cancel" @click="close">
            <text class="e-datetime-picker-btn-text">取消</text>
          </view>
          <view @click="setTime">
            <text class="e-datetime-picker-btn-text">确认</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const dt = new Date()
    const years = []
    const year = dt.getFullYear()
    const months = []
    const month = this.lessThanTen(dt.getMonth() + 1)
    const days = []
    const day = this.lessThanTen(dt.getDate())
    const hours = []
    const hour = this.lessThanTen(dt.getHours())
    const minutes = []
    const minute = this.lessThanTen(dt.getMinutes())
    const seconds = []
    const second = this.lessThanTen(dt.getSeconds())
    for (let i = dt.getFullYear() - 5; i <= dt.getFullYear() + 5; i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(this.lessThanTen(i))
    }
    for (let i = 1; i <= day; i++) {
      days.push(this.lessThanTen(i))
    }
    for (let i = 0; i <= 23; i++) {
      hours.push(this.lessThanTen(i))
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(this.lessThanTen(i))
    }
    for (let i = 0; i < 60; i++) {
      seconds.push(this.lessThanTen(i))
    }
    const date = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    return {
      open: false, // 控制弹窗显示
      err: false, // 控制未填数据标红
      date,
      years,
      year,
      months,
      month,
      days,
      day,
      hours,
      hour,
      minutes,
      minute,
      seconds,
      second
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
    }
  },
  watch: {
    /** 月份变化则清空日 */
    month() {
      this.day = ""
      this.getDays()
    },
    /** 年份变化则清空月日 */
    year() {
      this.month = ""
      this.day = ""
      this.getDays()
    }
  },
  mounted() {
    this.$emit("input", this.date)
    this.$emit("update:modelValue", this.date)
  },
  methods: {
    /**
     * 获取日期
     */
    getDays() {
      if (this.year && this.month) {
        const totalDays = new Date(this.year, this.month, 0).getDate()
        const days = []
        for (let i = 1; i <= totalDays; i++) {
          days.push(this.lessThanTen(i))
        }
        this.days = days
      }
    },
    /**
     * 清空
     */
    clear() {
      this.date = ""
      this.close()
    },
    /**
     * 打开弹窗
     */
    show() {
      // 初始化上次的日期
      const date = new Date(this.date)
      this.year = date.getFullYear()
      this.month = (date.getMonth() + 1 + "").padStart(2, "0")
      this.day = (date.getDate() + "").padStart(2, "0")
      this.hour = (date.getHours() + "").padStart(2, "0")
      this.minute = (date.getMinutes() + "").padStart(2, "0")
      this.second = (date.getSeconds() + "").padStart(2, "0")
      this.open = true
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.open = false
    },
    /** 点击保存文本,保存日期 */
    setTime() {
      if (!this.month || !this.day) {
        return (this.err = true)
      }
      this.err = false
      this.date = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`
      this.$emit("input", this.date)
      this.$emit("update:modelValue", this.date)
      this.close()
    },
    /** 少于10补0 */
    lessThanTen(item) {
      return Number(item) < 10 ? "0" + item : item
    }
  }
}
</script>

<style lang="scss" scoped>
.e-datetime-picker-mask {
  position: fixed;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.4);
  transition-duration: 0.3s;
  z-index: 998;
}
.e-datetime-picker-popup {
  border-radius: 8px;
  padding: 30px;
  width: 420px;
  /* #ifdef APP-NVUE */
  height: 500px;
  /* #endif */
  /* #ifdef APP-NVUE */
  width: 330px;
  /* #endif */
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition-duration: 0.3s;
  z-index: 999;
  .e-datetime-picker-title {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;

    text {
      width: 160px;
      text-align: center;
      font-weight: bold;
    }
    .err-red {
      color: red;
    }
  }
  .e-datetime-picker-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .e-datetime-picker-view {
      height: 250px;
      width: 570px;
      /* #ifndef APP-NVUE */
      cursor: pointer;
      /* #endif */
    }
    .e-datetime-picker-item {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 14px;
    }

    .e-datetime-picker-scroll {
      display: flex;
      width: 100%;
      height: 250px;
      .e-datetime-picker-scroll-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        view {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* padding: 10px 0px; */
          margin: 0 auto;
        }
      }
      .e-datetime-picker-scroll-item-active {
        background-color: #007aff;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
      }
    }
  }
  .e-datetime-picker-btn {
    margin-top: 60px;
    /* #ifndef APP-NVUE */
    display: flex;
    cursor: pointer;
    /* #endif */
    flex-direction: row;
    justify-content: space-between;
    .e-datetime-picker-btn-text {
      font-size: 14px;
      color: #007aff;
    }
    .e-datetime-picker-btn-group {
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-direction: row;

      .e-datetime-picker-cancel {
        margin-right: 30px;
      }
    }
  }
}
</style>
