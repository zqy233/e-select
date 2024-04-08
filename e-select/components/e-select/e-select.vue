<template>
  <e-select-built-in
    v-model="selectData"
    :options="options"
    :props="props"
    :placeholder="placeholder"
    :width="width"
    :minWidth="minWidth"
    :maxHeight="maxHeight"
    :emptyTips="emptyTips"
    :clearable="clearable"
    :disabled="disabled"
    :search="search"
    :animation="animation"
    :position="position"
    :pageSize="pageSize"
    :pageIndex="pageIndex"
    @update:pageIndex="updatePageIndex"
    @update:total="updateTotal"
    @change="changeSelect">
    <uni-pagination-built-in
      v-if="pageSize"
      show-icon="true"
      :total="total"
      :pageSize="pageSize"
      :current="pageIndex"
      @change="changePage"></uni-pagination-built-in>
  </e-select-built-in>
</template>

<script>
import eSelectBuiltIn from './e-select-built-in.vue';
import uniPaginationBuiltIn from './uni-pagination-built-in/uni-pagination-built-in.vue';
export default {
  components: {
    eSelectBuiltIn,
    uniPaginationBuiltIn,
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
  },
  data() {
    return {
      // 前端分页，总数就是下拉列表总数，不应由用户来控制，放在组件内部
      total: 0,
      // 前端分页，当前分页不应由用户来控制，放在组件内部
      pageIndex: 1,
      selectData: '',
    };
  },
  watch: {
    options: {
      handler(val) {
        this.total = val.length;
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
    selectData: {
      handler(val) {
        this.$emit('input', val);
        this.$emit('update:modelValue', val);
      },
    },
  },
  methods: {
    /** 处理数据，此函数用于兼容vue2 vue3 */
    initData() {
      // vue2
      if (this.value || this.value === 0) {
        this.selectData = this.value;
      }
      // vue3
      else if (this.modelValue || this.modelValue === 0) {
        this.selectData = this.modelValue;
      }
    },
    updatePageIndex(pageIndex) {
      this.pageIndex = pageIndex;
    },
    updateTotal(total) {
      this.total = total;
    },
    changePage(data) {
      this.pageIndex = data.current;
      this.$emit('changePage', data);
    },
    changeSelect(data) {
      this.$emit('change', data);
    },
  },
};
</script>
