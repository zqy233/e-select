<!-- 学习自https://www.cnblogs.com/jwzhang/p/14485021.html -->
<template>
  <view class="sickBody">
    <scroll-view scroll-y="true" class="scroll-Y" @scroll="scroll">
      <view class="parentDom">
        <view :style="{ height: screenHeight + 'px' }"></view>
        <view class="positionRelative" :style="{ transform: getTransform }">
          <slot :visibleData="visibleData"></slot>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    /** 传入的数据 */
    listData: {
      type: Array,
      default: () => []
    },
    /** 每条数据的高度 */
    itemSize: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      /** 偏移高度 */
      startOffset: 0,
      /** 起始显示数据 */
      start: 0,
      /** 结束显示数据 */
      end: 20,
      /** 预留的数量，避免空白 */
      remain: 10,
      /** 控制节流 */
      throttle: true
    }
  },
  computed: {
    /** 根据每条数据的高度获取总列表高度,100用于预留 */
    screenHeight() {
      return this.listData.length * this.itemSize + 100
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
      return this.listData.slice(this.start, Math.min(this.end, this.listData.length))
    }
  },
  methods: {
    /** 当前点击的列 */
    choseSick(item) {
      this.$emit("choseSickSearch", item)
    },
    /** 列表滚动 */
    scroll(e) {
      if (this.throttle) {
        this.scrollThrottle(e.target.scrollTop)
        this.throttle = false
        setTimeout(() => {
          this.throttle = true
        }, 50)
      }
    },
    /** 滚动函数 */
    scrollThrottle(scrollTop) {
      uni.showLoading({
        title: "加载中",
        mask: true
      })
      // 此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize) - this.prevCount >= 0 ? Math.floor(scrollTop / this.itemSize) - this.prevCount : 0
      // 此时的结束索引
      this.end = this.start + this.nextCount + this.remain
      // 此时的偏移量
      this.startOffset = this.start * this.itemSize
      uni.hideLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
.sickBody {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  z-index: 99;
  .scroll-Y {
    height: 100%;
    overflow-y: scroll;
    .parentDom {
      position: relative;
      .positionRelative {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 32rpx;
        padding-bottom: 300rpx;
      }
    }
  }
}
</style>
