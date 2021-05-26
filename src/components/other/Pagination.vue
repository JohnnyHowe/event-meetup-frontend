<template>
  <div>
    <button v-if="value != 0" v-on:click="value = 0">First</button>
    <button v-if="value != 0" v-on:click="value -= 1">&lt;</button>
    <button>{{ value + 1 }}</button>
    <button v-if="value < parseInt(lastPageIndex)" v-on:click="value += 1">
      &gt;
    </button>
    <button
      v-if="value < parseInt(lastPageIndex)"
      v-on:click="value = parseInt(lastPageIndex)"
    >
      Last
    </button>
  </div>
</template>
<script>
export default {
  props: ["modelValue", "lastPageIndex"],
  mounted() {
    this.value = parseInt(this.modelValue);
  },
  data() {
    return {
      value: 0,
    };
  },
  watch: {
    modelValue() {
      this.value = this.modelValue;
    },
    value() {
      this.$emit("update:modelValue", this.value);
      this.$emit("change", this.value);
    },
  },
};
</script>