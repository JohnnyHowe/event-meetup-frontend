<template>
  <table class="grow" VALIGN="TOP">
    <tr>
      <td id="title">{{ title }}:</td>
      <td v-if="type === 'textarea'" class="input-cell">
        <textarea v-model="ivalue" class="input-box" v-bind:type="type" />
      </td>
      <td
        v-else-if="type === 'checkbox'"
        class="input-cell"
        style="text-align: left"
      >
        <input v-model="ivalue" style="text-align: left" v-bind:type="type" />
      </td>
      <td
        v-else-if="type === 'file'"
        class="input-cell"
        style="text-align: left"
      >
        <input
          v-model="ivalue"
          style="text-align: left"
          v-bind:type="type"
          v-bind:accept="accept"
        />
      </td>
      <td v-else class="input-cell">
        <input v-model="ivalue" class="input-box" v-bind:type="type" />
      </td>
    </tr>
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
    },
    accept: {
      type: String,
      default: null,
    },
  },
  mounted: function () {
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
    },
  },
  watch: {
    ivalue: function () {
      this.$emit("update:modelValue", this.ivalue);
    },
    modelValue: function () {
      if (this.modelValue != this.ivalue) {
        this.ivalue = this.modelValue;
      }
    },
  },
};
</script>
<style scoped>
#title {
  /* white-space: nowrap; */
  text-align: right;
  width: 150px;
}
.grow {
  width: 100%;
}
.input-cell {
  width: 100% - 150px;
}
.input-box {
  width: 100%;
}
</style>