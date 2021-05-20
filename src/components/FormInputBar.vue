<template>
  <table class="grow" VALIGN="TOP">
    <td id="title">{{ title }}:</td>
    <td v-if="isTextArea()" class="input-box">
      <textarea v-model="ivalue" class="input-box" v-bind:type="type" />
    </td>
    <td v-else class="input-box">
      <input v-model="ivalue" class="input-box" v-bind:type="type" />
    </td>
  </table>
</template>
<script>
export default {
  props: {
    title: String,
    modelValue: String,
    type: {
        type: String,
        default: "text",
    }
  },
  mounted: function() {
    this.ivalue = this.modelValue;
  },
  data() {
    return {
      ivalue: null,
    };
  },
  methods: {
    isTextArea() {
      return this.type === "textarea";
    }
  },
  watch: {
    ivalue: function () {
      this.$emit("update:modelValue", this.ivalue);
    },
  },
};
</script>
<style scoped>
#title {
  white-space: nowrap;
  text-align: right;
}
.grow {
  width: 100%;
}
.input-box {
  width: 80%;
}
</style>