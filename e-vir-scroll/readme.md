# e-vir-scroll

> 虚拟滚动组件，支持上万条数据渲染
>
> 学习自https://www.cnblogs.com/jwzhang/p/14485021.html

## 属性

```js
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
```

## 用法

```js
<template>
  <vir :listData="listData" v-slot="{ visibleData }">
    <view v-for="item in visibleData" :key="item.id" class="list" @click="choseItem(item)">
      {{ item.name }}
    </view>
  </vir>
</template>

<script>
export default {
  data() {
    return {
      listData: []
    }
  },
  methods: {
    choseItem(item) {
      console.log(item)
    }
  },
  mounted() {
    for (var i = 0; i < 10000; i++) {
      this.listData.push({
        name: "list-item" + i,
        id: "list-item" + i
      })
    }
  }
}
</script>
<style>
.list {
  height: 80px;
  line-height: 80px;
  width: 100%;
  padding: 0px 10px;
  border-bottom: 1px solid #d2d2d2;
}
</style>
```

